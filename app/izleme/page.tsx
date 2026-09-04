import type { Metadata } from 'next';
import {
  ArrowRight,
  FileSearch,
  FileDiff,
  ShieldCheck,
  Clock3,
  CircleAlert,
} from 'lucide-react';
import Link from '@/components/site/safe-link';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { legislation } from '@/lib/legislation-data';
import { getMonitoringStatus } from '@/lib/monitoring-status';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mevzuat izleme',
  description:
    'Yeni çevre düzenlemeleri ve mevcut mevzuat değişiklikleri için izleme durumu ve inceleme süreci.',
  alternates: { canonical: '/izleme' },
};

const routes = [
  {
    icon: FileSearch,
    number: '01',
    title: 'Yeni düzenlemeleri bul',
    body: 'Günlük Resmî Gazete indeksi ve bağlantılı mükerrer sayılardaki metinler tarama kuyruğuna alınır. Başlığı çevreyle ilgili görünmeyen düzenlemeler de kapsam incelemesinden çıkarılmaz.',
  },
  {
    icon: FileDiff,
    number: '02',
    title: 'Mevcut kaynakları karşılaştır',
    body: 'Dizindeki düzenlemelerin resmî kaynakları ve varsa konsolide metinleri, saklanan önceki kopyalarıyla karşılaştırılır. Kaynak farkı, doğrulanmış mevzuat değişikliği sayılmaz.',
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: 'Dayanağı doğrula, sonra yayımla',
    body: 'Yeni metin, değişiklik, kaldırma ve ekler inceleme kuyruğunda ayrılır. Madde, ek ve yürürlük kontrolü yapılmadan dizin güncellenmez. Karbon düzenlemeleri ayrı değerlendirilir.',
  },
];

const stateText = {
  unconfigured: [
    'Canlı izleme henüz etkin değil',
    'İzleme altyapısı hazırlanıyor. Sunucu bağlantısı, zamanlayıcı ve canlı kaynak kabul testleri tamamlanmadan otomatik takip başlamaz.',
  ],
  unavailable: [
    'İzleme servisine ulaşılamıyor',
    'Güncel tarama durumu alınamadı. Bu durum, kaynaklarda değişiklik olmadığı anlamına gelmez.',
  ],
  waiting: [
    'İzleme bağlantısı kuruldu; etkinleştirme bekleniyor',
    'Otomatik tarama ayarı kapalı veya kaynak kabul kontrolü tamamlanmadı.',
  ],
  running: [
    'İzleme iş akışı çalışıyor',
    'Son çalışma bilgisi aşağıdadır. Taramalar aşamalıdır; bekleyen işler ve inceleme kayıtları doğrulanmış mevzuat güncellemesi değildir.',
  ],
  incomplete: [
    'İzleme kontrol gerektiriyor',
    'Kaynak erişim sorunu veya geciken tarama var. Eksik kontrol, “değişiklik yok” olarak gösterilmez.',
  ],
};

export default async function MonitoringPage() {
  const status = await getMonitoringStatus();
  const [heading, explanation] = stateText[status.state];
  const show = (value: number | null) => (value === null ? '—' : String(value));
  const date = (value: number | null) =>
    value === null
      ? 'Henüz yok'
      : new Date(value).toLocaleString('tr-TR', {
          timeZone: 'Europe/Istanbul',
        });
  return (
    <>
      <SiteHeader />
      <main id="icerik" className="min-h-screen bg-background">
        <section className="hero-surface border-b border-border">
          <div className="site-frame max-w-[1180px] py-12 lg:py-16">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Mevzuat izleme' },
              ]}
            />
            <span className="mt-8 inline-flex items-center gap-2 border border-border px-3 py-1.5 text-sm font-medium text-primary">
              <Clock3 className="size-4" aria-hidden="true" /> Yeni metinler ve
              değişiklikler
            </span>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.5rem,4.4vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
              Çevre mevzuatı değişir.
              <br />
              Kaynağıyla izini süreriz.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
              Yalnızca mevcut düzenlemeler değil, yeni yayımlanan metinler de
              izleme kapsamındadır. Otomatik tespit ve doğrulanmış yayın
              birbirinden ayrılır.
            </p>
          </div>
        </section>
        <section className="site-frame max-w-[1180px] py-10 lg:py-14">
          <div className="soft-panel border-primary/25 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <CircleAlert
                className="mt-1 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-heading text-xl font-semibold">
                  {heading}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {explanation}
                </p>
              </div>
            </div>
            <dl className="mt-7 grid grid-cols-2 gap-6 border-t border-border pt-6 lg:grid-cols-4">
              {[
                ['Dizindeki düzenleme', legislation.length],
                ['Bekleyen tarama', show(status.queued)],
                ['İnceleme kaydı', show(status.pending)],
                ['Kaynak sorunu', show(status.errors)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="mt-2 font-heading text-3xl font-semibold tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs leading-6 text-muted-foreground">
              Son tarama başlangıcı: {date(status.lastSeedAt)} · Son tamamlanan
              iş grubu: {date(status.lastCompletedAt)} · Türkiye saati
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {routes.map(({ icon: Icon, ...route }) => (
              <article
                key={route.number}
                className="soft-panel p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="meta-type text-sm text-muted-foreground">
                    {route.number}
                  </span>
                </div>
                <h2 className="mt-6 font-heading text-xl font-semibold leading-7">
                  {route.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {route.body}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-6 border-t border-border pt-8 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-lg font-semibold">
                Planlanan kontrol ritmi
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Her gün 08.00 ve 18.00’de tarama başlangıcı; sıradaki kaynaklar
                aşamalı işlenir. Başarısız okumalar tekrar denenir. Okunamayan
                PDF ve görüntülü ekler elle incelemeye ayrılır.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">
                Tespit, hukuki sonuç değildir
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Yayım ve yürürlük tarihleri ayrı tutulur. İlk kaynak kopyası
                geçmiş değişikliklerin doğrulandığını göstermez. İnceleme onayı
                da tek başına sitede yayın yapmaz.
              </p>
              <Link
                href="/metodoloji"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Kaynak ve yöntem{' '}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
