import type { Metadata } from 'next';
import {
  Archive,
  ArrowDown,
  ArrowRight,
  BookOpenText,
  FileClock,
  Files,
} from 'lucide-react';
import Link from 'next/link';

import { LegislationBrowser } from '@/components/site/legislation-browser';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { Button } from '@/components/ui/button';
import { categories, legislation } from '@/lib/legislation-data';

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
      <section className="inverse-panel relative isolate overflow-hidden border-b border-border">
        <div
          className="version-lines absolute inset-0 -z-10 opacity-25"
          aria-hidden="true"
        />
        <div className="site-frame grid gap-10 py-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:py-20">
          <div>
            <p className="meta-type text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
              Mevzuat kütüphanesi
            </p>
            <h1 className="mt-4 max-w-4xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">
              Aradığınız mevzuatı bulun; resmî metnine ve kayıt zincirine geçin.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-background/72">
              Düzenleme adıyla arayın veya çevre alanını seçin. Her kayıtta
              resmî kaynak bağlantısı; varsa değişiklikler ve bağlı belgeler
              birlikte gösterilir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                nativeButton={false}
                render={
                  <a href="#kaynaklar" aria-label="Kütüphanede aramaya geç" />
                }
                className="h-11 justify-between rounded-[10px] bg-accent px-4 text-accent-foreground hover:bg-accent/85 sm:min-w-48"
              >
                Kütüphanede ara
                <ArrowDown className="size-4" aria-hidden="true" />
              </Button>
              <Button
                nativeButton={false}
                render={
                  <Link
                    href="/#alanlar"
                    aria-label="Tesisime göre mevzuat rotasını başlat"
                  />
                }
                variant="outline"
                className="h-11 justify-between rounded-[10px] border-background/20 bg-transparent px-4 text-background hover:bg-background/10 hover:text-background sm:min-w-48"
              >
                Tesisime göre başla
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-background/15 bg-background/6 p-5 backdrop-blur-sm sm:p-6">
            <p className="meta-type text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
              30 saniyelik yol
            </p>
            <ol className="mt-5 grid gap-4">
              {[
                ['01', 'Başlığı yazın veya konu seçin'],
                ['02', 'Güncel kayıt sayfasını açın'],
                ['03', 'Resmî metin ve eklerine geçin'],
              ].map(([number, label]) => (
                <li
                  key={number}
                  className="flex items-center gap-4 border-t border-background/12 pt-4 first:border-t-0 first:pt-0"
                >
                  <span className="meta-type text-xs font-semibold text-accent">
                    {number}
                  </span>
                  <span className="text-sm font-medium text-background/85">
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="site-frame py-10 lg:py-14">
        <div className="mb-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {shelves.map(({ icon: Icon, title, detail }, index) => (
            <article
              key={title}
              className="group bg-card p-5 transition-colors hover:bg-primary/4 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-9 place-items-center rounded-[10px] bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="meta-type text-[10px] text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <h2 className="mt-5 font-heading text-lg font-semibold tracking-[-0.025em]">
                {title}
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {detail}
              </p>
            </article>
          ))}
        </div>

        <div id="kaynaklar" className="mb-6 scroll-mt-24">
          <p className="section-kicker">Kütüphanede arayın</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
            Başlığı yazın veya bir çevre alanı seçin
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Kaynağın niteliği her belgede ayrıca gösterilir. Kurum içi çalışma
            notları resmî mevzuat gibi yayımlanmaz.
          </p>
          <p className="meta-type mt-3 text-[11px] text-primary">
            {categories.length} ana alan · {legislation.length} kaynak kaydı ·
            kanun, yönetmelik ve tebliğ
          </p>
        </div>
        <LegislationBrowser />
      </section>
      <SiteFooter />
    </main>
  );
}
