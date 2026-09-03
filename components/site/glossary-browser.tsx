'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink } from '@/components/site/external-link';
import { glossary } from '@/lib/legislation-data';
import { fold, matchesAllTerms } from '@/lib/text';

const searchIndex = new Map(
  glossary.map((entry) => [
    `${entry.term}-${entry.source}`,
    fold(
      [entry.term, entry.definition, entry.source, entry.article, ...entry.tags].join(
        ' ',
      ),
    ),
  ]),
);

/** Aynı terimin kaç düzenlemede tanımlandığı. */
const definitionCount = glossary.reduce<Record<string, number>>((acc, entry) => {
  acc[entry.term] = (acc[entry.term] ?? 0) + 1;
  return acc;
}, {});

const allTags = Array.from(
  new Set(glossary.flatMap((entry) => entry.tags)),
).sort((a, b) => a.localeCompare(b, 'tr'));

export function GlossaryBrowser({
  initialQuery = '',
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [tag, setTag] = useState<string>('all');

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
      <div className="grid gap-4">
        <label className="relative block max-w-2xl" htmlFor="glossary-search">
          <span className="sr-only">Sözlükte ara</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="glossary-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-14 rounded-xl border-rule bg-card pl-12 text-md shadow-paper"
            placeholder="Terim, mevzuat veya konu ara…"
          />
        </label>
        <fieldset className="chip-scroller">
          <legend className="label mb-2.5">Konu</legend>
          <button
            type="button"
            onClick={() => setTag('all')}
            aria-pressed={tag === 'all'}
            className="filter-chip"
          >
            Tümü
          </button>
          {allTags.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTag(item)}
              aria-pressed={tag === item}
              className="filter-chip"
            >
              {item}
            </button>
          ))}
        </fieldset>
      </div>

      <div className="ruled mt-8 flex flex-wrap items-baseline justify-between gap-3 pt-4 text-sm text-muted-foreground">
        <span>
          <strong className="text-foreground">{filtered.length}</strong> tanım
        </span>
        <span>Her tanımda kaynak düzenleme ve madde gösterilir</span>
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} tanım bulundu.
      </p>

      {filtered.length > 0 ? (
        <div className="divide-y divide-rule">
          {filtered.map((entry) => (
            <article
              key={`${entry.term}-${entry.source}`}
              className="grid gap-5 py-8 lg:grid-cols-[15rem_1fr] lg:gap-10"
            >
              <div>
                <h3 className="font-display text-lg font-semibold">
                  {entry.term}
                </h3>
                {definitionCount[entry.term] > 1 && (
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Bu terim {definitionCount[entry.term]} düzenlemede ayrı
                    tanımlanıyor.
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.tags.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <blockquote
                  cite={entry.sourceUrl}
                  className="quote"
                >
                  {entry.verbatim ? `“${entry.definition}”` : entry.definition}
                </blockquote>
                <p className="mt-2.5 text-sm text-muted-foreground">
                  {entry.verbatim
                    ? 'Mevzuat metninden alıntı.'
                    : 'Mevzuat tanımının sadeleştirilmiş özeti; bağlayıcı metin kaynaktadır.'}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
                <p className="record text-xs text-muted-foreground">{entry.source}</p>
                <p className="record text-xs text-muted-foreground">{entry.article}</p>
                <>
                  {entry.sourceSlug && (
                    <Link
                      href={`/mevzuat/${entry.sourceSlug}`}
                      className="text-seal underline decoration-rule underline-offset-4 hover:decoration-seal"
                    >
                      Kayıt sayfası
                    </Link>
                  )}
                  <ExternalLink
                    href={entry.sourceUrl}
                    className="inline-flex items-center gap-1.5 text-muted-foreground underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-seal"
                    iconClassName="size-3"
                  >
                    Resmî kaynak
                  </ExternalLink>
                </>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <h3 className="font-display text-lg font-semibold">
            Eşleşen tanım bulunamadı
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Başka bir terim veya mevzuat adı deneyin.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 h-11 border border-rule-strong px-4"
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
