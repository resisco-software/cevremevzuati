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
      <main id="icerik">
        <section>
          <div className="site-frame py-10 lg:py-14">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Kapsam haritası' },
              ]}
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="label">Çevre mevzuatı</p>
                <h1 className="display-xl measure mt-4">
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
                    className="inline-flex h-12 items-center gap-2 bg-seal px-5 text-base font-medium text-primary-foreground hover:bg-ink"
                  >
                    <ScanSearch className="size-4" aria-hidden="true" />
                    Tesisimin kapsamını tara
                  </Button>
                  <Button
                    nativeButton={false}
                    render={<Link href="/mevzuat" />}
                    variant="outline"
                    className="inline-flex h-12 items-center gap-2 border border-rule-strong px-5 text-base hover:border-ink"
                  >
                    Tüm mevzuatı aç
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <dl className="kunye lg:w-[20rem]">
                <div>
                  <dd className="display-md">
                    {categories.length}
                  </dd>
                  <dt className="mt-1 text-sm text-muted-foreground">
                    ana çevre alanı
                  </dt>
                </div>
                <div>
                  <dd className="display-md">
                    {subtopicCount()}
                  </dd>
                  <dt className="mt-1 text-sm text-muted-foreground">
                    alt konu başlığı
                  </dt>
                </div>
                <div>
                  <dd className="display-md">
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
          <p className="label">{categories.length} ana alan</p>
          <h2 className="display-lg mt-4">
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
                  className="hanging py-6"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="record text-sm text-muted-foreground">
                      {String(index + 1).padStart(2, '0')} /{' '}
                      {categories.length}
                    </span>
                    <span className="record text-sm font-semibold text-seal">
                      {count} kayıt
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-md font-semibold leading-snug">
                      {category.label}
                    </h3>
                    <div className="measure-bar mt-3 max-w-sm" aria-hidden="true">
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
                        className="border border-rule px-2.5 py-1 text-sm text-muted-foreground"
                      >
                        {subtopic}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/mevzuat?alan=${category.id}`}
                    className="mt-auto inline-flex items-center gap-2 rounded text-sm font-semibold text-seal underline decoration-rule underline-offset-4 hover:decoration-seal"
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
