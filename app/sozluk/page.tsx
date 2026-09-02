import type { Metadata } from 'next';
import { BookMarked, Quote } from 'lucide-react';

import { GlossaryBrowser } from '@/components/site/glossary-browser';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export const metadata: Metadata = {
  title: 'Mevzuat Sözlüğü | Çevre Mevzuatı',
  description: 'Çevre mevzuatındaki terimleri, kaynak düzenleme ve madde atıflarıyla bulun.',
};

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_360px] lg:items-end lg:px-12 lg:py-18">
          <div>
            <p className="section-kicker">Mevzuat sözlüğü</p>
            <h1 className="mt-3 max-w-3xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">Tanımı, geçtiği maddeden ayırmayın.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Terimler yalnızca mevzuattaki tanım kaynaklarıyla gösterilir. Aynı terim farklı düzenlemelerde farklı tanımlanıyorsa kayıtlar ayrılır.</p>
          </div>
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
            <Quote className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold">Tanım + düzenleme + madde</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Her sözlük kaydının değişmez üç bileşeni.</p>
            <BookMarked className="mt-5 size-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <GlossaryBrowser initialQuery={q} />
      </section>
      <SiteFooter />
    </main>
  );
}
