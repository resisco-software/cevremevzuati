import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { GlossaryBrowser } from '@/components/site/glossary-browser';
import { JsonLd } from '@/components/site/json-ld';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { glossary } from '@/lib/legislation-data';
import { absoluteUrl, openGraphFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Mevzuat sözlüğü',
  description:
    'Çevre mevzuatındaki terimleri, kaynak düzenleme ve madde atıflarıyla bulun.',
  alternates: { canonical: '/sozluk' },
  openGraph: openGraphFor({
    title: 'Çevre mevzuatı sözlüğü',
    description:
      'Çevre mevzuatındaki terimleri, kaynak düzenleme ve madde atıflarıyla bulun.',
    path: '/sozluk',
  }),
};

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; konu?: string }>;
}) {
  const { q, konu } = await searchParams;
  const distinctTerms = new Set(glossary.map((entry) => entry.term));

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTermSet',
          name: 'Çevre Mevzuatı Sözlüğü',
          url: absoluteUrl('/sozluk'),
          inLanguage: 'tr-TR',
          hasDefinedTerm: glossary.map((entry) => ({
            '@type': 'DefinedTerm',
            name: entry.term,
            description: entry.definition,
            inDefinedTermSet: entry.source,
          })),
        }}
      />
      <main id="icerik">
        <section className="border-b border-border">
          <div className="site-frame py-7 lg:py-9">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Mevzuat sözlüğü' },
              ]}
            />
            <div className="mt-5 max-w-3xl">
              <p className="eyebrow">Çevre mevzuatı</p>
              <h1 className="mt-2 text-3xl">Mevzuat sözlüğü</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Terimleri; tanımın geçtiği düzenleme, madde ve resmî kaynakla
                birlikte inceleyin. Aynı terimin farklı düzenlemelerdeki
                tanımları ayrı gösterilir.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
                <span>
                  <strong className="font-semibold text-foreground">
                    {distinctTerms.size}
                  </strong>{' '}
                  terim
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="font-semibold text-foreground">
                    {glossary.length}
                  </strong>{' '}
                  kaynaklı tanım
                </span>
                <span aria-hidden="true">·</span>
                <span>Madde atıflarıyla</span>
              </div>
            </div>
          </div>
        </section>
        <section className="site-frame py-6 lg:py-8">
          <GlossaryBrowser
            key={`${q ?? ''}-${konu ?? ''}`}
            initialQuery={q}
            initialTag={konu}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
