import { parse } from 'parse5';

export const CRONS = ['0 5,15 * * *', '*/10 * * * *'];
const HOSTS = new Set([
  'resmigazete.gov.tr',
  'www.resmigazete.gov.tr',
  'mevzuat.gov.tr',
  'www.mevzuat.gov.tr',
]);

export function officialUrl(value, base) {
  const url = new URL(value, base);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    !HOSTS.has(url.hostname) ||
    url.username ||
    url.password ||
    url.port
  )
    throw new Error('Resmî kaynak dışında bağlantı');
  url.protocol = 'https:';
  url.hostname = url.hostname.startsWith('www.')
    ? url.hostname
    : `www.${url.hostname}`;
  url.hash = '';
  return url.href;
}

export async function digest(value) {
  const bytes =
    typeof value === 'string' ? new TextEncoder().encode(value) : value;
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function normalize(value) {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase('tr-TR')
    .replace(/[ı]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function readHtml(html, base) {
  const links = [];
  const images = [];
  function visit(node) {
    if (['script', 'style', 'noscript', 'template'].includes(node.tagName))
      return '';
    if (node.nodeName === '#text') return node.value;
    const attrs = Object.fromEntries(
      (node.attrs ?? []).map((a) => [a.name, a.value]),
    );
    const content = (node.childNodes ?? []).map(visit).join(' ');
    const title = content.replace(/\s+/g, ' ').trim();
    if (node.tagName === 'a' && attrs.href) {
      try {
        links.push({ url: officialUrl(attrs.href, base), title });
      } catch {
        /* off-site links are never fetched */
      }
    }
    if (
      node.tagName === 'img' &&
      attrs.src &&
      !/logo|icon|reader|index\.gif/i.test(attrs.src)
    )
      images.push(attrs.src);
    return content;
  }
  const text = visit(parse(html)).replace(/\s+/g, ' ').trim();
  return {
    text,
    links: [...new Map(links.map((link) => [link.url, link])).values()],
    hasImages: images.length > 0,
  };
}

export function decodeHtml(bytes, contentType) {
  const sniff = new TextDecoder('windows-1252').decode(bytes.slice(0, 4096));
  const encoding =
    /charset\s*=\s*["']?([a-z0-9_-]+)/i.exec(contentType)?.[1] ??
    /charset\s*=\s*["']?([a-z0-9_-]+)/i.exec(sniff)?.[1] ??
    'utf-8';
  return new TextDecoder(encoding, { fatal: true }).decode(bytes);
}

// Every redirect is re-validated; response limits apply to streamed bodies too.
export async function fetchOfficial(value, fetcher = fetch) {
  let url = officialUrl(value);
  const signal = AbortSignal.timeout(20_000);
  for (let redirects = 0; redirects <= 4; redirects++) {
    const response = await fetcher(url, {
      redirect: 'manual',
      signal,
      headers: {
        Accept: 'text/html,application/pdf;q=0.9',
        'User-Agent': 'CevreMevzuatiMonitor/1.0',
      },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      await response.body?.cancel();
      const location = response.headers.get('location');
      if (!location) throw new Error('Yönlendirme adresi eksik');
      url = officialUrl(location, url);
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`Kaynak HTTP ${response.status}`);
    }
    const maxBytes = 8 * 1024 * 1024;
    if (Number(response.headers.get('content-length')) > maxBytes) {
      await response.body?.cancel();
      throw new Error('Kaynak 8 MB sınırını aşıyor; elle inceleme gerekli');
    }
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Kaynak gövdesi boş');
    const chunks = [];
    let length = 0;
    for (;;) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      length += chunk.length;
      if (length > maxBytes) {
        await reader.cancel();
        throw new Error('Kaynak boyutu sınırı aşıldı');
      }
      chunks.push(chunk);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const contentType = response.headers.get('content-type') ?? '';
    if (new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-') {
      return {
        url,
        bytes,
        contentType: 'application/pdf',
        text: '',
        links: [],
        readable: false,
        hasImages: false,
      };
    }
    if (!/text\/html|application\/xhtml/i.test(contentType))
      throw new Error('Desteklenmeyen kaynak biçimi; elle inceleme gerekli');
    const html = decodeHtml(bytes, contentType);
    const parsed = readHtml(html, url);
    if (
      parsed.text.length < 100 ||
      /captcha|access denied|request rejected|just a moment|servis disi|erisim engellendi/.test(
        normalize(parsed.text),
      )
    ) {
      throw new Error('Metin alınamadı veya erişim engeli sayfası döndü');
    }
    return { url, bytes, contentType, ...parsed, readable: true };
  }
  throw new Error('Çok fazla yönlendirme');
}

export function istanbulDate(time = Date.now()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(time);
}

export function shiftDate(date, days) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function dayUrl(date) {
  return `https://www.resmigazete.gov.tr/${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`;
}

export function isDocument(url) {
  return /\/eskiler\/\d{4}\/\d{2}\/\d{8}(?:M\d+)?-\d+[^/]*\.(?:html?|pdf)$/i.test(
    new URL(url).pathname,
  );
}

export function issueEntries(document, date) {
  if (!document.readable) throw new Error('Günlük indeks okunamadı');
  const stamp = date.replaceAll('-', '');
  const documents = document.links.filter(
    (link) =>
      isDocument(link.url) && new URL(link.url).pathname.includes(`/${stamp}`),
  );
  const issues = document.links.filter(({ url }) => {
    const value = new URL(url);
    return (
      value.pathname === '/fihrist' &&
      value.searchParams.get('tarih') === date &&
      Number(value.searchParams.get('mukerrer')) > 0
    );
  });
  if (!documents.length)
    throw new Error('Bu tarihe ait indeks bulunamadı; boş gün kabul edilmedi');
  return { documents, issues };
}

const TOPICS = {
  kurulus: ['cevresel etki', 'stratejik cevresel', 'ced rapor'],
  izin: [
    'cevre izin',
    'cevre lisans',
    'cevre yonetimi',
    'cevre denetim',
    '2872',
  ],
  hava: [
    'hava kirliligi',
    'hava kalitesi',
    'emisyon',
    'ucucu organik',
    'koku',
    'ozon',
  ],
  su: ['yerustu su', 'yeralti su', 'havza', 'su verimliligi', 'su kaynak'],
  atiksu: ['atiksu', 'atik su', 'desarj', 'aritma', 'kanalizasyon'],
  atik: ['atik', 'bertaraf', 'geri kazanim', 'sifir atik', 'dongusel'],
  urun: ['ambalaj', 'akumulator', 'pil', 'cevre etiket', 'gekap', 'depozito'],
  toprak: ['toprak kirliligi', 'kirlenmis saha', 'toprak koruma'],
  gurultu: ['gurultu', 'titresim', 'akustik'],
  kimyasal: [
    'kimyasal',
    'kkdik',
    'buyuk endustriyel kaza',
    'kalici organik',
    'tehlikeli madde',
  ],
  deniz: ['deniz kirliligi', 'gemi atik', 'dip tarama', 'kiyi'],
  doga: [
    'sulak alan',
    'korunan alan',
    'tabiat',
    'biyolojik cesitlilik',
    'orman',
    'milli park',
  ],
  maden: ['maden atik', 'rehabilitasyon', 'dogaya yeniden'],
  entegre: ['endustriyel emisyon', 'kirletici salim', 'mevcut en iyi teknik'],
  olcum: ['cevre olcum', 'cevre laboratuvar', 'surekli izleme'],
};

// These are routing hints, never a legal scope decision or automatic exclusion.
export function classify(title, document, catalog) {
  const content = normalize(`${title} ${document.text}`);
  const matches = Object.entries(TOPICS).flatMap(([category, terms]) =>
    terms
      .filter((term) => content.includes(term))
      .map((term) => ({ category, term })),
  );
  const related = catalog
    .filter((item) =>
      [item.title, item.originalTitle, ...(item.aliases ?? [])]
        .filter(Boolean)
        .some(
          (name) =>
            normalize(name).length > 12 && content.includes(normalize(name)),
        ),
    )
    .map((item) => item.slug);
  const carbon = /karbon|sera gazi|iklim|emisyon ticaret/.test(content);
  // The word emission alone must not re-route an otherwise carbon-only text.
  const environmental =
    matches.some(({ term }) => term !== 'emisyon') ||
    /cevre kanunu|cevre kirliligi/.test(content);
  const intent = /yururlukten kaldir|ilga/.test(content)
    ? 'repeal_candidate'
    : /degisiklik yapil|degistiril/.test(content)
      ? 'amendment_candidate'
      : 'new_candidate';
  return {
    kind: !document.readable
      ? 'unreadable'
      : carbon && !environmental && !related.length
        ? 'carbon_review'
        : environmental || related.length || matches.length
          ? intent
          : 'scope_review',
    categories: [...new Set(matches.map((item) => item.category))],
    signals: matches,
    related,
    requiresAnnexReview: !document.readable || document.hasImages,
    effectiveDate: null,
    note: 'Otomatik ön eleme işaretleri; kapsam ve yürürlük kararı değildir. Yayım tarihi yürürlük tarihi sayılmaz.',
  };
}

export function retryDelay(attempts) {
  return Math.min(24 * 60 * 60_000, 10 * 60_000 * 2 ** Math.min(attempts, 8));
}
