import type { Metadata } from 'next';
import { Cookie, Database, ExternalLink as ExternalLinkIcon, Shield } from 'lucide-react';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { openGraphFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Gizlilik ve KVKK',
  description:
    'Sitenin hangi verileri işlediği, çerez kullanmadığı ve KVKK kapsamındaki haklar.',
  alternates: { canonical: '/gizlilik' },
  openGraph: openGraphFor({
    title: 'Gizlilik ve KVKK',
    description:
      'Sitenin hangi verileri işlediği, çerez kullanmadığı ve KVKK kapsamındaki haklar.',
    path: '/gizlilik',
  }),
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="icerik" className="min-h-screen bg-background">
        <section className="border-b border-border bg-card">
          <div className="site-frame max-w-[900px] py-12 lg:py-16">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Gizlilik ve KVKK' },
              ]}
            />
            <p className="section-kicker mt-8">Çevre Mevzuatı</p>
            <h1 className="mt-3 font-heading text-[clamp(2.5rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              Gizlilik ve KVKK
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              Bu metin, sitenin teknik olarak ne yaptığını olduğu gibi anlatır.
              Site üyelik almaz, form toplamaz, çerez yazmaz ve ziyaretçi
              takibi yapmaz.
            </p>
          </div>
        </section>

        <section className="site-frame max-w-[900px] py-12 lg:py-16">
          <div className="grid gap-10">
            <div>
              <h2 className="flex items-center gap-2.5 font-heading text-[1.75rem] font-semibold tracking-[-0.02em]">
                <Database className="size-5 text-primary" aria-hidden="true" />
                Toplanan kişisel veri
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Site, ziyaretçiden kişisel veri toplamaz. Üyelik sistemi, giriş
                ekranı, iletişim formu, yorum alanı ve bülten kaydı yoktur.
                Arama ve filtre işlemlerinin tamamı tarayıcınızda çalışır;
                aradığınız ifade sunucuya gönderilmez.
              </p>
            </div>

            <div>
              <h2 className="flex items-center gap-2.5 font-heading text-[1.75rem] font-semibold tracking-[-0.02em]">
                <Cookie className="size-5 text-primary" aria-hidden="true" />
                Çerez ve tarayıcı depolaması
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Site çerez yazmaz; bu nedenle çerez onay bandı da yoktur.
                Tarayıcınızın yerel depolamasında yalnızca bir kayıt tutulur:
                seçtiğiniz renk teması. Bu kayıt yalnızca kendi tarayıcınızda
                kalır, sunucuya iletilmez ve kimliğinizle ilişkilendirilemez.
                Tarayıcı verilerini temizlediğinizde silinir.
              </p>
            </div>

            <div>
              <h2 className="flex items-center gap-2.5 font-heading text-[1.75rem] font-semibold tracking-[-0.02em]">
                <Shield className="size-5 text-primary" aria-hidden="true" />
                Sunucu kayıtları
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Site bir barındırma sağlayıcısı üzerinden yayımlanır.
                Sağlayıcı, hizmetin güvenliği ve sürekliliği için erişim
                kayıtlarını (IP adresi, tarih, istenen adres, tarayıcı bilgisi)
                kendi altyapısında işleyebilir. Bu kayıtlar site tarafından
                analiz edilmez, pazarlama amacıyla kullanılmaz ve üçüncü
                taraflara aktarılmaz.
              </p>
            </div>

            <div>
              <h2 className="flex items-center gap-2.5 font-heading text-[1.75rem] font-semibold tracking-[-0.02em]">
                <ExternalLinkIcon className="size-5 text-primary" aria-hidden="true" />
                Dış bağlantılar
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Mevzuat kayıtlarındaki kaynak bağlantıları resmigazete.gov.tr
                ve mevzuat.gov.tr adreslerine gider. Bu bağlantıya
                tıkladığınızda ilgili kamu kurumunun kendi gizlilik uygulaması
                geçerli olur. Site, dış bağlantılara tıklama davranışını
                kaydetmez.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-[1.75rem] font-semibold tracking-[-0.02em]">
                KVKK kapsamındaki haklarınız
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun 11.
                maddesi uyarınca; kişisel verinizin işlenip işlenmediğini
                öğrenme, işlenmişse buna ilişkin bilgi talep etme, düzeltilmesini
                veya silinmesini isteme ve işlemeye itiraz etme haklarına
                sahipsiniz. Site kişisel veri toplamadığı için bu haklar
                yalnızca barındırma sağlayıcısının işlediği erişim kayıtları
                bakımından gündeme gelebilir.
              </p>
              {/* YAYIN ÖNCESİ: veri sorumlusu kimliği ve başvuru adresi eklenmeli. */}
              <div className="mt-5 rounded-lg border border-dashed border-input bg-card p-5">
                <p className="text-base font-semibold">
                  Veri sorumlusu bilgisi eklenmedi
                </p>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  KVKK aydınlatma yükümlülüğü, veri sorumlusunun kimliğinin
                  açıkça belirtilmesini gerektirir. Bu bilgi ve başvuru adresi{' '}
                  <Link
                    href="/kunye"
                    className="rounded font-semibold text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                  >
                    künye sayfasında
                  </Link>{' '}
                  doldurulmadan site kamuya açık olarak tanıtılmamalıdır.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Bu metnin durumu</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Metin, sitenin mevcut teknik davranışını doğru biçimde anlatır.
                Yayına almadan önce bir hukukçu tarafından gözden geçirilmesi ve
                veri sorumlusu bilgisinin eklenmesi gerekir. Sitenin teknik
                davranışı değişirse (örneğin analitik veya form eklenirse) bu
                metin de güncellenmelidir.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
