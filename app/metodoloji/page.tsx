import type { Metadata } from 'next';
import {
  ArrowDown,
  CheckCircle2,
  FileCheck2,
  FileClock,
  Library,
  ShieldCheck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export const metadata: Metadata = {
  title: 'Kaynak ve Yöntem | Çevre Mevzuatı',
  description:
    'Çevre Mevzuatı kayıtlarının kaynak, sürüm ve kapsam eşleştirme yöntemi.',
};

const steps = [
  {
    icon: Library,
    title: 'Kaynak alınır',
    text: 'Resmî Gazete veya güncel mevzuat sistemi kaydı kanonik kaynağa bağlanır.',
  },
  {
    icon: FileClock,
    title: 'Sürüm zinciri kurulur',
    text: 'İlk yayım, değişiklikler, ekler ve yürürlük bilgileri aynı düzenleme altında tutulur.',
  },
  {
    icon: FileCheck2,
    title: 'Kapsam dayanağı işaretlenir',
    text: 'Tesis verisi yalnızca açık madde, ek, faaliyet veya eşik hükmüyle eşleştirilir.',
  },
  {
    icon: CheckCircle2,
    title: 'Kontrol tarihi gösterilir',
    text: 'Kayıt üzerinde son resmî kaynak kontrolü görünür biçimde tutulur.',
  },
];

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border bg-card">
        <div className="site-frame max-w-[1180px] py-16 lg:py-22">
          <Badge
            variant="outline"
            className="gap-2 border-primary/20 bg-primary/5 text-primary"
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Yorum değil, kaynak ilişkisi
          </Badge>
          <h1 className="mt-6 max-w-4xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">
            Bir mevzuat kaydına nasıl güveneceğinizi açıkça gösteriyoruz.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            Sitedeki her sonuç; kullanılan tesis verisi, eşleşen hüküm, resmî
            kaynak ve kontrol tarihiyle izlenebilir olmalıdır.
          </p>
        </div>
      </section>
      <section className="site-frame max-w-[1180px] py-16 lg:py-22">
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="relative">
              <article className="precision-card h-full p-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-[10px] border border-border bg-background text-primary">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="meta-type text-[11px] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h2 className="mt-7 font-heading text-lg font-semibold tracking-[-0.025em]">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {text}
                </p>
              </article>
              {index < steps.length - 1 && (
                <ArrowDown
                  className="absolute -bottom-3 left-1/2 z-10 size-6 -translate-x-1/2 rounded-full bg-background p-1 text-muted-foreground md:-right-3 md:top-1/2 md:bottom-auto md:left-auto md:-translate-y-1/2 md:-rotate-90"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          <article className="bg-card p-6">
            <p className="section-kicker">Sonuç dili</p>
            <h2 className="mt-3 font-heading text-xl font-semibold">Eşleşme</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Dayanak hüküm ve kullanılan tesis verisi açık olduğunda.
            </p>
          </article>
          <article className="bg-card p-6">
            <p className="section-kicker">Sonuç dili</p>
            <h2 className="mt-3 font-heading text-xl font-semibold">
              Eşleşmeme
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Düzenlemenin açık kapsam koşulu sağlanmadığında.
            </p>
          </article>
          <article className="bg-card p-6">
            <p className="section-kicker">Sonuç dili</p>
            <h2 className="mt-3 font-heading text-xl font-semibold">
              Karar için veri eksik
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Faaliyet, kapasite, konum veya proses bilgisi yeterli olmadığında.
            </p>
          </article>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
