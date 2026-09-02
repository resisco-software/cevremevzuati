import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileClock,
  Info,
  Link2,
  ListChecks,
  Newspaper,
  ShieldCheck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
          sameAs: item.consolidatedUrl ?? item.sourceUrl,
          description: item.summary,
          publisher: { '@type': 'Organization', name: siteName },
        }}
      />
      <main id="icerik" className="min-h-screen bg-background">
        <section className="border-b border-border bg-card">
          <div className="site-frame max-w-[1200px] py-10 lg:py-14">
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
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  <Badge
                    variant="outline"
                    className={`gap-1 ${
                      item.status === 'Yürürlükte'
                        ? 'border-primary/25 bg-primary/5 text-primary'
                        : 'border-destructive/30 bg-destructive/8 text-destructive'
                    }`}
                  >
                    {item.status === 'Yürürlükte' ? (
                      <CheckCircle2 className="size-3" aria-hidden="true" />
                    ) : (
                      <Archive className="size-3" aria-hidden="true" />
                    )}{' '}
                    {item.status}
                  </Badge>
                </div>
                <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
                  {item.title}
                </h1>
                {item.originalTitle && (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    İlk yayımdaki adı: {item.originalTitle}
                  </p>
                )}
                {item.aliases.length > 0 && (
                  <p className="meta-type mt-3 text-sm text-muted-foreground">
                    Ayrıca bilinen adlar: {item.aliases.join(', ')}
                  </p>
                )}
                <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
                  {item.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {itemCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/mevzuat?alan=${category.id}`}
                      className="rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:border-primary/40 hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                    >
                      {category.shortLabel}
                    </Link>
                  ))}
                </div>
              </div>
              <aside className="precision-card bg-background p-5">
                <h2 className="section-kicker">Resmî Gazete</h2>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                    <dt className="text-muted-foreground">Tarih</dt>
                    <dd className="meta-type text-right font-medium">
                      {item.publicationLabel}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                    <dt className="text-muted-foreground">Sayı</dt>
                    <dd className="meta-type text-right font-medium">
                      {item.gazetteNumber}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground">Son kontrol</dt>
                    <dd className="meta-type text-right font-medium">
                      {item.checkedAt}
                    </dd>
                  </div>
                </dl>
                <ExternalLink
                  href={item.consolidatedUrl ?? item.sourceUrl}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                  iconClassName="size-4"
                >
                  {item.consolidatedUrl ? 'Güncel metni aç' : 'Resmî kaynağı aç'}
                </ExternalLink>
                {item.consolidatedUrl && (
                  <ExternalLink
                    href={item.sourceUrl}
                    className="mt-3 flex items-center justify-center gap-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                    iconClassName="size-3"
                  >
                    İlk yayım kaynağı
                  </ExternalLink>
                )}
                {item.sourceNote && (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.sourceNote}
                  </p>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section className="site-frame grid max-w-[1200px] gap-10 py-12 lg:grid-cols-[1fr_320px] lg:py-16">
          <div>
            <section aria-labelledby="scope-title">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                  <ListChecks className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="section-kicker">Kapsam</p>
                  <h2
                    id="scope-title"
                    className="font-heading text-[1.75rem] font-semibold tracking-[-0.02em]"
                  >
                    Bu düzenleme kimi kapsar?
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-3xl text-base leading-7">
                {item.appliesTo}
              </p>
              {item.primaryAnnex && (
                <div className="mt-6 rounded-lg border border-border bg-card p-5">
                  <h3 className="text-base font-semibold">
                    Önce bakılacak ek veya madde
                  </h3>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">
                    {item.primaryAnnex}
                  </p>
                </div>
              )}
              {item.obligations.length > 0 && (
                <div className="mt-4 rounded-lg border border-border bg-card p-5">
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <ClipboardList
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    Tipik yükümlülükler
                  </h3>
                  <ul className="mt-3 grid gap-2">
                    {item.obligations.map((obligation) => (
                      <li
                        key={obligation}
                        className="flex items-start gap-2.5 text-base leading-7 text-muted-foreground"
                      >
                        <CheckCircle2
                          className="mt-1.5 size-3.5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        {obligation}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Bu başlıklar yönlendirme amaçlıdır; hangi yükümlülüğün
                    tesisinize düştüğü ilgili ek ve eşik değerlerle
                    doğrulanmalıdır.
                  </p>
                </div>
              )}
            </section>

            <section
              className="mt-12 border-t border-border pt-10"
              aria-labelledby="version-title"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                  <FileClock className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="section-kicker">Kayıt zinciri</p>
                  <h2
                    id="version-title"
                    className="font-heading text-[1.75rem] font-semibold tracking-[-0.02em]"
                  >
                    Sürüm ve değişiklikler
                  </h2>
                </div>
              </div>

              {hasChanges ? (
                <div className="mt-6 border-l border-primary/30 pl-6">
                  <article className="relative pb-7">
                    <span className="absolute top-1.5 -left-[29px] size-2 rounded-full bg-primary ring-4 ring-background" />
                    <time
                      dateTime={item.publicationDate}
                      className="meta-type text-sm font-medium text-primary"
                    >
                      {item.publicationLabel}
                    </time>
                    <h3 className="mt-1 text-base font-semibold">İlk yayım</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.gazetteNumber} sayılı Resmî Gazete
                    </p>
                  </article>
                  {item.changes?.map((change) => (
                    <article key={change.sourceUrl} className="relative pb-7">
                      <span className="absolute top-1.5 -left-[29px] size-2 rounded-full bg-accent-foreground ring-4 ring-background dark:bg-accent" />
                      <time className="meta-type text-sm font-medium text-primary">
                        {change.date}
                      </time>
                      <h3 className="mt-1 text-base font-semibold leading-6">
                        {change.label}
                      </h3>
                      <ExternalLink
                        href={change.sourceUrl}
                        className="mt-2 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                        iconClassName="size-3"
                      >
                        Değişiklik kaynağı
                      </ExternalLink>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-dashed border-input bg-card p-5">
                  <p className="text-base font-semibold">
                    Bu kayıtta değişiklik zinciri henüz işlenmedi
                  </p>
                  <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
                    Kayıtta yalnızca ilk yayım künyesi bulunuyor:{' '}
                    {item.publicationLabel}, {item.gazetteNumber} sayılı Resmî
                    Gazete. Düzenlemenin sonradan değişmiş olabileceğini
                    varsayın ve güncel metni{' '}
                    {item.consolidatedUrl
                      ? 'konsolide kaynaktan'
                      : 'resmî kaynaktan'}{' '}
                    kontrol edin.
                  </p>
                  <ExternalLink
                    href={item.consolidatedUrl ?? item.sourceUrl}
                    className="mt-4 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                    iconClassName="size-3"
                  >
                    Güncel metni kontrol et
                  </ExternalLink>
                </div>
              )}
            </section>

            {sameGazette.length > 0 && (
              <section
                className="mt-12 border-t border-border pt-10"
                aria-labelledby="same-gazette-title"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                    <Newspaper className="size-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="section-kicker">Aynı nüsha</p>
                    <h2
                      id="same-gazette-title"
                      className="font-heading text-[1.75rem] font-semibold tracking-[-0.02em]"
                    >
                      Aynı Resmî Gazete sayısındaki diğer kayıtlar
                    </h2>
                  </div>
                </div>
                <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
                  {item.gazetteNumber} sayılı Resmî Gazete&apos;de bu düzenlemeyle
                  birlikte {sameGazette.length} düzenleme daha yayımlandı. Aynı
                  nüsha, ayrı kayıtlardır.
                </p>
                <ul className="mt-4 grid gap-2">
                  {sameGazette.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/mevzuat/${other.slug}`}
                        className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3.5 text-base transition-colors hover:border-primary/40 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                      >
                        <span className="font-medium">{other.title}</span>
                        <span className="meta-type shrink-0 text-sm text-muted-foreground">
                          {other.type}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="grid gap-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Info className="size-4 text-primary" aria-hidden="true" />
                Kapsam sonucu için tesis verisi gerekir
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Faaliyet adı, proses, kapasite ve konum bilgileri ilgili madde
                veya ekle karşılaştırılmadan yükümlülük sonucu verilmez.
              </p>
              <Link
                href="/#alanlar"
                className="mt-4 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
              >
                Tesisime göre rota oluştur
              </Link>
            </div>
            <div className="precision-card p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                Kaynak niteliği
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.status === 'Yürürlükten kaldırıldı'
                  ? 'Bu kayıt tarihsel iz için tutulur ve güncel okuma rotasına eklenmez.'
                  : item.verification === 'doğrulandı'
                    ? 'Yayım tarihi ve resmî ad, Resmî Gazete kaydıyla karşılaştırıldı; kaynak bağlantısı madde düzeyinde açılıyor.'
                    : 'Kayıt eklendi, künye doğrulaması sürüyor. Yükümlülük sonucu olarak kullanmadan önce resmî kaynaktan teyit edin.'}
              </p>
              <Link
                href="/metodoloji"
                className="mt-4 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
              >
                Kaynak yöntemini incele{' '}
                <Link2 className="size-3" aria-hidden="true" />
              </Link>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/mevzuat" />}
              variant="outline"
              className="h-11 gap-2 rounded-md bg-card px-4"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Mevzuat dizinine dön
            </Button>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
