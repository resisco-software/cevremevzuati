import type { Metadata } from 'next';
import { ArrowRight, Compass, Search } from 'lucide-react';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import Link from '@/components/site/safe-link';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { areaStyle } from '@/lib/area-theme';
import { categoryIcons } from '@/lib/category-icons';
import {
  categories,
  categoryRecordCount,
  legislation,
  maxCategoryRecordCount,
  subtopicCount,
} from '@/lib/legislation-data';
import { openGraphFor } from '@/lib/site';

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
        <section className="site-frame py-10 lg:py-14">
          <Breadcrumbs
            items={[
              { label: 'Ana sayfa', href: '/' },
              { label: 'Kapsam haritası' },
            ]}
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="eyebrow">Çevre alanları</p>
              <h1 className="mt-2.5 text-3xl">Kapsam haritası</h1>
              <p className="measure mt-4 text-md leading-8 text-muted-foreground">
                Konuyu bilin ya da bilmeyin, doğru giriş noktasını görün. Her
                alanın sabit bir rengi ve ikonu var; alt başlıklara tıklayarak
                o alandaki kayıtlara inersiniz.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/#alanlar" className="btn inline-flex items-center justify-center btn-primary h-12 px-5">
                  <Compass className="size-4" aria-hidden="true" />
                  Tesisime göre rota
                </Link>
                <Link href="/mevzuat" className="btn inline-flex items-center justify-center btn-quiet h-12 px-5">
                  <Search className="size-4" aria-hidden="true" />
                  Dizinde ara
                </Link>
              </div>
            </div>
            <dl className="card grid grid-cols-3 divide-x divide-border">
              <div className="px-5 py-4">
                <dd className="text-lg font-semibold">{categories.length}</dd>
                <dt className="mt-0.5 text-sm text-muted-foreground">alan</dt>
              </div>
              <div className="px-5 py-4">
                <dd className="text-lg font-semibold">{subtopicCount()}</dd>
                <dt className="mt-0.5 text-sm text-muted-foreground">
                  alt başlık
                </dt>
              </div>
              <div className="px-5 py-4">
                <dd className="text-lg font-semibold">{legislation.length}</dd>
                <dt className="mt-0.5 text-sm text-muted-foreground">kayıt</dt>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-t border-border bg-card">
          <div className="site-frame py-12 lg:py-16">
            <p className="text-sm leading-7 text-muted-foreground">
              Bu harita bir konu dizinidir; hukuki kapsam sonucu üretmez. Her
              başlık sizi ilgili kayıt kümesine götürür.
            </p>
            <ul className="mt-8 grid gap-4 lg:grid-cols-2">
              {categories.map((category, index) => {
                const count = categoryRecordCount(category.id);
                const Icon = categoryIcons[category.id];
                return (
                  <li
                    key={category.id}
                    style={areaStyle(category.id)}
                    className="card area-edge flex flex-col p-6"
                  >
                    <div className="flex items-start gap-3.5">
                      {Icon && (
                        <span className="area-tint grid size-11 shrink-0 place-items-center rounded-lg">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <h2 className="text-md font-semibold leading-snug">
                          {category.label}
                        </h2>
                        <p className="gazette mt-1 text-muted-foreground">
                          {String(index + 1).padStart(2, '0')} / {categories.length} · {count} kayıt
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {category.description}
                    </p>

                    <div className="meter mt-4" aria-hidden="true">
                      <span
                        style={{
                          width: `${Math.max(6, (count / maxCount) * 100)}%`,
                        }}
                      />
                    </div>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {category.subtopics.map((subtopic) => (
                        <li
                          key={subtopic}
                          className="rounded-full bg-secondary px-2.5 py-1 text-sm text-muted-foreground"
                        >
                          {subtopic}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/mevzuat?alan=${category.id}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Bu alandaki {count} kaydı aç
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
