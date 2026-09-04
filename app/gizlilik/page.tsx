import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Cookie, Mail, Server, ShieldCheck } from 'lucide-react';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import Link from '@/components/site/safe-link';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import {
  openGraphFor,
  publisherAddress,
  publisherEmail,
  publisherKvkkEmail,
  publisherName,
  publisherUrl,
} from '@/lib/site';

const updateDate = '4 Eylül 2026';
const description =
  'Çevre Mevzuatı sitesinde hangi kişisel verinin işlendiği, çerez kullanımı, yurt dışına aktarım ve KVKK kapsamındaki haklarınız.';

const externalLinkClass =
  'rounded font-semibold text-primary underline decoration-primary/35 underline-offset-3 hover:decoration-primary';

export const metadata: Metadata = {
  title: 'Gizlilik ve KVKK Aydınlatma Metni',
  description,
  alternates: { canonical: '/gizlilik' },
  openGraph: openGraphFor({
    title: 'Gizlilik ve KVKK Aydınlatma Metni',
    description,
    path: '/gizlilik',
  }),
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-9">
      <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      <div className="mt-4 grid gap-4 text-base leading-7 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Subsection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h3 className="font-heading text-xl font-semibold text-ink">{title}</h3>
      <div className="mt-3 grid gap-4">{children}</div>
    </section>
  );
}

function DetailList({ children }: { children: ReactNode }) {
  return (
    <ul className="grid list-disc gap-3 pl-5 marker:text-primary">
      {children}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="icerik">
        <section className="hero-surface border-b border-border">
          <div className="site-frame max-w-[1100px] py-10 lg:py-14">
            <Breadcrumbs
              items={[
                { label: 'Ana sayfa', href: '/' },
                { label: 'Gizlilik ve KVKK' },
              ]}
            />
            <p className="eyebrow mt-8">Site bildirimi</p>
            <h1 className="mt-4 max-w-3xl font-heading text-[clamp(2.35rem,5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
              Gizlilik ve KVKK
              <br />
              Aydınlatma Metni
            </h1>
            <p className="mt-5 text-sm font-medium text-muted-foreground">
              Kişisel veri ve çerez bildirimi · Son güncelleme: {updateDate}
            </p>
            <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">
              Bu sayfa, cevremevzuati.com&apos;u ziyaret ettiğinizde hangi
              kişisel verinin işlendiğini, kimin işlediğini, hangi amaçla ve
              hangi hukuki sebebe dayanarak işlendiğini, kime aktarıldığını, ne
              kadar saklandığını ve bu veriler üzerindeki haklarınızı anlatır.
            </p>
          </div>
        </section>

        <div className="site-frame max-w-[1100px] py-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <article className="grid min-w-0 gap-9">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: ShieldCheck,
                    label: 'Veri sorumlusu',
                    value: publisherName,
                  },
                  {
                    icon: Cookie,
                    label: 'Çerez',
                    value: 'Kullanılmaz',
                  },
                  {
                    icon: Server,
                    label: 'Altyapı ve ölçüm',
                    value: 'Vercel',
                  },
                  {
                    icon: Mail,
                    label: 'KVKK başvurusu',
                    value: publisherKvkkEmail,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="precision-card bg-card p-5">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <p className="eyebrow mt-4">{label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 text-base leading-7 text-muted-foreground">
                <p>
                  Bu metin, 6698 sayılı Kişisel Verilerin Korunması
                  Kanunu&apos;nun (Kanun) 10&apos;uncu maddesi ile Aydınlatma
                  Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar
                  Hakkında Tebliğ uyarınca hazırlanmıştır.
                </p>
                <p>
                  Bildirim iki katmanlıdır: her sayfanın altındaki kısa cümle
                  teknik veri işlemenin varlığını söyler; ayrıntı bu sayfadadır.
                  Sitedeki işleme açık rızaya dayanmaz. Bu nedenle sizden onay
                  istenmez ve bu sayfa bir onay formu içermez.
                </p>
              </div>

              <Section id="veri-sorumlusu" title="Veri sorumlusu">
                <p>
                  Bu sitede işlenen kişisel verilerin sorumlusu, Türkiye&apos;de
                  yerleşik{' '}
                  <a
                    href={publisherUrl}
                    target="_blank"
                    rel="noopener"
                    className={externalLinkClass}
                  >
                    {publisherName}
                  </a>
                  &apos;dir. Adres: {publisherAddress}. Kişisel verilerle ilgili
                  her türlü soru ve Kanun kapsamındaki başvurular için e-posta
                  adresi:{' '}
                  <a
                    href={`mailto:${publisherKvkkEmail}`}
                    className={externalLinkClass}
                  >
                    {publisherKvkkEmail}
                  </a>
                  .
                </p>
              </Section>

              <Section
                id="kapsam"
                title="Sitede kişisel veri işleyen ve işlemeyen bölümler"
              >
                <p>
                  Sitede üyelik, giriş, yorum, bülten kaydı, iletişim formu,
                  anket veya ödeme yoktur. Ziyaretçiden ad, e-posta veya başka
                  bir kimlik bilgisi istenmez.
                </p>
                <DetailList>
                  <li>
                    <strong className="text-ink">Tesisinize göre rota.</strong>{' '}
                    Verdiğiniz cevaplar tarayıcınızda değerlendirilir; sunucuya
                    ayrı bir form olarak gönderilmez ve kaydedilmez. Sonuç
                    bağlantısını paylaşabilmeniz için seçimler sayfa adresine
                    yazılabilir.
                  </li>
                  <li>
                    <strong className="text-ink">Arama ve filtreler.</strong>{' '}
                    Aradığınız kelime ve seçtiğiniz filtreler, sayfayla birlikte
                    tarayıcıya gelen dizin üzerinde eşleştirilir. Bu bilgiler
                    paylaşılabilir bir sonuç oluşturmak için sayfa adresine
                    yazılabilir. Adresi yeniler veya paylaşırsanız adresin sorgu
                    kısmı sunucu istek kaydına girebilir; Vercel Web
                    Analytics&apos;e gönderilen sayfa adresinden sorgu ve sayfa
                    parçası kaldırılır. Arama ve rota alanlarına kişisel veri,
                    ticari sır veya gizli bilgi yazmayın.
                  </li>
                  <li>
                    <strong className="text-ink">Tema tercihi.</strong> Açık,
                    koyu veya sistem temasını seçtiğinizde tercih yalnız kendi
                    tarayıcınızın yerel depolamasında saklanır. Sunucuya
                    gönderilmez, kimliğinizle ilişkilendirilmez ve tarayıcı
                    verilerini temizlediğinizde silinir.
                  </li>
                  <li>
                    <strong className="text-ink">
                      Mevzuat izleme sayfası.
                    </strong>{' '}
                    Yalnız sistemin güncel çalışma durumunu gösterir; ziyaretçi
                    verisini izleme servisine göndermez.
                  </li>
                </DetailList>
                <p>
                  Ziyaret sırasında kişisel veri üç kaynaktan işlenir. Her biri
                  için veri, toplama yöntemi, amaç, hukuki sebep, saklama süresi
                  ve alıcı aşağıda ayrı ayrı açıklanmıştır.
                </p>
              </Section>

              <Section id="veri-isleme" title="İşleme faaliyetleri">
                <Subsection id="ziyaret-olcumu" title="1. Ziyaret ölçümü">
                  <p>
                    Sitede{' '}
                    <a
                      href="https://vercel.com/docs/analytics/privacy-policy"
                      target="_blank"
                      rel="noopener"
                      className={externalLinkClass}
                    >
                      Vercel Web Analytics
                    </a>{' '}
                    çalışır.
                  </p>
                  <DetailList>
                    <li>
                      <strong className="text-ink">İşlenen veri.</strong>{' '}
                      Görüntüleme zamanı, açılan sayfanın adresi, geliş kaynağı,
                      IP adresinden türetilen ülke ve şehir düzeyinde konum,
                      cihaz türü, tarayıcı ve sürümü ile işletim sistemi ve
                      sürümü. Aynı ziyaretçinin bir gün içindeki sayfa
                      görüntülemelerini birleştirmek için gelen istekten
                      üretilen bir karma değer kullanılır; bu değer 24 saat
                      sonra sıfırlanır. IP adresi ölçüm verisiyle birlikte
                      saklanmaz; ad, e-posta veya siteler arası izleme
                      tanımlayıcısı toplanmaz.
                    </li>
                    <li>
                      <strong className="text-ink">Toplama yöntemi.</strong>{' '}
                      Tamamen otomatik; sayfayla birlikte yüklenen bir betik
                      aracılığıyla. Betik, sayfa adresinin sorgu dizesini ve
                      parçasını göndermeden önce kaldırır.
                    </li>
                    <li>
                      <strong className="text-ink">Amaç.</strong> Hangi mevzuat
                      kaydının ne kadar okunduğunu, ziyaretin hangi ülke ve
                      cihaz grubundan geldiğini toplu sayılar hâlinde görmek ve
                      içeriği buna göre düzenlemek. Veri tek bir ziyaretçiyi
                      izlemek için kullanılmaz.
                    </li>
                    <li>
                      <strong className="text-ink">Hukuki sebep.</strong> Kanun
                      m.5/2(f): ilgili kişinin temel hak ve özgürlüklerine zarar
                      vermemek kaydıyla, veri sorumlusunun meşru menfaatleri
                      için veri işlenmesinin zorunlu olması.
                    </li>
                    <li>
                      <strong className="text-ink">Saklama.</strong> Ölçüm
                      verisi, Vercel Pro planının raporlama penceresi olan 12 ay
                      boyunca panelde görüntülenir. Verinin Vercel tarafında
                      tamamen silinme süresini sağlayıcının kendi kuralları
                      belirler.
                    </li>
                    <li>
                      <strong className="text-ink">Alıcı.</strong> Vercel Inc.,
                      veri işleyen sıfatıyla.
                    </li>
                  </DetailList>
                </Subsection>

                <Subsection id="sunucu-kayitlari" title="2. Sunucu kayıtları">
                  <p>Site Vercel Inc. altyapısında barındırılır.</p>
                  <DetailList>
                    <li>
                      <strong className="text-ink">İşlenen veri.</strong> Her
                      istek için IP adresi, istek zamanı, istenen adres,
                      tarayıcı bilgisi, HTTP durum kodu ve isteğin işlendiği
                      bölge.
                    </li>
                    <li>
                      <strong className="text-ink">Toplama yöntemi.</strong>{' '}
                      Tamamen otomatik; sunucunun isteği karşılaması sırasında.
                    </li>
                    <li>
                      <strong className="text-ink">Amaç.</strong> Siteyi sunmak,
                      saldırı ve arızaları tespit etmek, güvenliği ve
                      sürekliliği sağlamak.
                    </li>
                    <li>
                      <strong className="text-ink">Hukuki sebep.</strong> Kanun
                      m.5/2(f), veri sorumlusunun meşru menfaati.
                    </li>
                    <li>
                      <strong className="text-ink">Saklama.</strong> Çalışma
                      zamanı istek kayıtları (Runtime Logs), Vercel Pro planında
                      panelde 1 gün erişilebilir kalır. Vercel&apos;in diğer
                      altyapı kayıtları için sağlayıcının kendi saklama
                      kuralları uygulanır. Yayımcı bu kayıtları dışarıya
                      aktarmaz.
                    </li>
                    <li>
                      <strong className="text-ink">Alıcı.</strong> Vercel Inc.,
                      veri işleyen sıfatıyla.
                    </li>
                  </DetailList>
                </Subsection>

                <Subsection id="yazisma" title="3. Bize yazdığınızda">
                  <p>
                    Künye sayfasındaki düzeltme ve iletişim bağlantısı{' '}
                    <a
                      href={`mailto:${publisherEmail}`}
                      className={externalLinkClass}
                    >
                      {publisherEmail}
                    </a>{' '}
                    adresine; bu sayfadaki KVKK başvuru bağlantısı{' '}
                    <a
                      href={`mailto:${publisherKvkkEmail}`}
                      className={externalLinkClass}
                    >
                      {publisherKvkkEmail}
                    </a>{' '}
                    adresine e-posta açar.
                  </p>
                  <DetailList>
                    <li>
                      <strong className="text-ink">İşlenen veri.</strong>{' '}
                      E-posta adresiniz, yazdıysanız adınız ve mesajınızın
                      içeriği.
                    </li>
                    <li>
                      <strong className="text-ink">Toplama yöntemi.</strong>{' '}
                      Sizin kendi isteğinizle iletmeniz.
                    </li>
                    <li>
                      <strong className="text-ink">Amaç.</strong> Bildirimi veya
                      başvuruyu değerlendirmek ve size cevap vermek.
                    </li>
                    <li>
                      <strong className="text-ink">Hukuki sebep.</strong>{' '}
                      Düzeltme bildirimlerinde Kanun m.5/2(f), veri sorumlusunun
                      meşru menfaati; Kanun kapsamındaki başvurularda Kanun
                      m.5/2(ç), veri sorumlusunun hukuki yükümlülüğünü yerine
                      getirmesi.
                    </li>
                    <li>
                      <strong className="text-ink">Saklama.</strong> Yazışma,
                      konu sonuçlandıktan sonra en geç bir yıl içinde silinir.
                      Adresiniz bir listeye eklenmez ve başka amaçla
                      kullanılmaz.
                    </li>
                    <li>
                      <strong className="text-ink">Alıcı.</strong>{' '}
                      {publisherName} ile şirketin kurumsal e-posta hizmetini
                      veren Microsoft (Microsoft 365), veri işleyen sıfatıyla.
                    </li>
                  </DetailList>
                </Subsection>
              </Section>

              <Section id="cerezler" title="Çerezler ve benzeri teknolojiler">
                <p>
                  Site çerez kullanmaz ve üçüncü taraf çerez yükleyen bir
                  bileşen içermez. Bu nedenle çerez onay penceresi gösterilmez.
                  Tema tercihi, yalnız tarayıcınızdaki yerel depolamada tutulur;
                  kimlik tespiti veya ziyaret ölçümü için kullanılmaz. Oturum
                  depolaması ya da cihaz parmak izi oluşturulmaz.
                </p>
                <p>
                  Vercel Web Analytics&apos;in ziyaretçi sayımı için kullandığı
                  karma değer tarayıcınıza yazılmaz; Vercel sunucusunda üretilir
                  ve 24 saat sonra sıfırlanır.
                </p>
              </Section>

              <Section id="aktarim" title="Alıcı grupları ve aktarım">
                <p>
                  Kişisel veri satılmaz, kiralanmaz; reklam veya pazarlama
                  amacıyla üçüncü taraflarla paylaşılmaz. Veri aktarılabilen
                  taraflar şunlardır:
                </p>
                <DetailList>
                  <li>
                    <strong className="text-ink">Vercel Inc.</strong> Barındırma
                    ve ziyaret ölçümü hizmetini verir. Veriyi bu hizmetleri
                    sunmak için ve veri işleyen sıfatıyla işler; alt
                    işleyenlerini{' '}
                    <a
                      href="https://security.vercel.com"
                      target="_blank"
                      rel="noopener"
                      className={externalLinkClass}
                    >
                      Vercel Güven Merkezi&apos;nde
                    </a>{' '}
                    yayımlar.
                  </li>
                  <li>
                    <strong className="text-ink">Microsoft.</strong> Şirketin
                    kurumsal e-posta hizmetini sağlar. Bize yazdığınızda
                    e-postanız Microsoft 365&apos;te tutulur ve hizmetin
                    sunulması için işlenir.
                  </li>
                  <li>
                    <strong className="text-ink">
                      Yetkili kamu makamları.
                    </strong>{' '}
                    Kanuna dayanan bir talep gelirse yalnız talebin kapsamıyla
                    sınırlı olarak.
                  </li>
                </DetailList>
              </Section>

              <Section id="yurt-disi" title="Yurt dışına aktarım">
                <p>
                  Vercel Inc. Amerika Birleşik Devletleri merkezlidir; ziyaret
                  ölçümü ve sunucu kayıtlarını Türkiye dışındaki sunucularında
                  işler. Bu aktarım Kanun&apos;un 9&apos;uncu maddesindeki yurt
                  dışına aktarım şartlarına tabidir. Vercel&apos;in{' '}
                  <a
                    href="https://vercel.com/legal/dpa"
                    target="_blank"
                    rel="noopener"
                    className={externalLinkClass}
                  >
                    veri işleme sözleşmesi
                  </a>{' '}
                  hizmetin kapsamını, güvenlik tedbirlerini ve alt işleyenleri
                  düzenler. Aktarılan veri, yukarıda sayılan ölçüm ve sunucu
                  kaydı verisiyle sınırlıdır.
                </p>
                <p>
                  E-posta yazışmaları Microsoft 365&apos;te tutulur. Microsoft
                  bu veriyi Türkiye dışındaki sunucularında kendi veri işleme
                  koşulları çerçevesinde işler; bu aktarım da Kanun&apos;un
                  9&apos;uncu maddesine tabidir.
                </p>
              </Section>

              <Section id="guvenlik" title="Veri güvenliği">
                <p>
                  Siteyle tarayıcınız arasındaki trafik HTTPS ile şifrelenir.
                  Sitede ziyaretçi bilgisi tutan bir kullanıcı veritabanı
                  yoktur. Vercel paneline erişim, yayımcının yetkili
                  personeliyle sınırlıdır ve hesap doğrulaması gerektirir.
                  Vercel&apos;in güvenlik önlemleri{' '}
                  <a
                    href="https://vercel.com/docs/security/compliance"
                    target="_blank"
                    rel="noopener"
                    className={externalLinkClass}
                  >
                    güvenlik ve uyum sayfasında
                  </a>{' '}
                  açıklanır.
                </p>
              </Section>

              <Section id="otomatik-karar" title="Otomatik karar ve profilleme">
                <p>
                  Ziyaretçi verisiyle otomatik karar alınmaz, kişi profili
                  çıkarılmaz ve içerik kişiye göre değiştirilmez. Her ziyaretçi
                  aynı içeriği görür.
                </p>
              </Section>

              <Section id="cocuklar" title="Çocuklar">
                <p>
                  Site çevre mevzuatı ve kurumsal yükümlülük konularını anlatır;
                  çocuklara yönelik değildir. Çocuklara ait olduğu bilinen
                  kişisel veri işlenmez. Böyle bir veri yanlışlıkla ulaşırsa
                  fark edildiği anda silinir.
                </p>
              </Section>

              <Section id="dis-baglantilar" title="Dış bağlantılar">
                <p>
                  Sitedeki kaynak bağlantıları başta Resmî Gazete ve Mevzuat
                  Bilgi Sistemi olmak üzere kamu kurumlarının ve ilgili resmî
                  kaynakların sayfalarına gider. Bağlantıya tıkladığınız andan
                  sonra ilgili sitenin kendi gizlilik kuralları geçerlidir.
                </p>
              </Section>

              <Section id="haklar" title="Haklarınız">
                <p>
                  Kanun&apos;un 11&apos;inci maddesi uyarınca şunları
                  isteyebilirsiniz:
                </p>
                <DetailList>
                  <li>Kişisel verinizin işlenip işlenmediğini öğrenmek.</li>
                  <li>İşlenmişse buna ilişkin bilgi almak.</li>
                  <li>
                    İşlenme amacını ve verinin amacına uygun kullanılıp
                    kullanılmadığını öğrenmek.
                  </li>
                  <li>
                    Yurt içinde veya yurt dışında verinin aktarıldığı üçüncü
                    kişileri bilmek.
                  </li>
                  <li>Eksik veya yanlış işlenmişse düzeltilmesini istemek.</li>
                  <li>
                    Kanun&apos;un 7&apos;nci maddesindeki şartlar çerçevesinde
                    silinmesini veya yok edilmesini istemek.
                  </li>
                  <li>
                    Düzeltme, silme ve yok etme işlemlerinin verinin aktarıldığı
                    üçüncü kişilere bildirilmesini istemek.
                  </li>
                  <li>
                    Yalnız otomatik sistemlerle yapılan bir analizin aleyhinize
                    sonuç doğurmasına itiraz etmek.
                  </li>
                  <li>
                    Kanuna aykırı işleme nedeniyle zarara uğradıysanız zararın
                    giderilmesini talep etmek.
                  </li>
                </DetailList>
              </Section>

              <Section id="basvuru" title="Başvuru nasıl yapılır">
                <p>
                  Başvurunuzu Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında
                  Tebliğ&apos;de sayılan yollarla, Türkçe yapabilirsiniz:{' '}
                  {publisherName}&apos;nin ticaret sicilinde kayıtlı adresine
                  yazılı başvuru; kayıtlı elektronik posta (KEP), güvenli
                  elektronik imza veya mobil imza. Bunlara ek olarak yayımcı,{' '}
                  <a
                    href={`mailto:${publisherKvkkEmail}`}
                    className={externalLinkClass}
                  >
                    {publisherKvkkEmail}
                  </a>{' '}
                  adresine gelen başvuruları da kabul eder ve aynı sürede
                  cevaplar. E-postada kimliğinizi doğrulamaya yetecek bilgi
                  bulunmalıdır.
                </p>
                <p>Başvuruda şu bilgiler bulunmalıdır:</p>
                <DetailList>
                  <li>Ad, soyad ve başvuru yazılı ise imza.</li>
                  <li>
                    Türkiye Cumhuriyeti vatandaşları için T.C. kimlik numarası;
                    yabancılar için uyruk, pasaport numarası veya varsa kimlik
                    numarası.
                  </li>
                  <li>Tebligata esas yerleşim yeri veya iş yeri adresi.</li>
                  <li>
                    Varsa bildirime esas e-posta adresi, telefon ve faks
                    numarası.
                  </li>
                  <li>Talep konusu.</li>
                </DetailList>
                <p>
                  Başvurular talebin niteliğine göre en kısa sürede ve en geç
                  otuz gün içinde ücretsiz sonuçlandırılır. Yazılı cevap on
                  sayfayı aşarsa Tebliğ&apos;in 7&apos;nci maddesindeki işlem
                  ücreti alınabilir. Başvurunuz reddedilir, cevap yetersiz
                  bulunur veya süresinde cevap verilmezse; cevabı öğrendiğiniz
                  tarihten itibaren otuz gün ve her hâlde başvuru tarihinden
                  itibaren altmış gün içinde Kişisel Verileri Koruma
                  Kurulu&apos;na şikâyet edebilirsiniz. Kurul&apos;a şikâyet
                  için önce veri sorumlusuna başvurmak zorunludur.
                </p>
              </Section>

              <Section
                id="turkiye-disi"
                title="Türkiye dışından ziyaret edenler"
              >
                <p>
                  Site Türkiye çevre mevzuatını anlatır ve Türkiye&apos;deki
                  kişilere yöneliktir. Başka bir ülkedeki kişileri hedeflemez,
                  davranışlarını izlemez ve onlara özel içerik sunmaz.
                  Yukarıdaki haklar ve başvuru yolu, siteyi nereden ziyaret
                  ederseniz edin aynıdır.
                </p>
              </Section>

              <Section id="degisiklikler" title="Değişiklikler ve dayanaklar">
                <p>
                  Bu sayfa değişirse başlığın altındaki tarih güncellenir. Ölçüm
                  aracı eklenir veya kaldırılırsa ya da veri Vercel dışında bir
                  sağlayıcıya taşınırsa bu metin aynı gün düzenlenir. Önemli bir
                  değişiklik sitede ayrıca duyurulur.
                </p>
                <p>
                  Bu metin sitenin genel bilgilendirme içeriğinden farklıdır;
                  yayımcının kendi veri işleme faaliyetine ilişkin beyanıdır.
                  Dayanaklar:{' '}
                  <a
                    href="https://www.kvkk.gov.tr/Icerik/4132/aydinlatma-yukumlulugunun-yerine-getirilmesinde-uyulacak-usul-ve-esaslar-hakkinda-teblig"
                    target="_blank"
                    rel="noopener"
                    className={externalLinkClass}
                  >
                    Aydınlatma Yükümlülüğü Tebliği
                  </a>
                  ,{' '}
                  <a
                    href="https://www.kvkk.gov.tr/Icerik/4109/Veri-Sorumlusuna-Basvuru-Usul-ve-Esaslari-Hakkinda-Teblig-Resmi-Gazetede-yayinlanmistir"
                    target="_blank"
                    rel="noopener"
                    className={externalLinkClass}
                  >
                    Veri Sorumlusuna Başvuru Tebliği
                  </a>{' '}
                  (RG 10.03.2018, 30356), 6698 sayılı Kanun (7499 sayılı Kanunla
                  değişik) ve{' '}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener"
                    className={externalLinkClass}
                  >
                    Vercel gizlilik bildirimi
                  </a>
                  .
                </p>
                <p>
                  Sitenin amacı ve genel iletişim bilgileri için{' '}
                  <Link href="/kunye" className={externalLinkClass}>
                    Künye ve iletişim
                  </Link>{' '}
                  sayfasına bakabilirsiniz.
                </p>
              </Section>
            </article>

            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <nav
                aria-label="Gizlilik metni içindekiler"
                className="border-l border-border pl-5"
              >
                <p className="eyebrow">Bu sayfada</p>
                <ol className="mt-4 grid gap-3 text-sm leading-5 text-muted-foreground">
                  {[
                    ['#veri-sorumlusu', 'Veri sorumlusu'],
                    ['#kapsam', 'Sitedeki işlemler'],
                    ['#veri-isleme', 'İşleme faaliyetleri'],
                    ['#cerezler', 'Çerezler'],
                    ['#aktarim', 'Alıcılar ve aktarım'],
                    ['#yurt-disi', 'Yurt dışına aktarım'],
                    ['#guvenlik', 'Veri güvenliği'],
                    ['#haklar', 'Haklarınız'],
                    ['#basvuru', 'Başvuru yolu'],
                    ['#degisiklikler', 'Dayanaklar'],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <a href={href} className="hover:text-ink hover:underline">
                        {label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
