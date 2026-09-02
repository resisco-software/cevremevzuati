import type { Metadata } from 'next';
import { Archive, BookOpenText, FileClock, Files } from 'lucide-react';

import { LegislationBrowser } from '@/components/site/legislation-browser';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export const metadata: Metadata = {
  title: 'Mevzuat Kütüphanesi | Çevre Mevzuatı',
  description:
    'Çevre mevzuatının resmî metinleri, sürümleri, ekleri ve kaynak kayıtları.',
};

const shelves = [
  {
    icon: BookOpenText,
    title: 'Güncel resmî metinler',
    detail: 'Konsolide metin veya son resmî kaynak bağlantısı',
  },
  {
    icon: FileClock,
    title: 'Sürüm ve değişiklikler',
    detail: 'İlk yayım, değişiklik metinleri ve yürürlük tarihleri',
  },
  {
    icon: Files,
    title: 'Ekler, tablolar ve formlar',
    detail: 'Ana düzenleme kaydına bağlı yardımcı belgeler',
  },
  {
    icon: Archive,
    title: 'Yürürlükten kaldırılanlar',
    detail: 'Güncel kayıttan ayrılmış tarihsel metinler',
  },
];

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative isolate overflow-hidden border-b border-border bg-foreground text-background">
        <div
          className="version-lines absolute inset-0 -z-10 opacity-25"
          aria-hidden="true"
        />
        <div className="site-frame py-16 lg:py-22">
          <p className="meta-type text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
            Kütüphane
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">
            Bir düzenlemenin yalnızca kendisi değil, bütün kayıt zinciri.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-background/60">
            Mevzuat metinleri; değişiklikler, ekler, tablolar ve resmî kaynak
            niteliği korunarak tek kayıt altında toplanır.
          </p>
        </div>
      </section>

      <section className="site-frame py-10 lg:py-14">
        <div className="mb-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {shelves.map(({ icon: Icon, title, detail }) => (
            <article key={title} className="bg-card p-5 sm:p-6">
              <Icon className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-heading text-lg font-semibold tracking-[-0.025em]">
                {title}
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mb-6">
          <p className="section-kicker">İndirilebilir kaynaklar</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
            Resmî metinlere tek kayıttan ulaşın
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Kaynağın niteliği her belgede ayrıca gösterilir. Kurum içi çalışma
            notları resmî mevzuat gibi yayımlanmaz.
          </p>
        </div>
        <LegislationBrowser />
      </section>
      <SiteFooter />
    </main>
  );
}
