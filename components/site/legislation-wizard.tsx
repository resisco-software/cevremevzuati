'use client';

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Info,
  Layers3,
  Plus,
  Printer,
  RotateCcw,
  ScanSearch,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Link from '@/components/site/safe-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { ExternalLink } from '@/components/site/external-link';
import { categoryIcons } from '@/lib/category-icons';
import {
  categories,
  getLegislation,
  legislation,
} from '@/lib/legislation-data';

type Option = { id: string; label: string; topics: string[]; slugs: string[] };

/** Proses ve çevresel çıkış koşulları. Her koşul en az bir kayda bağlıdır. */
const featureOptions: Option[] = [
  {
    id: 'air-source',
    label: 'Yakma, proses bacası, toz veya VOC kaynağı var',
    topics: ['hava', 'entegre', 'olcum'],
    slugs: ['skhkky', 'hava-kalitesi-degerlendirme-ve-yonetimi'],
  },
  {
    id: 'odour',
    label: 'Koku oluşturan proses veya koku şikayeti var',
    topics: ['hava', 'olcum'],
    slugs: ['koku-emisyonlari-kontrolu'],
  },
  {
    id: 'heating-plant',
    label: 'Isınma amaçlı kazan veya yakma sistemi var',
    topics: ['hava'],
    slugs: ['isinmadan-kaynaklanan-hava-kirliligi'],
  },
  {
    id: 'fuel-storage',
    label: 'Benzin, nafta veya akaryakıt depolama ve dolum var',
    topics: ['hava', 'kimyasal'],
    slugs: ['benzin-nafta-voc'],
  },
  {
    id: 'wastewater',
    label: 'Proses atıksuyu oluşuyor veya arıtma tesisi var',
    topics: ['atiksu', 'su', 'olcum'],
    slugs: [
      'su-kirliligi-kontrolu',
      'atiksu-aritma-teknik-usuller',
      'surekli-atiksu-izleme-sistemleri',
      'atiksu-aritma-enerji-tesviki',
    ],
  },
  {
    id: 'sewer-discharge',
    label: 'Kanalizasyona veya altyapı sistemine deşarj var',
    topics: ['atiksu', 'su'],
    slugs: ['kentsel-atiksu-aritimi', 'atiksu-toplama-uzaklastirma'],
  },
  {
    id: 'direct-discharge',
    label: 'Alıcı ortama veya denize doğrudan deşarj var',
    topics: ['atiksu', 'su', 'deniz'],
    slugs: [
      'su-kirliligi-kontrolu',
      'yerustu-su-kalitesi',
      'surekli-atiksu-izleme-sistemleri',
    ],
  },
  {
    id: 'hazardous-water',
    label: 'Atıksuda tehlikeli madde bulunma olasılığı var',
    topics: ['atiksu', 'su', 'kimyasal'],
    slugs: ['tehlikeli-maddeler-su-kirliligi'],
  },
  {
    id: 'sludge',
    label: 'Arıtma çamuru oluşuyor',
    topics: ['atiksu', 'toprak', 'atik'],
    slugs: ['aritma-camurlarinin-topraktakullanimi'],
  },
  {
    id: 'water-use',
    label: 'Su tüketimi yüksek veya su verimliliği hedefi var',
    topics: ['su', 'atiksu', 'entegre'],
    slugs: ['su-verimliligi'],
  },
  {
    id: 'waste-storage',
    label: 'Tesiste atık oluşuyor veya geçici depolanıyor',
    topics: ['atik', 'urun'],
    slugs: ['atik-yonetimi', 'atik-ara-depolama-tesisleri'],
  },
  {
    id: 'waste-transport',
    label: 'Atık karayoluyla tesis dışına gönderiliyor',
    topics: ['atik', 'olcum'],
    slugs: ['atiklarin-karayolunda-tasinmasi'],
  },
  {
    id: 'waste-treatment',
    label: 'Atık toplama, geri kazanım veya bertaraf faaliyeti var',
    topics: ['atik', 'izin', 'entegre'],
    slugs: [
      'atik-on-islem-geri-kazanim-tesisleri',
      'atiklarin-duzenli-depolanmasi',
      'kompost-tebligi',
      'mekanik-ayirma-biyokurutma',
      'atik-getirme-merkezi',
      'met-atik-isleme',
    ],
  },
  {
    id: 'waste-incineration',
    label: 'Atık yakılıyor veya yakıt/hammadde olarak beraber yakılıyor',
    topics: ['atik', 'hava', 'entegre'],
    slugs: ['atiklarin-yakilmasi', 'atiktan-turetilmis-yakit'],
  },
  {
    id: 'canteen',
    label: 'Yemekhane veya mutfak var',
    topics: ['atik', 'urun'],
    slugs: ['bitkisel-atik-yaglarin-kontrolu'],
  },
  {
    id: 'medical-unit',
    label: 'Revir veya sağlık birimi var',
    topics: ['atik'],
    slugs: ['tibbi-atiklarin-kontrolu'],
  },
  {
    id: 'construction',
    label: 'İnşaat, yıkım veya kazı faaliyeti var',
    topics: ['atik', 'toprak', 'kurulus'],
    slugs: ['hafriyat-insaat-yikinti-atiklari'],
  },
  {
    id: 'product-role',
    label:
      'Ambalajlı ürün, yağ, lastik, araç, pil veya elektronik eşya piyasaya arz ediliyor',
    topics: ['urun', 'atik'],
    slugs: [
      'ambalaj-atiklarinin-kontrolu',
      'gekap-yonetmeligi',
      'atik-yaglarin-yonetimi',
      'atik-pil-akumulator-kontrolu',
      'aeee-yonetimi',
      'elektronik-esya-zararli-madde-kisitlamasi',
      'omrunu-tamamlamis-lastikler',
      'omrunu-tamamlamis-araclar',
    ],
  },
  {
    id: 'lubricants',
    label: 'Madeni yağ kullanılıyor, atık yağ oluşuyor',
    topics: ['urun', 'atik'],
    slugs: ['atik-yaglarin-yonetimi'],
  },
  {
    id: 'chemicals',
    label: 'Kimyasal imalatı, ithalatı, kullanımı veya depolaması var',
    topics: ['kimyasal', 'urun'],
    slugs: [
      'kkdik',
      'sea-yonetmeligi',
      'zararli-kimyasallar-ihracat-ithalat',
      'kalici-organik-kirleticiler',
    ],
  },
  {
    id: 'hazardous-inventory',
    label: 'Tehlikeli madde envanteri veya büyük kaza riski var',
    topics: ['kimyasal'],
    slugs: [
      'buyuk-endustriyel-kazalar',
      'bekra-guvenlik-raporu-tebligi',
      'bekra-onleme-politikasi-tebligi',
      'bekra-kaza-senaryosu-tebligi',
      'bekra-dahili-acil-durum-tebligi',
    ],
  },
  {
    id: 'pcb',
    label: 'Trafo, kondansatör veya eski yağlı ekipman var',
    topics: ['kimyasal', 'atik'],
    slugs: ['pcb-pct-kontrolu'],
  },
  {
    id: 'land-risk',
    label: 'Yeraltı tankı, dökülme/sızıntı veya geçmiş saha kullanımı var',
    topics: ['toprak', 'su'],
    slugs: ['toprak-kirliligi-kontrolu'],
  },
  {
    id: 'noise-source',
    label: 'Endüstriyel gürültü veya titreşim kaynağı var',
    topics: ['gurultu'],
    slugs: ['cevresel-gurultu-kontrolu'],
  },
  {
    id: 'mining',
    label: 'Maden, taş ocağı, cevher hazırlama veya pasa faaliyeti var',
    topics: ['maden', 'toprak', 'doga'],
    slugs: ['maden-atiklari', 'madencilik-dogaya-yeniden-kazandirma'],
  },
  {
    id: 'coastal-activity',
    label: 'Liman, gemi, dip tarama veya tersane faaliyeti var',
    topics: ['deniz'],
    slugs: [
      'gemilerden-atik-alinmasi',
      'dip-tarama-malzemesi',
      'tersane-tekne-imal-cekevleri',
      'deniz-kirliligi-mudahale-kanunu-5312',
    ],
  },
  {
    id: 'aquaculture',
    label: 'Denizde su ürünleri yetiştiriciliği var',
    topics: ['deniz', 'doga'],
    slugs: ['balik-ciftlikleri-hassas-alan'],
  },
  {
    id: 'protected-proximity',
    label: 'Korunan alan, millî park veya tabiat koruma alanıyla ilişkili',
    topics: ['doga', 'kurulus'],
    slugs: [
      'korunan-alanlarda-planlama',
      'korunan-alanlar-tespit-tescil',
      'milli-parklar-kanunu-2873',
    ],
  },
  {
    id: 'wetland',
    label: 'Sulak alan veya tampon bölgesiyle ilişkili',
    topics: ['doga', 'su'],
    slugs: ['sulak-alanlarin-korunmasi'],
  },
  {
    id: 'natural-asset',
    label: 'Sit alanı veya tescilli tabiat varlığıyla ilişkili',
    topics: ['doga', 'kurulus'],
    slugs: ['kultur-tabiat-varliklari-2863'],
  },
  {
    id: 'planning',
    label: 'Yeni plan veya program hazırlanıyor',
    topics: ['kurulus', 'doga'],
    slugs: ['stratejik-cevresel-degerlendirme'],
  },
  {
    id: 'measurement',
    label: 'Çevre laboratuvarı ya da sürekli ölçüm sistemi var',
    topics: ['olcum', 'hava', 'atiksu'],
    slugs: [
      'cevre-olcum-analiz-laboratuvarlari',
      'surekli-emisyon-olcum-sistemleri',
      'surekli-atiksu-izleme-sistemleri',
    ],
  },
  {
    id: 'reporting',
    label: 'Yıllık kirletici salım veya beyan yükümlülüğü olabilir',
    topics: ['entegre', 'olcum'],
    slugs: ['kstk-yonetmeligi'],
  },
];

/** Konum koşulları. Hepsi bir kayda veya açık bir uyarıya bağlıdır. */
const locationOptions: Option[] = [
  {
    id: 'osb',
    label: 'Organize sanayi bölgesinde',
    topics: [],
    slugs: ['atiksu-toplama-uzaklastirma', 'kentsel-atiksu-aritimi'],
  },
  {
    id: 'coast',
    label: 'Kıyı veya denizle ilişkili',
    topics: [],
    slugs: [
      'kiyi-kanunu-3621',
      'gemilerden-atik-alinmasi',
      'dip-tarama-malzemesi',
      'tersane-tekne-imal-cekevleri',
    ],
  },
  {
    id: 'protected',
    label: 'Korunan alanla ilişkili olabilir',
    topics: [],
    slugs: [
      'ced-yonetmeligi',
      'korunan-alanlarda-planlama',
      'korunan-alanlar-tespit-tescil',
      'milli-parklar-kanunu-2873',
      'kultur-tabiat-varliklari-2863',
    ],
  },
  {
    id: 'water-basin',
    label: 'İçme suyu havzası veya su kaynağıyla ilişkili',
    topics: [],
    slugs: [
      'icme-kullanma-suyu-havzalari',
      'su-kirliligi-kontrolu',
      'yerustu-su-kalitesi',
    ],
  },
  {
    id: 'groundwater',
    label: 'Yeraltı suyu kullanımı veya kuyusu var',
    topics: [],
    slugs: ['yeralti-sularinin-korunmasi', '167-yeralti-sulari-kanunu'],
  },
  {
    id: 'forest',
    label: 'Orman alanı veya yakın çevresiyle ilişkili',
    topics: [],
    slugs: ['orman-kanunu-6831', 'madencilik-dogaya-yeniden-kazandirma'],
  },
  {
    id: 'wetland-area',
    label: 'Sulak alan sınırı veya tampon bölgesinde',
    topics: [],
    slugs: ['sulak-alanlarin-korunmasi'],
  },
];

const stageOptions: { id: string; label: string; slugs: string[] }[] = [
  { id: 'belirsiz', label: 'Henüz seçmedim / bilmiyorum', slugs: [] },
  {
    id: 'planlama',
    label: 'Planlama / yeni kuruluş',
    slugs: ['ced-yonetmeligi', 'stratejik-cevresel-degerlendirme'],
  },
  {
    id: 'faaliyette',
    label: 'Faaliyette',
    slugs: ['cevre-denetimi-yonetmeligi', 'cevre-yonetimi-hizmetleri'],
  },
  {
    id: 'degisiklik',
    label: 'Kapasite veya proses değişikliği',
    slugs: ['ced-yonetmeligi', 'cevre-izin-ve-lisans-yonetmeligi'],
  },
  {
    id: 'devir',
    label: 'Devir / işletmeci değişikliği',
    slugs: ['cevre-izin-ve-lisans-yonetmeligi', 'cevre-yonetimi-hizmetleri'],
  },
  {
    id: 'kapanis',
    label: 'Faaliyet sonlandırma',
    slugs: [
      'toprak-kirliligi-kontrolu',
      'madencilik-dogaya-yeniden-kazandirma',
      'hafriyat-insaat-yikinti-atiklari',
    ],
  },
];

const sectorOptions: { id: string; label: string; slugs: string[] }[] = [
  { id: 'belirsiz', label: 'Faaliyet grubunu seçin', slugs: [] },
  {
    id: 'genel',
    label: 'Genel imalat sanayii',
    slugs: ['met-diger-uretim-faaliyetleri'],
  },
  {
    id: 'mineral',
    label: 'Çimento, kireç, cam ve seramik',
    slugs: [
      'skhkky',
      'endustriyel-emisyonlarin-yonetimi',
      'met-mineral-endustrisi',
      'kstk-yonetmeligi',
    ],
  },
  {
    id: 'metal',
    label: 'Metal üretimi ve işleme',
    slugs: [
      'endustriyel-emisyonlarin-yonetimi',
      'met-metal-uretimi',
      'kkdik',
      'kstk-yonetmeligi',
    ],
  },
  {
    id: 'kimya',
    label: 'Kimya ve petrokimya',
    slugs: [
      'kkdik',
      'sea-yonetmeligi',
      'buyuk-endustriyel-kazalar',
      'met-kimya-endustrisi',
      'kstk-yonetmeligi',
    ],
  },
  {
    id: 'enerji',
    label: 'Enerji üretimi',
    slugs: [
      'skhkky',
      'endustriyel-emisyonlarin-yonetimi',
      'met-enerji-uretimi',
      'surekli-emisyon-olcum-sistemleri',
      'kstk-yonetmeligi',
    ],
  },
  {
    id: 'atik',
    label: 'Atık yönetimi',
    slugs: [
      'atik-yonetimi',
      'cevre-izin-ve-lisans-yonetmeligi',
      'atik-on-islem-geri-kazanim-tesisleri',
      'met-atik-isleme',
    ],
  },
  {
    id: 'tekstil',
    label: 'Tekstil ve deri',
    slugs: [
      'met-diger-uretim-faaliyetleri',
      'su-verimliligi',
      'su-kirliligi-kontrolu',
    ],
  },
  {
    id: 'gida',
    label: 'Gıda ve tarım ürünleri',
    slugs: [
      'met-diger-uretim-faaliyetleri',
      'su-verimliligi',
      'bitkisel-atik-yaglarin-kontrolu',
    ],
  },
  {
    id: 'maden',
    label: 'Madencilik ve taş ocakları',
    slugs: [
      'maden-atiklari',
      'madencilik-dogaya-yeniden-kazandirma',
      'orman-kanunu-6831',
    ],
  },
  {
    id: 'insaat',
    label: 'İnşaat ve altyapı',
    slugs: ['hafriyat-insaat-yikinti-atiklari'],
  },
  {
    id: 'liman',
    label: 'Liman, tersane ve kıyı tesisleri',
    slugs: [
      'gemilerden-atik-alinmasi',
      'dip-tarama-malzemesi',
      'tersane-tekne-imal-cekevleri',
      'kiyi-kanunu-3621',
    ],
  },
  {
    id: 'saglik',
    label: 'Sağlık kuruluşları',
    slugs: ['tibbi-atiklarin-kontrolu'],
  },
  {
    id: 'otomotiv',
    label: 'Otomotiv, elektronik ve ürün üretimi',
    slugs: [
      'omrunu-tamamlamis-araclar',
      'aeee-yonetimi',
      'elektronik-esya-zararli-madde-kisitlamasi',
      'gekap-yonetmeligi',
      'met-diger-uretim-faaliyetleri',
    ],
  },
];

/** Sanayi tesislerinin tamamını ilgilendiren taban küme. */
const baselineSlugs = [
  'cevre-kanunu-2872',
  'cevre-izin-ve-lisans-yonetmeligi',
  'atik-yonetimi',
  'sifir-atik',
];

const wizardSteps = ['Konu', 'Tesis', 'Koşullar', 'Okuma listesi'];
const wizardStepDescriptions = [
  'Tarama alanını belirleyin',
  'Temel tesis profilini seçin',
  'Proses ve konum bilgilerini işaretleyin',
  'İlgili kayıtları birlikte inceleyin',
];

type Grouped = {
  key: string;
  title: string;
  description: string;
  items: { slug: string; reasons: string[] }[];
};

export function LegislationWizard({
  initialTopic = 'all',
}: {
  initialTopic?: string;
}) {
  const [step, setStep] = useState(1);
  const [topics, setTopics] = useState<string[]>(
    categories.some((item) => item.id === initialTopic) ? [initialTopic] : [],
  );
  const [stage, setStage] = useState('belirsiz');
  const [sector, setSector] = useState('belirsiz');
  const [features, setFeatures] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [copied, setCopied] = useState(false);

  const allTopicsSelected = topics.length === 0;
  const selectedCategories = useMemo(
    () => categories.filter((category) => topics.includes(category.id)),
    [topics],
  );
  const selectionLabel = allTopicsSelected
    ? 'Tüm çevre mevzuatı kapsamı'
    : selectedCategories.length === 1
      ? selectedCategories[0].label
      : `${selectedCategories.length} çevre alanı`;
  const selectionBadgeLabel = allTopicsSelected
    ? 'Tüm çevre kapsamı'
    : selectedCategories.length === 1
      ? selectedCategories[0].shortLabel
      : `${selectedCategories.length} alan`;
  const routeHeading = allTopicsSelected
    ? 'Tüm çevre mevzuatı için başlangıç rotası'
    : selectedCategories.length === 1
      ? `${selectedCategories[0].label} için başlangıç rotası`
      : `Seçtiğiniz ${selectedCategories.length} alan için başlangıç rotası`;
  const SelectedIcon =
    selectedCategories.length === 1
      ? (categoryIcons[selectedCategories[0].id] ?? ScanSearch)
      : allTopicsSelected
        ? ScanSearch
        : Layers3;
  const visibleTopics = showAllTopics ? categories : categories.slice(0, 6);
  const visibleFeatureOptions = featureOptions.filter(
    (option) =>
      allTopicsSelected ||
      option.topics.some((topic) => topics.includes(topic)),
  );

  // Sonuç adres çubuğuna yazılır; okuma listesi paylaşılabilir olur.
  useEffect(() => {
    if (step < 4) return;
    const params = new URLSearchParams();
    if (topics.length) params.set('konu', topics.join(','));
    if (stage !== 'belirsiz') params.set('evre', stage);
    if (sector !== 'belirsiz') params.set('sektor', sector);
    if (features.length) params.set('kosul', features.join(','));
    if (locations.length) params.set('yer', locations.join(','));
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ''}#alanlar`;
    window.history.replaceState(null, '', next);
  }, [features, locations, sector, stage, step, topics]);

  const missingAnswers = [
    stage === 'belirsiz' ? 'tesisin yaşam evresi' : null,
    sector === 'belirsiz' ? 'ana faaliyet grubu' : null,
    features.length === 0 ? 'proses ve çevresel çıkışlar' : null,
    locations.length === 0 ? 'konum bilgileri' : null,
  ].filter(Boolean) as string[];

  const grouped = useMemo<Grouped[]>(() => {
    const alive = (slug: string) => {
      const item = getLegislation(slug);
      return item && item.status !== 'Yürürlükten kaldırıldı'
        ? item.slug
        : null;
    };

    const reasons = new Map<string, Set<string>>();
    const addReason = (slug: string, reason: string) => {
      const valid = alive(slug);
      if (!valid) return;
      const set = reasons.get(valid) ?? new Set<string>();
      set.add(reason);
      reasons.set(valid, set);
    };

    const baseline: string[] = [];
    for (const slug of baselineSlugs) {
      const valid = alive(slug);
      if (valid) baseline.push(valid);
    }

    const stageOption = stageOptions.find((option) => option.id === stage);
    stageOption?.slugs.forEach((slug) =>
      addReason(
        slug,
        `Tesis evresi: ${stageOption.label.toLocaleLowerCase('tr-TR')}`,
      ),
    );

    const sectorOption = sectorOptions.find((option) => option.id === sector);
    sectorOption?.slugs.forEach((slug) =>
      addReason(
        slug,
        `Faaliyet grubu: ${sectorOption.label.toLocaleLowerCase('tr-TR')}`,
      ),
    );

    for (const id of features) {
      const option = featureOptions.find((candidate) => candidate.id === id);
      option?.slugs.forEach((slug) => addReason(slug, option.label));
    }

    for (const id of locations) {
      const option = locationOptions.find((candidate) => candidate.id === id);
      option?.slugs.forEach((slug) =>
        addReason(slug, `Konum: ${option.label}`),
      );
    }

    const profileSlugs = Array.from(reasons.keys()).filter(
      (slug) => !baseline.includes(slug),
    );

    const topicSlugs = allTopicsSelected
      ? []
      : legislation
          .filter(
            (item) =>
              item.status !== 'Yürürlükten kaldırıldı' &&
              item.categories.some((topic) => topics.includes(topic)) &&
              !baseline.includes(item.slug) &&
              !profileSlugs.includes(item.slug),
          )
          .map((item) => item.slug);

    // Önce tesise özel eşleşmeler: kullanıcının bilmediği kısım budur.
    // Temel çerçeve altta durur; bilinen ve her tesiste aynı olan kısımdır.
    const groups: Grouped[] = [
      {
        key: 'profile',
        title: 'Tesisinize özel eşleşenler',
        description:
          'Her kaydın altında, o kaydı listeye getiren cevabınız yazılıdır.',
        items: profileSlugs.map((slug) => ({
          slug,
          reasons: Array.from(reasons.get(slug) ?? []),
        })),
      },
      {
        key: 'baseline',
        title: 'Her sanayi tesisi için temel çerçeve',
        description: 'Faaliyet türüne bakılmaksızın geçerli olan düzenlemeler.',
        items: baseline.map((slug) => ({ slug, reasons: [] })),
      },
    ];

    if (topicSlugs.length) {
      groups.push({
        key: 'topic',
        title:
          selectedCategories.length === 1
            ? `${selectedCategories[0].shortLabel} alanındaki diğer kayıtlar`
            : 'Seçtiğiniz alanlardaki diğer kayıtlar',
        description:
          'Seçtiğiniz alanlarda yer alan, cevaplarınızla henüz eşleşmemiş kayıtlar.',
        items: topicSlugs.map((slug) => ({ slug, reasons: [] })),
      });
    }

    return groups.filter((group) => group.items.length > 0);
  }, [
    allTopicsSelected,
    features,
    locations,
    sector,
    selectedCategories,
    stage,
    topics,
  ]);

  const totalCount = grouped.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  function toggle(
    value: string,
    values: string[],
    setter: (next: string[]) => void,
  ) {
    setter(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  }

  function reset() {
    setStep(1);
    setTopics([]);
    setStage('belirsiz');
    setSector('belirsiz');
    setFeatures([]);
    setLocations([]);
    setShowAllTopics(false);
    window.history.replaceState(null, '', window.location.pathname);
  }

  function selectAllTopics() {
    setTopics([]);
  }

  function toggleTopic(nextTopic: string) {
    const nextTopics = topics.includes(nextTopic)
      ? topics.filter((topic) => topic !== nextTopic)
      : [...topics, nextTopic];
    setTopics(nextTopics);
    // Konu daralınca ilgisiz koşullar düşer; yeni alan eklenince kalanlar korunur.
    setFeatures((current) =>
      current.filter((id) => {
        const option = featureOptions.find((candidate) => candidate.id === id);
        return (
          option &&
          (nextTopics.length === 0 ||
            option.topics.some((topic) => nextTopics.includes(topic)))
        );
      }),
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside className="lg:sticky lg:top-24">
        <div className="soft-dark-surface overflow-hidden rounded-2xl p-6 text-white">
          <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.07] text-white">
            <ScanSearch className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
            Tesis rehberi
          </p>
          <h2 className="mt-2 text-lg leading-tight">
            Tesisinize göre okuma rotası
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Dört kısa adımda tesisinizi tanımlayın. Bilmediğiniz alanları boş
            bırakabilirsiniz.
          </p>
          <div className="mt-6 flex items-center justify-between text-xs font-medium text-white/70">
            <span>
              Adım {step} / {wizardSteps.length}
            </span>
            <span>Yaklaşık 2 dakika</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <span
              className="block h-full rounded-full bg-white/85 transition-[width] duration-300"
              style={{ width: `${(step / wizardSteps.length) * 100}%` }}
            />
          </div>
        </div>

        <ol
          className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1"
          aria-label="Okuma rotası adımları"
        >
          {wizardSteps.map((label, index) => {
            const number = index + 1;
            const current = number === step;
            const complete = number < step;
            return (
              <li
                key={label}
                aria-current={current ? 'step' : undefined}
                className={`flex min-h-16 items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
                  current
                    ? 'border-primary bg-primary/5'
                    : complete
                      ? 'border-border bg-card'
                      : 'border-transparent text-muted-foreground'
                }`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg border text-xs font-semibold ${
                    complete
                      ? 'border-primary bg-primary text-primary-foreground'
                      : current
                        ? 'border-primary bg-card text-primary'
                        : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  {complete ? (
                    <>
                      <Check className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">Tamamlandı: </span>
                    </>
                  ) : (
                    <span aria-hidden="true">0{number}</span>
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-sm ${current ? 'font-semibold text-foreground' : ''}`}
                  >
                    {label}
                  </span>
                  <span className="mt-0.5 hidden text-xs leading-5 text-muted-foreground sm:block">
                    {wizardStepDescriptions[index]}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          onClick={reset}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground lg:justify-start"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Başa dön
          <span className="sr-only"> ve bütün seçimleri temizle</span>
        </button>
      </aside>

      <div className="soft-panel overflow-hidden rounded-2xl">
        <div className="p-5 sm:p-8 lg:p-10">
          <p className="sr-only" aria-live="polite">
            {`Adım ${step} / ${wizardSteps.length}: ${wizardSteps[step - 1]}`}
          </p>

          {step === 1 && (
            <section aria-labelledby="wizard-step-one">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                  01
                </span>
                <p className="eyebrow">Konu seçimi</p>
              </div>
              <h3 id="wizard-step-one" className="text-xl">
                Tüm kapsamı tarayın veya ilgili alanları birlikte seçin
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Bir tesis birden fazla çevre alanına girebilir. İhtiyacınız olan
                tüm alanları işaretleyebilir; emin değilseniz kapsamın tamamını
                tarayabilirsiniz.
              </p>
              <button
                type="button"
                onClick={selectAllTopics}
                aria-pressed={allTopicsSelected}
                className="topic-option mt-6 flex w-full items-center gap-4 px-4 py-4 text-left"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-ink">
                  <ScanSearch className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold">
                    Tesisimin tüm çevre kapsamını tara
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {categories.length} alan · tesis bilgilerine göre tek okuma
                    rotası
                  </span>
                </span>
                {allTopicsSelected && (
                  <CheckCircle2
                    className="size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                )}
              </button>

              <div className="mt-8 mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="eyebrow">İlgili alanları seçin</p>
                {!allTopicsSelected && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {selectedCategories.length} alan seçildi
                  </span>
                )}
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {visibleTopics.map((category) => {
                  const Icon = categoryIcons[category.id] ?? Layers3;
                  const selected = topics.includes(category.id);
                  return (
                    <li key={category.id} className="contents">
                      <button
                        type="button"
                        onClick={() => toggleTopic(category.id)}
                        aria-pressed={selected}
                        className="topic-option flex items-center gap-3 px-3.5 py-3.5 text-left"
                      >
                        <Icon
                          className="size-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1 text-sm font-medium">
                          {category.label}
                        </span>
                        {selected ? (
                          <CheckCircle2
                            className="size-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                        ) : (
                          <Plus
                            className="size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => setShowAllTopics((current) => !current)}
                aria-expanded={showAllTopics}
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline hover:decoration-seal"
              >
                {showAllTopics
                  ? 'Daha az alan göster'
                  : `Diğer ${categories.length - 6} çevre alanını göster`}
                <ChevronDown
                  className={`size-4 transition-transform ${showAllTopics ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <div className="border-t border-border mt-8 flex flex-wrap items-center justify-between gap-4 pt-6">
                <div className="min-w-0 text-sm">
                  <p>
                    <span className="text-muted-foreground">Seçiminiz: </span>
                    <strong className="font-semibold">{selectionLabel}</strong>
                  </p>
                  {!allTopicsSelected && selectedCategories.length > 1 && (
                    <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
                      {selectedCategories
                        .map((category) => category.shortLabel)
                        .join(' · ')}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="h-11 gap-2 px-4"
                >
                  Devam et
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="wizard-step-two">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                  02
                </span>
                <p className="eyebrow">Tesis profili</p>
              </div>
              <h3 id="wizard-step-two" className="text-xl">
                Tesisin temel profilini seçin
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Tesisin bulunduğu evreyi ve ana faaliyetini seçin. Bu bilgiler,
                sonraki adımda gösterilecek proses ve konum sorularını düzenler.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label
                  className="soft-panel p-4 transition-colors focus-within:border-primary"
                  htmlFor="facility-stage"
                >
                  <span className="flex items-start gap-3">
                    <span className="gazette grid size-7 shrink-0 place-items-center rounded-md bg-muted text-xs text-primary">
                      A
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        Tesisin yaşam evresi
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        Yatırımın veya işletmenin mevcut aşaması
                      </span>
                    </span>
                  </span>
                  <NativeSelect
                    id="facility-stage"
                    value={stage}
                    onChange={(event) => setStage(event.target.value)}
                    className="mt-4 w-full [&>select]:h-12 [&>select]:border-border [&>select]:bg-background [&>select]:px-4"
                  >
                    {stageOptions.map((option) => (
                      <NativeSelectOption key={option.id} value={option.id}>
                        {option.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </label>
                <label
                  className="soft-panel p-4 transition-colors focus-within:border-primary"
                  htmlFor="facility-sector"
                >
                  <span className="flex items-start gap-3">
                    <span className="gazette grid size-7 shrink-0 place-items-center rounded-md bg-muted text-xs text-primary">
                      B
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        Ana faaliyet grubu
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        Tesisin baskın üretim veya hizmet alanı
                      </span>
                    </span>
                  </span>
                  <NativeSelect
                    id="facility-sector"
                    value={sector}
                    onChange={(event) => setSector(event.target.value)}
                    className="mt-4 w-full [&>select]:h-12 [&>select]:border-border [&>select]:bg-background [&>select]:px-4"
                  >
                    {sectorOptions.map((option) => (
                      <NativeSelectOption key={option.id} value={option.id}>
                        {option.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </label>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-card text-primary shadow-sm">
                  <Info className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    Faaliyet kodu tek başına kapsamı belirlemez
                  </p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    Faaliyet adı, proses ve mevzuattaki kapasite eşiği birlikte
                    kontrol edilmelidir. Bu site eşik hesabı yapmaz; hangi eke
                    bakmanız gerektiğini gösterir.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/60 px-4 py-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="h-11 gap-2 px-3"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Geri
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  className="h-11 min-w-40 gap-2 px-5"
                >
                  Koşullara geç
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="wizard-step-three">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                  03
                </span>
                <p className="eyebrow">Koşullar</p>
              </div>
              <h3 id="wizard-step-three" className="text-xl">
                Tesiste hangi koşullar var?
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Bildiğiniz seçenekleri işaretleyin; bilmediğiniz alanlar sonuçta
                açıkça gösterilir.
              </p>
              <div className="mt-7 grid gap-7 lg:grid-cols-2">
                <fieldset className="min-w-0">
                  <legend className="mb-3 w-full text-sm font-semibold">
                    <span className="flex items-center justify-between gap-3">
                      <span>Proses ve çevresel çıkışlar</span>
                      <span className="gazette text-xs text-muted-foreground">
                        {visibleFeatureOptions.length} seçenek
                      </span>
                    </span>
                  </legend>
                  {visibleFeatureOptions.length > 0 ? (
                    <div className="option-scroll grid gap-2.5 lg:max-h-[500px] lg:overflow-y-auto lg:pr-2">
                      {visibleFeatureOptions.map((option) => (
                        <label
                          key={option.id}
                          className="choice-row flex cursor-pointer items-start gap-3 px-3.5 py-3 text-sm leading-7"
                        >
                          <Checkbox
                            checked={features.includes(option.id)}
                            onCheckedChange={() =>
                              toggle(option.id, features, setFeatures)
                            }
                            className="mt-0.5"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="border border-dashed border-input px-4 py-6 text-sm leading-7 text-muted-foreground">
                      Bu alanda proses koşulu sorulmuyor. Kapsam, aşağıdaki
                      konum bilgileri ve tesis profiliyle belirlenir.
                    </p>
                  )}
                </fieldset>
                <fieldset className="min-w-0">
                  <legend className="mb-3 w-full text-sm font-semibold">
                    <span className="flex items-center justify-between gap-3">
                      <span>Konum bilgileri</span>
                      <span className="gazette text-xs text-muted-foreground">
                        {locationOptions.length} seçenek
                      </span>
                    </span>
                  </legend>
                  <div className="option-scroll grid gap-2.5 lg:max-h-[500px] lg:overflow-y-auto lg:pr-2">
                    {locationOptions.map((option) => (
                      <label
                        key={option.id}
                        className="choice-row flex cursor-pointer items-start gap-3 px-3.5 py-3 text-sm leading-7"
                      >
                        <Checkbox
                          checked={locations.includes(option.id)}
                          onCheckedChange={() =>
                            toggle(option.id, locations, setLocations)
                          }
                          className="mt-0.5"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Konumsal statüyü bilmiyorsanız hiçbirini işaretlemeyin;
                    sonuçta bu alanın taranmadığı belirtilir.
                  </p>
                </fieldset>
              </div>
              <div className="border-t border-border mt-8 flex flex-wrap items-center justify-between gap-3 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="h-11 gap-2 px-3"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Geri
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(4)}
                  className="h-11 gap-2 px-4"
                >
                  Okuma listesini oluştur
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </section>
          )}

          {step === 4 && (
            <section aria-labelledby="wizard-step-four">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                      04
                    </span>
                    <p className="eyebrow">Ön okuma listesi</p>
                  </div>
                  <h3 id="wizard-step-four" className="text-xl">
                    {routeHeading}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {totalCount} düzenleme, verdiğiniz bilgilerle birlikte
                    incelenmeli. Liste öncelik sırası değil, gerekçe
                    gruplarıdır.
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 gap-1.5">
                  <SelectedIcon className="size-3.5" aria-hidden="true" />
                  {selectionBadgeLabel}
                </Badge>
              </div>

              {missingAnswers.length > 0 ? (
                <div className="mt-6 border-l-2 border-attention pl-5">
                  <TriangleAlert
                    className="mt-0.5 size-4 shrink-0 text-accent-foreground dark:text-accent"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      Karar için veri eksik: {missingAnswers.length} alan
                      belirtilmedi
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Şu alanlar taranmadı: {missingAnswers.join(', ')}.
                      Belirsiz alanlar kapsam dışı kabul edilmez; eksik cevap
                      yalnızca o alandaki kayıtların listeye gelmediğini
                      gösterir.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 border-l-2 border-seal pl-5">
                  <Info
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      Bu liste mevzuat yorumu içermez
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Cevaplarınız resmî düzenleme başlıklarıyla eşleştirilir.
                      Kapsam sonucu, ilgili madde veya ek dayanağı
                      doğrulandığında kesinleşir.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-7 grid gap-8">
                {grouped.map((group) => (
                  <section
                    key={group.key}
                    aria-labelledby={`group-${group.key}`}
                  >
                    <h4
                      id={`group-${group.key}`}
                      className="text-lg font-semibold"
                    >
                      {group.title}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {group.items.length} kayıt
                      </span>
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {group.description}
                    </p>
                    <ul className="mt-4 grid gap-2.5">
                      {group.items.map(({ slug, reasons }) => {
                        const item = getLegislation(slug);
                        if (!item) return null;
                        return (
                          <li
                            key={slug}
                            className="border-t border-border py-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <h5 className="text-base font-semibold leading-6">
                                  <Link
                                    href={`/mevzuat/${item.slug}`}
                                    className="hover:text-primary hover:underline hover:decoration-seal decoration-border underline-offset-4"
                                  >
                                    {item.title}
                                  </Link>
                                </h5>
                                {reasons.length > 0 && (
                                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                      Neden listede:{' '}
                                    </span>
                                    {reasons.join(' · ')}
                                  </p>
                                )}
                                {item.primaryAnnex && (
                                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                      Önce şuna bakın:{' '}
                                    </span>
                                    {item.primaryAnnex}
                                  </p>
                                )}
                                {item.obligations.length > 0 && (
                                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                      Tipik yükümlülük:{' '}
                                    </span>
                                    {item.obligations.join(' · ')}
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 flex-col items-start gap-1.5">
                                {item.foundation && (
                                  <Badge variant="secondary">
                                    Temel düzenleme
                                  </Badge>
                                )}
                                <ExternalLink
                                  href={item.consolidatedUrl ?? item.sourceUrl}
                                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline hover:decoration-seal"
                                  iconClassName="size-3"
                                >
                                  {item.consolidatedUrl
                                    ? 'Güncel metin'
                                    : 'Resmî kaynak'}
                                </ExternalLink>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="border-t border-border mt-8 flex flex-wrap items-center gap-3 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(3)}
                  className="h-11 gap-2 px-3"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Geri
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyLink}
                  className="h-11 gap-2 border border-input px-4"
                >
                  <Copy className="size-4" aria-hidden="true" />
                  {copied ? 'Bağlantı kopyalandı' : 'Bağlantıyı kopyala'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.print()}
                  className="h-11 gap-2 border border-input px-4"
                >
                  <Printer className="size-4" aria-hidden="true" />
                  Yazdır
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={reset}
                  className="h-11 gap-2 px-3"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Yeni rota
                </Button>
                <Button
                  nativeButton={false}
                  render={
                    <Link
                      href={
                        topics.length === 1
                          ? `/mevzuat?alan=${topics[0]}`
                          : '/mevzuat'
                      }
                    />
                  }
                  className="h-11 gap-2 px-4"
                >
                  Mevzuat dizinini aç
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
