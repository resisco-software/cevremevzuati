'use client';

import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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
 * Arama dizinleri bir kez kurulur.
 * Başlık/kısaltma eşleşmesi ile konu eşleşmesi ayrı tutulur, böylece
 * "SKHKKY" araması tek kaydı; "atıksu" araması konu kayıtlarını getirir.
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
      <label htmlFor="legislation-search" className="block">
        <span className="label">Kayıt ara</span>
        <span className="mt-2 flex items-center border-b-2 border-ink">
          <Search
            className="size-5 shrink-0 text-lead"
            aria-hidden="true"
          />
          <input
            id="legislation-search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            className="font-display h-14 w-full bg-transparent px-3 text-xl outline-none placeholder:text-lead/70"
            placeholder="SKHKKY, atiksu, GEKAP, 32029…"
          />
        </span>
      </label>
      <p className="mt-2 text-sm text-muted-foreground">
        Ad, kısaltma veya Resmî Gazete sayısı. Türkçe karakter kullanmanız
        gerekmez.
      </p>

      {/* ---- filtreler ---- */}
      <div className="mt-8 grid gap-5">
        <fieldset>
          <legend className="label mb-2.5">Alan</legend>
          <div className="chip-scroller">
            <button
              type="button"
              onClick={() => changeCategory('all')}
              aria-pressed={category === 'all'}
              className="filter-chip"
            >
              Tümü
            </button>
            {categories.map((item) => (
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
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend className="label mb-2.5">Belge türü</legend>
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
            <legend className="label mb-2.5">Yürürlük</legend>
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

      {/* ---- sonuç künyesi ---- */}
      <div className="ruled mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
        <p className="record text-sm">
          <span className="text-ink">{filtered.length}</span>{' '}
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
              className="text-sm text-seal underline decoration-rule underline-offset-4 hover:decoration-seal"
            >
              Filtreleri temizle
            </button>
          )}
          <p className="record text-xs text-muted-foreground">
            Kontrol: {lastSourceCheck()}
          </p>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} kayıt bulundu.
      </p>

      {/* ---- sicil ---- */}
      {shown.length > 0 ? (
        <>
          <ol className="record-list mt-1">
            {shown.map((item, index) => (
              <li key={item.slug}>
                <div className="record-row hanging">
                  <span className="hanging-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="font-display max-w-2xl text-md font-semibold leading-snug">
                      <Link
                        href={`/mevzuat/${item.slug}`}
                        className="hover:text-seal"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <span className="record shrink-0 text-xs text-muted-foreground">
                      {item.type} · RG {item.gazetteNumber}
                    </span>
                  </div>
                  <p className="measure mt-2 text-sm leading-7 text-muted-foreground">
                    {item.appliesTo}
                  </p>
                  {item.primaryAnnex && (
                    <p className="measure mt-1.5 text-sm leading-7">
                      <span className="label">Önce</span>{' '}
                      <span className="text-muted-foreground">
                        {item.primaryAnnex}
                      </span>
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span
                      className={
                        item.status === 'Yürürlükte'
                          ? 'status'
                          : 'status status-repealed'
                      }
                    >
                      {item.status}
                    </span>
                    <Link
                      href={`/mevzuat/${item.slug}`}
                      className="underline decoration-rule underline-offset-4 hover:text-seal hover:decoration-seal"
                    >
                      Kayıt sayfası
                    </Link>
                    <ExternalLink
                      href={item.consolidatedUrl ?? item.sourceUrl}
                      className="inline-flex items-center gap-1.5 text-muted-foreground underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-seal"
                      iconClassName="size-3"
                    >
                      {item.consolidatedUrl ? 'Güncel metin' : 'Resmî kaynak'}
                    </ExternalLink>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          {shown.length < filtered.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="mt-8 inline-flex h-11 items-center gap-2 border border-rule-strong px-4 text-sm hover:border-ink"
            >
              {Math.min(PAGE_SIZE, filtered.length - shown.length)} kayıt daha
              <ArrowRight className="size-4 rotate-90" aria-hidden="true" />
            </button>
          )}
        </>
      ) : (
        <div className="ruled mt-1 py-16 text-center">
          <h3 className="font-display text-lg font-semibold">
            Eşleşen kayıt bulunamadı
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Kısaltma da deneyebilirsiniz: SKHKKY, ÇİLY, AYY, GEKAP, SEÖS.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 inline-flex h-11 items-center border border-rule-strong px-4 text-sm hover:border-ink"
          >
            Filtreleri temizle
          </button>
        </div>
      )}
    </div>
  );
}
