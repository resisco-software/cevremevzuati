import type { Metadata } from 'next';
import { Cookie, Database, ExternalLink as ExternalLinkIcon, Shield } from 'lucide-react';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { openGraphFor, publisherEmail, publisherName } from '@/lib/site';

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
      <main id="icerik">
        <section>
          <div className="site-frame py-10 lg:py-14">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Gizlilik ve KVKK' },
              ]}
            />
            <p className="eyebrow mt-8">Çevre Mevzuatı</p>
            <h1 className="text-3xl measure mt-4">
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
              <h2 className="flex items-center gap-2.5 text-xl">
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
              <h2 className="flex items-center gap-2.5 text-xl">
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
              <h2 className="flex items-center gap-2.5 text-xl">
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
              <h2 className="flex items-center gap-2.5 text-xl">
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
              <h2 className="text-xl">
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
              <dl className="mt-5 grid gap-3 border border-border p-5 text-base">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
                  <dt className="font-medium">Veri sorumlusu</dt>
                  <dd className="text-muted-foreground">{publisherName}</dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <dt className="font-medium">Başvuru</dt>
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
                Künye ve iletişim bilgileri{' '}
                <Link
                  href="/kv"
                  className="rounded font-semibold text-primary hover:underline hover:decoration-seal"
                >
                  künye sayfasında
                </Link>{' '}
                da yer alır.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold">Bu metnin durumu</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Metin, sitenin mevcut teknik davranışını doğru biçimde anlatır.
                Sitenin teknik davranışı değişirse (örneğin analitik veya form
                eklenirse) bu metin de güncellenmelidir.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
