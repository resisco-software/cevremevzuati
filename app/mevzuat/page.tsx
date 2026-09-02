import type { Metadata } from 'next';
import { BookOpenCheck, ShieldCheck } from 'lucide-react';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { LegislationBrowser } from '@/components/site/legislation-browser';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { categories, legislation } from '@/lib/legislation-data';
import { openGraphFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Mevzuat dizini',
  description:
    'Çevre mevzuatını konu, kısaltma, başlık ve Resmî Gazete bilgileriyle tarayın.',
  alternates: { canonical: '/mevzuat' },
  openGraph: openGraphFor({
    title: 'Çevre mevzuatı dizini',
    description:
      'Çevre mevzuatını konu, kısaltma, başlık ve Resmî Gazete bilgileriyle tarayın.',
    path: '/mevzuat',
  }),
};

export default async function LegislationPage({
  searchParams,
}: {
  searchParams: Promise<{ alan?: string; q?: string }>;
}) {
  const { alan, q } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main id="icerik" className="min-h-screen bg-background">
        <section className="border-b border-border bg-card">
          <div className="site-frame py-12 lg:py-16">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Mevzuat dizini' },
              ]}
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="section-kicker">Çevre mevzuatı</p>
                <h1 className="mt-3 max-w-3xl font-heading text-[clamp(2.5rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                  Mevzuat dizini
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                  Konu başlığı, düzenleme adı, kısaltma veya Resmî Gazete
                  sayısıyla arayın. Her kayıtta yayım künyesi, kimi kapsadığı,
                  önce bakılacak ek ve resmî kaynak birlikte gösterilir.
                </p>
              </div>
              <ul className="grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
                <li className="flex items-center gap-2">
                  <ShieldCheck
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Madde düzeyinde resmî kaynak
                </li>
                <li className="flex items-center gap-2">
                  <BookOpenCheck
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Yorum içermeyen kayıt yapısı
                </li>
                <li className="flex items-center gap-2">
                  <BookOpenCheck
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {categories.length} alan · {legislation.length} kayıt
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="site-frame py-10 lg:py-14">
          {/* key: adres değişince bileşen yeniden kurulur, filtre URL ile senkron kalır */}
          <LegislationBrowser
            key={`${alan ?? 'all'}-${q ?? ''}`}
            initialCategory={alan}
            initialQuery={q}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
