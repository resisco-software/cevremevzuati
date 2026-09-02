import type { Metadata } from 'next';
import { BookOpenCheck, ShieldCheck } from 'lucide-react';

import { LegislationBrowser } from '@/components/site/legislation-browser';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export const metadata: Metadata = {
  title: 'Çevre Mevzuatı Dizini',
  description: 'Çevre mevzuatını konu, başlık ve Resmî Gazete bilgileriyle tarayın.',
};

export default async function LegislationPage({
  searchParams,
}: {
  searchParams: Promise<{ alan?: string }>;
}) {
  const { alan } = await searchParams;
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:py-18">
          <div>
            <p className="section-kicker">Mevzuat dizini</p>
            <h1 className="mt-3 max-w-3xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">Çevre mevzuatını doğru yerden açın.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Konu başlığı, düzenleme adı veya Resmî Gazete sayısıyla arayın. Her kayıtta ilk yayım, değişiklik izi ve resmî kaynak birlikte gösterilir.</p>
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" aria-hidden="true" /> Resmî kaynak bağlantılı</span>
            <span className="flex items-center gap-2"><BookOpenCheck className="size-4 text-primary" aria-hidden="true" /> Yorum içermeyen kayıt yapısı</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <LegislationBrowser initialCategory={alan} />
      </section>
      <SiteFooter />
    </main>
  );
}
