import type { Metadata } from 'next';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cloud,
  Droplets,
  FileText,
  FlaskConical,
  Gauge,
  Layers3,
  Map,
  MapPinned,
  Package,
  Pickaxe,
  Recycle,
  ScanSearch,
  Volume2,
  Waves,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { categories, legislation } from '@/lib/legislation-data';

export const metadata: Metadata = {
  title: 'Çevre Mevzuatı Kapsam Haritası',
  description:
    'Çevre mevzuatını 15 ana alan ve alt konu başlıkları üzerinden tarayın.',
};

const categoryIcons = {
  kurulus: Building2,
  izin: CheckCircle2,
  hava: Cloud,
  su: Droplets,
  atiksu: Waves,
  atik: Recycle,
  urun: Package,
  toprak: MapPinned,
  gurultu: Volume2,
  kimyasal: FlaskConical,
  deniz: Waves,
  doga: Map,
  maden: Pickaxe,
  entegre: Layers3,
  olcum: Gauge,
} as const;

export default function ScopePage() {
  const subtopicCount = categories.reduce(
    (total, category) => total + category.subtopics.length,
    0,
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="hero-surface relative isolate overflow-hidden border-b border-border/70">
        <div
          className="document-grid absolute inset-0 -z-10 opacity-50"
          aria-hidden="true"
        />
        <div className="site-frame grid gap-10 py-14 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:py-20">
          <div>
            <p className="section-kicker">Çevre mevzuatı kapsam haritası</p>
            <h1 className="mt-4 max-w-4xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">
              Konuyu bilin ya da bilmeyin, doğru giriş noktasını görün.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
              Ana çevre alanından alt başlıklara, oradan ilgili düzenleme
              kayıtlarına ilerleyin. Tesisinize özel ön okuma rotası için kapsam
              taramasını kullanın.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                nativeButton={false}
                render={
                  <Link
                    href="/#alanlar"
                    aria-label="Tesisimin çevre kapsamını taramaya başla"
                  />
                }
                className="h-12 justify-between rounded-xl px-5 sm:min-w-60"
              >
                Tesisimin kapsamını tara
                <ScanSearch className="size-4" aria-hidden="true" />
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/mevzuat" aria-label="Tüm mevzuatı aç" />}
                variant="outline"
                className="h-12 justify-between rounded-xl bg-card/70 px-5 sm:min-w-44"
              >
                Tüm mevzuatı aç
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-border border-y border-border bg-card/45 py-5">
            <div className="px-4">
              <strong className="font-heading text-3xl font-semibold tracking-[-0.04em] text-primary">
                {categories.length}
              </strong>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                ana çevre alanı
              </span>
            </div>
            <div className="px-4">
              <strong className="font-heading text-3xl font-semibold tracking-[-0.04em] text-primary">
                {subtopicCount}
              </strong>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                alt konu başlığı
              </span>
            </div>
            <div className="px-4">
              <strong className="font-heading text-3xl font-semibold tracking-[-0.04em] text-primary">
                {legislation.length}
              </strong>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                kaynak kaydı
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="site-frame py-16 lg:py-20">
        <div className="mb-10 grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="section-kicker">15 ana alan</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-[-0.045em]">
              Önce alanı seçin.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Bu harita bir konu dizinidir; hukuki kapsam sonucu üretmez. Her
            başlık sizi ilgili kayıt kümesine götürür, resmî kaynak her kayıt
            üzerinde ayrıca açılır.
          </p>
        </div>

        <div className="grid border-l border-t border-border md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => {
            const Icon =
              categoryIcons[category.id as keyof typeof categoryIcons] ??
              FileText;
            const recordCount = legislation.filter(
              (item) =>
                item.foundation || item.categories.includes(category.id),
            ).length;

            return (
              <Link
                key={category.id}
                href={`/mevzuat?alan=${category.id}`}
                className="group flex min-h-[340px] flex-col border-r border-b border-border p-6 transition-colors hover:bg-card lg:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 place-items-center rounded-[11px] border border-border bg-card text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="text-right">
                    <span className="meta-type block text-[10px] text-muted-foreground">
                      {String(index + 1).padStart(2, '0')} /{' '}
                      {String(categories.length).padStart(2, '0')}
                    </span>
                    <span className="mt-1.5 block text-xs font-semibold text-primary">
                      {recordCount} ilgili kayıt
                    </span>
                  </div>
                </div>

                <h3 className="mt-7 max-w-sm font-heading text-[22px] font-semibold leading-7 tracking-[-0.035em]">
                  {category.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>

                <ul className="mt-5 grid gap-2 text-xs text-muted-foreground">
                  {category.subtopics.map((subtopic) => (
                    <li key={subtopic} className="flex items-start gap-2">
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-primary/55" />
                      <span className="leading-5">{subtopic}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-auto flex items-center justify-between border-t border-border pt-5 text-sm font-semibold text-primary">
                  Bu alandaki kayıtları aç
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
