'use client';

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Cloud,
  Droplets,
  ExternalLink,
  FileSearch,
  FlaskConical,
  Info,
  Layers3,
  MapPinned,
  Recycle,
  RotateCcw,
  Volume2,
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
import {
  Progress,
  ProgressLabel,
} from '@/components/ui/progress';
import { categories, legislation } from '@/lib/legislation-data';

const wizardTopics = categories.filter((category) =>
  ['kurulus', 'izin', 'hava', 'su', 'atik', 'kimyasal', 'toprak', 'gurultu', 'entegre'].includes(category.id),
);

const icons = {
  kurulus: Building2,
  izin: CheckCircle2,
  hava: Cloud,
  su: Droplets,
  atik: Recycle,
  kimyasal: FlaskConical,
  toprak: MapPinned,
  gurultu: Volume2,
  entegre: Layers3,
} as const;

const featureOptions = [
  { id: 'combustion', label: 'Yakma tesisi veya ısıl güç kaynağı var' },
  { id: 'stack', label: 'Proses bacası, toz, VOC veya koku kaynağı var' },
  { id: 'wastewater', label: 'Proses atıksuyu oluşuyor' },
  { id: 'direct-discharge', label: 'Alıcı ortama doğrudan deşarj var' },
  { id: 'waste-treatment', label: 'Tesiste atık işleme faaliyeti var' },
  { id: 'chemicals', label: 'Kimyasal imalatı, ithalatı veya depolaması var' },
];

const locationOptions = [
  { id: 'osb', label: 'Organize sanayi bölgesinde' },
  { id: 'coast', label: 'Kıyı veya denizle ilişkili' },
  { id: 'protected', label: 'Korunan alanla ilişkili olabilir' },
  { id: 'unknown-location', label: 'Konumsal statü henüz bilinmiyor' },
];

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

export function LegislationWizard() {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('hava');
  const [stage, setStage] = useState('faaliyette');
  const [sector, setSector] = useState('genel');
  const [features, setFeatures] = useState<string[]>(['stack']);
  const [locations, setLocations] = useState<string[]>(['osb']);

  const selectedCategory = categories.find((category) => category.id === topic)!;
  const SelectedIcon = icons[topic as keyof typeof icons];

  const results = useMemo(() => {
    const direct = legislation.filter((item) => item.categories.includes(topic));
    const baseline = legislation.filter((item) =>
      ['cevre-kanunu-2872', 'cevre-izin-ve-lisans-yonetmeligi'].includes(item.slug),
    );
    return [...new Map([...baseline, ...direct].map((item) => [item.slug, item])).values()].slice(0, 7);
  }, [topic]);

  function toggle(value: string, values: string[], setter: (next: string[]) => void) {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  function reset() {
    setStep(1);
    setTopic('hava');
    setStage('faaliyette');
    setSector('genel');
    setFeatures(['stack']);
    setLocations(['osb']);
  }

  return (
    <div className="overflow-hidden rounded-[28px] bg-card shadow-[0_26px_70px_-34px_oklch(0.18_0.03_166/0.38)] ring-1 ring-foreground/10">
      <div className="border-b border-border/70 px-6 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Mevzuat pusulası</p>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.025em]">Tesisiniz için okuma rotası</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Dört kısa adımda, önce okunması gereken düzenlemeleri daraltın.</p>
          </div>
          <span className="hidden rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground sm:inline-flex">3–4 dk.</span>
        </div>
        <Progress value={step * 25} locale="tr-TR" className="mt-5 gap-2">
          <ProgressLabel>{step === 1 ? 'Konu' : step === 2 ? 'Tesis' : step === 3 ? 'Koşullar' : 'Okuma listesi'}</ProgressLabel>
          <span className="ml-auto text-sm tabular-nums text-muted-foreground">{step} / 4</span>
        </Progress>
      </div>

      <div className="min-h-[470px] px-6 py-6 sm:px-8 sm:py-7" aria-live="polite">
        {step === 1 && (
          <section aria-labelledby="wizard-step-one">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 id="wizard-step-one" className="font-heading text-lg font-semibold tracking-tight">Hangi alanla başlayalım?</h3>
              <span className="text-xs text-muted-foreground">Bir alan seçin</span>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2" aria-label="Çevre mevzuatı alanları">
              {wizardTopics.map((item) => {
                const Icon = icons[item.id as keyof typeof icons];
                const active = topic === item.id;
                return (
                  <li key={item.id} className="contents">
                  <button
                    type="button"
                    onClick={() => setTopic(item.id)}
                    aria-pressed={active}
                    className="topic-option group flex min-h-14 items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-all"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground transition-colors group-aria-pressed:bg-primary group-aria-pressed:text-primary-foreground">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <span className="flex-1 leading-5">{item.shortLabel}</span>
                    {active ? (
                      <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                    ) : (
                      <ArrowRight className="size-4 text-muted-foreground/50" aria-hidden="true" />
                    )}
                  </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="wizard-step-two">
            <p className="mb-2 text-xs font-semibold text-primary">2. adım</p>
            <h3 id="wizard-step-two" className="font-heading text-2xl font-semibold tracking-tight">Tesisin temel profilini seçin</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Faaliyet adı ve kapasite eşikleri, ayrıntılı kapsam kontrolünde ayrıca istenir.</p>
            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold" htmlFor="facility-stage">
                Tesisin yaşam evresi
                <NativeSelect id="facility-stage" value={stage} onChange={(event) => setStage(event.target.value)} className="w-full [&>select]:h-11 [&>select]:rounded-xl">
                  <NativeSelectOption value="planlama">Planlama / yeni kuruluş</NativeSelectOption>
                  <NativeSelectOption value="faaliyette">Faaliyette</NativeSelectOption>
                  <NativeSelectOption value="degisiklik">Kapasite veya proses değişikliği</NativeSelectOption>
                  <NativeSelectOption value="kapanis">Faaliyet sonlandırma</NativeSelectOption>
                </NativeSelect>
              </label>
              <label className="grid gap-2 text-sm font-semibold" htmlFor="facility-sector">
                Ana faaliyet grubu
                <NativeSelect id="facility-sector" value={sector} onChange={(event) => setSector(event.target.value)} className="w-full [&>select]:h-11 [&>select]:rounded-xl">
                  <NativeSelectOption value="genel">Genel imalat sanayii</NativeSelectOption>
                  <NativeSelectOption value="mineral">Çimento, seramik ve mineral</NativeSelectOption>
                  <NativeSelectOption value="metal">Metal üretimi ve işleme</NativeSelectOption>
                  <NativeSelectOption value="kimya">Kimya ve petrokimya</NativeSelectOption>
                  <NativeSelectOption value="enerji">Enerji üretimi</NativeSelectOption>
                  <NativeSelectOption value="atik">Atık yönetimi</NativeSelectOption>
                  <NativeSelectOption value="tekstil">Tekstil ve deri</NativeSelectOption>
                  <NativeSelectOption value="gida">Gıda ve tarım ürünleri</NativeSelectOption>
                </NativeSelect>
              </label>
            </div>
            <Alert className="mt-7 rounded-xl border-primary/20 bg-primary/5 px-4 py-3">
              <Info className="text-primary" aria-hidden="true" />
              <AlertTitle>NACE kodu tek başına kapsam kararı üretmez</AlertTitle>
              <AlertDescription>Faaliyet adı, proses ve mevzuattaki kapasite eşiği birlikte kontrol edilir.</AlertDescription>
            </Alert>
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="wizard-step-three">
            <p className="mb-2 text-xs font-semibold text-primary">3. adım</p>
            <h3 id="wizard-step-three" className="font-heading text-2xl font-semibold tracking-tight">Tesiste hangi koşullar var?</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Bildiğiniz seçenekleri işaretleyin; bilmediğiniz alanlar sonuçta açıkça gösterilir.</p>
            <div className="mt-7 grid gap-7 lg:grid-cols-2">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">Proses ve çevresel çıkışlar</legend>
                <div className="grid gap-2.5">
                  {featureOptions.map((option) => (
                    <label key={option.id} className="choice-row flex cursor-pointer items-start gap-3 rounded-xl border border-border px-3.5 py-3 text-sm leading-5 hover:bg-muted/50">
                      <Checkbox
                        checked={features.includes(option.id)}
                        onCheckedChange={() => toggle(option.id, features, setFeatures)}
                        aria-label={option.label}
                        className="mt-0.5"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">Konum bilgileri</legend>
                <div className="grid gap-2.5">
                  {locationOptions.map((option) => (
                    <label key={option.id} className="choice-row flex cursor-pointer items-start gap-3 rounded-xl border border-border px-3.5 py-3 text-sm leading-5 hover:bg-muted/50">
                      <Checkbox
                        checked={locations.includes(option.id)}
                        onCheckedChange={() => toggle(option.id, locations, setLocations)}
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
                <p className="mb-2 text-xs font-semibold text-primary">4. adım · Ön okuma listesi</p>
                <h3 id="wizard-step-four" className="font-heading text-2xl font-semibold tracking-tight">{selectedCategory.shortLabel} için başlangıç rotası</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{results.length} düzenleme, seçtiğiniz bilgilerle birlikte incelenmeli.</p>
              </div>
              <Badge variant="outline" className="h-7 gap-1.5 rounded-full border-primary/25 bg-primary/5 px-3 text-primary">
                <SelectedIcon className="size-3.5" aria-hidden="true" />
                {selectedCategory.shortLabel}
              </Badge>
            </div>

            <Alert className="mt-5 rounded-xl border-primary/20 bg-primary/5 px-4 py-3">
              <FileSearch className="text-primary" aria-hidden="true" />
              <AlertTitle>Bu liste mevzuat yorumu içermez</AlertTitle>
              <AlertDescription>Konu ve tesis verileriniz resmî düzenleme başlıklarıyla eşleştirilir. Kapsam sonucu, ilgili madde veya ek dayanağı doğrulandığında kesinleşir.</AlertDescription>
            </Alert>

            <div className="mt-5 grid max-h-[370px] gap-2.5 overflow-y-auto pr-1">
              {results.map((item, index) => (
                <article key={item.slug} className="rounded-xl border border-border bg-background/55 p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold leading-5">{item.title}</h4>
                        <Badge variant={item.slug === 'cevre-kanunu-2872' ? 'secondary' : 'outline'} className="h-5 rounded-full">
                          {item.slug === 'cevre-kanunu-2872' ? 'Temel düzenleme' : 'Konu eşleşmesi'}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Kontrol dayanağı: {basis[item.slug] ?? 'İlgili faaliyet, kapasite ve kapsam hükümleri'}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        <Link className="font-semibold text-primary hover:underline" href={`/mevzuat/${item.slug}`}>Kayıt sayfası</Link>
                        <a className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground" href={item.sourceUrl}>
                          Resmî kaynak <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        {step === 1 ? (
          <div className="flex items-center gap-3" aria-live="polite">
            <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
              <SelectedIcon className="size-4" aria-hidden="true" />
            </span>
            <p className="text-sm">
              <span className="block text-xs text-muted-foreground">Seçiminiz</span>
              <strong className="font-semibold">{selectedCategory.shortLabel}</strong>
            </p>
          </div>
        ) : (
          <Button type="button" variant="ghost" className="h-10 gap-2 self-start rounded-xl px-3" onClick={() => setStep((value) => Math.max(1, value - 1))}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Geri
          </Button>
        )}

        {step < 4 ? (
          <Button type="button" className="h-11 gap-2 rounded-xl px-5" onClick={() => setStep((value) => Math.min(4, value + 1))}>
            {step === 1 ? 'Tesis bilgilerine geç' : step === 2 ? 'Koşullara geç' : 'Okuma listesini oluştur'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button type="button" variant="outline" className="h-11 gap-2 rounded-xl px-5" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Yeni rota
          </Button>
        )}
      </div>
    </div>
  );
}
