import type { Metadata } from 'next';
import { AlertTriangle, FileCheck2, Mail, ScrollText } from 'lucide-react';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { lastSourceCheck, legislation, verificationSummary } from '@/lib/legislation-data';
import { openGraphFor, publisherEmail, publisherName } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Künye ve iletişim',
  description:
    'Sitenin amacı, içerik politikası, düzeltme talebi süreci ve iletişim bilgileri.',
  alternates: { canonical: '/kv' },
  openGraph: openGraphFor({
    title: 'Künye ve iletişim',
    description:
      'Sitenin amacı, içerik politikası, düzeltme talebi süreci ve iletişim bilgileri.',
    path: '/kv',
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
            <h1 className="text-3xl measure mt-4">
              Künye ve iletişim
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              Bu sayfa; sitenin ne olduğunu, neyi vaat ettiğini, neyi vaat
              etmediğini ve bir hata gördüğünüzde nasıl bildireceğinizi
              açıklar.
            </p>
          </div>
        </section>

        <section className="site-frame max-w-[900px] py-12 lg:py-16">
          <div className="grid gap-10">
            <div>
              <h2 className="flex items-center gap-2.5 text-xl">
                <FileCheck2 className="size-5 text-primary" aria-hidden="true" />
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
                Bu sitede yer alan bilgiler hukuki görüş, danışmanlık veya
                resmî yorum niteliği taşımaz. Bağlayıcı metin, her zaman
                Resmî Gazete&apos;de yayımlanan ve yürürlükte olan düzenlemenin
                kendisidir. Yükümlülük değerlendirmesi yapmadan önce güncel
                metni resmî kaynağından teyit edin.
              </p>
            </div>

            <div>
              <h2 className="flex items-center gap-2.5 text-xl">
                <ScrollText className="size-5 text-primary" aria-hidden="true" />
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
                <Mail className="size-5 text-primary" aria-hidden="true" />
                Düzeltme talebi ve iletişim
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Bir künyede, bağlantıda veya yürürlük bilgisinde hata
                gördüğünüzde bildirin. Bildirimde kaydın adını, hatalı gördüğünüz
                bilgiyi ve varsa doğru kaynağı belirtmeniz düzeltmeyi hızlandırır.
              </p>
              <dl className="mt-5 grid gap-3 border border-border p-5 text-base">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
                  <dt className="font-medium">Yayıncı</dt>
                  <dd className="text-muted-foreground">{publisherName}</dd>
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
