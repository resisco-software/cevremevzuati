export type Category = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  external?: boolean;
  href?: string;
};

export type Legislation = {
  slug: string;
  title: string;
  type: 'Kanun' | 'Yönetmelik';
  categories: string[];
  publicationDate: string;
  publicationLabel: string;
  gazetteNumber: string;
  sourceUrl: string;
  consolidatedUrl?: string;
  summary: string;
  status: 'Yürürlükte';
  checkedAt: string;
  changes?: Array<{
    date: string;
    label: string;
    sourceUrl: string;
  }>;
};

export type GlossaryEntry = {
  term: string;
  definition: string;
  source: string;
  article: string;
  sourceUrl: string;
  tags: string[];
};

export const categories: Category[] = [
  {
    id: 'kurulus',
    label: 'Kuruluş, değişiklik ve kapanış',
    shortLabel: 'ÇED ve kuruluş',
    description: 'ÇED, kapasite artışı, alan genişlemesi ve faaliyet sonlandırma kayıtları.',
  },
  {
    id: 'izin',
    label: 'Çevre izni, lisansı ve yönetimi',
    shortLabel: 'İzin ve lisans',
    description: 'Çevre izin ve lisans süreçlerinin dayandığı düzenlemeler.',
  },
  {
    id: 'hava',
    label: 'Hava, emisyon ve koku',
    shortLabel: 'Hava ve emisyon',
    description: 'Sanayi kaynaklı emisyonlar, hava kalitesi, ölçüm ve izleme düzenlemeleri.',
  },
  {
    id: 'su',
    label: 'Su, atıksu ve deşarj',
    shortLabel: 'Su ve atıksu',
    description: 'Alıcı ortam, kanalizasyon, deşarj ve su kalitesi düzenlemeleri.',
  },
  {
    id: 'atik',
    label: 'Atık ve döngüsellik',
    shortLabel: 'Atık',
    description: 'Genel atık yönetimi, sıfır atık ve özel atık akışları.',
  },
  {
    id: 'toprak',
    label: 'Toprak ve kirlenmiş sahalar',
    shortLabel: 'Toprak',
    description: 'Noktasal kaynaklı kirlenmiş sahalar ve toprak koruma düzenlemeleri.',
  },
  {
    id: 'gurultu',
    label: 'Çevresel gürültü ve titreşim',
    shortLabel: 'Gürültü',
    description: 'Çevresel gürültü kaynakları, ölçüm ve kontrol düzenlemeleri.',
  },
  {
    id: 'kimyasal',
    label: 'Kimyasallar ve endüstriyel kazalar',
    shortLabel: 'Kimyasallar',
    description: 'Kimyasal kayıt, sınıflandırma ve büyük endüstriyel kaza düzenlemeleri.',
  },
  {
    id: 'deniz',
    label: 'Deniz ve kıyı',
    shortLabel: 'Deniz ve kıyı',
    description: 'Kıyı veya denizle ilişkili tesisleri ilgilendiren çevre düzenlemeleri.',
  },
  {
    id: 'doga',
    label: 'Doğa ve korunan alanlar',
    shortLabel: 'Doğa',
    description: 'Konuma bağlı korunan alan, sulak alan ve tabiat varlığı düzenlemeleri.',
  },
  {
    id: 'entegre',
    label: 'Entegre sanayi ve raporlama',
    shortLabel: 'Entegre sanayi',
    description: 'Endüstriyel emisyonlar ile kirletici salım ve taşıma kaydı düzenlemeleri.',
  },
];

export const legislation: Legislation[] = [
  {
    slug: 'cevre-kanunu-2872',
    title: '2872 sayılı Çevre Kanunu',
    type: 'Kanun',
    categories: ['kurulus', 'izin', 'hava', 'su', 'atik', 'toprak', 'gurultu', 'deniz', 'doga', 'entegre'],
    publicationDate: '1983-08-11',
    publicationLabel: '11 Ağustos 1983',
    gazetteNumber: '18132',
    sourceUrl: 'https://www.resmigazete.gov.tr/arsiv/18132.pdf',
    consolidatedUrl: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.2872.pdf',
    summary: 'Çevrenin korunmasına ilişkin temel kanuni çerçeveyi içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'ced-yonetmeligi',
    title: 'Çevresel Etki Değerlendirmesi Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['kurulus'],
    publicationDate: '2022-07-29',
    publicationLabel: '29 Temmuz 2022',
    gazetteNumber: '31907',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2022/07/20220729-2.htm',
    summary: 'Gerçekleştirilmesi planlanan projelerin çevresel etki değerlendirmesine ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
    changes: [
      {
        date: '5 Mart 2026',
        label: 'Çevresel Etki Değerlendirmesi Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmelik',
        sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2026/03/20260305-3.htm',
      },
    ],
  },
  {
    slug: 'cevre-izin-ve-lisans-yonetmeligi',
    title: 'Çevre İzin ve Lisans Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['izin', 'hava', 'su', 'gurultu', 'atik'],
    publicationDate: '2014-09-10',
    publicationLabel: '10 Eylül 2014',
    gazetteNumber: '29115',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2014/09/20140910-4.htm',
    summary: 'Çevre izni ve çevre lisansına tabi işletmelere ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'cevre-yonetimi-hizmetleri',
    title: 'Çevre Yönetimi Hizmetleri Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['izin'],
    publicationDate: '2022-11-01',
    publicationLabel: '1 Kasım 2022',
    gazetteNumber: '32000',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2022/11/20221101-11.htm',
    summary: 'Çevre yönetimi hizmetlerinin yürütülmesine ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'cevre-denetimi-yonetmeligi',
    title: 'Çevre Denetimi Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['izin'],
    publicationDate: '2021-06-12',
    publicationLabel: '12 Haziran 2021',
    gazetteNumber: '31509',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2021/06/20210612-5.htm',
    summary: 'Çevre denetimlerinin usul ve esaslarına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'endustriyel-emisyonlarin-yonetimi',
    title: 'Endüstriyel Emisyonların Yönetimi Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['entegre', 'hava', 'su'],
    publicationDate: '2025-01-14',
    publicationLabel: '14 Ocak 2025',
    gazetteNumber: '32782',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/01/20250114-1.htm',
    summary: 'Endüstriyel emisyonların entegre biçimde önlenmesi ve kontrolüne ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'kstk-yonetmeligi',
    title: 'Kirletici Salım ve Taşıma Kaydı Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['entegre'],
    publicationDate: '2021-12-04',
    publicationLabel: '4 Aralık 2021',
    gazetteNumber: '31679',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2021/12/20211204-1.htm',
    summary: 'Kirletici salım ve taşıma kaydının oluşturulmasına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'skhkky',
    title: 'Sanayi Kaynaklı Hava Kirliliğinin Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['hava'],
    publicationDate: '2009-07-03',
    publicationLabel: '3 Temmuz 2009',
    gazetteNumber: '27277',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2009/07/20090703-20.htm',
    summary: 'Sanayi ve enerji üretim tesislerinden kaynaklanan hava emisyonlarına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'hava-kalitesi-degerlendirme-ve-yonetimi',
    title: 'Hava Kalitesi Değerlendirme ve Yönetimi Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['hava'],
    publicationDate: '2008-06-06',
    publicationLabel: '6 Haziran 2008',
    gazetteNumber: '26898',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2008/06/20080606-6.htm',
    summary: 'Hava kalitesinin değerlendirilmesi ve yönetimine ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'su-kirliligi-kontrolu',
    title: 'Su Kirliliği Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['su'],
    publicationDate: '2004-12-31',
    publicationLabel: '31 Aralık 2004',
    gazetteNumber: '25687',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2004/12/20041231.htm#9',
    summary: 'Su kirliliğinin önlenmesi ve su kaynaklarının korunmasına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atik-yonetimi',
    title: 'Atık Yönetimi Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['atik'],
    publicationDate: '2015-04-02',
    publicationLabel: '2 Nisan 2015',
    gazetteNumber: '29314',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2015/04/20150402-2.htm',
    summary: 'Atıkların oluşumundan bertarafına kadar yönetimine ilişkin genel düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'sifir-atik',
    title: 'Sıfır Atık Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['atik'],
    publicationDate: '2019-07-12',
    publicationLabel: '12 Temmuz 2019',
    gazetteNumber: '30829',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2019/07/20190712-9.htm',
    summary: 'Sıfır atık yönetim sisteminin kurulması ve belgelendirilmesine ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'toprak-kirliligi-kontrolu',
    title: 'Toprak Kirliliğinin Kontrolü ve Noktasal Kaynaklı Kirlenmiş Sahalara Dair Yönetmelik',
    type: 'Yönetmelik',
    categories: ['toprak'],
    publicationDate: '2010-06-08',
    publicationLabel: '8 Haziran 2010',
    gazetteNumber: '27605',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2010/06/20100608-3.htm',
    summary: 'Toprak kirliliğinin kontrolü ve kirlenmiş sahalara ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'cevresel-gurultu-kontrolu',
    title: 'Çevresel Gürültü Kontrol Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['gurultu'],
    publicationDate: '2022-11-30',
    publicationLabel: '30 Kasım 2022',
    gazetteNumber: '32029',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2022/11/20221130-1.htm',
    summary: 'Çevresel gürültünün kontrolüne ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'kkdik',
    title: 'Kimyasalların Kaydı, Değerlendirilmesi, İzni ve Kısıtlanması Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['kimyasal'],
    publicationDate: '2017-06-23',
    publicationLabel: '23 Haziran 2017',
    gazetteNumber: '30105 (Mükerrer)',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2017/06/20170623M1-18.htm',
    summary: 'Kimyasalların kaydı, değerlendirilmesi, izni ve kısıtlanmasına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
    changes: [
      {
        date: '23 Aralık 2023',
        label: 'KKDİK Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmelik',
        sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2023/12/20231223-9.htm',
      },
    ],
  },
  {
    slug: 'sea-yonetmeligi',
    title: 'Maddelerin ve Karışımların Sınıflandırılması, Etiketlenmesi ve Ambalajlanması Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['kimyasal'],
    publicationDate: '2013-12-11',
    publicationLabel: '11 Aralık 2013',
    gazetteNumber: '28848 (Mükerrer)',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2013/12/20131211M1-1.htm',
    summary: 'Madde ve karışımların sınıflandırılması, etiketlenmesi ve ambalajlanmasına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'buyuk-endustriyel-kazalar',
    title: 'Büyük Endüstriyel Kazaların Önlenmesi ve Etkilerinin Azaltılması Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['kimyasal'],
    publicationDate: '2019-03-02',
    publicationLabel: '2 Mart 2019',
    gazetteNumber: '30702',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2019/03/20190302-1.htm',
    summary: 'Tehlikeli maddeler içeren kuruluşlardaki büyük endüstriyel kazalara ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
];

export const glossary: GlossaryEntry[] = [
  {
    term: 'Alıcı ortam',
    definition: 'Atıksuların boşaltıldığı veya dolaylı olarak karıştığı göl, akarsu, kıyı ve deniz suları ile yeraltı suları.',
    source: 'Su Kirliliği Kontrolü Yönetmeliği',
    article: 'Madde 3',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2004/12/20041231.htm#9',
    tags: ['Su', 'Atıksu'],
  },
  {
    term: 'Atık',
    definition: 'Herhangi bir faaliyet sonucunda oluşan, çevreye atılan veya bırakılan her türlü madde.',
    source: '2872 sayılı Çevre Kanunu',
    article: 'Madde 2',
    sourceUrl: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.2872.pdf',
    tags: ['Atık'],
  },
  {
    term: 'Atıksu',
    definition: 'Evsel, endüstriyel, tarımsal ve diğer kullanımlar sonucunda kirlenmiş veya özellikleri değişmiş sular.',
    source: 'Su Kirliliği Kontrolü Yönetmeliği',
    article: 'Madde 3',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2004/12/20041231.htm#9',
    tags: ['Su', 'Atıksu'],
  },
  {
    term: 'Çevre izni',
    definition: 'Çevre Kanunu uyarınca alınması gereken; hava emisyonu, çevresel gürültü, atıksu deşarjı ve derin deniz deşarjı konularından en az birini içeren izin.',
    source: 'Çevre İzin ve Lisans Yönetmeliği',
    article: 'Madde 4',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2014/09/20140910-4.htm',
    tags: ['İzin', 'Hava', 'Su', 'Gürültü'],
  },
  {
    term: 'Çevresel etki değerlendirmesi',
    definition: 'Planlanan projelerin çevreye olabilecek olumlu ve olumsuz etkilerinin belirlenmesi için yürütülen çalışmalar.',
    source: 'Çevresel Etki Değerlendirmesi Yönetmeliği',
    article: 'Madde 4',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2022/07/20220729-2.htm',
    tags: ['ÇED', 'Kuruluş'],
  },
  {
    term: 'Emisyon',
    definition: 'Yakıt ve benzerlerinin yanmasıyla veya üretim işlemleri sonucunda havaya yayılan kirleticiler.',
    source: 'Sanayi Kaynaklı Hava Kirliliğinin Kontrolü Yönetmeliği',
    article: 'Madde 3',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2009/07/20090703-20.htm',
    tags: ['Hava', 'Emisyon'],
  },
  {
    term: 'İşletmeci',
    definition: 'Tesisi işleten veya kontrol eden gerçek veya tüzel kişi.',
    source: 'Endüstriyel Emisyonların Yönetimi Yönetmeliği',
    article: 'Madde 4',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/01/20250114-1.htm',
    tags: ['Entegre sanayi'],
  },
  {
    term: 'Kirletici',
    definition: 'Çevre üzerinde olumsuz etkiye yol açabilecek madde, titreşim, ısı veya gürültü.',
    source: 'Endüstriyel Emisyonların Yönetimi Yönetmeliği',
    article: 'Madde 4',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/01/20250114-1.htm',
    tags: ['Entegre sanayi', 'Hava', 'Su'],
  },
];

export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}

export function getLegislation(slug: string) {
  return legislation.find((item) => item.slug === slug);
}
