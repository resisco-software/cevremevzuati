import type { Metadata } from 'next';
import {
  ArrowRight,
  BookMarked,
  CheckCircle2,
  FileSearch,
  FolderSearch2,
  Layers,
  ListChecks,
  Compass,
  RadioTower,
  Route,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

import { JsonLd } from '@/components/site/json-ld';
import { LegislationWizard } from '@/components/site/legislation-wizard';
import { QuickSearch } from '@/components/site/quick-search';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { areaStyle } from '@/lib/area-theme';
import { categoryIcons } from '@/lib/category-icons';
import {
  categories,
  categoryRecordCount,
  glossary,
  lastSourceCheck,
  legislation,
  maxCategoryRecordCount,
} from '@/lib/legislation-data';
import {
  absoluteUrl,
  openGraphFor,
  publisherName,
  publisherUrl,
  siteDescription,
  siteName,
} from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: 'Çevre Mevzuatı | Tesisiniz için mevzuat navigasyonu',
  },
  description: siteDescription,
  alternates: { canonical: '/' },
  openGraph: openGraphFor({
    title: 'Çevre Mevzuatı',
    description: 'Tesisiniz için doğrulanabilir mevzuat navigasyonu',
    path: '/',
  }),
};

/** Sitenin resmî mevzuat portallarından ayrıştığı somut noktalar. */
const differences = [
  {
    icon: FileSearch,
    title: 'Tam adı bilmeden bulun',
    body: 'SKHKKY, ÇİLY, GEKAP, SEÖS gibi kısaltmalar; Türkçe karakter kullanmadan yazım; Resmî Gazete sayısı. Üçü de çalışır.',
  },
  {
    icon: ListChecks,
    title: 'Hangi eke bakacağınız yazılı',
    body: 'Her kayıtta kimi kapsadığı, önce bakılacak ek veya madde ve tipik yükümlülükler listelenir. PDF açmadan görürsünüz.',
  },
  {
    icon: Compass,
    title: 'Tesisinizi tanımlayın, liste çıksın',
    body: 'Konuyu bilmiyorsanız dört soruya cevap verin. Her sonucun altında onu listeye getiren cevabınız yazar.',
  },
  {
    icon: CheckCircle2,
    title: 'Bağlantı doğrudan düzenlemeye gider',
    body: `${legislation.length} kaydın tamamı madde düzeyinde Resmî Gazete bağlantısı taşır. Günün tam sayısına atan bağlantı yok.`,
  },
];

const featuredSlugs = [
  'cevre-izin-ve-lisans-yonetmeligi',
  'skhkky',
  'atik-yonetimi',
  'endustriyel-emisyonlarin-yonetimi',
  'sifir-atik',
  'su-kirliligi-kontrolu',
];

const featured = featuredSlugs
  .map((slug) => legislation.find((item) => item.slug === slug))
  .filter((item): item is (typeof legislation)[number] => Boolean(item));

const documentTypes = [
  { label: 'Kanunlar', value: 'Kanun' },
  { label: 'Yönetmelikler', value: 'Yönetmelik' },
  { label: 'Tebliğler', value: 'Tebliğ' },
].map((entry) => ({
  ...entry,
  count: legislation.filter((item) => item.type === entry.value).length,
}));

export default function HomePage() {
  const maxCount = maxCategoryRecordCount();

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: absoluteUrl('/'),
          inLanguage: 'tr-TR',
          description: siteDescription,
          publisher: {
            '@type': 'Organization',
            name: publisherName,
            url: publisherUrl,
            knowsAbout: [
              'Çevre mevzuatı',
              'Çevre izin ve lisans',
              'Sürekli Emisyon Ölçüm Sistemleri',
              'Sera gazı emisyonları',
              'Atık yönetimi',
              'Sürdürülebilirlik',
            ],
          },
          creator: {
            '@type': 'Organization',
            name: publisherName,
            url: publisherUrl,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${absoluteUrl('/mevzuat')}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <main id="icerik">
        {/*
          ---- arama önce ----
          Tek sol eksen. Önce başlık ve alt başlık ortalıydı, altındaki
          form ise 768 piksellik ortalanmış bir blokta sola dayalıydı;
          üstteki bar ve aşağıdaki bölümler ise sayfa kenarında.
          Yani sayfada üç ayrı sol kenar vardı. Hepsi artık aynı
          kenardan başlıyor, metin genişliği okunabilirlikle sınırlı.
        */}
        <section className="home-hero border-b border-border">
          <div className="site-frame py-12 lg:py-16">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 font-medium text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Resmî kaynaklara dayalı
              </span>
              <span
                className="hidden h-4 w-px bg-border sm:block"
                aria-hidden="true"
              />
              <span>Son kaynak kontrolü: {lastSourceCheck()}</span>
            </div>

            <h1 className="mt-6 max-w-[19ch] text-3xl">
              Çevre mevzuatına doğrudan ulaşın.
            </h1>
            <p className="measure mt-5 text-md leading-8 text-muted-foreground">
              Aradığınız düzenlemeyi adı, konusu, kısaltması veya Resmî Gazete
              sayısıyla bulun; kapsamını anlayın ve doğrulanmış kaynağına geçin.
            </p>

            <div className="mt-9 max-w-5xl">
              <QuickSearch />
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-2">
              <Link
                href="#konu-dizini"
                className="card card-link home-route-card group flex min-h-44 items-start gap-5 p-6 sm:p-7"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <FolderSearch2 className="size-5" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col self-stretch">
                  <span className="eyebrow">Konu ve çalışma alanına göre</span>
                  <span className="mt-2 block text-lg font-semibold leading-snug">
                    Mevzuat haritasını keşfedin
                  </span>
                  <span className="mt-2 block text-sm leading-7 text-muted-foreground">
                    {categories.length} çevre alanını; alt konuları ve ilgili
                    düzenlemeleri birlikte inceleyin.
                  </span>
                  <span className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium text-primary">
                    Alanları incele
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
              <Link
                href="#alanlar"
                className="card card-link home-route-card group flex min-h-44 items-start gap-5 p-6 sm:p-7"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Route className="size-5" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col self-stretch">
                  <span className="eyebrow">
                    Faaliyetinize ve tesisinize göre
                  </span>
                  <span className="mt-2 block text-lg font-semibold leading-snug">
                    Kapsam listenizi oluşturun
                  </span>
                  <span className="mt-2 block text-sm leading-7 text-muted-foreground">
                    Dört kısa adımda tesisinizi tanımlayın; önce incelemeniz
                    gereken mevzuat kayıtlarını görün.
                  </span>
                  <span className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium text-primary">
                    Kapsam çalışmasını başlat
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section
          className="border-b border-border bg-card"
          aria-label="Hızlı erişim"
        >
          <div className="site-frame flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <nav
              className="flex flex-wrap items-center gap-2"
              aria-label="Düzenleme türleri"
            >
              <span className="eyebrow mr-2">Düzenleme türleri</span>
              {documentTypes.map((entry) => (
                <Link
                  key={entry.value}
                  href={`/mevzuat?tur=${encodeURIComponent(entry.value)}`}
                  className="pill"
                >
                  {entry.label}
                  <span className="gazette text-muted-foreground">
                    {entry.count}
                  </span>
                </Link>
              ))}
            </nav>
            <Link
              href="/izleme"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              <RadioTower className="size-4" aria-hidden="true" />
              Yeni düzenlemeleri ve değişiklikleri izleyin
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>

        {/* ---- alan haritası ---- */}
        <section id="konu-dizini" className="border-t border-border bg-card">
          <div className="site-frame py-14 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Mevzuat haritası</p>
                <h2 className="mt-2.5 text-xl">
                  Çalışma alanınıza göre keşfedin.
                </h2>
                <p className="measure mt-3 leading-8 text-muted-foreground">
                  Hava, su, atık, kimyasallar ve diğer çevre başlıklarını alt
                  konularıyla birlikte tarayın. Her kart doğrudan ilgili kayıt
                  kümesini açar.
                </p>
              </div>
              <Link
                href="/mevzuat"
                className="btn inline-flex items-center justify-center btn-quiet h-11 px-4 text-sm"
              >
                Tüm dizin
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => {
                const count = categoryRecordCount(category.id);
                const Icon = categoryIcons[category.id] ?? Layers;
                return (
                  <li key={category.id} style={areaStyle(category.id)}>
                    <Link
                      href={`/mevzuat?alan=${category.id}`}
                      className="card card-link area-edge flex min-h-52 h-full flex-col p-6"
                    >
                      <span className="flex items-start gap-3">
                        <Icon
                          className="mt-0.5 size-5 shrink-0 text-area"
                          aria-hidden="true"
                        />
                        <span className="font-semibold leading-snug">
                          {category.label}
                        </span>
                      </span>
                      <span className="mt-3 block text-sm leading-7 text-muted-foreground">
                        {category.description}
                      </span>
                      <span className="mt-3 block text-sm leading-6 text-muted-foreground">
                        {category.subtopics.slice(0, 3).join(' · ')}
                      </span>
                      <span className="mt-4 flex items-center gap-3">
                        <span className="meter flex-1" aria-hidden="true">
                          <span
                            style={{
                              width: `${Math.max(6, (count / maxCount) * 100)}%`,
                            }}
                          />
                        </span>
                        <span className="gazette shrink-0 text-muted-foreground">
                          {count} kayıt
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---- neden burası ---- */}
        <section className="border-t border-border">
          <div className="site-frame py-14 lg:py-16">
            <p className="eyebrow">Neden burası</p>
            <h2 className="measure mt-2.5 text-xl">
              Resmî portalda arama, doğru adı bilmenizi ister. Burada bilmeniz
              gerekmiyor.
            </h2>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {differences.map((entry) => (
                <li
                  key={entry.title}
                  className="card flex items-start gap-4 p-5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <entry.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold">{entry.title}</span>
                    <span className="mt-1.5 block text-sm leading-7 text-muted-foreground">
                      {entry.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              Bu site hukuki görüş üretmez ve resmî portalın yerine geçmez.
              Bağlayıcı metin Resmî Gazete&apos;dedir; her kayıt oraya bağlanır.{' '}
              <Link
                href="/metodoloji"
                className="font-medium text-primary hover:underline"
              >
                Kaynak ve yöntem
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ---- sihirbaz ---- */}
        <section id="alanlar" className="border-t border-border bg-muted/30">
          <div className="site-frame py-14 lg:py-16">
            <LegislationWizard />
          </div>
        </section>

        {/* ---- sık açılan kayıtlar ---- */}
        <section className="border-t border-border">
          <div className="site-frame py-14 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Sık açılan kayıtlar</p>
                <h2 className="mt-2.5 text-xl">
                  Çoğu sanayi tesisinin başladığı yer
                </h2>
              </div>
              <Link
                href="/mevzuat"
                className="btn inline-flex items-center justify-center btn-quiet h-11 px-4 text-sm"
              >
                {legislation.length} kaydın tamamı
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-9 grid gap-3 lg:grid-cols-2">
              {featured.map((item) => {
                const areaId = item.categories[0] ?? 'izin';
                return (
                  <li key={item.slug} style={areaStyle(areaId)}>
                    <Link
                      href={`/mevzuat/${item.slug}`}
                      className="card card-link area-edge flex h-full flex-col p-5"
                    >
                      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="area-dot" aria-hidden="true" />
                        <span className="text-sm text-muted-foreground">
                          {item.type}
                        </span>
                        <span className="gazette ml-auto text-muted-foreground">
                          RG {item.gazetteNumber} · {item.publicationLabel}
                        </span>
                      </span>
                      <span className="mt-2 block font-semibold leading-snug">
                        {item.title}
                      </span>
                      <span className="mt-2 block text-sm leading-7 text-muted-foreground">
                        {item.appliesTo}
                      </span>
                      {item.primaryAnnex && (
                        <span className="mt-3 block text-sm leading-6">
                          <span className="eyebrow">Önce</span>{' '}
                          <span className="text-muted-foreground">
                            {item.primaryAnnex}
                          </span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---- sözlük ---- */}
        <section className="border-t border-border bg-card">
          <div className="site-frame flex flex-wrap items-center justify-between gap-8 py-14 lg:py-16">
            <div className="measure">
              <p className="eyebrow">Sözlük</p>
              <h2 className="mt-2.5 text-xl">
                Tanım nereden geliyorsa, cevabı orada.
              </h2>
              <p className="mt-3 leading-8 text-muted-foreground">
                {glossary.length} terim, kullanıldığı düzenleme ve maddeyle
                birlikte. Aynı terim farklı düzenlemelerde farklı tanımlanıyorsa
                kayıtlar ayrılır. En son kaynak kontrolü {lastSourceCheck()}.
              </p>
            </div>
            <Link
              href="/sozluk"
              className="btn inline-flex items-center justify-center btn-primary h-12 px-5"
            >
              <BookMarked className="size-4" aria-hidden="true" />
              Sözlüğü aç
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
