'use client';

import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { ExternalLink } from '@/components/site/external-link';
import { areaStyle } from '@/lib/area-theme';
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
const categoryLabel = new Map(
  categories.map((category) => [category.id, category.shortLabel]),
);

/**
 * Arama dizinleri bir kez kurulur.
 * Ad/kısaltma eşleşmesi konu eşleşmesinden ayrı tutulur; "SKHKKY" tek
 * kaydı, "atıksu" konu kayıtlarını getirir ve adı geçenler üstte kalır.
 */
const primaryIndex = new Map(
  legislation.map((item) => [item.slug, fold(primarySearchText(item))]),
);
const secondaryIndex = new Map(
  legislation.map((item) => [item.slug, fold(secondarySearchText(item))]),
);

const PAGE_SIZE = 15;

export function LegislationBrowser({
  initialCategory = 'all',
  initialQuery = '',
  initialDocumentType = 'all',
  initialRecordStatus = 'all',
}: {
  initialCategory?: string;
  initialQuery?: string;
  initialDocumentType?: string;
  initialRecordStatus?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    categories.some((item) => item.id === initialCategory)
      ? initialCategory
      : 'all',
  );
  const [documentType, setDocumentType] = useState<'all' | DocumentType>(
    documentTypes.includes(initialDocumentType as DocumentType)
      ? (initialDocumentType as DocumentType)
      : 'all',
  );
  const [recordStatus, setRecordStatus] = useState<'all' | RecordStatus>(
    recordStatuses.includes(initialRecordStatus as RecordStatus)
      ? (initialRecordStatus as RecordStatus)
      : 'all',
  );
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Filtre durumu adres çubuğuna yazılır; liste paylaşılabilir olur.
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
      {/* ---- arama ---- */}
      <div className="relative">
        <label htmlFor="legislation-search" className="sr-only">
          Mevzuatta ara
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="legislation-search"
          type="search"
          value={query}
          onChange={(event) => changeQuery(event.target.value)}
          className="field h-14 pr-11 pl-12 text-md"
          placeholder="SKHKKY, atiksu, GEKAP, 32029…"
        />
        {query && (
          <button
            type="button"
            onClick={() => changeQuery('')}
            aria-label="Aramayı temizle"
            className="absolute top-1/2 right-2.5 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Kısaltma, Türkçe karaktersiz yazım ve Resmî Gazete sayısı çalışır.
      </p>

      {/* ---- alan filtresi ---- */}
      <fieldset className="mt-6">
        <legend className="eyebrow mb-2.5">Çevre alanı</legend>
        <div className="chip-scroller">
          <button
            type="button"
            onClick={() => changeCategory('all')}
            aria-pressed={category === 'all'}
            className="pill"
          >
            Tümü
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => changeCategory(item.id)}
              aria-pressed={category === item.id}
              style={areaStyle(item.id)}
              className="pill pill-area"
            >
              <span className="area-dot" aria-hidden="true" />
              {item.shortLabel}
            </button>
          ))}
        </div>
      </fieldset>

      {/* ---- ek filtreler, katlanır ---- */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowMoreFilters((current) => !current)}
          aria-expanded={showMoreFilters}
          className="pill"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Belge türü ve yürürlük
        </button>
        {showMoreFilters && (
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <fieldset>
              <legend className="eyebrow mb-2.5">Belge türü</legend>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => changeDocumentType('all')}
                  aria-pressed={documentType === 'all'}
                  className="pill"
                >
                  Tümü
                </button>
                {documentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => changeDocumentType(type)}
                    aria-pressed={documentType === type}
                    className="pill"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="eyebrow mb-2.5">Yürürlük</legend>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => changeRecordStatus('all')}
                  aria-pressed={recordStatus === 'all'}
                  className="pill"
                >
                  Tümü
                </button>
                {recordStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => changeRecordStatus(status)}
                    aria-pressed={recordStatus === status}
                    className="pill"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </div>

      {/* ---- sonuç sayacı ---- */}
      <div className="mt-7 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border pb-4">
        <p className="text-sm">
          <span className="font-semibold">{filtered.length}</span>{' '}
          <span className="text-muted-foreground">kayıt</span>
          {query.trim() && filtered.length > exactCount && (
            <span className="text-muted-foreground">
              {' · '}
              {exactCount > 0
                ? `${exactCount} tanesi adında geçiyor`
                : 'tamamı konu eşleşmesi'}
            </span>
          )}
        </p>
        <div className="flex items-baseline gap-5">
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-primary hover:underline"
            >
              Filtreleri temizle
            </button>
          )}
          <p className="gazette text-muted-foreground">
            Kontrol: {lastSourceCheck()}
          </p>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} kayıt bulundu.
      </p>

      {/* ---- sonuçlar ---- */}
      {shown.length > 0 ? (
        <>
          <ul className="mt-5 grid gap-3">
            {shown.map((item) => {
              const areaId = item.categories[0] ?? 'izin';
              return (
                <li key={item.slug} style={areaStyle(areaId)}>
                  <div className="card area-edge p-5">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="area-dot" aria-hidden="true" />
                      <span className="text-sm text-muted-foreground">
                        {categoryLabel.get(areaId) ?? item.type} · {item.type}
                      </span>
                      <span
                        className={`badge ml-auto ${
                          item.status === 'Yürürlükte'
                            ? 'badge-live'
                            : 'badge-repealed'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-md font-semibold leading-snug">
                      <Link
                        href={`/mevzuat/${item.slug}`}
                        className="hover:text-primary hover:underline"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="measure mt-2 text-sm leading-7 text-muted-foreground">
                      {item.appliesTo}
                    </p>
                    {item.primaryAnnex && (
                      <p className="measure mt-2.5 text-sm leading-6">
                        <span className="eyebrow">Önce bakın</span>{' '}
                        <span className="text-muted-foreground">
                          {item.primaryAnnex}
                        </span>
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <Link
                        href={`/mevzuat/${item.slug}`}
                        className="font-medium text-primary hover:underline"
                      >
                        Kayıt sayfası
                      </Link>
                      <ExternalLink
                        href={item.consolidatedUrl ?? item.sourceUrl}
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink hover:underline"
                        iconClassName="size-3.5"
                      >
                        {item.consolidatedUrl ? 'Güncel metin' : 'Resmî kaynak'}
                      </ExternalLink>
                      <span className="gazette ml-auto text-muted-foreground">
                        RG {item.gazetteNumber} · {item.publicationLabel}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {shown.length < filtered.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="btn inline-flex items-center justify-center btn-quiet mt-6 h-12 px-5"
            >
              {Math.min(PAGE_SIZE, filtered.length - shown.length)} kayıt daha
              göster
              <ArrowRight className="size-4 rotate-90" aria-hidden="true" />
            </button>
          )}
        </>
      ) : (
        <div className="card mt-5 px-6 py-14 text-center">
          <Search
            className="mx-auto size-6 text-muted-foreground"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-md font-semibold">
            Eşleşen kayıt bulunamadı
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
            Kısaltma da deneyebilirsiniz: SKHKKY, ÇİLY, AYY, GEKAP, SEÖS. Ya da
            filtreleri temizleyip konudan başlayın.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="btn inline-flex items-center justify-center btn-quiet mt-5 h-11 px-4 text-sm"
          >
            Filtreleri temizle
          </button>
        </div>
      )}
    </div>
  );
}
