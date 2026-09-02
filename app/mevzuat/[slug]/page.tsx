import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileClock,
  FileText,
  Info,
  Link2,
  ShieldCheck,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import {
  categories,
  getLegislation,
  legislation,
} from '@/lib/legislation-data';

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
  if (!item) return { title: 'Mevzuat kaydı bulunamadı' };
  return {
    title: `${item.title} | Çevre Mevzuatı`,
    description: `${item.summary} Resmî Gazete ve sürüm bilgileri.`,
    openGraph: {
      title: item.title,
      description: item.summary,
      images: [],
    },
    twitter: {
      card: 'summary',
      title: item.title,
      description: item.summary,
      images: [],
    },
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
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border bg-card">
        <div className="site-frame max-w-[1200px] py-10 lg:py-14">
          <Link
            href="/mevzuat"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Mevzuat dizinine dön
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{item.type}</Badge>
                <Badge
                  variant="outline"
                  className={`gap-1 ${
                    item.status === 'Yürürlükte'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.status === 'Yürürlükte' ? (
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                  ) : (
                    <FileText className="size-3" aria-hidden="true" />
                  )}{' '}
                  {item.status}
                </Badge>
              </div>
              <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl">
                {item.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
                {item.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {itemCategories.map(
                  (category) =>
                    category && (
                      <Link
                        key={category.id}
                        href={`/mevzuat?alan=${category.id}`}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary/35 hover:text-primary"
                      >
                        {category.shortLabel}
                      </Link>
                    ),
                )}
              </div>
            </div>
            <aside className="precision-card bg-background p-5">
              <p className="section-kicker">Resmî Gazete</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-muted-foreground">Tarih</dt>
                  <dd className="meta-type font-medium text-right">
                    {item.publicationLabel}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-muted-foreground">Sayı</dt>
                  <dd className="meta-type font-medium text-right">
                    {item.gazetteNumber}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Kontrol</dt>
                  <dd className="meta-type font-medium text-right">
                    {item.checkedAt}
                  </dd>
                </div>
              </dl>
              <Button
                nativeButton={false}
                render={
                  <a
                    href={item.consolidatedUrl ?? item.sourceUrl}
                    aria-label={`${item.title} resmî metni`}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
                className="mt-5 h-10 w-full rounded-[10px]"
              >
                {item.consolidatedUrl ? 'Güncel metni aç' : 'Resmî kaynağı aç'}
                <ExternalLink className="size-4" aria-hidden="true" />
              </Button>
              {item.consolidatedUrl && (
                <a
                  href={item.sourceUrl}
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noreferrer"
                >
                  İlk yayım kaynağı{' '}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="site-frame grid max-w-[1200px] gap-10 py-12 lg:grid-cols-[1fr_320px] lg:py-16">
        <div>
          <section aria-labelledby="version-title">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <FileClock className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="section-kicker">Kayıt zinciri</p>
                <h2
                  id="version-title"
                  className="font-heading text-2xl font-semibold tracking-tight"
                >
                  Sürüm ve değişiklikler
                </h2>
              </div>
            </div>
            <div className="mt-6 border-l border-primary/30 pl-6">
              <article className="relative pb-7">
                <span className="absolute top-1 -left-[29px] size-2 rounded-full bg-primary ring-4 ring-background" />
                <time className="meta-type text-[11px] font-medium text-primary">
                  {item.publicationLabel}
                </time>
                <h3 className="mt-1 font-semibold">İlk yayım</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.gazetteNumber} sayılı Resmî Gazete
                </p>
              </article>
              {item.changes?.map((change) => (
                <article key={change.sourceUrl} className="relative pb-7">
                  <span className="absolute top-1 -left-[29px] size-2 rounded-full bg-accent-foreground ring-4 ring-background" />
                  <time className="meta-type text-[11px] font-medium text-primary">
                    {change.date}
                  </time>
                  <h3 className="mt-1 font-semibold leading-6">
                    {change.label}
                  </h3>
                  <a
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    href={change.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Değişiklik kaynağı{' '}
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </article>
              ))}
              <article className="relative">
                <span className="absolute top-1 -left-[29px] size-2 rounded-full bg-secondary-foreground ring-4 ring-background" />
                <time className="meta-type text-[11px] font-medium text-primary">
                  {item.checkedAt}
                </time>
                <h3 className="mt-1 font-semibold">Son kaynak kontrolü</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Resmî kaynak bağlantısı kontrol edildi.
                </p>
              </article>
            </div>
          </section>

          <section
            className="mt-12 border-t border-border pt-10"
            aria-labelledby="record-title"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <FileText className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="section-kicker">Kayıt yapısı</p>
                <h2
                  id="record-title"
                  className="font-heading text-2xl font-semibold tracking-tight"
                >
                  Bu düzenlemeye bağlı içerikler
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              <div className="bg-card p-5">
                <strong className="block font-heading text-lg">
                  Ana metin
                </strong>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                  İlk yayım ve varsa konsolide resmî metin
                </span>
              </div>
              <div className="bg-card p-5">
                <strong className="block font-heading text-lg">
                  Değişiklikler
                </strong>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                  Tarih ve kaynak sırasıyla bağlı kayıtlar
                </span>
              </div>
              <div className="bg-card p-5">
                <strong className="block font-heading text-lg">Ekler</strong>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                  Kapsam tabloları, listeler ve formlar
                </span>
              </div>
            </div>
          </section>
        </div>

        <aside>
          <Alert className="rounded-[14px] border-primary/20 bg-primary/5 p-5 shadow-none">
            <Info className="text-primary" aria-hidden="true" />
            <AlertTitle>Kapsam sonucu için tesis verisi gerekir</AlertTitle>
            <AlertDescription>
              Faaliyet adı, proses, kapasite ve konum bilgileri ilgili madde
              veya ekle karşılaştırılmadan yükümlülük sonucu verilmez.
            </AlertDescription>
          </Alert>
          <div className="precision-card mt-4 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />{' '}
              Kaynak niteliği
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {item.status === 'Yürürlükte'
                ? 'Yayım künyesi resmî kaynağa bağlıdır; yürürlük durumu güncel resmî listeyle karşılaştırılmıştır.'
                : item.status === 'Yürürlükten kaldırıldı'
                  ? 'Bu kayıt tarihsel iz için tutulur ve güncel okuma rotasına eklenmez.'
                  : 'Yayım künyesi resmî kaynağa bağlıdır; güncel yürürlük kontrolü tamamlanmadan yükümlülük sonucu olarak kullanılmaz.'}
            </p>
            <Link
              href="/metodoloji"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Kaynak yöntemini incele{' '}
              <Link2 className="size-3" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}
