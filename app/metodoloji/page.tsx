import type { Metadata } from 'next';
import {
  BadgeCheck,
  FileClock,
  Link2,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { openGraphFor } from '@/lib/site';
import {
  lastSourceCheck,
  legislation,
  verificationSummary,
} from '@/lib/legislation-data';

export const metadata: Metadata = {
  title: 'Kaynak ve yöntem',
  description:
    'Kayıtların nasıl kurulduğu, neyin doğrulandığı ve neyin henüz işlenmediği.',
  alternates: { canonical: '/metodoloji' },
  openGraph: openGraphFor({
    title: 'Kaynak ve yöntem',
    description:
      'Kayıtların nasıl kurulduğu, neyin doğrulandığı ve neyin henüz işlenmediği.',
    path: '/metodoloji',
  }),
};

const steps = [
  {
    icon: Link2,
    title: 'Kaynak madde düzeyinde bağlanır',
    body: 'Her kayıt, Resmî Gazete günlük indeksinde ilgili düzenlemenin kendi sayfasına bağlanır. Günün tam sayısına giden bağlantı birincil kaynak olarak kullanılmaz. Kanunlarda ayrıca mevzuat sistemi konsolide metni verilir.',
  },
  {
    icon: BadgeCheck,
    title: 'Künye Resmî Gazete kaydıyla karşılaştırılır',
    body: 'Yayım tarihi ve düzenlemenin resmî adı, Resmî Gazete indeksindeki başlıkla karşılaştırılır. Ad sonradan değiştiyse ilk yayımdaki ad da kayıtta tutulur.',
  },
  {
    icon: ListChecks,
    title: 'Kapsam dayanağı işaretlenir',
    body: 'Her kayıtta kimin kapsandığı ve önce hangi ek, liste veya maddeye bakılacağı yazılır. Site eşik hesabı yapmaz; hangi hükmü kontrol etmeniz gerektiğini gösterir, kararı siz verirsiniz.',
  },
  {
    icon: FileClock,
    title: 'Kontrol tarihi kayıt üzerinde tutulur',
    body: 'Kontrol; kaynak bağlantısının açıldığını ve künyenin eşleştiğini kapsar. Değişiklik zinciri işlenmemişse kayıt sayfasında bu durum açıkça belirtilir.',
  },
];

const resultLanguage = [
  {
    title: 'Eşleşme',
    body: 'Okuma listesinde kullanılır. Kayıt listeye girer ve altında hangi cevabınız nedeniyle geldiği yazılır.',
  },
  {
    title: 'Eşleşmeme',
    body: 'İşaretlemediğiniz koşullara bağlı kayıtlar listeye girmez. Bu bir kapsam dışı kararı değildir; yalnızca o koşulun sorulmadığı ya da işaretlenmediği anlamına gelir.',
  },
  {
    title: 'Karar için veri eksik',
    body: 'Yaşam evresi, faaliyet grubu, proses veya konum bilgisi verilmediğinde okuma listesinin başında hangi alanların taranmadığı adıyla yazılır.',
  },
];

export default function MethodologyPage() {
  const summary = verificationSummary();
  const withChanges = legislation.filter(
    (item) => (item.changes?.length ?? 0) > 0,
  ).length;
  const withConsolidated = legislation.filter(
    (item) => item.consolidatedUrl,
  ).length;

  return (
    <>
      <SiteHeader />
      <main id="icerik" className="min-h-screen bg-background">
        <section className="hero-surface relative overflow-hidden border-b border-border">
          <div
            className="document-grid pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <div className="site-frame relative max-w-[1180px] py-12 lg:py-16">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Kaynak ve yöntem' },
              ]}
            />
            <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Yorum değil, kaynak ilişkisi
            </span>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.5rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              Kaynak ve yöntem
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
              Sitedeki her sonuç; kullanılan tesis verisi, eşleşen hüküm, resmî
              kaynak ve kontrol tarihiyle izlenebilir olmalıdır. Aşağıda neyin
              doğrulandığı ve neyin henüz işlenmediği sayılarla birlikte
              yazılıdır.
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-card py-12 lg:py-16">
          <div className="site-frame max-w-[1180px]">
            <h2 className="font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em]">
              Kaydın kuruluşu
            </h2>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <li key={step.title} className="precision-card bg-background p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                      <step.icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <span className="meta-type text-sm text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold leading-7 tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border py-12 lg:py-16">
          <div className="site-frame max-w-[1180px]">
            <h2 className="font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em]">
              Şu anda ne doğrulanmış durumda?
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              Aşağıdaki sayılar veri dosyasından üretilir; elle güncellenmez.
              Bir kaydın doğrulama durumu yürürlük bilgisi değildir ve liste
              rozetinde gösterilmez.
            </p>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card p-5">
                <dd className="font-heading text-[1.75rem] font-semibold">
                  {summary.total}
                </dd>
                <dt className="mt-1 text-sm text-muted-foreground">
                  toplam mevzuat kaydı
                </dt>
              </div>
              <div className="bg-card p-5">
                <dd className="font-heading text-[1.75rem] font-semibold text-primary">
                  {summary.verified}
                </dd>
                <dt className="mt-1 text-sm text-muted-foreground">
                  künyesi doğrulanmış kayıt
                </dt>
              </div>
              <div className="bg-card p-5">
                <dd className="font-heading text-[1.75rem] font-semibold">
                  {withChanges}
                </dd>
                <dt className="mt-1 text-sm text-muted-foreground">
                  değişiklik zinciri işlenmiş kayıt
                </dt>
              </div>
              <div className="bg-card p-5">
                <dd className="font-heading text-[1.75rem] font-semibold">
                  {withConsolidated}
                </dd>
                <dt className="mt-1 text-sm text-muted-foreground">
                  konsolide metin bağlantısı olan kayıt
                </dt>
              </div>
            </dl>
            <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-5">
              <h3 className="text-base font-semibold">Bilinen sınırlar</h3>
              <ul className="mt-3 grid gap-2 text-base leading-7 text-muted-foreground">
                <li>
                  Değişiklik zinciri {summary.total - withChanges} kayıtta
                  işlenmemiştir. Bu kayıtlarda zaman çizelgesi gösterilmez;
                  yerine güncel metni kontrol etme uyarısı verilir.
                </li>
                <li>
                  Konsolide metin bağlantısı yalnızca kanunlarda bulunuyor.
                  Yönetmelik ve tebliğlerde bağlantı ilk yayım metnine gider;
                  güncel metni mevzuat.gov.tr üzerinden kontrol etmeniz gerekir.
                </li>
                <li>
                  Sözlük tanımlarının bir kısmı sadeleştirilmiş özettir ve her
                  kayıtta bu durum ayrıca belirtilir. Bağlayıcı metin kaynaktaki
                  maddedir.
                </li>
                <li>En son kaynak kontrolü: {lastSourceCheck()}.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="site-frame max-w-[1180px]">
            <h2 className="font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em]">
              Sonuç dili
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              Okuma listesi bu üç durumu ayırır. Üçüncüsü, cevaplanmamış
              soruları gizlemek yerine açıkça göstermek için vardır.
            </p>
            <ul className="mt-8 grid gap-4 lg:grid-cols-3">
              {resultLanguage.map((entry) => (
                <li key={entry.title} className="precision-card p-6">
                  <h3 className="font-heading text-lg font-semibold tracking-[-0.02em]">
                    {entry.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    {entry.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
