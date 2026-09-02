'use client';

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Droplets,
  ExternalLink,
  FileSearch,
  FlaskConical,
  Gauge,
  Info,
  Layers3,
  MapPinned,
  Package,
  Pickaxe,
  Recycle,
  RotateCcw,
  ScanSearch,
  Volume2,
  Waves,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Progress, ProgressLabel } from '@/components/ui/progress';
import { categories, legislation } from '@/lib/legislation-data';

const wizardTopics = categories;

const icons = {
  kurulus: Building2,
  izin: CheckCircle2,
  hava: Cloud,
  su: Droplets,
  atiksu: Waves,
  atik: Recycle,
  urun: Package,
  kimyasal: FlaskConical,
  toprak: MapPinned,
  gurultu: Volume2,
  deniz: Waves,
  doga: MapPinned,
  maden: Pickaxe,
  entegre: Layers3,
  olcum: Gauge,
} as const;

const featureOptions = [
  {
    id: 'air-source',
    label: 'Yakma, proses bacası, toz, VOC veya koku kaynağı var',
    topics: ['hava', 'izin', 'entegre', 'olcum'],
  },
  {
    id: 'wastewater',
    label: 'Proses atıksuyu oluşuyor veya arıtma tesisi var',
    topics: ['su', 'atiksu', 'izin', 'entegre', 'olcum'],
  },
  {
    id: 'direct-discharge',
    label: 'Kanalizasyona, alıcı ortama veya denize deşarj var',
    topics: ['su', 'atiksu', 'deniz', 'izin'],
  },
  {
    id: 'waste-storage',
    label: 'Tesiste atık oluşuyor veya geçici depolanıyor',
    topics: ['atik', 'urun', 'izin'],
  },
  {
    id: 'waste-treatment',
    label: 'Atık toplama, geri kazanım, yakma veya bertaraf faaliyeti var',
    topics: ['atik', 'izin', 'entegre'],
  },
  {
    id: 'product-role',
    label:
      'Ambalajlı ürün, yağ, lastik, araç, pil veya elektronik eşya piyasaya arz ediliyor',
    topics: ['urun', 'atik'],
  },
  {
    id: 'chemicals',
    label: 'Kimyasal imalatı, ithalatı, kullanımı veya depolaması var',
    topics: ['kimyasal', 'toprak'],
  },
  {
    id: 'hazardous-inventory',
    label: 'Tehlikeli madde envanteri veya büyük kaza riski var',
    topics: ['kimyasal'],
  },
  {
    id: 'land-risk',
    label: 'Yeraltı tankı, dökülme/sızıntı veya geçmiş saha kullanımı var',
    topics: ['toprak', 'kimyasal', 'kurulus'],
  },
  {
    id: 'noise-source',
    label: 'Endüstriyel gürültü veya titreşim kaynağı var',
    topics: ['gurultu', 'izin'],
  },
  {
    id: 'mining',
    label: 'Maden, taş ocağı, cevher hazırlama veya pasa faaliyeti var',
    topics: ['maden', 'atik', 'toprak', 'kurulus'],
  },
  {
    id: 'coastal-activity',
    label: 'Liman, gemi, dip tarama veya deniz tesisi faaliyeti var',
    topics: ['deniz', 'atik'],
  },
  {
    id: 'measurement',
    label: 'Çevre laboratuvarı ya da sürekli ölçüm/izleme sistemi var',
    topics: ['olcum', 'hava', 'atiksu'],
  },
];

const locationOptions = [
  { id: 'osb', label: 'Organize sanayi bölgesinde' },
  { id: 'coast', label: 'Kıyı veya denizle ilişkili' },
  { id: 'protected', label: 'Korunan alanla ilişkili olabilir' },
  { id: 'water-basin', label: 'İçme suyu havzası veya su kaynağıyla ilişkili' },
  { id: 'groundwater', label: 'Yeraltı suyu kullanımı veya kuyusu var' },
  { id: 'forest', label: 'Orman alanı veya yakın çevresiyle ilişkili' },
  { id: 'unknown-location', label: 'Konumsal statü henüz bilinmiyor' },
];

const featureLegislation: Record<string, string[]> = {
  'air-source': [
    'skhkky',
    'koku-emisyonlari-kontrolu',
    'surekli-emisyon-olcum-sistemleri',
  ],
  wastewater: [
    'su-kirliligi-kontrolu',
    'atiksu-aritma-teknik-usuller',
    'surekli-atiksu-izleme-sistemleri',
    'atiksu-aritma-enerji-tesviki',
  ],
  'direct-discharge': [
    'su-kirliligi-kontrolu',
    'yerustu-su-kalitesi',
    'surekli-atiksu-izleme-sistemleri',
  ],
  'waste-storage': ['atik-yonetimi', 'atiklarin-duzenli-depolanmasi'],
  'waste-treatment': [
    'cevre-izin-ve-lisans-yonetmeligi',
    'atik-yonetimi',
    'atiklarin-yakilmasi',
    'atik-on-islem-geri-kazanim-tesisleri',
    'met-atik-isleme',
  ],
  'product-role': [
    'ambalaj-atiklarinin-kontrolu',
    'atik-yaglarin-yonetimi',
    'atik-pil-akumulator-kontrolu',
    'aeee-yonetimi',
    'elektronik-esya-zararli-madde-kisitlamasi',
    'omrunu-tamamlamis-lastikler',
    'omrunu-tamamlamis-araclar',
    'gekap-yonetmeligi',
  ],
  chemicals: [
    'kkdik',
    'sea-yonetmeligi',
    'zararli-kimyasallar-ihracat-ithalat',
    'pcb-pct-kontrolu',
    'kalici-organik-kirleticiler',
  ],
  'hazardous-inventory': [
    'buyuk-endustriyel-kazalar',
    'bekra-guvenlik-raporu-tebligi',
    'bekra-onleme-politikasi-tebligi',
    'bekra-kaza-senaryosu-tebligi',
    'bekra-dahili-acil-durum-tebligi',
    'pcb-pct-kontrolu',
  ],
  'land-risk': ['toprak-kirliligi-kontrolu'],
  'noise-source': ['cevresel-gurultu-kontrolu'],
  mining: ['maden-atiklari', 'madencilik-dogaya-yeniden-kazandirma'],
  'coastal-activity': [
    'gemilerden-atik-alinmasi',
    'dip-tarama-malzemesi',
    'tersane-tekne-imal-cekevleri',
  ],
  measurement: [
    'cevre-olcum-analiz-laboratuvarlari',
    'surekli-emisyon-olcum-sistemleri',
    'surekli-atiksu-izleme-sistemleri',
  ],
};

const sectorLegislation: Record<string, string[]> = {
  genel: ['met-diger-uretim-faaliyetleri'],
  enerji: ['skhkky', 'endustriyel-emisyonlarin-yonetimi', 'met-enerji-uretimi'],
  mineral: [
    'skhkky',
    'endustriyel-emisyonlarin-yonetimi',
    'met-mineral-endustrisi',
  ],
  metal: ['endustriyel-emisyonlarin-yonetimi', 'kkdik', 'met-metal-uretimi'],
  kimya: [
    'kkdik',
    'sea-yonetmeligi',
    'buyuk-endustriyel-kazalar',
    'met-kimya-endustrisi',
  ],
  atik: [
    'atik-yonetimi',
    'cevre-izin-ve-lisans-yonetmeligi',
    'atik-on-islem-geri-kazanim-tesisleri',
    'met-atik-isleme',
  ],
  maden: ['maden-atiklari', 'madencilik-dogaya-yeniden-kazandirma'],
  insaat: ['hafriyat-insaat-yikinti-atiklari'],
  liman: [
    'gemilerden-atik-alinmasi',
    'dip-tarama-malzemesi',
    'tersane-tekne-imal-cekevleri',
  ],
  saglik: ['tibbi-atiklarin-kontrolu'],
  tekstil: ['met-diger-uretim-faaliyetleri'],
  gida: ['met-diger-uretim-faaliyetleri'],
  otomotiv: [
    'omrunu-tamamlamis-araclar',
    'aeee-yonetimi',
    'elektronik-esya-zararli-madde-kisitlamasi',
    'gekap-yonetmeligi',
    'met-diger-uretim-faaliyetleri',
  ],
};

const locationLegislation: Record<string, string[]> = {
  coast: [
    'gemilerden-atik-alinmasi',
    'dip-tarama-malzemesi',
    'tersane-tekne-imal-cekevleri',
  ],
  protected: [
    'ced-yonetmeligi',
    'stratejik-cevresel-degerlendirme',
    'sulak-alanlarin-korunmasi',
    'korunan-alanlarda-planlama',
    'korunan-alanlar-tespit-tescil',
  ],
  'water-basin': [
    'su-kirliligi-kontrolu',
    'yerustu-su-kalitesi',
    'icme-kullanma-suyu-havzalari',
  ],
  groundwater: ['yeralti-sularinin-korunmasi'],
  forest: ['ced-yonetmeligi', 'madencilik-dogaya-yeniden-kazandirma'],
};

const basis: Record<string, string> = {
  'ced-yonetmeligi': 'Ek-1 ve Ek-2 proje listeleri',
  'cevre-izin-ve-lisans-yonetmeligi': 'Ek-1 ve Ek-2 faaliyet listeleri',
  skhkky: 'Tesis sınıfları, emisyon hükümleri ve ilgili ekler',
  'su-kirliligi-kontrolu': 'Deşarj ortamı ve sektör tabloları',
  'atik-yonetimi': 'Atık üreticisi hükümleri ve atık listesi',
  kkdik: 'Madde, rol ve tonaj verileri',
  'buyuk-endustriyel-kazalar': 'Tehlikeli madde ve eşik miktarları',
  'endustriyel-emisyonlarin-yonetimi': 'Kapsamdaki faaliyetler ve ilgili ekler',
};

const wizardSteps = ['Konu', 'Tesis', 'Koşullar', 'Okuma listesi'];

export function LegislationWizard() {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('all');
  const [stage, setStage] = useState('belirsiz');
  const [sector, setSector] = useState('belirsiz');
  const [features, setFeatures] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showAllTopics, setShowAllTopics] = useState(false);

  const selectedCategory =
    topic === 'all'
      ? {
          id: 'all',
          label: 'Tüm çevre mevzuatı kapsamı',
          shortLabel: 'Tüm çevre kapsamı',
          description: 'Tesisin tüm çevre alanları birlikte taranır.',
          subtopics: [],
        }
      : categories.find((category) => category.id === topic)!;
  const SelectedIcon =
    topic === 'all' ? ScanSearch : icons[topic as keyof typeof icons];
  const visibleTopics = showAllTopics ? wizardTopics : wizardTopics.slice(0, 6);
  const visibleFeatureOptions = featureOptions.filter(
    (option) => topic === 'all' || option.topics.includes(topic),
  );
  const profileGapCount = [
    stage === 'belirsiz',
    sector === 'belirsiz',
    features.length === 0,
    locations.length === 0,
  ].filter(Boolean).length;

  const results = useMemo(() => {
    const direct =
      topic === 'all'
        ? []
        : legislation.filter(
            (item) =>
              item.status !== 'Yürürlükten kaldırıldı' &&
              item.categories.includes(topic),
          );
    const baseline = legislation.filter((item) =>
      ['cevre-kanunu-2872', 'cevre-izin-ve-lisans-yonetmeligi'].includes(
        item.slug,
      ),
    );
    const stageSlugs =
      stage === 'planlama'
        ? ['ced-yonetmeligi', 'stratejik-cevresel-degerlendirme']
        : stage === 'degisiklik'
          ? ['ced-yonetmeligi', 'cevre-izin-ve-lisans-yonetmeligi']
          : stage === 'devir'
            ? ['cevre-izin-ve-lisans-yonetmeligi', 'cevre-yonetimi-hizmetleri']
            : stage === 'kapanis'
              ? [
                  'toprak-kirliligi-kontrolu',
                  'atik-yonetimi',
                  'madencilik-dogaya-yeniden-kazandirma',
                ]
              : stage === 'faaliyette'
                ? [
                    'cevre-izin-ve-lisans-yonetmeligi',
                    'cevre-denetimi-yonetmeligi',
                  ]
                : [];
    const matchedSlugs = [
      ...stageSlugs,
      ...(sectorLegislation[sector] ?? []),
      ...features.flatMap((feature) => featureLegislation[feature] ?? []),
      ...locations.flatMap((location) => locationLegislation[location] ?? []),
    ];
    const matched = legislation.filter(
      (item) =>
        item.status !== 'Yürürlükten kaldırıldı' &&
        matchedSlugs.includes(item.slug),
    );
    return [
      ...new Map(
        [...baseline, ...direct, ...matched].map((item) => [item.slug, item]),
      ).values(),
    ];
  }, [features, locations, sector, stage, topic]);

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
    setTopic('all');
    setStage('belirsiz');
    setSector('belirsiz');
    setFeatures([]);
    setLocations([]);
    setShowAllTopics(false);
  }

  function selectTopic(nextTopic: string) {
    setTopic(nextTopic);
    setFeatures([]);
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/90 bg-card shadow-[0_24px_64px_-40px_oklch(0.18_0.03_166/0.45)]">
      <div className="border-b border-border/80 px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="section-kicker mb-2">Şimdi başlayın</p>
            <h2 className="font-heading text-[22px] font-semibold tracking-[-0.035em]">
              Tüm çevre kapsamını tarayın
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              15 alanı birlikte tarayın veya belirli bir konudan başlayın.
            </p>
          </div>
          <span className="meta-type hidden rounded-full border border-border bg-background px-3 py-1.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
            05–07 dk.
          </span>
        </div>
        <ol
          className="mt-5 grid grid-cols-4 gap-1.5"
          aria-label="Mevzuat pusulası adımları"
        >
          {wizardSteps.map((label, index) => {
            const number = index + 1;
            const current = number === step;
            const complete = number < step;
            return (
              <li
                key={label}
                aria-current={current ? 'step' : undefined}
                className={`rounded-[10px] border px-2.5 py-2.5 transition-colors ${
                  current
                    ? 'border-primary/35 bg-primary/8'
                    : complete
                      ? 'border-primary/20 bg-primary/4'
                      : 'border-border/75 bg-background/55'
                }`}
              >
                <span
                  className={`meta-type block text-[9px] font-semibold ${
                    current || complete
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {complete ? '✓' : `0${number}`}
                </span>
                <strong
                  className={`mt-1 block truncate text-[10px] font-semibold sm:text-xs ${
                    current ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </strong>
              </li>
            );
          })}
        </ol>
        <Progress value={step * 25} locale="tr-TR" className="mt-3 gap-2">
          <ProgressLabel className="sr-only">
            {wizardSteps[step - 1]}
          </ProgressLabel>
          <span className="meta-type ml-auto text-[11px] text-muted-foreground">
            0{step} / 04
          </span>
        </Progress>
      </div>

      <div
        className="px-5 py-6 sm:px-7 sm:py-7 lg:min-h-[470px]"
        aria-live="polite"
      >
        {step === 1 && (
          <section aria-labelledby="wizard-step-one">
            <div className="mb-5">
              <p className="section-kicker mb-2">1. adım · Birini seçin</p>
              <h3
                id="wizard-step-one"
                className="font-heading text-[19px] font-semibold tracking-[-0.025em]"
              >
                Tüm kapsamı mı, belirli bir alanı mı tarayalım?
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Emin değilseniz tüm çevre kapsamıyla başlayın.
              </p>
            </div>

            <button
              type="button"
              onClick={() => selectTopic('all')}
              aria-pressed={topic === 'all'}
              className="topic-option group mb-3 flex min-h-16 w-full items-center gap-3 rounded-[12px] border px-4 py-3.5 text-left transition-all"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-border/70 bg-card text-primary transition-colors group-aria-pressed:border-primary group-aria-pressed:bg-primary group-aria-pressed:text-primary-foreground">
                <ScanSearch className="size-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm font-semibold">
                  Tesisimin tüm çevre kapsamını tara
                </strong>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                  15 alan · tesis bilgilerine göre tek okuma rotası
                </span>
              </span>
              {topic === 'all' ? (
                <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check
                    className="size-3"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                </span>
              ) : (
                <ArrowRight
                  className="size-4 text-muted-foreground/50"
                  aria-hidden="true"
                />
              )}
            </button>

            <p className="meta-type mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Ya da tek alanla başlayın
            </p>
            <ul
              className="grid gap-2.5 sm:grid-cols-2"
              aria-label="Çevre mevzuatı alanları"
            >
              {visibleTopics.map((item) => {
                const Icon = icons[item.id as keyof typeof icons];
                const active = topic === item.id;
                return (
                  <li key={item.id} className="contents">
                    <button
                      type="button"
                      onClick={() => selectTopic(item.id)}
                      aria-pressed={active}
                      className="topic-option group flex min-h-14 items-center gap-3 rounded-[11px] border px-3.5 py-3 text-left text-sm font-medium transition-all"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border/70 bg-card text-primary transition-colors group-aria-pressed:border-primary group-aria-pressed:bg-primary group-aria-pressed:text-primary-foreground">
                        <Icon className="size-4.5" aria-hidden="true" />
                      </span>
                      <span className="flex-1 leading-5">
                        {item.shortLabel}
                      </span>
                      {active ? (
                        <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                          <Check
                            className="size-3"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        </span>
                      ) : (
                        <ArrowRight
                          className="size-4 text-muted-foreground/50"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            {!showAllTopics && (
              <Button
                type="button"
                variant="ghost"
                className="mt-3 h-9 w-full gap-2 rounded-[10px] border border-dashed border-border text-xs text-muted-foreground"
                onClick={() => setShowAllTopics(true)}
                aria-expanded={showAllTopics}
              >
                Diğer {wizardTopics.length - visibleTopics.length} çevre alanını
                göster
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </Button>
            )}
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="wizard-step-two">
            <p className="section-kicker mb-2">2. adım</p>
            <h3
              id="wizard-step-two"
              className="font-heading text-[22px] font-semibold tracking-[-0.035em]"
            >
              Tesisin temel profilini seçin
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Faaliyet adı ve kapasite eşikleri, ayrıntılı kapsam kontrolünde
              ayrıca istenir.
            </p>
            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <label
                className="grid gap-2 text-sm font-semibold"
                htmlFor="facility-stage"
              >
                Tesisin yaşam evresi
                <NativeSelect
                  id="facility-stage"
                  value={stage}
                  onChange={(event) => setStage(event.target.value)}
                  className="w-full [&>select]:h-11 [&>select]:rounded-[10px] [&>select]:bg-background"
                >
                  <NativeSelectOption value="belirsiz">
                    Henüz seçmedim / bilmiyorum
                  </NativeSelectOption>
                  <NativeSelectOption value="planlama">
                    Planlama / yeni kuruluş
                  </NativeSelectOption>
                  <NativeSelectOption value="faaliyette">
                    Faaliyette
                  </NativeSelectOption>
                  <NativeSelectOption value="degisiklik">
                    Kapasite veya proses değişikliği
                  </NativeSelectOption>
                  <NativeSelectOption value="devir">
                    Devir / işletmeci değişikliği
                  </NativeSelectOption>
                  <NativeSelectOption value="kapanis">
                    Faaliyet sonlandırma
                  </NativeSelectOption>
                </NativeSelect>
              </label>
              <label
                className="grid gap-2 text-sm font-semibold"
                htmlFor="facility-sector"
              >
                Ana faaliyet grubu
                <NativeSelect
                  id="facility-sector"
                  value={sector}
                  onChange={(event) => setSector(event.target.value)}
                  className="w-full [&>select]:h-11 [&>select]:rounded-[10px] [&>select]:bg-background"
                >
                  <NativeSelectOption value="belirsiz">
                    Faaliyet grubunu seçin
                  </NativeSelectOption>
                  <NativeSelectOption value="genel">
                    Genel imalat sanayii
                  </NativeSelectOption>
                  <NativeSelectOption value="mineral">
                    Çimento, seramik ve mineral
                  </NativeSelectOption>
                  <NativeSelectOption value="metal">
                    Metal üretimi ve işleme
                  </NativeSelectOption>
                  <NativeSelectOption value="kimya">
                    Kimya ve petrokimya
                  </NativeSelectOption>
                  <NativeSelectOption value="enerji">
                    Enerji üretimi
                  </NativeSelectOption>
                  <NativeSelectOption value="atik">
                    Atık yönetimi
                  </NativeSelectOption>
                  <NativeSelectOption value="tekstil">
                    Tekstil ve deri
                  </NativeSelectOption>
                  <NativeSelectOption value="gida">
                    Gıda ve tarım ürünleri
                  </NativeSelectOption>
                  <NativeSelectOption value="maden">
                    Madencilik ve taş ocakları
                  </NativeSelectOption>
                  <NativeSelectOption value="insaat">
                    İnşaat ve altyapı
                  </NativeSelectOption>
                  <NativeSelectOption value="liman">
                    Liman, tersane ve kıyı tesisleri
                  </NativeSelectOption>
                  <NativeSelectOption value="saglik">
                    Sağlık kuruluşları
                  </NativeSelectOption>
                  <NativeSelectOption value="otomotiv">
                    Otomotiv, elektronik ve ürün üretimi
                  </NativeSelectOption>
                </NativeSelect>
              </label>
            </div>
            <Alert className="mt-7 rounded-[12px] border-primary/20 bg-primary/5 px-4 py-3 shadow-none">
              <Info className="text-primary" aria-hidden="true" />
              <AlertTitle>
                NACE kodu tek başına kapsam kararı üretmez
              </AlertTitle>
              <AlertDescription>
                Faaliyet adı, proses ve mevzuattaki kapasite eşiği birlikte
                kontrol edilir.
              </AlertDescription>
            </Alert>
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="wizard-step-three">
            <p className="section-kicker mb-2">3. adım</p>
            <h3
              id="wizard-step-three"
              className="font-heading text-[22px] font-semibold tracking-[-0.035em]"
            >
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
                    <span className="meta-type text-[10px] font-medium text-muted-foreground">
                      {visibleFeatureOptions.length} seçenek
                    </span>
                  </span>
                </legend>
                <div className="option-scroll grid gap-2.5 lg:max-h-[500px] lg:overflow-y-auto lg:pr-2">
                  {visibleFeatureOptions.map((option) => (
                    <label
                      key={option.id}
                      className="choice-row flex cursor-pointer items-start gap-3 rounded-[11px] border border-border px-3.5 py-3 text-sm leading-5 transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={features.includes(option.id)}
                        onCheckedChange={() =>
                          toggle(option.id, features, setFeatures)
                        }
                        aria-label={option.label}
                        className="mt-0.5"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="min-w-0">
                <legend className="mb-3 w-full text-sm font-semibold">
                  <span className="flex items-center justify-between gap-3">
                    <span>Konum bilgileri</span>
                    <span className="meta-type text-[10px] font-medium text-muted-foreground">
                      {locationOptions.length} seçenek
                    </span>
                  </span>
                </legend>
                <div className="option-scroll grid gap-2.5 lg:max-h-[500px] lg:overflow-y-auto lg:pr-2">
                  {locationOptions.map((option) => (
                    <label
                      key={option.id}
                      className="choice-row flex cursor-pointer items-start gap-3 rounded-[11px] border border-border px-3.5 py-3 text-sm leading-5 transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={locations.includes(option.id)}
                        onCheckedChange={() =>
                          toggle(option.id, locations, setLocations)
                        }
                        aria-label={option.label}
                        className="mt-0.5"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>
        )}

        {step === 4 && (
          <section aria-labelledby="wizard-step-four">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="section-kicker mb-2">
                  4. adım · Ön okuma listesi
                </p>
                <h3
                  id="wizard-step-four"
                  className="font-heading text-[22px] font-semibold tracking-[-0.035em]"
                >
                  {selectedCategory.shortLabel} için başlangıç rotası
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {results.length} düzenleme, seçtiğiniz bilgilerle birlikte
                  incelenmeli.
                </p>
              </div>
              <Badge
                variant="outline"
                className="h-7 gap-1.5 rounded-full border-primary/25 bg-primary/5 px-3 text-primary"
              >
                <SelectedIcon className="size-3.5" aria-hidden="true" />
                {selectedCategory.shortLabel}
              </Badge>
            </div>

            <Alert className="mt-5 rounded-[12px] border-primary/20 bg-primary/5 px-4 py-3 shadow-none">
              <FileSearch className="text-primary" aria-hidden="true" />
              <AlertTitle>
                {profileGapCount > 0
                  ? `${profileGapCount} bilgi alanı henüz belirsiz`
                  : 'Bu liste mevzuat yorumu içermez'}
              </AlertTitle>
              <AlertDescription>
                {profileGapCount > 0
                  ? 'Belirsiz alanlar kapsam dışı kabul edilmez. Liste, verdiğiniz bilgilerle oluşturulmuş bir ön okuma rotasıdır.'
                  : 'Konu ve tesis verileriniz resmî düzenleme başlıklarıyla eşleştirilir. Kapsam sonucu, ilgili madde veya ek dayanağı doğrulandığında kesinleşir.'}
              </AlertDescription>
            </Alert>

            <div className="option-scroll mt-5 grid gap-2.5 lg:max-h-[370px] lg:overflow-y-auto lg:pr-1">
              {results.map((item, index) => (
                <article
                  key={item.slug}
                  className="rounded-[12px] border border-border bg-background/55 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold leading-5">
                          {item.title}
                        </h4>
                        <Badge
                          variant={
                            item.foundation || item.status === 'Yürürlükte'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="h-5 rounded-full"
                        >
                          {item.foundation ? 'Temel düzenleme' : item.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Kontrol dayanağı:{' '}
                        {basis[item.slug] ??
                          'İlgili faaliyet, kapasite ve kapsam hükümleri'}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        <Link
                          className="font-semibold text-primary hover:underline"
                          href={`/mevzuat/${item.slug}`}
                        >
                          Kayıt sayfası
                        </Link>
                        <a
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Resmî kaynak{' '}
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <Button
              nativeButton={false}
              render={
                <Link
                  href={topic === 'all' ? '/mevzuat' : `/mevzuat?alan=${topic}`}
                  aria-label="İlgili tüm mevzuat kayıtlarını aç"
                />
              }
              variant="outline"
              className="mt-4 h-10 w-full justify-between rounded-[10px] px-4"
            >
              İlgili tüm kayıtları kütüphanede aç
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </section>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-border/80 bg-background/45 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        {step === 1 ? (
          <div className="flex items-center gap-3" aria-live="polite">
            <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
              <SelectedIcon className="size-4" aria-hidden="true" />
            </span>
            <p className="text-sm">
              <span className="block text-xs text-muted-foreground">
                Seçiminiz
              </span>
              <strong className="font-semibold">
                {selectedCategory.shortLabel}
              </strong>
            </p>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="h-10 gap-2 self-start rounded-[10px] px-3"
            onClick={() => setStep((value) => Math.max(1, value - 1))}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Geri
          </Button>
        )}

        {step < 4 ? (
          <div className="sm:text-right">
            <Button
              type="button"
              className="h-11 w-full gap-2 rounded-[10px] px-5 sm:w-auto"
              onClick={() => setStep((value) => Math.min(4, value + 1))}
            >
              {step === 1
                ? topic === 'all'
                  ? 'Tüm kapsamla devam et'
                  : 'Seçimimi kullan ve devam et'
                : step === 2
                  ? 'Koşullara geç'
                  : 'Okuma listesini oluştur'}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <span className="mt-1.5 hidden text-[10px] text-muted-foreground sm:block">
              {step === 1
                ? 'Sonraki adım: tesis profili'
                : step === 2
                  ? 'Sonraki adım: proses ve konum'
                  : 'Sonraki adım: resmî kaynaklı liste'}
            </span>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 rounded-[10px] px-5"
            onClick={reset}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Yeni rota
          </Button>
        )}
      </div>
    </div>
  );
}
