import type { Metadata } from 'next';
import { ArrowRight, ScanSearch } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { openGraphFor } from '@/lib/site';
import {
  categories,
  categoryRecordCount,
  legislation,
  maxCategoryRecordCount,
  subtopicCount,
} from '@/lib/legislation-data';

export const metadata: Metadata = {
  title: 'Kapsam haritası',
  description:
    'Çevre mevzuatını 15 ana alan ve alt konu başlıkları üzerinden tarayın.',
  alternates: { canonical: '/kapsam' },
  openGraph: openGraphFor({
    title: 'Çevre Mevzuatı kapsam haritası',
    description:
      'Çevre mevzuatını ana alanlar ve alt konu başlıkları üzerinden tarayın.',
    path: '/kapsam',
  }),
};

export default function ScopePage() {
  const maxCount = maxCategoryRecordCount();

  return (
    <>
      <SiteHeader />
      <main id="icerik" className="min-h-screen bg-background">
        <section className="hero-surface relative overflow-hidden border-b border-border">
          <div
            className="document-grid pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <div className="site-frame relative py-12 lg:py-16">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Kapsam haritası' },
              ]}
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="section-kicker">Çevre mevzuatı</p>
                <h1 className="mt-3 max-w-3xl font-heading text-[clamp(2.5rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                  Kapsam haritası
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                  Konuyu bilin ya da bilmeyin, doğru giriş noktasını görün. Ana
                  çevre alanından alt başlıklara, oradan ilgili düzenleme
                  kayıtlarına ilerleyin.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    nativeButton={false}
                    render={<Link href="/#alanlar" />}
                    className="h-12 gap-2 rounded-md px-5 text-base"
                  >
                    <ScanSearch className="size-4" aria-hidden="true" />
                    Tesisimin kapsamını tara
                  </Button>
                  <Button
                    nativeButton={false}
                    render={<Link href="/mevzuat" />}
                    variant="outline"
                    className="h-12 gap-2 rounded-md bg-card px-5 text-base"
                  >
                    Tüm mevzuatı aç
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <dl className="precision-card grid gap-px overflow-hidden bg-border p-0 sm:grid-cols-3 lg:w-[380px]">
                <div className="bg-card px-5 py-4">
                  <dd className="font-heading text-[1.75rem] font-semibold">
                    {categories.length}
                  </dd>
                  <dt className="mt-1 text-sm text-muted-foreground">
                    ana çevre alanı
                  </dt>
                </div>
                <div className="bg-card px-5 py-4">
                  <dd className="font-heading text-[1.75rem] font-semibold">
                    {subtopicCount()}
                  </dd>
                  <dt className="mt-1 text-sm text-muted-foreground">
                    alt konu başlığı
                  </dt>
                </div>
                <div className="bg-card px-5 py-4">
                  <dd className="font-heading text-[1.75rem] font-semibold">
                    {legislation.length}
                  </dd>
                  <dt className="mt-1 text-sm text-muted-foreground">
                    mevzuat kaydı
                  </dt>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="site-frame py-12 lg:py-16">
          <p className="section-kicker">{categories.length} ana alan</p>
          <h2 className="mt-3 font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em]">
            Önce alanı seçin.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Bu harita bir konu dizinidir; hukuki kapsam sonucu üretmez. Her
            başlık sizi ilgili kayıt kümesine götürür, resmî kaynak her kayıt
            üzerinde ayrıca açılır.
          </p>

          <ul className="mt-10 grid gap-4 lg:grid-cols-2">
            {categories.map((category, index) => {
              const count = categoryRecordCount(category.id);
              return (
                <li
                  key={category.id}
                  className="area-tile precision-card flex flex-col gap-4 p-6"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="meta-type text-sm text-muted-foreground">
                      {String(index + 1).padStart(2, '0')} /{' '}
                      {categories.length}
                    </span>
                    <span className="meta-type text-sm font-semibold text-primary">
                      {count} kayıt
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold leading-7 tracking-[-0.02em]">
                      {category.label}
                    </h3>
                    <div className="weight-bar mt-3" aria-hidden="true">
                      <span
                        style={{
                          width: `${Math.max(6, (count / maxCount) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {category.subtopics.map((subtopic) => (
                      <li
                        key={subtopic}
                        className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
                      >
                        {subtopic}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/mevzuat?alan=${category.id}`}
                    className="mt-auto inline-flex items-center gap-2 rounded text-sm font-semibold text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                  >
                    Bu alandaki {count} kaydı aç
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
