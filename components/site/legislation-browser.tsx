'use client';

import {
  Archive,
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink } from '@/components/site/external-link';
import {
  categories,
  lastSourceCheck,
  legislation,
  primarySearchText,
  secondarySearchText,
} from '@/lib/legislation-data';
import { fold, matchesAllTerms } from '@/lib/text';

type DocumentType = (typeof legislation)[number]['type'];
type RecordStatus = (typeof legislation)[number]['status'];

const documentTypes = Array.from(new Set(legislation.map((item) => item.type)));
const recordStatuses = Array.from(
  new Set(legislation.map((item) => item.status)),
);

/**
 * Arama dizinleri bir kez kurulur; her tuş vuruşunda yeniden üretilmez.
 * Başlık/kısaltma eşleşmesi ile konu eşleşmesi ayrı tutulur, böylece
 * "SKHKKY" araması tek kaydı; "atıksu" araması konu kayıtlarını getirir.
 */
const primaryIndex = new Map(
  legislation.map((item) => [item.slug, fold(primarySearchText(item))]),
);
const secondaryIndex = new Map(
  legislation.map((item) => [item.slug, fold(secondarySearchText(item))]),
);

const PAGE_SIZE = 12;

export function LegislationBrowser({
  initialCategory = 'all',
  initialQuery = '',
}: {
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    categories.some((item) => item.id === initialCategory)
      ? initialCategory
      : 'all',
  );
  const [documentType, setDocumentType] = useState<'all' | DocumentType>('all');
  const [recordStatus, setRecordStatus] = useState<'all' | RecordStatus>('all');
  const [showAllCategories, setShowAllCategories] = useState(
    categories.findIndex((item) => item.id === initialCategory) >= 8,
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Filtre durumu adres çubuğuna yazılır; liste paylaşılabilir ve
  // yer imine eklenebilir hale gelir. Sayfa yeniden yüklenmez.
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('alan', category);
    if (query.trim()) params.set('q', query.trim());
    if (documentType !== 'all') params.set('tur', documentType);
    if (recordStatus !== 'all') params.set('durum', recordStatus);
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ''}`;
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, '', next);
    }
  }, [category, documentType, query, recordStatus]);

  const { filtered, exactCount } = useMemo(() => {
    const trimmed = query.trim();
    const inScope = legislation.filter((item) => {
      if (category !== 'all' && !item.categories.includes(category)) {
        return false;
      }
      if (documentType !== 'all' && item.type !== documentType) return false;
      if (recordStatus !== 'all' && item.status !== recordStatus) return false;
      return true;
    });

    if (!trimmed) return { filtered: inScope, exactCount: 0 };

    const byName = inScope.filter((item) =>
      matchesAllTerms(primaryIndex.get(item.slug) ?? '', trimmed),
    );
    const byTopic = inScope.filter(
      (item) =>
        !byName.includes(item) &&
        matchesAllTerms(secondaryIndex.get(item.slug) ?? '', trimmed),
    );
    return { filtered: [...byName, ...byTopic], exactCount: byName.length };
  }, [category, documentType, query, recordStatus]);

  const shown = filtered.slice(0, visibleCount);
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 8);
  const hasFilters =
    query.trim().length > 0 ||
    category !== 'all' ||
    documentType !== 'all' ||
    recordStatus !== 'all';

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setDocumentType('all');
    setRecordStatus('all');
    setVisibleCount(PAGE_SIZE);
  }

  /** Her filtre değişiminde liste başa döner. */
  function update<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setVisibleCount(PAGE_SIZE);
    };
  }

  const changeQuery = update(setQuery);
  const changeCategory = update(setCategory);
  const changeDocumentType = update<'all' | DocumentType>(setDocumentType);
  const changeRecordStatus = update<'all' | RecordStatus>(setRecordStatus);

  return (
    <div>
      <div className="precision-card overflow-hidden">
        <div className="grid gap-5 border-b border-border p-5 sm:grid-cols-[0.68fr_1.32fr] sm:items-end sm:p-6">
          <div>
            <p className="section-kicker">Mevzuat araması</p>
            <h2 className="mt-2 font-heading text-[28px] font-semibold tracking-[-0.02em]">
              Ne arıyorsunuz?
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Adını, kısaltmasını veya Resmî Gazete sayısını yazın. Türkçe
              karakter kullanmanız gerekmez.
            </p>
          </div>
          <label className="relative" htmlFor="legislation-search">
            <span className="sr-only">Mevzuat ara</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-primary"
              aria-hidden="true"
            />
            <Input
              id="legislation-search"
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              className="h-13 rounded-lg border-input bg-background pr-4 pl-12 text-base shadow-none focus-visible:border-primary"
              placeholder="Örn. SKHKKY, atiksu, GEKAP, 32029…"
            />
          </label>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Konuya göre daraltın</p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded text-sm font-semibold text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
              >
                Aramayı temizle
              </button>
            )}
          </div>
          <fieldset className="chip-scroller">
            <legend className="sr-only">Mevzuat alanına göre filtrele</legend>
            <button
              type="button"
              onClick={() => changeCategory('all')}
              aria-pressed={category === 'all'}
              className="filter-chip"
            >
              Tümü
            </button>
            {visibleCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => changeCategory(item.id)}
                aria-pressed={category === item.id}
                className="filter-chip"
              >
                {item.shortLabel}
              </button>
            ))}
            {categories.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAllCategories((current) => !current)}
                className="filter-chip"
                aria-expanded={showAllCategories}
              >
                {showAllCategories
                  ? 'Daha az alan'
                  : `${categories.length - 8} alan daha`}
              </button>
            )}
          </fieldset>

          <div className="mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
            <fieldset>
              <legend className="mb-2.5 text-sm font-semibold">
                Belge türü
              </legend>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => changeDocumentType('all')}
                  aria-pressed={documentType === 'all'}
                  className="filter-chip"
                >
                  Tümü
                </button>
                {documentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => changeDocumentType(type)}
                    aria-pressed={documentType === type}
                    className="filter-chip"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2.5 text-sm font-semibold">
                Yürürlük durumu
              </legend>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => changeRecordStatus('all')}
                  aria-pressed={recordStatus === 'all'}
                  className="filter-chip"
                >
                  Tümü
                </button>
                {recordStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => changeRecordStatus(status)}
                    aria-pressed={recordStatus === status}
                    className="filter-chip"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">
            {filtered.length}
          </strong>{' '}
          kayıt gösteriliyor
          {query.trim() && filtered.length > exactCount && (
            <>
              {' · '}
              {exactCount > 0
                ? `${exactCount} tanesi adında geçiyor, sonrakiler konu eşleşmesi`
                : 'tamamı konu eşleşmesi'}
            </>
          )}
        </p>
        <p className="text-sm text-muted-foreground">
          En son kaynak kontrolü: {lastSourceCheck()}
        </p>
      </div>
      {/* Sonuç sayısı ayrıca duyurulur; liste gövdesi canlı bölge değildir. */}
      <p className="sr-only" aria-live="polite">
        {filtered.length} kayıt bulundu.
      </p>

      {shown.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {shown.map((item) => (
            <article
              key={item.slug}
              className="precision-card group grid gap-5 p-5 transition-colors sm:grid-cols-[auto_1fr_auto] sm:items-start sm:p-6"
            >
              <span className="grid size-10 place-items-center rounded-md border border-border bg-background text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  <Badge
                    variant="outline"
                    className={`gap-1 ${
                      item.status === 'Yürürlükte'
                        ? 'border-primary/25 bg-primary/5 text-primary'
                        : 'border-destructive/30 bg-destructive/8 text-destructive'
                    }`}
                  >
                    {item.status === 'Yürürlükte' ? (
                      <CheckCircle2 className="size-3" aria-hidden="true" />
                    ) : (
                      <Archive className="size-3" aria-hidden="true" />
                    )}
                    {item.status}
                  </Badge>
                </div>
                <h3 className="mt-3 font-heading text-lg font-semibold leading-7 tracking-[-0.02em]">
                  <Link
                    href={`/mevzuat/${item.slug}`}
                    className="rounded hover:text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {item.appliesTo}
                </p>
                {item.primaryAnnex && (
                  <p className="mt-2 max-w-3xl text-sm leading-6">
                    <span className="font-semibold">Önce şuna bakın: </span>
                    <span className="text-muted-foreground">
                      {item.primaryAnnex}
                    </span>
                  </p>
                )}
                <div className="meta-type mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span>Resmî Gazete: {item.publicationLabel}</span>
                  <span>Sayı: {item.gazetteNumber}</span>
                  {item.foundation && <span>Temel düzenleme</span>}
                </div>
              </div>
              <div className="grid gap-2 sm:flex sm:flex-col sm:items-end">
                <Button
                  nativeButton={false}
                  render={<Link href={`/mevzuat/${item.slug}`} />}
                  className="h-10 w-full justify-between rounded-md px-3.5 sm:w-auto"
                >
                  Kayıt sayfası
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <ExternalLink
                  href={item.consolidatedUrl ?? item.sourceUrl}
                  className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60 sm:w-auto"
                >
                  {item.consolidatedUrl ? 'Güncel metin' : 'Resmî kaynak'}
                </ExternalLink>
              </div>
            </article>
          ))}
          {shown.length < filtered.length && (
            <div className="flex justify-center pt-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg px-5"
                onClick={() =>
                  setVisibleCount((count) => count + PAGE_SIZE)
                }
              >
                {Math.min(PAGE_SIZE, filtered.length - shown.length)} kayıt daha
                göster
                <ArrowRight className="size-4 rotate-90" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-input px-6 py-16 text-center">
          <Search
            className="mx-auto size-6 text-muted-foreground"
            aria-hidden="true"
          />
          <h3 className="mt-4 font-heading text-lg font-semibold">
            Eşleşen kayıt bulunamadı
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Kısaltma da deneyebilirsiniz: SKHKKY, ÇİLY, AYY, GEKAP, SEÖS.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 h-10 rounded-md px-4"
            onClick={clearFilters}
          >
            Filtreleri temizle
          </Button>
        </div>
      )}
    </div>
  );
}
