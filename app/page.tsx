import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cloud,
  Download,
  Droplets,
  ExternalLink,
  FileClock,
  FileText,
  FlaskConical,
  Gauge,
  Layers3,
  Map,
  MapPinned,
  Package,
  Pickaxe,
  Recycle,
  Search,
  ShieldCheck,
  Volume2,
  Waves,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LegislationWizard } from '@/components/site/legislation-wizard';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { categories, glossary, legislation } from '@/lib/legislation-data';

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
  deniz: Droplets,
  doga: Map,
  maden: Pickaxe,
  entegre: Layers3,
  olcum: Gauge,
} as const;

export default function Home() {
  const localCategories = categories.filter((category) => !category.external);
  const featuredLegislation = legislation.filter((item) =>
    [
      'cevre-kanunu-2872',
      'ced-yonetmeligi',
      'cevre-izin-ve-lisans-yonetmeligi',
    ].includes(item.slug),
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section
        id="baslangic"
        className="hero-surface relative isolate overflow-hidden border-b border-border/70"
      >
        <div
          className="document-grid absolute inset-0 -z-10 opacity-55"
          aria-hidden="true"
        />
        <div className="site-frame grid gap-9 py-9 lg:grid-cols-[minmax(0,0.8fr)_minmax(560px,1.2fr)] lg:gap-10 lg:py-12">
          <div className="flex flex-col justify-between gap-9 py-2 lg:min-h-[630px] lg:py-4">
            <div>
              <Badge
                variant="outline"
                className="meta-type mb-8 h-7 gap-2 rounded-full border-primary/20 bg-card/75 px-3 text-[10px] uppercase tracking-[0.06em] text-primary shadow-none"
              >
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Resmî kaynağa dayalı
              </Badge>
              <p className="section-kicker mb-4">
                Tesisiniz için hızlı başlangıç
              </p>
              <h1 className="max-w-xl font-heading text-[clamp(2.65rem,4.8vw,4.75rem)] leading-[0.96] font-semibold tracking-[-0.06em] text-balance">
                Hangi çevre mevzuatını{' '}
                <span className="text-primary">okumanız gerektiğini</span>{' '}
                bulun.
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 tracking-[-0.012em] text-muted-foreground sm:text-[17px] sm:leading-7">
                Alanı seçin, tesisinizi kısaca tanımlayın ve önce okunması
                gereken düzenlemeleri resmî kaynaklarıyla birlikte görün.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  nativeButton={false}
                  render={
                    <a
                      href="#alanlar"
                      aria-label="Tesisime göre mevzuat rotasını başlat"
                    />
                  }
                  className="h-12 justify-between rounded-xl px-5 text-sm sm:min-w-56"
                >
                  Tesisim için başla
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/mevzuat" aria-label="Mevzuat dizininde ara" />
                  }
                  variant="outline"
                  className="h-12 justify-between rounded-xl bg-card/70 px-5 text-sm sm:min-w-44"
                >
                  Mevzuat ara
                  <Search className="size-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="meta-type mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.07em] text-muted-foreground">
                <span>{localCategories.length} ana çevre alanı</span>
                <span className="size-1 rounded-full bg-primary/45" />
                <span>{legislation.length} kaynak kaydı</span>
                <span className="size-1 rounded-full bg-primary/45" />
                <span>Kanun · Yönetmelik · Tebliğ</span>
              </div>
            </div>

            <div
              className="grid max-w-lg grid-cols-3 border-y border-border/90 py-5"
              aria-label="Üç adımlı kullanım akışı"
            >
              <div className="pr-4">
                <span className="meta-type block text-[10px] font-semibold text-primary">
                  01
                </span>
                <strong className="mt-1 block text-sm font-semibold tracking-[-0.02em]">
                  Alanı seçin
                </strong>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Hava, su, atık veya diğer konu
                </span>
              </div>
              <div className="border-x border-border/80 px-4">
                <span className="meta-type block text-[10px] font-semibold text-primary">
                  02
                </span>
                <strong className="mt-1 block text-sm font-semibold tracking-[-0.02em]">
                  Tesisi tanımlayın
                </strong>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Faaliyet, proses ve konum
                </span>
              </div>
              <div className="pl-4">
                <span className="meta-type block text-[10px] font-semibold text-primary">
                  03
                </span>
                <strong className="mt-1 block text-sm font-semibold tracking-[-0.02em]">
                  Rotayı alın
                </strong>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Madde, ek ve resmî kaynak
                </span>
              </div>
            </div>
          </div>

          <div id="alanlar">
            <LegislationWizard />
          </div>
        </div>
      </section>

      <section
        id="konu-dizini"
        className="site-frame scroll-mt-20 py-20 lg:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-12">
          <div>
            <p className="section-kicker">Kapsam haritası</p>
            <h2 className="mt-3 max-w-sm font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[46px]">
              Çevre mevzuatının kapsamı, 15 doğru giriş noktasıyla.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              Kuruluştan kapanışa; hava, su, atık, ürün, kimyasal, deniz, doğa
              ve ölçüm dahil bütün çevre alanlarını tek yapıda tarayın.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-card px-3 py-1.5">
                {localCategories.length} ana alan
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1.5">
                {localCategories.reduce(
                  (total, category) => total + category.subtopics.length,
                  0,
                )}{' '}
                alt başlık
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1.5">
                {legislation.length} kayıt
              </span>
            </div>
            <Button
              nativeButton={false}
              render={
                <Link href="/kapsam" aria-label="Tam kapsam haritasını aç" />
              }
              variant="outline"
              className="mt-7 h-10 rounded-[10px] px-4"
            >
              Tam kapsam haritasını aç
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="category-index grid border-l border-t border-border sm:grid-cols-2">
            {localCategories.map((category, index) => {
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
                  className="group relative min-h-56 border-r border-b border-border p-5 transition-colors duration-200 hover:bg-card sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-9 place-items-center rounded-[10px] border border-border bg-card text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <div className="text-right">
                      <span className="meta-type block text-[11px] text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="mt-1 block text-[10px] font-semibold text-primary">
                        {recordCount} kayıt
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-7 max-w-xs font-heading text-lg font-semibold leading-6 tracking-[-0.025em]">
                    {category.label}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="mt-3 pr-7 text-[11px] leading-5 text-muted-foreground/80">
                    {category.subtopics.slice(0, 2).join(' · ')}
                  </p>
                  <ArrowRight
                    className="absolute right-5 bottom-5 size-4 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="inverse-panel border-y border-border">
        <div className="mx-auto grid max-w-[1280px] lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative isolate overflow-hidden border-b border-background/10 px-5 py-16 sm:px-8 lg:border-r lg:border-b-0 lg:px-10 lg:py-20">
            <div
              className="version-lines absolute inset-0 -z-10 opacity-30"
              aria-hidden="true"
            />
            <p className="meta-type text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
              Sürüm takibi
            </p>
            <h2 className="mt-4 max-w-md font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.045em]">
              Değişiklik metni kaybolmaz; ana düzenlemeye bağlanır.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-background/72">
              İlk yayım, değişiklikler, yürürlük tarihleri ve güncel metin aynı
              kayıt üzerinde izlenir.
            </p>
            <Button
              nativeButton={false}
              render={
                <Link href="/metodoloji" aria-label="Kaynak yöntemini incele" />
              }
              variant="outline"
              className="mt-8 h-10 rounded-[10px] border-background/20 bg-transparent px-4 text-background hover:bg-background/10 hover:text-background"
            >
              Kaynak yöntemini incele
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="divide-y divide-background/10">
            <article className="grid gap-4 px-5 py-7 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:px-8 lg:px-10">
              <time className="meta-type text-sm text-accent">05.03.2026</time>
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 border-background/20 text-background/72"
                >
                  Değişiklik
                </Badge>
                <h3 className="font-semibold leading-6">
                  Çevresel Etki Değerlendirmesi Yönetmeliğinde Değişiklik
                </h3>
                <p className="mt-1 text-xs text-background/64">
                  Resmî Gazete · Ana düzenleme kaydına bağlı
                </p>
              </div>
              <a
                className="inline-flex size-9 items-center justify-center rounded-full border border-background/20 hover:bg-background/10"
                href="https://www.resmigazete.gov.tr/eskiler/2026/03/20260305-3.htm"
                aria-label="Resmî Gazete kaynağını aç"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </article>
            <article className="grid gap-4 px-5 py-7 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:px-8 lg:px-10">
              <time className="meta-type text-sm text-accent">14.01.2025</time>
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 border-background/20 text-background/72"
                >
                  İlk yayım
                </Badge>
                <h3 className="font-semibold leading-6">
                  Endüstriyel Emisyonların Yönetimi Yönetmeliği
                </h3>
                <p className="mt-1 text-xs text-background/64">
                  32782 sayılı Resmî Gazete
                </p>
              </div>
              <a
                className="inline-flex size-9 items-center justify-center rounded-full border border-background/20 hover:bg-background/10"
                href="https://www.resmigazete.gov.tr/eskiler/2025/01/20250114-1.htm"
                aria-label="Resmî Gazete kaynağını aç"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </article>
            <article className="grid gap-4 px-5 py-7 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:px-8 lg:px-10">
              <span className="meta-type text-sm text-accent">Kontrol</span>
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 border-background/20 text-background/72"
                >
                  Kaynak izi
                </Badge>
                <h3 className="font-semibold leading-6">
                  Her kayıt üzerinde son kontrol tarihi
                </h3>
                <p className="mt-1 text-xs text-background/64">
                  Kaynak bağlantısı ve kontrol tarihi birlikte gösterilir
                </p>
              </div>
              <FileClock
                className="size-5 text-background/68"
                aria-hidden="true"
              />
            </article>
          </div>
        </div>
      </section>

      <section id="kutuphane" className="site-frame py-20 lg:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Mevzuat kütüphanesi</p>
            <h2 className="mt-3 max-w-2xl font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-[46px]">
              Aramakla değil, okumakla vakit geçirin.
            </h2>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/kutuphane" aria-label="Kütüphaneyi aç" />}
            variant="outline"
            className="h-10 self-start rounded-[10px] px-4 sm:self-auto"
          >
            Kütüphaneyi aç
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {featuredLegislation.map((item) => (
            <article
              key={item.slug}
              className="precision-card group flex min-h-72 flex-col p-6 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-4">
                <Badge variant="secondary">{item.type}</Badge>
                <span className="text-xs text-muted-foreground">
                  RG {item.gazetteNumber}
                </span>
              </div>
              <h3 className="mt-7 font-heading text-xl font-semibold leading-7 tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.summary}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
                <Link
                  className="text-sm font-semibold text-primary hover:underline"
                  href={`/mevzuat/${item.slug}`}
                >
                  Kayıt sayfası
                </Link>
                <a
                  className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                  href={item.consolidatedUrl ?? item.sourceUrl}
                  aria-label={`${item.title} resmî kaynağını aç`}
                >
                  <Download className="size-4" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="sozluk" className="border-t border-border bg-card">
        <div className="site-frame grid gap-12 py-20 lg:grid-cols-[0.72fr_1.28fr] lg:py-24">
          <div>
            <p className="section-kicker">Mevzuat sözlüğü</p>
            <h2 className="mt-3 max-w-sm font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.045em]">
              Tanım nereden geliyorsa, cevabı orada.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              Her terim, kullanıldığı düzenleme ve maddeyle birlikte gösterilir.
              Aynı terimin farklı düzenlemelerdeki tanımları ayrı tutulur.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/sozluk" aria-label="Sözlüğü aç" />}
              variant="outline"
              className="mt-7 h-10 rounded-[10px] px-4"
            >
              Sözlüğü aç
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {glossary.slice(0, 4).map((entry) => (
              <Link
                key={entry.term}
                href={`/sozluk?q=${encodeURIComponent(entry.term)}`}
                className="group grid gap-2 py-5 sm:grid-cols-[160px_1fr_auto] sm:items-baseline"
              >
                <strong className="font-heading text-lg font-semibold tracking-[-0.025em]">
                  {entry.term}
                </strong>
                <span className="text-sm leading-6 text-muted-foreground">
                  {entry.definition}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-70 group-hover:opacity-100">
                  {entry.article}
                  <ArrowRight className="size-3" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
