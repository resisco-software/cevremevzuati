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
import { getLegislationGuide } from '@/lib/legislation-guides';
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
  const guide = getLegislationGuide(item.slug);

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

              <nav
                aria-label="Bu sayfadaki bölümler"
                className="card mt-8 p-3 shadow-none"
              >
                <p className="eyebrow px-2 pt-1 pb-2">Bu sayfada</p>
                <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
                  {(guide
                    ? [
                        ['01', 'Neden var?', '#neden-var'],
                        ['02', 'Kim bilmeli?', '#kim-bilmeli'],
                        ['03', 'Neye karar verir?', '#karar-alanlari'],
                        ['04', 'Nasıl okunur?', '#okuma-rotasi'],
                        ['05', 'Kapsam atfı', '#kapsam-atfi'],
                        ['06', 'Madde ve ekler', '#metin-haritasi'],
                        ['08', 'Resmî kaynak', '#resmi-kaynak'],
                      ]
                    : [
                        ['01', 'Kapsam atfı', '#kapsam-atfi'],
                        ['02', 'Metin haritası', '#metin-haritasi'],
                        ['03', 'Sürüm zinciri', '#surum-zinciri'],
                        ['04', 'Resmî kaynak', '#resmi-kaynak'],
                      ]
                  ).map(([number, label, href]) => (
                    <a
                      key={href}
                      href={href}
                      className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                    >
                      <span className="gazette text-xs text-muted-foreground">
                        {number}
                      </span>
                      <span className="group-hover:text-primary">{label}</span>
                    </a>
                  ))}
                </div>
              </nav>

              {guide && (
                <>
                  <section
                    id="neden-var"
                    className="border-t border-border mt-12 scroll-mt-24 pt-8"
                  >
                    <p className="eyebrow">01 · Genel çerçeve</p>
                    <h2 className="text-xl mt-3">Neyi düzenler, neden var?</h2>
                    <p className="measure mt-5 text-lg leading-8 font-medium">
                      {guide.purpose.lead}
                    </p>
                    <p className="measure mt-3 text-md leading-8 text-muted-foreground">
                      {guide.purpose.detail}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {guide.purpose.references.map((reference) => (
                        <span key={reference} className="badge badge-live">
                          {reference}
                        </span>
                      ))}
                    </div>

                    {guide.boundary && (
                      <div className="card mt-7 border-l-2 border-l-attention p-5 shadow-none">
                        <h3 className="text-md font-semibold">
                          {guide.boundary.title}
                        </h3>
                        <p className="measure mt-2 text-sm leading-7 text-muted-foreground">
                          {guide.boundary.text}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {guide.boundary.references.map((reference) => (
                            <span key={reference} className="pill h-8 text-xs">
                              {reference}
                            </span>
                          ))}
                          {guide.boundary.relatedSlug && (
                            <Link
                              href={`/mevzuat/${guide.boundary.relatedSlug}`}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                              {guide.boundary.relatedLabel}
                              <ArrowRight
                                className="size-3.5"
                                aria-hidden="true"
                              />
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </section>

                  <section
                    id="kim-bilmeli"
                    className="border-t border-border mt-12 scroll-mt-24 pt-8"
                  >
                    <p className="eyebrow">02 · Kullanım alanı</p>
                    <h2 className="text-xl mt-3">
                      Kim, hangi nedenle bilmelidir?
                    </h2>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {guide.audiences.map((entry) => (
                        <article
                          key={entry.title}
                          className="card p-5 shadow-none"
                        >
                          <h3 className="text-base font-semibold">
                            {entry.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {entry.text}
                          </p>
                          <p className="gazette mt-4 text-xs text-primary">
                            {entry.references.join(' · ')}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section
                    id="karar-alanlari"
                    className="border-t border-border mt-12 scroll-mt-24 pt-8"
                  >
                    <p className="eyebrow">03 · Etkilediği kararlar</p>
                    <h2 className="text-xl mt-3">Neye karar verir?</h2>
                    <p className="measure mt-4 text-sm leading-7 text-muted-foreground">
                      Yönetmelik tek bir sınır değer tablosu değildir. Bir
                      tesisin hava emisyonu yönetiminde aşağıdaki karar
                      alanlarını birlikte kurar.
                    </p>
                    <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
                      {guide.decisions.map((entry, index) => (
                        <article
                          key={entry.title}
                          className="grid gap-3 border-b border-border p-5 last:border-b-0 sm:grid-cols-[2rem_12rem_1fr]"
                        >
                          <span className="gazette text-xs text-muted-foreground">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold">
                              {entry.title}
                            </h3>
                            <p className="gazette mt-2 text-xs text-primary">
                              {entry.references.join(' · ')}
                            </p>
                          </div>
                          <p className="text-sm leading-7 text-muted-foreground">
                            {entry.text}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section
                    id="okuma-rotasi"
                    className="border-t border-border mt-12 scroll-mt-24 pt-8"
                  >
                    <p className="eyebrow">04 · Uygulama sırası</p>
                    <h2 className="text-xl mt-3">Nasıl okunmalıdır?</h2>
                    <ol className="mt-6 grid gap-3 list-none">
                      {guide.readingOrder.map((entry, index) => (
                        <li key={entry.title} className="card p-5 shadow-none">
                          <div className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
                            <span className="gazette text-lg text-primary">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <h3 className="text-base font-semibold">
                                {entry.title}
                              </h3>
                              <p className="measure mt-2 text-sm leading-7 text-muted-foreground">
                                {entry.text}
                              </p>
                              <p className="gazette mt-3 text-xs text-primary">
                                {entry.references.join(' · ')}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                </>
              )}

              {/* kapsam */}
              <section
                id="kapsam-atfi"
                className="border-t border-border mt-12 scroll-mt-24 pt-8"
              >
                <p className="eyebrow">
                  {guide ? '05 · Doğrudan atıf' : '01 · Başlangıç noktası'}
                </p>
                <h2 className="text-xl mt-3">Kapsamı belirleyen atıf</h2>
                <p className="measure mt-4 text-sm leading-7 text-muted-foreground">
                  Bu bölüm yalnızca ilgili hükme yönlendirir. Kapsam kararı,
                  resmî metindeki faaliyet, kapasite, proses ve istisna şartları
                  birlikte okunarak verilir.
                </p>

                {item.primaryAnnex && (
                  <div className="card mt-6 border-l-2 border-l-primary p-5 shadow-none">
                    <h3 className="eyebrow">İlk kontrol</h3>
                    <p className="measure mt-2 text-md leading-8 font-medium">
                      {item.primaryAnnex}
                    </p>
                    <ExternalLink
                      href={item.consolidatedUrl ?? item.sourceUrl}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline hover:decoration-seal"
                      iconClassName="size-3"
                    >
                      Atfı resmî metinde aç
                    </ExternalLink>
                  </div>
                )}
              </section>

              <section
                id="metin-haritasi"
                className="border-t border-border mt-12 scroll-mt-24 pt-8"
              >
                <p className="eyebrow">
                  {guide ? '06 · Resmî metin' : '02 · Resmî metin'}
                </p>
                <h2 className="text-xl mt-3">Hızlı okuma haritası</h2>
                <p className="measure mt-4 text-sm leading-7 text-muted-foreground">
                  Atıflar yorum içermez; madde, ek ve tablo başlıklarını okuma
                  sırasına dizer.
                </p>

                {item.officialReferences?.length ? (
                  <ol className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
                    {item.officialReferences.map((entry, index) => (
                      <li
                        key={`${entry.reference}-${entry.title}`}
                        className="border-b border-border last:border-b-0"
                      >
                        <div className="grid gap-2 px-5 py-4 sm:grid-cols-[8.5rem_1fr] sm:items-center">
                          <span className="flex items-baseline gap-3">
                            <span className="gazette text-xs text-muted-foreground">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                              {entry.reference}
                            </span>
                          </span>
                          <span className="text-sm leading-6 font-medium">
                            {entry.title}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="mt-6 border-l-2 border-attention pl-5">
                    <p className="text-md font-semibold">
                      Madde ve ek dizini henüz işlenmedi
                    </p>
                    <p className="measure mt-2 text-sm leading-7 text-muted-foreground">
                      Doğrulanmamış bir başlık üretmek yerine doğrudan resmî
                      metne yönlendiriyoruz.
                    </p>
                    <ExternalLink
                      href={item.consolidatedUrl ?? item.sourceUrl}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline hover:decoration-seal"
                      iconClassName="size-3"
                    >
                      Resmî metni aç
                    </ExternalLink>
                  </div>
                )}
              </section>

              {/* sürüm zinciri */}
              <section
                id="surum-zinciri"
                className="border-t border-border mt-12 scroll-mt-24 pt-8"
              >
                <p className="eyebrow">
                  {guide ? '07 · Zaman çizgisi' : '03 · Zaman çizgisi'}
                </p>
                <h2 className="text-xl mt-3">Sürüm ve değişiklikler</h2>
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
                        <p className="text-md font-semibold">İlk yayım</p>
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
                      {item.publicationLabel}, {item.gazetteNumber} sayılı Resmî
                      Gazete. Düzenlemenin sonradan değişmiş olabileceğini
                      varsayın ve güncel metni resmî kaynağından kontrol edin.
                    </p>
                  </div>
                )}
              </section>

              <section
                id="resmi-kaynak"
                className="border-t border-border mt-12 scroll-mt-24 pt-8"
              >
                <p className="eyebrow">
                  {guide ? '08 · Kaynak' : '04 · Kaynak'}
                </p>
                <h2 className="text-xl mt-3">Resmî metin</h2>
                <p className="measure mt-4 text-sm leading-7 text-muted-foreground">
                  {item.publicationLabel} tarihli, {item.gazetteNumber} sayılı
                  Resmî Gazete kaydı.
                </p>
                <ExternalLink
                  href={item.consolidatedUrl ?? item.sourceUrl}
                  className="mt-5 inline-flex h-12 items-center justify-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  iconClassName="size-3.5"
                >
                  {item.consolidatedUrl ? 'Güncel metni aç' : 'Resmî metni aç'}
                </ExternalLink>
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
            <aside className="lg:sticky lg:top-24 lg:self-start">
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
                      ? 'Yayım tarihi ve resmî ad, Resmî Gazete kaydıyla karşılaştırıldı. Bağlantı resmî yayım kaydını açar.'
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
