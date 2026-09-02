'use client';

import { ExternalLink, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { glossary } from '@/lib/legislation-data';

export function GlossaryBrowser({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    if (!normalized) return glossary;
    return glossary.filter((entry) =>
      [entry.term, entry.definition, entry.source, ...entry.tags]
        .join(' ')
        .toLocaleLowerCase('tr-TR')
        .includes(normalized),
    );
  }, [query]);

  return (
    <div>
      <label className="relative block max-w-2xl" htmlFor="glossary-search">
        <span className="sr-only">Sözlükte ara</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          id="glossary-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 rounded-xl bg-card pl-11"
          placeholder="Terim, mevzuat veya konu ara…"
        />
      </label>

      <div className="mt-5 flex items-center justify-between border-b border-border pb-4 text-sm text-muted-foreground">
        <span aria-live="polite"><strong className="text-foreground">{filtered.length}</strong> tanım</span>
        <span className="hidden sm:inline">Her tanımda madde kaynağı gösterilir</span>
      </div>

      {filtered.length > 0 ? (
        <div className="divide-y divide-border">
          {filtered.map((entry) => (
            <article key={`${entry.term}-${entry.source}`} className="grid gap-5 py-7 lg:grid-cols-[220px_1fr_230px] lg:gap-10">
              <div>
                <p className="font-heading text-2xl font-semibold tracking-tight">{entry.term}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </div>
              <blockquote className="text-base leading-7 text-foreground/85">{entry.definition}</blockquote>
              <div className="rounded-xl bg-secondary/70 p-4 text-xs leading-5">
                <p className="font-semibold text-foreground">{entry.source}</p>
                <p className="mt-1 text-muted-foreground">{entry.article}</p>
                <a className="mt-3 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline" href={entry.sourceUrl}>
                  Resmî kaynağı aç
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="font-heading text-xl font-semibold">Eşleşen tanım bulunamadı</p>
          <p className="mt-2 text-sm text-muted-foreground">Başka bir terim veya mevzuat adı deneyin.</p>
        </div>
      )}
    </div>
  );
}
