export type Category = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  subtopics: string[];
  external?: boolean;
  href?: string;
};

export type Legislation = {
  slug: string;
  title: string;
  type: 'Kanun' | 'Yönetmelik' | 'Tebliğ' | 'Genelge';
  categories: string[];
  foundation?: boolean;
  publicationDate: string;
  publicationLabel: string;
  gazetteNumber: string;
  sourceUrl: string;
  consolidatedUrl?: string;
  summary: string;
  status: 'Yürürlükte' | 'Kaynak kaydı' | 'Yürürlükten kaldırıldı';
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
    description:
      'ÇED, kapasite artışı, alan genişlemesi ve faaliyet sonlandırma kayıtları.',
    subtopics: [
      'ÇED proje listeleri',
      'Kapasite artışı ve değişiklik',
      'Stratejik çevresel değerlendirme',
      'Faaliyet sonlandırma',
    ],
  },
  {
    id: 'izin',
    label: 'Çevre izni, lisansı ve yönetimi',
    shortLabel: 'İzin ve lisans',
    description: 'Çevre izin ve lisans süreçlerinin dayandığı düzenlemeler.',
    subtopics: [
      'Çevre izni',
      'Çevre lisansı',
      'Çevre yönetimi hizmetleri',
      'Denetim ve yaptırım',
    ],
  },
  {
    id: 'hava',
    label: 'Hava, emisyon ve koku',
    shortLabel: 'Hava ve emisyon',
    description:
      'Sanayi kaynaklı emisyonlar, hava kalitesi, ölçüm ve izleme düzenlemeleri.',
    subtopics: [
      'Proses emisyonları',
      'Yakma tesisleri',
      'Toz, VOC ve koku',
      'Sürekli emisyon ölçümü',
    ],
  },
  {
    id: 'su',
    label: 'Su kaynakları, havzalar ve verimlilik',
    shortLabel: 'Su kaynakları',
    description:
      'Yerüstü ve yeraltı suyu, havza koruma, su kalitesi ve verimlilik düzenlemeleri.',
    subtopics: [
      'Yerüstü su kalitesi',
      'Yeraltı suları',
      'Havza koruma',
      'Su verimliliği ve yeniden kullanım',
    ],
  },
  {
    id: 'atiksu',
    label: 'Atıksu, altyapı ve deşarj',
    shortLabel: 'Atıksu ve deşarj',
    description:
      'Proses atıksuyu, kanal bağlantısı, arıtma, alıcı ortam ve deşarj düzenlemeleri.',
    subtopics: [
      'Kanal bağlantısı',
      'Alıcı ortama deşarj',
      'Atıksu arıtma',
      'Derin deniz deşarjı',
      'Sürekli atıksu izleme',
    ],
  },
  {
    id: 'atik',
    label: 'Atık ve döngüsellik',
    shortLabel: 'Atık',
    description: 'Genel atık yönetimi, sıfır atık ve özel atık akışları.',
    subtopics: [
      'Atık kodları ve sınıflandırma',
      'Geçici depolama ve taşıma',
      'Geri kazanım ve bertaraf',
      'Yakma ve düzenli depolama',
    ],
  },
  {
    id: 'urun',
    label: 'Ürünler ve özel atık akışları',
    shortLabel: 'Ürün ve özel akışlar',
    description:
      'Piyasaya arz edilen ürünler ile ambalaj, yağ, lastik, araç, pil ve elektronik eşya akışları.',
    subtopics: [
      'Ambalajlar',
      'Elektrikli ve elektronik eşya',
      'Pil ve akümülatörler',
      'Yağ, lastik ve araçlar',
      'GEKAP',
    ],
  },
  {
    id: 'toprak',
    label: 'Toprak ve kirlenmiş sahalar',
    shortLabel: 'Toprak',
    description:
      'Noktasal kaynaklı kirlenmiş sahalar ve toprak koruma düzenlemeleri.',
    subtopics: [
      'Kirlenmiş sahalar',
      'Depolama tankları ve sızıntı',
      'Saha temizleme',
      'Arıtma çamurlarının kullanımı',
    ],
  },
  {
    id: 'gurultu',
    label: 'Çevresel gürültü ve titreşim',
    shortLabel: 'Gürültü',
    description: 'Çevresel gürültü kaynakları, ölçüm ve kontrol düzenlemeleri.',
    subtopics: [
      'Endüstriyel gürültü',
      'Titreşim',
      'Akustik rapor',
      'Ölçüm ve kontrol',
    ],
  },
  {
    id: 'kimyasal',
    label: 'Kimyasallar ve endüstriyel kazalar',
    shortLabel: 'Kimyasallar',
    description:
      'Kimyasal kayıt, sınıflandırma ve büyük endüstriyel kaza düzenlemeleri.',
    subtopics: [
      'KKDİK ve tonaj',
      'SEA sınıflandırması',
      'Güvenlik bilgi formları',
      'Kalıcı organik kirleticiler',
      'Büyük endüstriyel kazalar',
    ],
  },
  {
    id: 'deniz',
    label: 'Deniz ve kıyı',
    shortLabel: 'Deniz ve kıyı',
    description:
      'Kıyı veya denizle ilişkili tesisleri ilgilendiren çevre düzenlemeleri.',
    subtopics: [
      'Gemi atıkları',
      'Petrol ve zararlı maddeler',
      'Dip tarama',
      'Balık çiftlikleri',
      'Kıyı alanları',
    ],
  },
  {
    id: 'doga',
    label: 'Doğa ve korunan alanlar',
    shortLabel: 'Doğa',
    description:
      'Konuma bağlı korunan alan, sulak alan ve tabiat varlığı düzenlemeleri.',
    subtopics: [
      'Korunan alanlar',
      'Sulak alanlar',
      'Orman alanları',
      'Tabiat varlıkları',
    ],
  },
  {
    id: 'maden',
    label: 'Madencilik ve saha rehabilitasyonu',
    shortLabel: 'Madencilik',
    description:
      'Maden atıkları, ocak ve cevher hazırlama tesisleri ile doğaya yeniden kazandırma düzenlemeleri.',
    subtopics: [
      'Maden atıkları',
      'Ocak ve cevher hazırlama',
      'Pasa ve depolama tesisleri',
      'Doğaya yeniden kazandırma',
    ],
  },
  {
    id: 'entegre',
    label: 'Entegre sanayi ve raporlama',
    shortLabel: 'Entegre sanayi',
    description:
      'Endüstriyel emisyonlar ile kirletici salım ve taşıma kaydı düzenlemeleri.',
    subtopics: [
      'Entegre çevre izni',
      'Mevcut en iyi teknikler',
      'Yeşil dönüşüm belgesi',
      'Kirletici salım ve taşıma kaydı',
    ],
  },
  {
    id: 'olcum',
    label: 'Ölçüm, izleme ve laboratuvar',
    shortLabel: 'Ölçüm ve izleme',
    description:
      'Çevre ölçüm laboratuvarları, numune alma ve sürekli izleme sistemleri düzenlemeleri.',
    subtopics: [
      'Laboratuvar yeterliği',
      'Emisyon ölçümleri',
      'Atıksu numune ve analizleri',
      'Sürekli izleme sistemleri',
    ],
  },
];

export const legislation: Legislation[] = [
  {
    slug: 'cevre-kanunu-2872',
    title: '2872 sayılı Çevre Kanunu',
    type: 'Kanun',
    categories: [],
    foundation: true,
    publicationDate: '1983-08-11',
    publicationLabel: '11 Ağustos 1983',
    gazetteNumber: '18132',
    sourceUrl: 'https://www.resmigazete.gov.tr/arsiv/18132.pdf',
    consolidatedUrl: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.2872.pdf',
    summary:
      'Çevrenin korunmasına ilişkin temel kanuni çerçeveyi içeren düzenleme.',
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
    summary:
      'Gerçekleştirilmesi planlanan projelerin çevresel etki değerlendirmesine ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
    changes: [
      {
        date: '5 Mart 2026',
        label:
          'Çevresel Etki Değerlendirmesi Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmelik',
        sourceUrl:
          'https://www.resmigazete.gov.tr/eskiler/2026/03/20260305-3.htm',
      },
    ],
  },
  {
    slug: 'cevre-izin-ve-lisans-yonetmeligi',
    title: 'Çevre İzin ve Lisans Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['izin', 'hava', 'atiksu', 'gurultu', 'atik', 'olcum'],
    publicationDate: '2014-09-10',
    publicationLabel: '10 Eylül 2014',
    gazetteNumber: '29115',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2014/09/20140910-4.htm',
    summary:
      'Çevre izni ve çevre lisansına tabi işletmelere ilişkin düzenleme.',
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
    categories: ['entegre', 'hava', 'su', 'atiksu', 'olcum'],
    publicationDate: '2025-01-14',
    publicationLabel: '14 Ocak 2025',
    gazetteNumber: '32782',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/01/20250114-1.htm',
    summary:
      'Endüstriyel emisyonların entegre biçimde önlenmesi ve kontrolüne ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'kstk-yonetmeligi',
    title: 'Kirletici Salım ve Taşıma Kaydı Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['entegre', 'olcum'],
    publicationDate: '2021-12-04',
    publicationLabel: '4 Aralık 2021',
    gazetteNumber: '31679',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2021/12/20211204-1.htm',
    summary:
      'Kirletici salım ve taşıma kaydının oluşturulmasına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'skhkky',
    title: 'Sanayi Kaynaklı Hava Kirliliğinin Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['hava', 'olcum'],
    publicationDate: '2009-07-03',
    publicationLabel: '3 Temmuz 2009',
    gazetteNumber: '27277',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2009/07/20090703-20.htm',
    summary:
      'Sanayi ve enerji üretim tesislerinden kaynaklanan hava emisyonlarına ilişkin düzenleme.',
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
    summary:
      'Hava kalitesinin değerlendirilmesi ve yönetimine ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'su-kirliligi-kontrolu',
    title: 'Su Kirliliği Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['su', 'atiksu', 'olcum'],
    publicationDate: '2004-12-31',
    publicationLabel: '31 Aralık 2004',
    gazetteNumber: '25687',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2004/12/20041231.htm#9',
    summary:
      'Su kirliliğinin önlenmesi ve su kaynaklarının korunmasına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atik-yonetimi',
    title: 'Atık Yönetimi Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['atik', 'urun'],
    publicationDate: '2015-04-02',
    publicationLabel: '2 Nisan 2015',
    gazetteNumber: '29314',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2015/04/20150402-2.htm',
    summary:
      'Atıkların oluşumundan bertarafına kadar yönetimine ilişkin genel düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'sifir-atik',
    title: 'Sıfır Atık Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['atik', 'urun'],
    publicationDate: '2019-07-12',
    publicationLabel: '12 Temmuz 2019',
    gazetteNumber: '30829',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2019/07/20190712-9.htm',
    summary:
      'Sıfır atık yönetim sisteminin kurulması ve belgelendirilmesine ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'toprak-kirliligi-kontrolu',
    title:
      'Toprak Kirliliğinin Kontrolü ve Noktasal Kaynaklı Kirlenmiş Sahalara Dair Yönetmelik',
    type: 'Yönetmelik',
    categories: ['toprak'],
    publicationDate: '2010-06-08',
    publicationLabel: '8 Haziran 2010',
    gazetteNumber: '27605',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2010/06/20100608-3.htm',
    summary:
      'Toprak kirliliğinin kontrolü ve kirlenmiş sahalara ilişkin düzenleme.',
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
    title:
      'Kimyasalların Kaydı, Değerlendirilmesi, İzni ve Kısıtlanması Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['kimyasal'],
    publicationDate: '2017-06-23',
    publicationLabel: '23 Haziran 2017',
    gazetteNumber: '30105 (Mükerrer)',
    sourceUrl:
      'https://www.resmigazete.gov.tr/eskiler/2017/06/20170623M1-18.htm',
    summary:
      'Kimyasalların kaydı, değerlendirilmesi, izni ve kısıtlanmasına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
    changes: [
      {
        date: '23 Aralık 2023',
        label: 'KKDİK Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmelik',
        sourceUrl:
          'https://www.resmigazete.gov.tr/eskiler/2023/12/20231223-9.htm',
      },
    ],
  },
  {
    slug: 'sea-yonetmeligi',
    title:
      'Maddelerin ve Karışımların Sınıflandırılması, Etiketlenmesi ve Ambalajlanması Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['kimyasal'],
    publicationDate: '2013-12-11',
    publicationLabel: '11 Aralık 2013',
    gazetteNumber: '28848 (Mükerrer)',
    sourceUrl:
      'https://www.resmigazete.gov.tr/eskiler/2013/12/20131211M1-1.htm',
    summary:
      'Madde ve karışımların sınıflandırılması, etiketlenmesi ve ambalajlanmasına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'buyuk-endustriyel-kazalar',
    title:
      'Büyük Endüstriyel Kazaların Önlenmesi ve Etkilerinin Azaltılması Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['kimyasal'],
    publicationDate: '2019-03-02',
    publicationLabel: '2 Mart 2019',
    gazetteNumber: '30702',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2019/03/20190302-1.htm',
    summary:
      'Tehlikeli maddeler içeren kuruluşlardaki büyük endüstriyel kazalara ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'stratejik-cevresel-degerlendirme',
    title: 'Stratejik Çevresel Değerlendirme Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['kurulus', 'doga'],
    publicationDate: '2017-04-08',
    publicationLabel: '8 Nisan 2017',
    gazetteNumber: '30032',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2017/04/20170408.pdf',
    summary:
      'Plan ve programlar için stratejik çevresel değerlendirme kayıtlarını içeren düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'koku-emisyonlari-kontrolu',
    title: 'Koku Oluşturan Emisyonların Kontrolü Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['hava', 'olcum'],
    publicationDate: '2013-07-19',
    publicationLabel: '19 Temmuz 2013',
    gazetteNumber: '28712',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2013/07/20130719.pdf',
    summary:
      'Koku oluşturan faaliyet ve tesislere ilişkin kontrol hükümlerini içeren düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'buyuk-yakma-tesisleri',
    title: 'Büyük Yakma Tesisleri Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['hava', 'entegre', 'olcum'],
    publicationDate: '2010-06-08',
    publicationLabel: '8 Haziran 2010',
    gazetteNumber: '27605',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2010/06/20100608.pdf',
    summary:
      'Büyük yakma tesislerine ilişkin tarihsel düzenleme ve sürüm kaydı.',
    status: 'Yürürlükten kaldırıldı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'benzin-nafta-voc',
    title:
      'Benzin ve Naftanın Depolanması ve Dağıtılmasından Kaynaklanan Uçucu Organik Bileşik Emisyonlarının Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['hava', 'kimyasal', 'olcum'],
    publicationDate: '2018-12-05',
    publicationLabel: '5 Aralık 2018',
    gazetteNumber: '30616',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2018/12/20181205.pdf',
    summary:
      'Benzin ve nafta depolama ile dağıtım faaliyetlerindeki uçucu organik bileşik emisyonlarına ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'su-verimliligi',
    title: 'Su Verimliliği Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['su', 'atiksu', 'entegre'],
    publicationDate: '2024-12-27',
    publicationLabel: '27 Aralık 2024',
    gazetteNumber: '32765',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2024/12/20241227.pdf',
    summary:
      'Su verimliliği sistemleri, planları ve belgelendirme kayıtlarını içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'yerustu-su-kalitesi',
    title: 'Yerüstü Su Kalitesi Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['su', 'atiksu', 'olcum'],
    publicationDate: '2012-11-30',
    publicationLabel: '30 Kasım 2012',
    gazetteNumber: '28483',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2012/11/20121130.pdf',
    summary:
      'Yerüstü sularının kalite sınıfları, hedefleri ve izlenmesine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'yeralti-sularinin-korunmasi',
    title:
      'Yeraltı Sularının Kirlenmeye ve Bozulmaya Karşı Korunması Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['su', 'toprak', 'olcum'],
    publicationDate: '2012-04-07',
    publicationLabel: '7 Nisan 2012',
    gazetteNumber: '28257',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2012/04/20120407.pdf',
    summary:
      'Yeraltı sularının kirlenme ve bozulmaya karşı korunmasına ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'kentsel-atiksu-aritimi',
    title: 'Kentsel Atıksu Arıtımı Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['atiksu', 'olcum'],
    publicationDate: '2006-01-08',
    publicationLabel: '8 Ocak 2006',
    gazetteNumber: '26047',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2006/01/20060108.pdf',
    summary:
      'Kentsel atıksuların toplanması, arıtılması ve deşarjına ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atiksu-toplama-uzaklastirma',
    title: 'Atıksu Toplama ve Uzaklaştırma Sistemleri Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['atiksu', 'olcum'],
    publicationDate: '2017-01-06',
    publicationLabel: '6 Ocak 2017',
    gazetteNumber: '29940',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2017/01/20170106.pdf',
    summary:
      'Atıksu toplama ve uzaklaştırma sistemlerinin planlanmasına ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atiklarin-duzenli-depolanmasi',
    title: 'Atıkların Düzenli Depolanmasına Dair Yönetmelik',
    type: 'Yönetmelik',
    categories: ['atik', 'toprak', 'olcum'],
    publicationDate: '2010-03-26',
    publicationLabel: '26 Mart 2010',
    gazetteNumber: '27533',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2010/03/20100326.pdf',
    summary:
      'Atıkların düzenli depolama tesislerinde yönetimine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atiklarin-yakilmasi',
    title: 'Atıkların Yakılmasına İlişkin Yönetmelik',
    type: 'Yönetmelik',
    categories: ['atik', 'hava', 'entegre', 'olcum'],
    publicationDate: '2010-10-06',
    publicationLabel: '6 Ekim 2010',
    gazetteNumber: '27721',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2010/10/20101006.pdf',
    summary: 'Atık yakma ve beraber yakma tesislerine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'ambalaj-atiklarinin-kontrolu',
    title: 'Ambalaj Atıklarının Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['urun', 'atik'],
    publicationDate: '2021-06-26',
    publicationLabel: '26 Haziran 2021',
    gazetteNumber: '31523',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2021/06/20210626.pdf',
    summary:
      'Ambalajların piyasaya arzı ve ambalaj atıklarının yönetimine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atik-yaglarin-yonetimi',
    title: 'Atık Yağların Yönetimi Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['urun', 'atik'],
    publicationDate: '2019-12-21',
    publicationLabel: '21 Aralık 2019',
    gazetteNumber: '30985',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2019/12/20191221.pdf',
    summary:
      'Atık yağların oluşumundan işlenmesine kadar yönetimine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'tibbi-atiklarin-kontrolu',
    title: 'Tıbbi Atıkların Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['atik'],
    publicationDate: '2017-01-25',
    publicationLabel: '25 Ocak 2017',
    gazetteNumber: '29959',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2017/01/20170125.pdf',
    summary:
      'Tıbbi atıkların ayrı toplanması, taşınması ve işlenmesine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'omrunu-tamamlamis-lastikler',
    title: 'Ömrünü Tamamlamış Lastiklerin Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['urun', 'atik'],
    publicationDate: '2006-11-25',
    publicationLabel: '25 Kasım 2006',
    gazetteNumber: '26357',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2006/11/20061125.pdf',
    summary:
      'Ömrünü tamamlamış lastiklerin toplanması ve yönetimine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'omrunu-tamamlamis-araclar',
    title: 'Ömrünü Tamamlamış Araçların Kontrolü Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['urun', 'atik'],
    publicationDate: '2009-12-30',
    publicationLabel: '30 Aralık 2009',
    gazetteNumber: '27448',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2009/12/20091230.pdf',
    summary:
      'Ömrünü tamamlamış araçların teslimi, arındırılması ve işlenmesine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'maden-atiklari',
    title: 'Maden Atıkları Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['maden', 'atik', 'toprak', 'atiksu'],
    publicationDate: '2015-07-15',
    publicationLabel: '15 Temmuz 2015',
    gazetteNumber: '29417',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2015/07/20150715.pdf',
    summary:
      'Madenlerin aranması, çıkarılması ve işlenmesinden kaynaklanan atıkların yönetimine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'madencilik-dogaya-yeniden-kazandirma',
    title:
      'Madencilik Faaliyetleri ile Bozulan Arazilerin Doğaya Yeniden Kazandırılması Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['maden', 'doga', 'toprak', 'kurulus'],
    publicationDate: '2010-01-23',
    publicationLabel: '23 Ocak 2010',
    gazetteNumber: '27471',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2010/01/20100123.pdf',
    summary:
      'Madencilik faaliyetlerinden etkilenen arazilerin yeniden kazandırılmasına ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'gemilerden-atik-alinmasi',
    title: 'Gemilerden Atık Alınması ve Atıkların Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['deniz', 'atik'],
    publicationDate: '2004-12-26',
    publicationLabel: '26 Aralık 2004',
    gazetteNumber: '25682',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2004/12/20041226.pdf',
    summary:
      'Gemilerden atık alınması, atık kabul tesisleri ve atıkların yönetimine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'dip-tarama-malzemesi',
    title: 'Dip Tarama Malzemesinin Çevresel Yönetimi Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['deniz', 'atik', 'olcum'],
    publicationDate: '2020-01-14',
    publicationLabel: '14 Ocak 2020',
    gazetteNumber: '31008',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2020/01/20200114.pdf',
    summary:
      'Dip tarama faaliyetleri ve malzemesinin çevresel yönetimine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'hafriyat-insaat-yikinti-atiklari',
    title:
      'Hafriyat Toprağı, İnşaat ve Yıkıntı Atıklarının Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['atik', 'toprak', 'kurulus'],
    publicationDate: '2004-03-18',
    publicationLabel: '18 Mart 2004',
    gazetteNumber: '25406',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2004/03/20040318.pdf',
    summary:
      'Hafriyat toprağı ile inşaat ve yıkıntı atıklarının yönetimine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'cevre-olcum-analiz-laboratuvarlari',
    title: 'Çevre Ölçüm ve Analiz Laboratuvarları Yeterlik Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['olcum', 'hava', 'atiksu', 'toprak'],
    publicationDate: '2013-12-25',
    publicationLabel: '25 Aralık 2013',
    gazetteNumber: '28862',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2013/12/20131225.pdf',
    summary:
      'Çevre ölçüm ve analiz laboratuvarlarının yeterliğine ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atiksu-aritma-teknik-usuller',
    title: 'Atıksu Arıtma Tesisleri Teknik Usuller Tebliği',
    type: 'Tebliğ',
    categories: ['atiksu', 'olcum'],
    publicationDate: '2010-03-20',
    publicationLabel: '20 Mart 2010',
    gazetteNumber: '27527',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2010/03/20100320.pdf',
    summary:
      'Atıksu arıtma tesislerinin teknoloji seçimi ve teknik usullerine ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'surekli-atiksu-izleme-sistemleri',
    title: 'Sürekli Atıksu İzleme Sistemleri Tebliği',
    type: 'Tebliğ',
    categories: ['atiksu', 'olcum'],
    publicationDate: '2015-03-22',
    publicationLabel: '22 Mart 2015',
    gazetteNumber: '29303',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2015/03/20150322.pdf',
    summary:
      'Sürekli atıksu izleme sistemlerinin kurulması ve işletilmesine ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'surekli-emisyon-olcum-sistemleri',
    title: 'Sürekli Emisyon Ölçüm Sistemleri Tebliği',
    type: 'Tebliğ',
    categories: ['hava', 'olcum'],
    publicationDate: '2011-10-12',
    publicationLabel: '12 Ekim 2011',
    gazetteNumber: '28082',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2011/10/20111012.pdf',
    summary:
      'Sürekli emisyon ölçüm sistemlerinin kurulması ve kalite güvencesine ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atik-on-islem-geri-kazanim-tesisleri',
    title:
      'Atık Ön İşlem ve Geri Kazanım Tesislerinin Genel Esaslarına İlişkin Yönetmelik',
    type: 'Yönetmelik',
    categories: ['atik', 'izin', 'olcum'],
    publicationDate: '2021-10-09',
    publicationLabel: '9 Ekim 2021',
    gazetteNumber: '31623',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2021/10/20211009.pdf',
    summary:
      'Atık ön işlem ve geri kazanım tesislerinin genel ve teknik esaslarına ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'aeee-yonetimi',
    title:
      'Atık Elektrikli ve Elektronik Eşyaların Yönetimi Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['urun', 'atik'],
    publicationDate: '2022-12-26',
    publicationLabel: '26 Aralık 2022',
    gazetteNumber: '32055',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2022/12/20221226.pdf',
    summary:
      'Elektrikli ve elektronik eşyalar ile bunlardan kaynaklanan atıkların yönetimine ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'elektronik-esya-zararli-madde-kisitlamasi',
    title:
      'Elektrikli ve Elektronik Eşyalarda Bazı Zararlı Maddelerin Kullanımının Kısıtlanmasına İlişkin Yönetmelik',
    type: 'Yönetmelik',
    categories: ['urun', 'kimyasal'],
    publicationDate: '2022-12-26',
    publicationLabel: '26 Aralık 2022',
    gazetteNumber: '32055',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2022/12/20221226.pdf',
    summary:
      'Elektrikli ve elektronik eşyalarda belirli zararlı maddelerin kullanımına ilişkin kısıtlamaları içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'zararli-kimyasallar-ihracat-ithalat',
    title:
      'Bazı Zararlı Kimyasalların İhracatı ve İthalatı Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['kimyasal', 'urun'],
    publicationDate: '2023-01-28',
    publicationLabel: '28 Ocak 2023',
    gazetteNumber: '32087',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2023/01/20230128.pdf',
    summary:
      'Belirli zararlı kimyasalların ihracatı ve ithalatına ilişkin usulleri içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'tersane-tekne-imal-cekevleri',
    title:
      'Tersane, Tekne İmal ve Çekek Yerlerinin Çevresel Yönetimi Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['deniz', 'atik', 'hava', 'atiksu'],
    publicationDate: '2022-12-07',
    publicationLabel: '7 Aralık 2022',
    gazetteNumber: '32036',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2022/12/20221207.pdf',
    summary:
      'Tersane, tekne imal ve çekek yerlerinin çevresel yönetimine ilişkin düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atiksu-aritma-enerji-tesviki',
    title: 'Atıksu Arıtma Tesisi Enerji Teşviki Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['atiksu', 'olcum'],
    publicationDate: '2023-11-11',
    publicationLabel: '11 Kasım 2023',
    gazetteNumber: '32366',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2023/11/20231111.pdf',
    summary:
      'Atıksu arıtma tesislerinin enerji gideri teşvikine ilişkin usul ve esasları içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'atik-pil-akumulator-kontrolu',
    title: 'Atık Pil ve Akümülatörlerin Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['urun', 'atik'],
    publicationDate: '2004-08-31',
    publicationLabel: '31 Ağustos 2004',
    gazetteNumber: '25569',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2004/08/20040831.pdf',
    summary:
      'Pil ve akümülatörler ile bunlardan kaynaklanan atıkların kontrolüne ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'bitkisel-atik-yaglarin-kontrolu',
    title: 'Bitkisel Atık Yağların Kontrolü Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['urun', 'atik'],
    publicationDate: '2015-06-06',
    publicationLabel: '6 Haziran 2015',
    gazetteNumber: '29378',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2015/06/20150606.pdf',
    summary:
      'Bitkisel atık yağların toplanması, taşınması ve geri kazanımına ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'gekap-yonetmeligi',
    title: 'Geri Kazanım Katılım Payına İlişkin Yönetmelik',
    type: 'Yönetmelik',
    categories: ['urun', 'atik'],
    publicationDate: '2019-12-31',
    publicationLabel: '31 Aralık 2019',
    gazetteNumber: '30995',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2019/12/20191231-7.htm',
    summary:
      'Geri kazanım katılım payına tabi ürünler ve uygulama esaslarına ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'pcb-pct-kontrolu',
    title:
      'Poliklorlu Bifenil ve Poliklorlu Terfenillerin Kontrolü Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['kimyasal', 'atik', 'urun'],
    publicationDate: '2007-12-27',
    publicationLabel: '27 Aralık 2007',
    gazetteNumber: '26739',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2007/12/20071227.pdf',
    summary:
      'PCB ve PCT içeren madde ve ekipmanların yönetimine ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'icme-kullanma-suyu-havzalari',
    title: 'İçme-Kullanma Suyu Havzalarının Korunmasına Dair Yönetmelik',
    type: 'Yönetmelik',
    categories: ['su', 'atiksu', 'doga'],
    publicationDate: '2017-10-28',
    publicationLabel: '28 Ekim 2017',
    gazetteNumber: '30224',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2017/10/20171028.pdf',
    summary:
      'İçme-kullanma suyu temin edilen havzaların korunmasına ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'sulak-alanlarin-korunmasi',
    title: 'Sulak Alanların Korunması Yönetmeliği',
    type: 'Yönetmelik',
    categories: ['doga', 'su', 'kurulus'],
    publicationDate: '2014-04-04',
    publicationLabel: '4 Nisan 2014',
    gazetteNumber: '28962',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2014/04/20140404-11.htm',
    summary:
      'Sulak alanların korunması ve bu alanlarla ilişkili faaliyetlere ilişkin düzenleme.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'korunan-alanlarda-planlama',
    title: 'Korunan Alanlarda Yapılacak Planlara Dair Yönetmelik',
    type: 'Yönetmelik',
    categories: ['doga', 'kurulus'],
    publicationDate: '2012-03-23',
    publicationLabel: '23 Mart 2012',
    gazetteNumber: '28242',
    sourceUrl:
      'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=15988&MevzuatTur=7&MevzuatTertip=5',
    summary:
      'Korunan alanlarda hazırlanacak planların usul ve esaslarına ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'korunan-alanlar-tespit-tescil',
    title:
      'Korunan Alanların Tespit, Tescil ve Onayına İlişkin Usul ve Esaslara Dair Yönetmelik',
    type: 'Yönetmelik',
    categories: ['doga', 'kurulus'],
    publicationDate: '2012-07-19',
    publicationLabel: '19 Temmuz 2012',
    gazetteNumber: '28358',
    sourceUrl:
      'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=23605&MevzuatTur=7&MevzuatTertip=5',
    summary:
      'Korunan alanların tespit, tescil ve onay süreçlerine ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'kalici-organik-kirleticiler',
    title: 'Kalıcı Organik Kirleticiler Hakkında Yönetmelik',
    type: 'Yönetmelik',
    categories: ['kimyasal', 'atik', 'olcum'],
    publicationDate: '2018-11-14',
    publicationLabel: '14 Kasım 2018',
    gazetteNumber: '30595',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2018/11/20181114.pdf',
    summary:
      'Kalıcı organik kirleticilerin üretimi, piyasaya arzı, kullanımı ve yönetimine ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'bekra-guvenlik-raporu-tebligi',
    title:
      'Büyük Endüstriyel Kazalarla İlgili Hazırlanacak Güvenlik Raporu Tebliği',
    type: 'Tebliğ',
    categories: ['kimyasal'],
    publicationDate: '2019-04-19',
    publicationLabel: '19 Nisan 2019',
    gazetteNumber: '30750',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2019/04/20190419.pdf',
    summary:
      'Büyük endüstriyel kaza riski bulunan kuruluşların güvenlik raporlarına ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'bekra-onleme-politikasi-tebligi',
    title:
      'Büyük Endüstriyel Kazalarla İlgili Hazırlanacak Büyük Kaza Önleme Politikası Belgesi Tebliği',
    type: 'Tebliğ',
    categories: ['kimyasal'],
    publicationDate: '2019-04-19',
    publicationLabel: '19 Nisan 2019',
    gazetteNumber: '30750',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2019/04/20190419.pdf',
    summary:
      'Büyük kaza önleme politikası belgesinin hazırlanmasına ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'bekra-kaza-senaryosu-tebligi',
    title:
      'Büyük Endüstriyel Kazalarla İlgili Hazırlanacak Büyük Kaza Senaryo Dokümanı Tebliği',
    type: 'Tebliğ',
    categories: ['kimyasal'],
    publicationDate: '2020-06-30',
    publicationLabel: '30 Haziran 2020',
    gazetteNumber: '31171',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2020/06/20200630.pdf',
    summary:
      'Büyük kaza senaryo dokümanının hazırlanmasına ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'bekra-dahili-acil-durum-tebligi',
    title:
      'Büyük Endüstriyel Kazalarda Uygulanacak Dahili Acil Durum Planları Hakkında Tebliğ',
    type: 'Tebliğ',
    categories: ['kimyasal'],
    publicationDate: '2020-08-15',
    publicationLabel: '15 Ağustos 2020',
    gazetteNumber: '31214',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2020/08/20200815.pdf',
    summary:
      'Büyük endüstriyel kazalara yönelik dahili acil durum planlarının hazırlanmasına ilişkin kaynak kaydı.',
    status: 'Kaynak kaydı',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'met-enerji-uretimi',
    title: 'Enerji Üretiminde Mevcut En İyi Teknikler Tebliği',
    type: 'Tebliğ',
    categories: ['entegre', 'hava', 'su', 'atiksu', 'olcum'],
    publicationDate: '2025-11-30',
    publicationLabel: '30 Kasım 2025',
    gazetteNumber: '33093',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/11/20251130.pdf',
    summary:
      'Enerji üretimi faaliyetlerine ilişkin mevcut en iyi teknikleri içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'met-metal-uretimi',
    title: 'Metal Üretimi ve İşlenmesinde Mevcut En İyi Teknikler Tebliği',
    type: 'Tebliğ',
    categories: ['entegre', 'hava', 'su', 'atiksu', 'atik', 'olcum'],
    publicationDate: '2025-11-30',
    publicationLabel: '30 Kasım 2025',
    gazetteNumber: '33093',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/11/20251130.pdf',
    summary:
      'Metal üretimi ve işlenmesi faaliyetlerine ilişkin mevcut en iyi teknikleri içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'met-mineral-endustrisi',
    title: 'Mineral Endüstrisinde Mevcut En İyi Teknikler Tebliği',
    type: 'Tebliğ',
    categories: ['entegre', 'hava', 'atik', 'olcum'],
    publicationDate: '2025-11-30',
    publicationLabel: '30 Kasım 2025',
    gazetteNumber: '33093',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/11/20251130.pdf',
    summary:
      'Mineral endüstrisi faaliyetlerine ilişkin mevcut en iyi teknikleri içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'met-kimya-endustrisi',
    title: 'Kimya Endüstrisinde Mevcut En İyi Teknikler Tebliği',
    type: 'Tebliğ',
    categories: [
      'entegre',
      'kimyasal',
      'hava',
      'su',
      'atiksu',
      'atik',
      'olcum',
    ],
    publicationDate: '2025-11-30',
    publicationLabel: '30 Kasım 2025',
    gazetteNumber: '33093',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/11/20251130.pdf',
    summary:
      'Kimya endüstrisi faaliyetlerine ilişkin mevcut en iyi teknikleri içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'met-atik-isleme',
    title: 'Atık İşleme Sektörüne İlişkin Mevcut En İyi Teknikler Tebliği',
    type: 'Tebliğ',
    categories: ['entegre', 'atik', 'hava', 'atiksu', 'olcum'],
    publicationDate: '2025-11-30',
    publicationLabel: '30 Kasım 2025',
    gazetteNumber: '33093',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/11/20251130.pdf',
    summary:
      'Atık işleme sektörü faaliyetlerine ilişkin mevcut en iyi teknikleri içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
  {
    slug: 'met-diger-uretim-faaliyetleri',
    title:
      'Diğer Üretim Faaliyetlerine İlişkin Mevcut En İyi Teknikler Tebliği',
    type: 'Tebliğ',
    categories: ['entegre', 'hava', 'su', 'atiksu', 'atik', 'olcum'],
    publicationDate: '2025-11-30',
    publicationLabel: '30 Kasım 2025',
    gazetteNumber: '33093',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2025/11/20251130.pdf',
    summary:
      'Diğer üretim faaliyetlerine ilişkin mevcut en iyi teknikleri içeren düzenleme.',
    status: 'Yürürlükte',
    checkedAt: '2 Eylül 2026',
  },
];

export const glossary: GlossaryEntry[] = [
  {
    term: 'Alıcı ortam',
    definition:
      'Atıksuların boşaltıldığı veya dolaylı olarak karıştığı göl, akarsu, kıyı ve deniz suları ile yeraltı suları.',
    source: 'Su Kirliliği Kontrolü Yönetmeliği',
    article: 'Madde 3',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2004/12/20041231.htm#9',
    tags: ['Su', 'Atıksu'],
  },
  {
    term: 'Atık',
    definition:
      'Herhangi bir faaliyet sonucunda oluşan, çevreye atılan veya bırakılan her türlü madde.',
    source: '2872 sayılı Çevre Kanunu',
    article: 'Madde 2',
    sourceUrl: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.2872.pdf',
    tags: ['Atık'],
  },
  {
    term: 'Atıksu',
    definition:
      'Evsel, endüstriyel, tarımsal ve diğer kullanımlar sonucunda kirlenmiş veya özellikleri değişmiş sular.',
    source: 'Su Kirliliği Kontrolü Yönetmeliği',
    article: 'Madde 3',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2004/12/20041231.htm#9',
    tags: ['Su', 'Atıksu'],
  },
  {
    term: 'Çevre izni',
    definition:
      'Çevre Kanunu uyarınca alınması gereken; hava emisyonu, çevresel gürültü, atıksu deşarjı ve derin deniz deşarjı konularından en az birini içeren izin.',
    source: 'Çevre İzin ve Lisans Yönetmeliği',
    article: 'Madde 4',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2014/09/20140910-4.htm',
    tags: ['İzin', 'Hava', 'Su', 'Gürültü'],
  },
  {
    term: 'Çevresel etki değerlendirmesi',
    definition:
      'Planlanan projelerin çevreye olabilecek olumlu ve olumsuz etkilerinin belirlenmesi için yürütülen çalışmalar.',
    source: 'Çevresel Etki Değerlendirmesi Yönetmeliği',
    article: 'Madde 4',
    sourceUrl: 'https://www.resmigazete.gov.tr/eskiler/2022/07/20220729-2.htm',
    tags: ['ÇED', 'Kuruluş'],
  },
  {
    term: 'Emisyon',
    definition:
      'Yakıt ve benzerlerinin yanmasıyla veya üretim işlemleri sonucunda havaya yayılan kirleticiler.',
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
    definition:
      'Çevre üzerinde olumsuz etkiye yol açabilecek madde, titreşim, ısı veya gürültü.',
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
