import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { ExternalLink } from '@/components/site/external-link';
import { FieldCard } from '@/components/site/field-card';
import { HomeSearch } from '@/components/site/home-search';
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
  verificationSummary,
} from '@/lib/legislation-data';
import {
  absoluteUrl,
  openGraphFor,
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

const featuredSlugs = [
  'cevre-izin-ve-lisans-yonetmeligi',
  'skhkky',
  'endustriyel-emisyonlarin-yonetimi',
  'atik-yonetimi',
];

const featured = featuredSlugs
  .map((slug) => legislation.find((item) => item.slug === slug))
  .filter((item): item is (typeof legislation)[number] => Boolean(item));

/** Aynı terimin iki düzenlemede ayrı tanımlandığı gerçek örnek. */
const doubleDefined = (() => {
  const counts = glossary.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.term] = (acc[entry.term] ?? 0) + 1;
    return acc;
  }, {});
  const term = Object.keys(counts).find((key) => counts[key] > 1);
  return term ? glossary.filter((entry) => entry.term === term) : [];
})();

export default function HomePage() {
  const summary = verificationSummary();

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
      <main id="icerik">
        <section className="site-frame pt-16 pb-14 lg:pt-24 lg:pb-20">
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="label">Türkiye çevre mevzuatı</p>
              <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
                Resmî kaynağa giden okuma rotası. Hukuki görüş değil; önce nereye
                bakacağınız.
              </p>
              <dl className="record mt-10 grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
                <div>
                  <dt className="text-muted-foreground">Alan</dt>
                  <dd className="mt-1 font-display text-2xl text-ink">
                    {categories.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Kayıt</dt>
                  <dd className="mt-1 font-display text-2xl text-ink">
                    {legislation.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Tanım</dt>
                  <dd className="mt-1 font-display text-2xl text-ink">
                    {glossary.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Kırık kaynak</dt>
                  <dd className="mt-1 font-display text-2xl text-ink">0</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <h1 className="display-xl">
                Hangi çevre mevzuatını okumanız gerektiğini bulun.
              </h1>
              <p className="mt-6 max-w-xl text-md leading-8 text-muted-foreground">
                Adını biliyorsanız arayın. Tesisi tarif ediyorsanız rota
                çıkarın. Her kaydın yanında hangi eke bakacağınız ve resmî
                kaynak vardır.
              </p>
              <div className="mt-8">
                <HomeSearch />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#alanlar"
                  className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-seal px-5 text-base font-medium text-primary-foreground hover:bg-ink"
                >
                  Tesisime göre rota
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/kapsam"
                  className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-rule bg-card px-5 text-base hover:border-ink"
                >
                  Alan haritası
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="alanlar" className="site-frame pb-16 lg:pb-20">
          <div className="panel px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <LegislationWizard />
          </div>
        </section>

        <section id="konu-dizini" className="site-frame pb-16 lg:pb-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="label">Kapsam</p>
              <h2 className="display-lg mt-4">
                {categories.length} giriş noktası, dağınık bir arşiv değil.
              </h2>
              <p className="mt-5 leading-8 text-muted-foreground">
                Kuruluştan kapanışa; hava, su, atık, ürün, kimyasal, deniz, doğa
                ve ölçüm. Alanı seçin, ilgili kayıtlara inin.
              </p>
            </div>
            <aside className="panel w-full max-w-sm p-5 lg:w-72">
              <h3 className="label">Kaynak izi</h3>
              <dl className="kunye mt-3">
                <div>
                  <dt>Kayıt</dt>
                  <dd>{summary.total}</dd>
                </div>
                <div>
                  <dt>Künyesi doğrulanmış</dt>
                  <dd>{summary.verified}</dd>
                </div>
                <div>
                  <dt>Son kontrol</dt>
                  <dd>{lastSourceCheck()}</dd>
                </div>
              </dl>
              <Link
                href="/metodoloji"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-seal underline decoration-rule underline-offset-4 hover:decoration-ochre"
              >
                Kaynak ve yöntem
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </aside>
          </div>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => (
              <li key={category.id}>
                <FieldCard
                  id={category.id}
                  index={index}
                  label={category.label}
                  description={category.subtopics.slice(0, 3).join(' · ')}
                  count={categoryRecordCount(category.id)}
                  href={`/mevzuat?alan=${category.id}`}
                />
              </li>
            ))}
          </ol>
        </section>

        <section className="site-frame pb-16 lg:pb-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label">Sık bakılanlar</p>
              <h2 className="display-lg mt-4">
                Aramakla değil, okumakla vakit geçirin.
              </h2>
            </div>
            <Link
              href="/mevzuat"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-rule bg-card px-4 text-sm hover:border-ink"
            >
              {legislation.length} kaydın tamamı
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="record-list mt-10">
            {featured.map((item) => (
              <li key={item.slug}>
                <div className="record-row">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="label">{item.aliases[0] ?? item.type}</p>
                    <span className="record text-xs text-muted-foreground">
                      RG {item.gazetteNumber} · {item.publicationLabel}
                    </span>
                  </div>
                  <h3 className="font-display mt-2 text-md font-semibold">
                    <Link
                      href={`/mevzuat/${item.slug}`}
                      className="hover:text-ochre"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="measure mt-2 text-sm leading-7 text-muted-foreground">
                    {item.appliesTo}
                  </p>
                  {item.primaryAnnex && (
                    <p className="measure mt-1.5 text-sm leading-7">
                      <span className="label">Önce</span>{' '}
                      <span className="text-muted-foreground">
                        {item.primaryAnnex}
                      </span>
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <Link
                      href={`/mevzuat/${item.slug}`}
                      className="underline decoration-rule underline-offset-4 hover:text-ochre hover:decoration-ochre"
                    >
                      Kayıt sayfası
                    </Link>
                    <ExternalLink
                      href={item.consolidatedUrl ?? item.sourceUrl}
                      className="inline-flex items-center gap-1.5 text-muted-foreground underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-ochre"
                      iconClassName="size-3"
                    >
                      Resmî kaynak
                    </ExternalLink>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {doubleDefined.length > 1 && (
          <section className="site-frame pb-8">
            <div className="ledger">
              <div>
                <p className="label">Sözlük</p>
                <h2 className="display-lg measure mt-4">
                  Tanım nereden geliyorsa, cevabı orada.
                </h2>
                <p className="measure mt-5 leading-8 text-muted-foreground">
                  Her terim, kullanıldığı düzenleme ve maddeyle birlikte
                  gösterilir. Aynı terim farklı düzenlemelerde farklı
                  tanımlanıyorsa kayıtlar ayrılır.
                </p>

                <h3 className="font-display mt-10 text-lg font-semibold">
                  “{doubleDefined[0].term}” · {doubleDefined.length} tanım
                </h3>
                <div className="mt-5 grid gap-8">
                  {doubleDefined.slice(0, 2).map((entry) => (
                    <figure key={entry.source}>
                      <blockquote
                        cite={entry.sourceUrl}
                        className="quote measure"
                      >
                        {entry.verbatim
                          ? `“${entry.definition}”`
                          : entry.definition}
                      </blockquote>
                      <figcaption className="record mt-3 pl-5 text-xs text-muted-foreground">
                        {entry.source} · {entry.article}
                        {!entry.verbatim && ' · sadeleştirilmiş özet'}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <Link
                  href="/sozluk"
                  className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl border border-rule bg-card px-4 text-sm hover:border-ink"
                >
                  {glossary.length} tanımın tamamı
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <aside className="panel h-fit p-5">
                <h2 className="label">Sözlük kuralı</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Bir tanım ya mevzuat metninden birebir alıntıdır ve tırnak
                  içinde gösterilir, ya da sadeleştirilmiş özettir. Bağlayıcı
                  metin her zaman kaynaktaki maddedir.
                </p>
              </aside>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
