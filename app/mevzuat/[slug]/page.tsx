import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ExternalLink } from '@/components/site/external-link';
import { JsonLd } from '@/components/site/json-ld';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import {
  categories,
  getLegislation,
  legislation,
  sameGazetteRecords,
} from '@/lib/legislation-data';
import { officialSourceUrl } from '@/lib/official-url';
import { absoluteUrl, openGraphFor, siteName } from '@/lib/site';

export function generateStaticParams() {
  return legislation.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getLegislation(slug);
  if (!item) {
    return { title: 'Mevzuat kaydı bulunamadı', robots: { index: false } };
  }
  const description = `${item.publicationLabel} tarihli ${item.gazetteNumber} sayılı Resmî Gazete. ${item.appliesTo}`;
  return {
    title: item.title,
    description,
    alternates: { canonical: `/mevzuat/${item.slug}` },
    openGraph: openGraphFor({
      title: item.title,
      description,
      path: `/mevzuat/${item.slug}`,
    }),
  };
}

export default async function LegislationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getLegislation(slug);
  if (!item) notFound();

  const itemCategories = item.categories
    .map((id) => categories.find((category) => category.id === id))
    .filter((category): category is (typeof categories)[number] =>
      Boolean(category),
    );
  const primaryCategory = itemCategories[0];
  const hasChanges = (item.changes?.length ?? 0) > 0;
  const sameGazette = sameGazetteRecords(item.slug);
  const sameAs =
    officialSourceUrl(item.consolidatedUrl) ??
    officialSourceUrl(item.sourceUrl);

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Legislation',
          name: item.title,
          alternateName: item.aliases,
          legislationType: item.type,
          legislationIdentifier: `Resmî Gazete ${item.gazetteNumber}`,
          datePublished: item.publicationDate,
          inLanguage: 'tr-TR',
          jurisdiction: 'Türkiye',
          url: absoluteUrl(`/mevzuat/${item.slug}`),
          ...(sameAs ? { sameAs } : {}),
          description: item.summary,
          publisher: { '@type': 'Organization', name: siteName },
        }}
      />
      <main id="icerik">
        <div className="site-frame pt-8 pb-14 lg:pb-20">
          <Breadcrumbs
            items={[
              { label: 'Ana sayfa', href: '/' },
              { label: 'Mevzuat', href: '/mevzuat' },
              ...(primaryCategory
                ? [
                    {
                      label: primaryCategory.shortLabel,
                      href: `/mevzuat?alan=${primaryCategory.id}`,
                    },
                  ]
                : []),
              { label: item.title },
            ]}
          />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            {/* ---- okuma sütunu ---- */}
            <article>
              <p className="eyebrow">
                {item.type}
                {item.foundation && ' · Temel düzenleme'}
              </p>
              <h1 className="text-2xl mt-4 max-w-4xl">{item.title}</h1>

              {item.originalTitle && (
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  İlk yayımdaki adı:{' '}
                  <span className="text-ink">{item.originalTitle}</span>
                </p>
              )}
              {item.aliases.length > 0 && (
                <p className="gazette mt-3 text-xs text-muted-foreground">
                  {item.aliases.join(' · ')}
                </p>
              )}

              <p className="measure mt-6 text-md leading-8">{item.summary}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span
                  className={
                    item.status === 'Yürürlükte'
                      ? 'badge badge-live'
                      : 'badge badge-repealed'
                  }
                >
                  {item.status}
                </span>
                {itemCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/mevzuat?alan=${category.id}`}
                    className="text-sm text-muted-foreground hover:underline hover:text-ink hover:decoration-seal"
                  >
                    {category.shortLabel}
                  </Link>
                ))}
              </div>

              {/* kapsam */}
              <section className="border-t border-border mt-12 pt-8">
                <h2 className="text-xl">Bu düzenleme kimi kapsar?</h2>
                <p className="measure mt-5 text-md leading-8">
                  {item.appliesTo}
                </p>

                {item.primaryAnnex && (
                  <div className="border-t border-border mt-8 pt-5">
                    <h3 className="eyebrow">Önce bakılacak ek veya madde</h3>
                    <p className="measure mt-3 text-md leading-8">
                      {item.primaryAnnex}
                    </p>
                  </div>
                )}

                {item.obligations.length > 0 && (
                  <div className="border-t border-border mt-8 pt-5">
                    <h3 className="eyebrow">Tipik yükümlülükler</h3>
                    <ol className="grid gap-3 list-none mt-3">
                      {item.obligations.map((obligation, index) => (
                        <li key={obligation}>
                          <div className="card p-4">
                            <span className="gazette text-muted-foreground">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="text-md leading-8">
                              {obligation}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="measure mt-4 text-sm leading-7 text-muted-foreground">
                      Bu başlıklar yönlendirme amaçlıdır. Hangi yükümlülüğün
                      tesisinize düştüğü, yukarıdaki ek ve eşik değerlerle
                      doğrulanmalıdır.
                    </p>
                  </div>
                )}
              </section>

              {/* sürüm zinciri */}
              <section className="border-t border-border mt-12 pt-8">
                <h2 className="text-xl">Sürüm ve değişiklikler</h2>
                {hasChanges ? (
                  <ol className="grid gap-3 list-none mt-6">
                    <li>
                      <div className="card p-4">
                        <time
                          dateTime={item.publicationDate}
                          className="gazette text-muted-foreground"
                        >
                          {item.publicationDate.slice(0, 4)}
                        </time>
                        <p className="text-md font-semibold">
                          İlk yayım
                        </p>
                        <p className="gazette mt-1 text-xs text-muted-foreground">
                          {item.publicationLabel} · {item.gazetteNumber} sayılı
                          Resmî Gazete
                        </p>
                      </div>
                    </li>
                    {item.changes?.map((change) => (
                      <li key={change.sourceUrl}>
                        <div className="card p-4">
                          <span className="gazette text-muted-foreground">
                            {change.date.slice(-4)}
                          </span>
                          <p className="text-md font-semibold leading-snug">
                            {change.label}
                          </p>
                          <p className="gazette mt-1 text-xs text-muted-foreground">
                            {change.date}
                          </p>
                          <ExternalLink
                            href={change.sourceUrl}
                            className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline hover:decoration-seal"
                            iconClassName="size-3"
                          >
                            Değişiklik kaynağı
                          </ExternalLink>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="mt-6 border-l-2 border-attention pl-5">
                    <p className="text-md font-semibold">
                      Bu kayıtta değişiklik zinciri henüz işlenmedi
                    </p>
                    <p className="measure mt-2 leading-8 text-muted-foreground">
                      Kayıtta yalnızca ilk yayım künyesi bulunuyor:{' '}
                      {item.publicationLabel}, {item.gazetteNumber} sayılı
                      Resmî Gazete. Düzenlemenin sonradan değişmiş olabileceğini
                      varsayın ve güncel metni resmî kaynağından kontrol edin.
                    </p>
                  </div>
                )}
              </section>

              {/* aynı nüsha */}
              {sameGazette.length > 0 && (
                <section className="border-t border-border mt-12 pt-8">
                  <h2 className="text-xl">Aynı nüshadaki diğer kayıtlar</h2>
                  <p className="measure mt-4 leading-8 text-muted-foreground">
                    {item.gazetteNumber} sayılı Resmî Gazete&apos;de bu
                    düzenlemeyle birlikte {sameGazette.length} düzenleme daha
                    yayımlandı. Aynı nüsha, ayrı kayıtlardır.
                  </p>
                  <ul className="grid gap-3 list-none mt-5">
                    {sameGazette.map((other) => (
                      <li key={other.slug}>
                        <Link
                          href={`/mevzuat/${other.slug}`}
                          className="card p-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                        >
                          <span className="max-w-2xl text-base font-semibold">
                            {other.title}
                          </span>
                          <span className="gazette text-xs text-muted-foreground">
                            {other.type}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>

            {/* ---- künye sütunu ---- */}
            <aside>
              <h2 className="eyebrow">Resmî Gazete</h2>
              <dl className="kv mt-4">
                <div>
                  <dt>Tarih</dt>
                  <dd>{item.publicationLabel}</dd>
                </div>
                <div>
                  <dt>Sayı</dt>
                  <dd>{item.gazetteNumber}</dd>
                </div>
                <div>
                  <dt>Tür</dt>
                  <dd>{item.type}</dd>
                </div>
                <div>
                  <dt>Yürürlük</dt>
                  <dd>{item.status}</dd>
                </div>
                <div>
                  <dt>Son kontrol</dt>
                  <dd>{item.checkedAt}</dd>
                </div>
              </dl>

              <ExternalLink
                href={item.consolidatedUrl ?? item.sourceUrl}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                iconClassName="size-3.5"
              >
                {item.consolidatedUrl ? 'Güncel metni aç' : 'Resmî kaynağı aç'}
              </ExternalLink>
              {item.consolidatedUrl && (
                <ExternalLink
                  href={item.sourceUrl}
                  className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:underline hover:text-ink hover:decoration-seal"
                  iconClassName="size-3"
                >
                  İlk yayım kaynağı
                </ExternalLink>
              )}
              {item.sourceNote && (
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {item.sourceNote}
                </p>
              )}

              <div className="border-t border-border mt-8 pt-5">
                <h2 className="eyebrow">Kaynak niteliği</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.status === 'Yürürlükten kaldırıldı'
                    ? 'Bu kayıt tarihsel iz için tutulur ve güncel okuma rotasına eklenmez.'
                    : item.verification === 'doğrulandı'
                      ? 'Yayım tarihi ve resmî ad, Resmî Gazete kaydıyla karşılaştırıldı. Kaynak bağlantısı madde düzeyinde açılıyor.'
                      : 'Kayıt eklendi, künye doğrulaması sürüyor. Yükümlülük sonucu olarak kullanmadan önce resmî kaynaktan teyit edin.'}
                </p>
                <Link
                  href="/metodoloji"
                  className="mt-3 inline-block text-sm text-primary hover:underline hover:decoration-seal"
                >
                  Kaynak ve yöntem
                </Link>
              </div>

              <div className="border-t border-border mt-8 pt-5">
                <h2 className="eyebrow">Kapsam kararı</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Faaliyet adı, proses, kapasite ve konum bilgileri ilgili madde
                  veya ekle karşılaştırılmadan yükümlülük sonucu verilmez.
                </p>
                <Link
                  href="/#alanlar"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline hover:decoration-seal"
                >
                  Tesisime göre rota oluştur
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>

              <Link
                href="/mevzuat"
                className="border-t border-border mt-8 flex items-center gap-2 pt-5 text-sm text-muted-foreground hover:text-ink"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Mevzuat dizinine dön
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
