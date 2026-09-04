'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Link from '@/components/site/safe-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { ExternalLink } from '@/components/site/external-link';
import { glossary } from '@/lib/legislation-data';
import { fold, matchesAllTerms } from '@/lib/text';

const searchIndex = new Map(
  glossary.map((entry) => [
    `${entry.term}-${entry.source}`,
    fold(
      [
        entry.term,
        entry.definition,
        entry.source,
        entry.article,
        ...entry.tags,
      ].join(' '),
    ),
  ]),
);

/** Aynı terimin kaç düzenlemede tanımlandığı. */
const definitionCount = glossary.reduce<Record<string, number>>(
  (acc, entry) => {
    acc[entry.term] = (acc[entry.term] ?? 0) + 1;
    return acc;
  },
  {},
);

const allTags = Array.from(
  new Set(glossary.flatMap((entry) => entry.tags)),
).sort((a, b) => a.localeCompare(b, 'tr'));

export function GlossaryBrowser({
  initialQuery = '',
  initialTag = 'all',
}: {
  initialQuery?: string;
  initialTag?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [tag, setTag] = useState<string>(
    allTags.includes(initialTag) ? initialTag : 'all',
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (tag !== 'all') params.set('konu', tag);
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ''}`;
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, '', next);
    }
  }, [query, tag]);

  const hasFilters = Boolean(query.trim()) || tag !== 'all';

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    return glossary
      .filter((entry) => {
        if (tag !== 'all' && !entry.tags.includes(tag)) return false;
        if (!trimmed) return true;
        return matchesAllTerms(
          searchIndex.get(`${entry.term}-${entry.source}`) ?? '',
          trimmed,
        );
      })
      .sort((a, b) => a.term.localeCompare(b.term, 'tr'));
  }, [query, tag]);

  return (
    <div>
      <div className="card rounded-xl p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
          <label className="block" htmlFor="glossary-search">
            <span className="eyebrow mb-1.5 block">Sözlükte ara</span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="glossary-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setQuery('');
                }}
                className="h-10 border-border bg-background pr-10 pl-9 text-sm"
                placeholder="Terim, mevzuat veya madde ara…"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Aramayı temizle"
                  title="Aramayı temizle"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </span>
          </label>
          <label className="block" htmlFor="glossary-topic">
            <span className="eyebrow mb-1.5 block">Konu</span>
            <NativeSelect
              id="glossary-topic"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="w-full [&>select]:h-10 [&>select]:bg-background"
            >
              <NativeSelectOption value="all">Tüm konular</NativeSelectOption>
              {allTags.map((item) => (
                <NativeSelectOption key={item} value={item}>
                  {item}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
        </div>
        <div className="mt-3 flex min-h-7 flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm text-muted-foreground">
          <span>
            <strong className="font-semibold text-foreground">
              {filtered.length}
            </strong>{' '}
            / {glossary.length} tanım
          </span>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setTag('all');
              }}
            >
              <X aria-hidden="true" />
              Filtreleri temizle
            </Button>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} tanım bulundu.
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 divide-y divide-rule border-y border-rule">
          {filtered.map((entry) => (
            <article
              key={`${entry.term}-${entry.source}`}
              className="grid gap-3 py-4 md:grid-cols-[minmax(10rem,13rem)_minmax(0,1fr)] md:gap-6"
            >
              <div>
                <h3 className="text-base leading-6 font-semibold">
                  {entry.term}
                </h3>
                {definitionCount[entry.term] > 1 && (
                  <Badge variant="outline" className="mt-1.5">
                    {definitionCount[entry.term]} ayrı tanım
                  </Badge>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {entry.tags.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="h-4 px-1.5 text-[0.6875rem]"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <blockquote
                  cite={entry.sourceUrl}
                  className="text-sm leading-6 text-muted-foreground"
                >
                  {entry.verbatim ? `“${entry.definition}”` : entry.definition}
                </blockquote>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/70 pt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {entry.source}
                  </span>
                  <span className="gazette">{entry.article}</span>
                  <span>
                    {entry.verbatim
                      ? 'Doğrudan alıntı'
                      : 'Sadeleştirilmiş özet'}
                  </span>
                  {entry.sourceSlug && (
                    <Link
                      href={`/mevzuat/${entry.sourceSlug}`}
                      className="font-medium text-primary hover:underline hover:decoration-seal"
                    >
                      Kayıt sayfası
                    </Link>
                  )}
                  <ExternalLink
                    href={entry.sourceUrl}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-ink hover:underline hover:decoration-seal"
                    iconClassName="size-3"
                  >
                    Resmî kaynak
                  </ExternalLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="text-lg font-semibold">Eşleşen tanım bulunamadı</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Başka bir terim veya mevzuat adı deneyin.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 h-11 border border-input px-4"
            onClick={() => {
              setQuery('');
              setTag('all');
            }}
          >
            Filtreleri temizle
          </Button>
        </div>
      )}
    </div>
  );
}
