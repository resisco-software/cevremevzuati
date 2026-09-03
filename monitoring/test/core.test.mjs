import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classify,
  decodeHtml,
  fetchOfficial,
  isDocument,
  istanbulDate,
  issueEntries,
  normalize,
  officialUrl,
  readHtml,
  retryDelay,
} from '../src/core.mjs';
import { escapeHtml } from '../src/admin.mjs';
import { catalog, htmlResponse, legalHtml, source } from './helpers.mjs';

test('official source allowlist validates protocol, hostname, credentials and port', () => {
  assert.equal(
    officialUrl('http://resmigazete.gov.tr/a#x'),
    'https://www.resmigazete.gov.tr/a',
  );
  for (const url of [
    'https://resmigazete.gov.tr.evil.test/x',
    'http://127.0.0.1/',
    'file:///etc/passwd',
    'https://user@resmigazete.gov.tr/a',
    'https://mevzuat.gov.tr:444/a',
  ])
    assert.throws(() => officialUrl(url));
});
test('redirect to an untrusted host never makes a second request', async () => {
  let requests = 0;
  await assert.rejects(
    fetchOfficial(source, async () => {
      requests++;
      return new Response(null, {
        status: 302,
        headers: { Location: 'https://evil.test/' },
      });
    }),
  );
  assert.equal(requests, 1);
});
test('Windows-1254 preserves Turkish legal text', () => {
  const prefix = new TextEncoder().encode('<meta charset="windows-1254">');
  const bytes = new Uint8Array([...prefix, 0xdd, 0xfd, 0xde, 0xfe, 0xd0, 0xf0]);
  assert.equal(decodeHtml(bytes, 'text/html').slice(-6), 'İıŞşĞğ');
  assert.equal(normalize('İZİN, ÇED, ATIKSU'), 'izin ced atiksu');
});
test('HTML parser handles single/unquoted links, entities, nested labels and scripts', () => {
  const parsed = readHtml(
    `<script>fake</script><a href='${source}'><b>Çevre</b> &amp; su</a><a href=${source}>Duplicate</a>`,
    source,
  );
  assert.equal(parsed.links.length, 1);
  assert.ok(!parsed.text.includes('fake'));
  assert.equal(
    escapeHtml('<img onerror="x">'),
    '&lt;img onerror=&quot;x&quot;&gt;',
  );
});
test('empty, blocked, oversized and unreadable sources never mean no change', async () => {
  await assert.rejects(
    fetchOfficial(source, async () =>
      htmlResponse('<html>Request rejected</html>'),
    ),
  );
  await assert.rejects(
    fetchOfficial(source, async () => new Response('no', { status: 503 })),
  );
  await assert.rejects(
    fetchOfficial(
      source,
      async () =>
        new Response('', { headers: { 'Content-Length': '99999999' } }),
    ),
  );
  const pdf = await fetchOfficial(
    source,
    async () =>
      new Response('%PDF-1.7 test', {
        headers: { 'Content-Type': 'application/pdf' },
      }),
  );
  assert.equal(pdf.readable, false);
});
test('date boundary uses Turkey, not UTC', () => {
  assert.equal(istanbulDate(Date.parse('2026-09-02T21:05:00Z')), '2026-09-03');
  assert.equal(retryDelay(99), 86400000);
});
test('normal and mükerrer documents are extracted; other dates are not substituted', () => {
  const links = [
    { url: source, title: 'Genel kanun' },
    {
      url: 'https://www.resmigazete.gov.tr/fihrist?tarih=2026-09-02&mukerrer=2',
      title: '2. Mükerrer',
    },
    {
      url: 'https://www.resmigazete.gov.tr/fihrist?tarih=2026-07-03&mukerrer=1',
      title: 'Son mükerrer',
    },
  ];
  assert.ok(
    isDocument(
      'https://www.resmigazete.gov.tr/eskiler/2026/09/20260902M2-1.pdf',
    ),
  );
  const entries = issueEntries({ readable: true, links }, '2026-09-02');
  assert.equal(entries.documents.length, 1);
  assert.equal(entries.issues.length, 1);
  assert.throws(() => issueEntries({ readable: true, links }, '2026-09-03'));
});
test('all new texts receive review; keywords are not exclusion decisions', () => {
  const document = (text) => ({ text, readable: true, hasImages: false });
  assert.equal(
    classify('Bazı Kanunlarda Değişiklik', document('Bu genel metin'), []).kind,
    'scope_review',
  );
  const omnibus = classify(
    'Bazı Kanunlarda Değişiklik Yapılması',
    document('2872 sayılı Çevre Kanunu ve atık'),
    [],
  );
  assert.equal(omnibus.kind, 'amendment_candidate');
  assert.ok(omnibus.categories.includes('atik'));
  assert.equal(omnibus.effectiveDate, null);
  assert.deepEqual(classify(catalog[0].title, document(''), catalog).related, [
    'cevre',
  ]);
});
test('carbon-only and mixed environmental/carbon texts remain separate review candidates', () => {
  const carbon = classify(
    'Emisyon Ticaret Sistemi',
    { text: 'Sera gazı karbon iklim', readable: true },
    [],
  );
  assert.equal(carbon.kind, 'carbon_review');
  const mixed = classify(
    'Karbon ve Çevre',
    { text: 'Atıksu deşarjı ve sera gazı', readable: true },
    [],
  );
  assert.equal(mixed.kind, 'new_candidate');
  assert.ok(mixed.categories.includes('atiksu'));
});
test('image-bearing text and PDF require manual review', () => {
  const doc = readHtml(legalHtml('Ekler', '<img src="ek1.gif">'), source);
  assert.equal(
    classify('Ekler', { ...doc, readable: true }, []).requiresAnnexReview,
    true,
  );
  assert.equal(
    classify('Yeni mevzuat', { text: '', readable: false }, []).kind,
    'unreadable',
  );
});
