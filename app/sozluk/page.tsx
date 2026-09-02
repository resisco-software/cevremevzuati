import type { Metadata } from 'next';
import { Quote } from 'lucide-react';

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
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
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
        <section>
          <div className="site-frame py-10 lg:py-14">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Mevzuat sözlüğü' },
              ]}
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <p className="label">Çevre mevzuatı</p>
                <h1 className="display-xl measure mt-4">
                  Mevzuat sözlüğü
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                  Tanımı, geçtiği maddeden ayırmayın. Terimler yalnızca
                  mevzuattaki tanım kaynaklarıyla gösterilir; aynı terim farklı
                  düzenlemelerde farklı tanımlanıyorsa kayıtlar ayrılır.
                </p>
              </div>
              <div className="border-l-2 border-seal pl-5">
                <Quote className="size-5 text-seal" aria-hidden="true" />
                <p className="mt-4 text-base font-semibold">
                  Tanım + düzenleme + madde
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Her sözlük kaydının değişmez üç bileşeni.
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {glossary.length} tanım · {distinctTerms.size} terim
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="site-frame py-10 lg:py-14">
          <GlossaryBrowser key={q ?? ''} initialQuery={q} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
