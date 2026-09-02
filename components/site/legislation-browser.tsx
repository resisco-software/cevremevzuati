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
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { categories, legislation } from '@/lib/legislation-data';

export function LegislationBrowser({
  compact = false,
  initialCategory = 'all',
}: {
  compact?: boolean;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(
    categories.some((item) => item.id === initialCategory) ? initialCategory : 'all',
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    return legislation.filter((item) => {
      const matchesCategory = category === 'all' || item.categories.includes(category);
      const matchesQuery =
        normalized.length === 0 ||
        [item.title, item.summary, item.type, item.gazetteNumber]
          .join(' ')
          .toLocaleLowerCase('tr-TR')
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const shown = compact ? filtered.slice(0, 9) : filtered;

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-[1fr_250px] sm:p-4">
        <label className="relative" htmlFor="legislation-search">
          <span className="sr-only">Mevzuat ara</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="legislation-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 rounded-xl bg-background pl-10"
            placeholder="Başlık, Resmî Gazete sayısı veya konu ara…"
          />
        </label>
        <label htmlFor="legislation-category">
          <span className="sr-only">Mevzuat alanı</span>
          <NativeSelect id="legislation-category" value={category} onChange={(event) => setCategory(event.target.value)} className="w-full [&>select]:h-11 [&>select]:rounded-xl [&>select]:bg-background">
            <NativeSelectOption value="all">Tüm çevre mevzuatı alanları</NativeSelectOption>
            {categories.map((item) => (
              <NativeSelectOption key={item.id} value={item.id}>{item.shortLabel}</NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <strong className="font-semibold text-foreground">{filtered.length}</strong> kayıt gösteriliyor
        </p>
        <p className="hidden text-xs text-muted-foreground sm:block">Son kaynak kontrolü: 2 Eylül 2026</p>
      </div>

      {shown.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {shown.map((item) => (
            <article key={item.slug} className="group grid gap-5 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/35 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  <Badge variant="outline" className="gap-1 text-primary">
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                    {item.status}
                  </Badge>
                </div>
                <h2 className="mt-3 font-heading text-xl font-semibold leading-6 tracking-tight sm:text-2xl sm:leading-7">{item.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{item.summary}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span>Resmî Gazete: {item.publicationLabel}</span>
                  <span>Sayı: {item.gazetteNumber}</span>
                  <span>{item.categories.map((id) => categories.find((entry) => entry.id === id)?.shortLabel).filter(Boolean).slice(0, 3).join(' · ')}</span>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col sm:items-end">
                <Button nativeButton={false} render={<Link href={`/mevzuat/${item.slug}`} aria-label={`${item.title} kayıt sayfası`} />} className="h-10 rounded-xl px-3.5">
                  Kayıt sayfası
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button nativeButton={false} render={<a href={item.consolidatedUrl ?? item.sourceUrl} aria-label={`${item.title} resmî kaynağı`} />} variant="ghost" className="h-9 rounded-xl px-3 text-muted-foreground">
                  Resmî kaynak
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <Search className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-4 font-heading text-xl font-semibold">Eşleşen kayıt bulunamadı</h2>
          <p className="mt-2 text-sm text-muted-foreground">Arama ifadesini veya mevzuat alanını değiştirin.</p>
        </div>
      )}
    </div>
  );
}
