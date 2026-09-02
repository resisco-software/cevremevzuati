import type { Metadata } from 'next';
import {
  ArrowRight,
  BookMarked,
  FileClock,
  FileText,
  Search,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/site/json-ld';
import { LegislationWizard } from '@/components/site/legislation-wizard';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import {
  categories,
  categoryRecordCount,
  glossary,
  lastSourceCheck,
  legislation,
  maxCategoryRecordCount,
  subtopicCount,
} from '@/lib/legislation-data';
import {
  absoluteUrl,
  openGraphFor,
  siteDescription,
  siteName,
} from '@/lib/site';

export const metadata: Metadata = {
  // absolute: kök düzendeki '%s | Çevre Mevzuatı' şablonu ana sayfada tekrar etmesin
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

/** Veriden üretilen son değişiklik kayıtları; sabit metin kullanılmaz. */
const recentChanges = legislation
  .flatMap((item) =>
    (item.changes ?? []).map((change) => ({
      ...change,
      parent: item.title,
      parentSlug: item.slug,
    })),
  )
  .slice(0, 3);

const featuredSlugs = [
  'cevre-izin-ve-lisans-yonetmeligi',
  'endustriyel-emisyonlarin-yonetimi',
  'skhkky',
];

const featured = featuredSlugs
  .map((slug) => legislation.find((item) => item.slug === slug))
  .filter((item): item is (typeof legislation)[number] => Boolean(item));

/** Aynı terimin iki düzenlemede ayrı tanımlandığı gerçek örnek. */
const multiDefinitionTerm = (() => {
  const counts = glossary.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.term] = (acc[entry.term] ?? 0) + 1;
    return acc;
  }, {});
  const term = Object.keys(counts).find((key) => counts[key] > 1);
  return term ? glossary.filter((entry) => entry.term === term) : [];
})();

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
          publisher: { '@type': 'Organization', name: siteName },
        }}
      />
      <main id="icerik" className="min-h-screen bg-background">
        <section className="hero-surface relative overflow-hidden border-b border-border">
          <div
            className="document-grid pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <div className="site-frame relative grid gap-12 py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(480px,1.15fr)] lg:items-start lg:py-18">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Resmî kaynağa dayalı
              </span>
              <h1 className="mt-6 font-heading text-[clamp(2.5rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                Hangi çevre mevzuatını{' '}
                <span className="text-primary">okumanız gerektiğini</span>{' '}
                bulun.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                Alanı seçin, tesisinizi kısaca tanımlayın ve önce okunması
                gereken düzenlemeleri resmî kaynaklarıyla birlikte görün. Her
                kaydın yanında hangi eke bakacağınız yazılıdır.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  nativeButton={false}
                  render={<Link href="#alanlar" />}
                  className="h-12 gap-2 rounded-md px-5 text-base"
                >
                  Tesisim için başla
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/mevzuat" />}
                  variant="outline"
                  className="h-12 gap-2 rounded-md bg-card px-5 text-base"
                >
                  <Search className="size-4" aria-hidden="true" />
                  Mevzuat ara
                </Button>
              </div>
              <dl className="meta-type mt-10 grid gap-x-6 gap-y-3 border-t border-border pt-6 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-muted-foreground">Ana çevre alanı</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {categories.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Mevzuat kaydı</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {legislation.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Sözlük tanımı</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {glossary.length}
                  </dd>
                </div>
              </dl>
            </div>
            <div id="alanlar" className="min-w-0">
              <LegislationWizard />
            </div>
          </div>
        </section>

        <section
          id="konu-dizini"
          className="border-b border-border bg-card py-14 lg:py-18"
        >
          <div className="site-frame">
            <p className="section-kicker">Kapsam haritası</p>
            <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="max-w-3xl font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em]">
                  Çevre mevzuatının kapsamı, {categories.length} doğru giriş
                  noktasıyla.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                  Kuruluştan kapanışa; hava, su, atık, ürün, kimyasal, deniz,
                  doğa ve ölçüm dahil bütün çevre alanlarını tek yapıda
                  tarayın. Çubuk uzunluğu o alandaki kayıt sayısını gösterir.
                </p>
              </div>
              <Button
                nativeButton={false}
                render={<Link href="/kapsam" />}
                variant="outline"
                className="h-11 gap-2 rounded-md bg-background px-4"
              >
                Tam kapsam haritası
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <ul className="category-index mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const count = categoryRecordCount(category.id);
                return (
                  <li key={category.id}>
                    <Link
                      href={`/mevzuat?alan=${category.id}`}
                      className="precision-card flex h-full flex-col gap-3 bg-background p-5 transition-colors hover:border-primary/50"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-heading text-base font-semibold leading-6 tracking-[-0.02em]">
                          {category.label}
                        </h3>
                        <span className="meta-type shrink-0 text-sm font-semibold text-primary">
                          {count}
                        </span>
                      </div>
                      <div className="weight-bar" aria-hidden="true">
                        <span
                          style={{
                            width: `${Math.max(6, (count / maxCount) * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {category.description}
                      </p>
                      <p className="mt-auto text-sm text-muted-foreground">
                        {category.subtopics.slice(0, 2).join(' · ')}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="inverse-panel relative overflow-hidden py-14 lg:py-18">
          <div
            className="version-lines pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <div className="site-frame relative grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <p className="meta-type text-xs font-semibold uppercase tracking-[0.12em] text-background/65">
                Kaynak izi
              </p>
              <h2 className="mt-3 max-w-xl font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em]">
                Her kayıt, madde düzeyinde resmî kaynağa bağlı.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-background/80">
                {legislation.length} kaydın tamamında yayım künyesi, kaynak
                bağlantısı ve son kontrol tarihi birlikte tutulur. Bağlantı
                günün tam sayısına değil, düzenlemenin kendisine gider.
              </p>
              <Link
                href="/metodoloji"
                className="mt-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-background hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
              >
                Kaynak yöntemini incele
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-3">
              {recentChanges.length > 0 && (
                <div className="rounded-lg border border-background/20 bg-background/10 p-5">
                  <p className="meta-type text-xs font-semibold uppercase tracking-[0.12em] text-background/65">
                    İşlenmiş değişiklik kayıtları
                  </p>
                  <ul className="mt-4 grid gap-4">
                    {recentChanges.map((change) => (
                      <li key={change.sourceUrl}>
                        <p className="meta-type text-sm text-background/70">
                          {change.date}
                        </p>
                        <p className="mt-1 text-base font-semibold leading-6">
                          {change.label}
                        </p>
                        <Link
                          href={`/mevzuat/${change.parentSlug}`}
                          className="mt-1.5 inline-block rounded text-sm text-background/80 underline hover:text-background focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                        >
                          {change.parent}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="rounded-lg border border-background/20 bg-background/10 p-5">
                <FileClock className="size-5" aria-hidden="true" />
                <p className="mt-3 text-base font-semibold">
                  En son kaynak kontrolü: {lastSourceCheck()}
                </p>
                <p className="mt-2 text-sm leading-6 text-background/80">
                  Kontrol; kaynak bağlantısının açıldığını ve yayım künyesinin
                  Resmî Gazete kaydıyla eşleştiğini kapsar. Değişiklik zinciri
                  işlenmemiş kayıtlarda bu durum kayıt sayfasında belirtilir.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-14 lg:py-18">
          <div className="site-frame">
            <p className="section-kicker">Mevzuat dizini</p>
            <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <h2 className="max-w-2xl font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em]">
                Aramakla değil, okumakla vakit geçirin.
              </h2>
              <Button
                nativeButton={false}
                render={<Link href="/mevzuat" />}
                variant="outline"
                className="h-11 gap-2 rounded-md bg-card px-4"
              >
                Dizini aç
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <ul className="mt-10 grid gap-3 lg:grid-cols-3">
              {featured.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/mevzuat/${item.slug}`}
                    className="precision-card flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-1 text-sm font-medium text-secondary-foreground">
                        {item.type}
                      </span>
                      <span className="meta-type text-sm text-muted-foreground">
                        RG {item.gazetteNumber}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-semibold leading-6 tracking-[-0.02em]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.appliesTo}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      <FileText className="size-3.5" aria-hidden="true" />
                      Kayıt sayfası
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 lg:py-18">
          <div className="site-frame grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <p className="section-kicker">Mevzuat sözlüğü</p>
              <h2 className="mt-3 font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em]">
                Tanım nereden geliyorsa, cevabı orada.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Her terim, kullanıldığı düzenleme ve maddeyle birlikte
                gösterilir. Aynı terimin farklı düzenlemelerdeki tanımları ayrı
                kayıtlarda tutulur.
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/sozluk" />}
                variant="outline"
                className="mt-6 h-11 gap-2 rounded-md bg-card px-4"
              >
                <BookMarked className="size-4" aria-hidden="true" />
                Sözlüğü aç
              </Button>
            </div>
            {multiDefinitionTerm.length > 1 && (
              <div className="precision-card p-6">
                <p className="section-kicker">Örnek: aynı terim, iki tanım</p>
                <h3 className="mt-2 font-heading text-lg font-semibold">
                  “{multiDefinitionTerm[0].term}”
                </h3>
                <dl className="mt-5 grid gap-5">
                  {multiDefinitionTerm.slice(0, 2).map((entry) => (
                    <div key={entry.source}>
                      <dt className="text-sm font-semibold">
                        {entry.source} · {entry.article}
                      </dt>
                      <dd className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        {entry.verbatim
                          ? `“${entry.definition}”`
                          : entry.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-sm text-muted-foreground">
                  Sözlükte {glossary.length} tanım, {subtopicCount()} alt konu
                  başlığı altındaki kayıtlara bağlı.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
