import type { Metadata } from 'next';
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  FileCheck2,
  Mail,
  ScrollText,
} from 'lucide-react';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import Link from '@/components/site/safe-link';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import {
  lastSourceCheck,
  legislation,
  verificationSummary,
} from '@/lib/legislation-data';
import {
  openGraphFor,
  publisherEmail,
  publisherName,
  publisherUrl,
} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Künye ve iletişim',
  description:
    'Sitenin amacı, içerik politikası, düzeltme talebi süreci ve iletişim bilgileri.',
  alternates: { canonical: '/kunye' },
  openGraph: openGraphFor({
    title: 'Künye ve iletişim',
    description:
      'Sitenin amacı, içerik politikası, düzeltme talebi süreci ve iletişim bilgileri.',
    path: '/kunye',
  }),
};

export default function ImprintPage() {
  const summary = verificationSummary();
  const withChanges = legislation.filter(
    (item) => (item.changes?.length ?? 0) > 0,
  ).length;

  return (
    <>
      <SiteHeader />
      <main id="icerik">
        <section>
          <div className="site-frame py-10 lg:py-14">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Künye ve iletişim' },
              ]}
            />
            <p className="eyebrow mt-8">Çevre Mevzuatı</p>
            <h1 className="text-3xl measure mt-4">Künye ve iletişim</h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              Bu sayfa; sitenin ne olduğunu, neyi vaat ettiğini, neyi vaat
              etmediğini ve bir hata gördüğünüzde nasıl bildireceğinizi açıklar.
            </p>
          </div>
        </section>

        <section className="site-frame max-w-[900px] py-12 lg:py-16">
          <div className="grid gap-10">
            <div>
              <h2 className="flex items-center gap-2.5 text-xl">
                <FileCheck2
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                Sitenin amacı
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Çevre Mevzuatı, sanayi tesislerinin Türkiye çevre mevzuatındaki
                yerini bulmasına yardımcı olan bir mevzuat navigasyon aracıdır.
                Her kayıt, düzenlemenin Resmî Gazete künyesi ve madde düzeyinde
                kaynak bağlantısıyla birlikte tutulur.
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Site bir kaydın hangi eke bakılarak değerlendirileceğini
                gösterir. Kapasite eşiği hesabı yapmaz, tesis adına kapsam
                kararı üretmez.
              </p>
            </div>

            <div className="border-l-2 border-attention pl-5">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold">
                <AlertTriangle
                  className="size-5 text-accent-foreground dark:text-accent"
                  aria-hidden="true"
                />
                Hukuki uyarı
              </h2>
              <p className="mt-3 text-base leading-7">
                Bu sitede yer alan bilgiler hukuki görüş, danışmanlık veya resmî
                yorum niteliği taşımaz. Bağlayıcı metin, her zaman Resmî
                Gazete&apos;de yayımlanan ve yürürlükte olan düzenlemenin
                kendisidir. Yükümlülük değerlendirmesi yapmadan önce güncel
                metni resmî kaynağından teyit edin.
              </p>
            </div>

            <div>
              <h2 className="flex items-center gap-2.5 text-xl">
                <ScrollText
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                İçerik politikası
              </h2>
              <ul className="mt-4 grid gap-3 text-base leading-7 text-muted-foreground">
                <li>
                  Kayıtlar yalnızca Resmî Gazete ve mevzuat sistemi kayıtlarına
                  dayanır. Kurum içi çalışma notları veya ikincil yorumlar
                  mevzuat kaydı olarak yayımlanmaz.
                </li>
                <li>
                  Kaynak bağlantısı, günün tam Resmî Gazete sayısına değil,
                  düzenlemenin kendi sayfasına gider.
                </li>
                <li>
                  Yayım tarihi ve resmî ad, Resmî Gazete kaydıyla
                  karşılaştırılır. {summary.total} kaydın {summary.verified}
                  &apos;inde bu karşılaştırma tamamlanmıştır.
                </li>
                <li>
                  Değişiklik zinciri {withChanges} kayıtta işlenmiştir. Zinciri
                  işlenmemiş kayıtlarda boş zaman çizelgesi gösterilmez; yerine
                  güncel metni kontrol etme uyarısı verilir.
                </li>
                <li>En son kaynak kontrolü: {lastSourceCheck()}.</li>
              </ul>
              <Link
                href="/metodoloji"
                className="mt-5 inline-flex rounded text-sm font-semibold text-primary hover:underline hover:decoration-seal"
              >
                Kaynak ve yöntemin ayrıntısı
              </Link>
            </div>

            <div>
              <h2 className="flex items-center gap-2.5 text-xl">
                <Building2 className="size-5 text-primary" aria-hidden="true" />
                Platformun arkasında
              </h2>
              <div className="mt-4 rounded-xl border border-border bg-card p-5 sm:p-6">
                <p className="text-base leading-7 text-muted-foreground">
                  Çevre Mevzuatı, 2015 yılında Ankara&apos;da kurulan{' '}
                  <strong className="font-semibold text-foreground">
                    {publisherName}
                  </strong>{' '}
                  tarafından geliştirilir ve yayımlanır. Platformdaki mevzuat
                  navigasyonu herkesin kullanımına açıktır; tesis özelindeki
                  uygulama, süreç yönetimi ve profesyonel destek
                  Resisco&apos;nun uzmanlık alanıdır.
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Çevre izin ve lisans, emisyon ve SEÖS, atık yönetimi, sera
                  gazı emisyonları ve sürdürülebilirlik çalışmalarında kurumsal
                  hizmet sunulur.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`${publisherUrl}/aboutus`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-semibold hover:border-primary hover:text-primary"
                  >
                    Resisco hakkında
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                    <span className="sr-only"> (yeni sekmede açılır)</span>
                  </a>
                  <a
                    href={`${publisherUrl}/services`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Hizmetleri inceleyin
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                    <span className="sr-only"> (yeni sekmede açılır)</span>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-2.5 text-xl">
                <Mail className="size-5 text-primary" aria-hidden="true" />
                Düzeltme talebi ve iletişim
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Bir künyede, bağlantıda veya yürürlük bilgisinde hata
                gördüğünüzde bildirin. Bildirimde kaydın adını, hatalı
                gördüğünüz bilgiyi ve varsa doğru kaynağı belirtmeniz düzeltmeyi
                hızlandırır.
              </p>
              <dl className="mt-5 grid gap-3 border border-border p-5 text-base">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
                  <dt className="font-medium">Yayıncı</dt>
                  <dd>
                    <a
                      href={publisherUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      {publisherName}
                      <span className="sr-only"> (yeni sekmede açılır)</span>
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <dt className="font-medium">E-posta</dt>
                  <dd>
                    <a
                      href={`mailto:${publisherEmail}`}
                      className="rounded font-semibold text-primary hover:underline hover:decoration-seal"
                    >
                      {publisherEmail}
                    </a>
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Düzeltme ve künye talepleri bu adrese yazılabilir.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
