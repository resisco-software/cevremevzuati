import type { Metadata } from 'next';
import {
  ArrowRight,
  BookMarked,
  CheckCircle2,
  FileSearch,
  Layers,
  ListChecks,
  Compass,
} from 'lucide-react';
import Link from 'next/link';

import { JsonLd } from '@/components/site/json-ld';
import { LegislationWizard } from '@/components/site/legislation-wizard';
import { QuickSearch } from '@/components/site/quick-search';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { areaStyle } from '@/lib/area-theme';
import { categoryIcons } from '@/lib/category-icons';
import {
  categories,
  categoryRecordCount,
  glossary,
  lastSourceCheck,
  legislation,
  maxCategoryRecordCount,
} from '@/lib/legislation-data';
import {
  absoluteUrl,
  openGraphFor,
  siteDescription,
  siteName,
} from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: 'Çevre Mevzuatı | Tesisiniz için mevzuat navigasyonu',
  },
  description: siteDescription,
  alternates: { canonical: '/' },
  openGraph: openGraphFor({
    title: 'Çevre Mevzuatı',
    description: 'Tesisiniz için doğrulanabilir mevzuat navigasyonu',
    path: '/',
  }),
};

/** Sitenin resmî mevzuat portallarından ayrıştığı somut noktalar. */
const differences = [
  {
    icon: FileSearch,
    title: 'Tam adı bilmeden bulun',
    body: 'SKHKKY, ÇİLY, GEKAP, SEÖS gibi kısaltmalar; Türkçe karakter kullanmadan yazım; Resmî Gazete sayısı. Üçü de çalışır.',
  },
  {
    icon: ListChecks,
    title: 'Hangi eke bakacağınız yazılı',
    body: 'Her kayıtta kimi kapsadığı, önce bakılacak ek veya madde ve tipik yükümlülükler listelenir. PDF açmadan görürsünüz.',
  },
  {
    icon: Compass,
    title: 'Tesisinizi tanımlayın, liste çıksın',
    body: 'Konuyu bilmiyorsanız dört soruya cevap verin. Her sonucun altında onu listeye getiren cevabınız yazar.',
  },
  {
    icon: CheckCircle2,
    title: 'Bağlantı doğrudan düzenlemeye gider',
    body: `${legislation.length} kaydın tamamı madde düzeyinde Resmî Gazete bağlantısı taşır. Günün tam sayısına atan bağlantı yok.`,
  },
];

const featuredSlugs = [
  'cevre-izin-ve-lisans-yonetmeligi',
  'skhkky',
  'atik-yonetimi',
  'endustriyel-emisyonlarin-yonetimi',
  'sifir-atik',
  'su-kirliligi-kontrolu',
];

const featured = featuredSlugs
  .map((slug) => legislation.find((item) => item.slug === slug))
  .filter((item): item is (typeof legislation)[number] => Boolean(item));

export default function HomePage() {
  const maxCount = maxCategoryRecordCount();

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: absoluteUrl('/'),
          inLanguage: 'tr-TR',
          description: siteDescription,
          publisher: { '@type': 'Organization', name: siteName },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${absoluteUrl('/mevzuat')}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <main id="icerik">
        {/* ---- arama önce ---- */}
        <section className="site-frame pt-12 pb-14 lg:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl">
              Çevre mevzuatında aradığınızı bulun.
            </h1>
            <p className="mt-5 text-md leading-8 text-muted-foreground">
              {categories.length} çevre alanı, {legislation.length} düzenleme,{' '}
              {glossary.length} tanım. Hepsi resmî kaynağına bağlı, hepsi
              aranabilir.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-3xl">
            <QuickSearch />
          </div>

          {/* iki kapı: adını biliyorum / bilmiyorum */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            <Link
              href="#alanlar"
              className="card card-link flex items-start gap-4 p-5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Compass className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold">
                  Konuyu bilmiyorum
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  Tesisinizi tanımlayın, okuma listesi çıkarayım
                </span>
              </span>
            </Link>
            <Link
              href="/kapsam"
              className="card card-link flex items-start gap-4 p-5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Layers className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold">Konudan gözat</span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {categories.length} çevre alanı, alt başlıklarıyla
                </span>
              </span>
            </Link>
          </div>
        </section>

        {/* ---- alan haritası ---- */}
        <section id="konu-dizini" className="border-t border-border bg-card">
          <div className="site-frame py-14 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Çevre alanları</p>
                <h2 className="mt-2.5 text-xl">
                  Hangi alandan girmek istersiniz?
                </h2>
                <p className="measure mt-3 leading-8 text-muted-foreground">
                  Her alanın sabit bir rengi var; çubuk o alandaki kayıt
                  sayısını gösterir.
                </p>
              </div>
              <Link
                href="/mevzuat"
                className="btn inline-flex items-center justify-center btn-quiet h-11 px-4 text-sm"
              >
                Tüm dizin
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const count = categoryRecordCount(category.id);
                const Icon = categoryIcons[category.id] ?? Layers;
                return (
                  <li key={category.id} style={areaStyle(category.id)}>
                    <Link
                      href={`/mevzuat?alan=${category.id}`}
                      className="card card-link area-edge flex h-full flex-col p-5"
                    >
                      <span className="flex items-start gap-3">
                        <Icon
                          className="mt-0.5 size-5 shrink-0 text-area"
                          aria-hidden="true"
                        />
                        <span className="font-semibold leading-snug">
                          {category.label}
                        </span>
                      </span>
                      <span className="mt-2.5 block text-sm leading-6 text-muted-foreground">
                        {category.subtopics.slice(0, 3).join(' · ')}
                      </span>
                      <span className="mt-4 flex items-center gap-3">
                        <span className="meter flex-1" aria-hidden="true">
                          <span
                            style={{
                              width: `${Math.max(6, (count / maxCount) * 100)}%`,
                            }}
                          />
                        </span>
                        <span className="gazette shrink-0 text-muted-foreground">
                          {count} kayıt
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---- neden burası ---- */}
        <section className="border-t border-border">
          <div className="site-frame py-14 lg:py-16">
            <p className="eyebrow">Neden burası</p>
            <h2 className="measure mt-2.5 text-xl">
              Resmî portalda arama, doğru adı bilmenizi ister. Burada
              bilmeniz gerekmiyor.
            </h2>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {differences.map((entry) => (
                <li key={entry.title} className="card flex items-start gap-4 p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <entry.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold">{entry.title}</span>
                    <span className="mt-1.5 block text-sm leading-7 text-muted-foreground">
                      {entry.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              Bu site hukuki görüş üretmez ve resmî portalın yerine geçmez.
              Bağlayıcı metin Resmî Gazete&apos;dedir; her kayıt oraya
              bağlanır.{' '}
              <Link
                href="/metodoloji"
                className="font-medium text-primary hover:underline"
              >
                Kaynak ve yöntem
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ---- sihirbaz ---- */}
        <section id="alanlar" className="border-t border-border bg-card">
          <div className="site-frame py-14 lg:py-16">
            <LegislationWizard />
          </div>
        </section>

        {/* ---- sık açılan kayıtlar ---- */}
        <section className="border-t border-border">
          <div className="site-frame py-14 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Sık açılan kayıtlar</p>
                <h2 className="mt-2.5 text-xl">
                  Çoğu sanayi tesisinin başladığı yer
                </h2>
              </div>
              <Link href="/mevzuat" className="btn inline-flex items-center justify-center btn-quiet h-11 px-4 text-sm">
                {legislation.length} kaydın tamamı
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-9 grid gap-3 lg:grid-cols-2">
              {featured.map((item) => {
                const areaId = item.categories[0] ?? 'izin';
                return (
                  <li key={item.slug} style={areaStyle(areaId)}>
                    <Link
                      href={`/mevzuat/${item.slug}`}
                      className="card card-link area-edge flex h-full flex-col p-5"
                    >
                      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="area-dot" aria-hidden="true" />
                        <span className="text-sm text-muted-foreground">
                          {item.type}
                        </span>
                        <span className="gazette ml-auto text-muted-foreground">
                          RG {item.gazetteNumber} · {item.publicationLabel}
                        </span>
                      </span>
                      <span className="mt-2 block font-semibold leading-snug">
                        {item.title}
                      </span>
                      <span className="mt-2 block text-sm leading-7 text-muted-foreground">
                        {item.appliesTo}
                      </span>
                      {item.primaryAnnex && (
                        <span className="mt-3 block text-sm leading-6">
                          <span className="eyebrow">Önce</span>{' '}
                          <span className="text-muted-foreground">
                            {item.primaryAnnex}
                          </span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---- sözlük ---- */}
        <section className="border-t border-border bg-card">
          <div className="site-frame flex flex-wrap items-center justify-between gap-8 py-14 lg:py-16">
            <div className="measure">
              <p className="eyebrow">Sözlük</p>
              <h2 className="mt-2.5 text-xl">
                Tanım nereden geliyorsa, cevabı orada.
              </h2>
              <p className="mt-3 leading-8 text-muted-foreground">
                {glossary.length} terim, kullanıldığı düzenleme ve maddeyle
                birlikte. Aynı terim farklı düzenlemelerde farklı
                tanımlanıyorsa kayıtlar ayrılır. En son kaynak kontrolü{' '}
                {lastSourceCheck()}.
              </p>
            </div>
            <Link href="/sozluk" className="btn inline-flex items-center justify-center btn-primary h-12 px-5">
              <BookMarked className="size-4" aria-hidden="true" />
              Sözlüğü aç
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
