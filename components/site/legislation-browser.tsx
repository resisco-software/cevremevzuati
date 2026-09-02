'use client';

import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categories, legislation } from '@/lib/legislation-data';

type DocumentType = (typeof legislation)[number]['type'];
type RecordStatus = (typeof legislation)[number]['status'];

const documentTypes = Array.from(new Set(legislation.map((item) => item.type)));
const recordStatuses = Array.from(
  new Set(legislation.map((item) => item.status)),
);

export function LegislationBrowser({
  compact = false,
  initialCategory = 'all',
}: {
  compact?: boolean;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState('');
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
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    return legislation.filter((item) => {
      const matchesCategory =
        category === 'all' ||
        item.foundation ||
        item.categories.includes(category);
      const matchesType = documentType === 'all' || item.type === documentType;
      const matchesStatus =
        recordStatus === 'all' || item.status === recordStatus;
      const categoryTerms = item.categories
        .flatMap((id) => {
          const entry = categories.find((candidate) => candidate.id === id);
          return entry
            ? [
                entry.label,
                entry.shortLabel,
                entry.description,
                ...entry.subtopics,
              ]
            : [];
        })
        .join(' ');
      const changeTerms = item.changes?.map((change) => change.label).join(' ');
      const matchesQuery =
        normalized.length === 0 ||
        [
          item.title,
          item.summary,
          item.type,
          item.gazetteNumber,
          categoryTerms,
          changeTerms,
        ]
          .join(' ')
          .toLocaleLowerCase('tr-TR')
          .includes(normalized);
      return matchesCategory && matchesType && matchesStatus && matchesQuery;
    });
  }, [category, documentType, query, recordStatus]);

  const shown = compact
    ? filtered.slice(0, 9)
    : filtered.slice(0, visibleCount);
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
    setVisibleCount(12);
  }

  function changeQuery(value: string) {
    setQuery(value);
    setVisibleCount(12);
  }

  function changeCategory(value: string) {
    setCategory(value);
    setVisibleCount(12);
  }

  function changeDocumentType(value: 'all' | DocumentType) {
    setDocumentType(value);
    setVisibleCount(12);
  }

  function changeRecordStatus(value: 'all' | RecordStatus) {
    setRecordStatus(value);
    setVisibleCount(12);
  }

  return (
    <div>
      <div className="precision-card overflow-hidden">
        <div className="grid gap-5 border-b border-border/80 p-5 sm:grid-cols-[0.68fr_1.32fr] sm:items-end sm:p-6">
          <div>
            <p className="section-kicker">Mevzuat araması</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-[-0.035em]">
              Ne arıyorsunuz?
            </h2>
            <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
              Adını biliyorsanız yazın; bilmiyorsanız çevre alanını seçin.
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
              className="h-13 rounded-xl border-input bg-background pr-4 pl-12 text-[15px] shadow-none focus-visible:border-primary"
              placeholder="Örn. çevre izni, atık, 32029…"
            />
          </label>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold">Konuya göre daraltın</p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Aramayı temizle
              </button>
            )}
          </div>
          <fieldset className="flex flex-wrap gap-2">
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
            <button
              type="button"
              onClick={() => setShowAllCategories((current) => !current)}
              className="filter-chip"
              aria-expanded={showAllCategories}
            >
              {showAllCategories
                ? 'Daha az alan'
                : `${categories.length - visibleCategories.length} alan daha`}
            </button>
          </fieldset>

          <div className="mt-5 grid gap-5 border-t border-border/70 pt-5 sm:grid-cols-2">
            <fieldset>
              <legend className="mb-2.5 text-xs font-semibold">
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
              <legend className="mb-2.5 text-xs font-semibold">
                Kayıt durumu
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
          <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
            <strong className="font-semibold text-foreground">
              Kayıt durumu:
            </strong>{' '}
            “Yürürlükte” güncel resmî listede doğrulanan kaydı; “Kaynak kaydı”
            ise yayım künyesi eklenmiş ve yürürlük kontrolü süren kaydı
            gösterir.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <strong className="font-semibold text-foreground">
            {filtered.length}
          </strong>{' '}
          kayıt gösteriliyor
        </p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Son kaynak kontrolü: 2 Eylül 2026
        </p>
      </div>

      {shown.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {shown.map((item) => (
            <article
              key={item.slug}
              className="precision-card group grid gap-5 p-5 transition-colors sm:grid-cols-[auto_1fr_auto] sm:items-start sm:p-6"
            >
              <span className="grid size-10 place-items-center rounded-[10px] border border-border bg-background text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  <Badge
                    variant="outline"
                    className={`gap-1 ${
                      item.status === 'Yürürlükte'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.status === 'Yürürlükte' ? (
                      <CheckCircle2 className="size-3" aria-hidden="true" />
                    ) : (
                      <FileText className="size-3" aria-hidden="true" />
                    )}
                    {item.status}
                  </Badge>
                </div>
                <h3 className="mt-3 font-heading text-xl font-semibold leading-6 tracking-[-0.03em] sm:text-[22px] sm:leading-7">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {item.summary}
                </p>
                <div className="meta-type mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
                  <span>Resmî Gazete: {item.publicationLabel}</span>
                  <span>Sayı: {item.gazetteNumber}</span>
                  <span>
                    {item.foundation
                      ? 'Temel düzenleme'
                      : item.categories
                          .map(
                            (id) =>
                              categories.find((entry) => entry.id === id)
                                ?.shortLabel,
                          )
                          .filter(Boolean)
                          .slice(0, 3)
                          .join(' · ')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col sm:items-end">
                <Button
                  nativeButton={false}
                  render={
                    <Link
                      href={`/mevzuat/${item.slug}`}
                      aria-label={`${item.title} kayıt sayfası`}
                    />
                  }
                  className="h-10 rounded-[10px] px-3.5"
                >
                  Kayıt sayfası
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  nativeButton={false}
                  render={
                    <a
                      href={item.consolidatedUrl ?? item.sourceUrl}
                      aria-label={`${item.title} resmî kaynağı`}
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                  variant="ghost"
                  className="h-9 rounded-[10px] px-3 text-muted-foreground"
                >
                  Resmî kaynak
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </article>
          ))}
          {!compact && shown.length < filtered.length && (
            <div className="flex justify-center pt-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl px-5"
                onClick={() => setVisibleCount((count) => count + 12)}
              >
                12 kayıt daha göster
                <ArrowRight className="size-4 rotate-90" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <Search
            className="mx-auto size-6 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="mt-4 font-heading text-xl font-semibold">
            Eşleşen kayıt bulunamadı
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Arama ifadesini veya mevzuat alanını değiştirin.
          </p>
        </div>
      )}
    </div>
  );
}
