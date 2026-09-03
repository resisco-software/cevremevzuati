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
  searchParams: Promise<{
    alan?: string;
    q?: string;
    tur?: string;
    durum?: string;
  }>;
}) {
  const { alan, q, tur, durum } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main id="icerik">
        <section>
          <div className="site-frame py-10 lg:py-14">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Mevzuat dizini' },
              ]}
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="eyebrow">Çevre mevzuatı</p>
                <h1 className="text-3xl measure mt-4">Mevzuat dizini</h1>
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
            key={`${alan ?? 'all'}-${q ?? ''}-${tur ?? 'all'}-${durum ?? 'all'}`}
            initialCategory={alan}
            initialQuery={q}
            initialDocumentType={tur}
            initialRecordStatus={durum}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
