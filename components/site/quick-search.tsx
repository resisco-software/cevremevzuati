'use client';

import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react';
import { useId, useMemo, useRef, useState } from 'react';

import Link from '@/components/site/safe-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  categories,
  legislation,
  primarySearchText,
  secondarySearchText,
} from '@/lib/legislation-data';
import { areaStyle } from '@/lib/area-theme';
import { fold, matchesAllTerms } from '@/lib/text';

const primaryIndex = new Map(
  legislation.map((item) => [item.slug, fold(primarySearchText(item))]),
);
const secondaryIndex = new Map(
  legislation.map((item) => [item.slug, fold(secondarySearchText(item))]),
);

const categoryLabel = new Map(
  categories.map((category) => [category.id, category.shortLabel]),
);

const MAX_RESULTS = 6;

/**
 * Ana sayfadaki anında arama.
 * mevzuat.gov.tr'de aradığınızı bulmak için tam adı bilmeniz gerekir;
 * burada kısaltma, Türkçe karaktersiz yazım ve Resmî Gazete sayısı çalışır
 * ve sonuç yazarken görünür.
 */
export function QuickSearch() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    const byName = legislation.filter((item) =>
      matchesAllTerms(primaryIndex.get(item.slug) ?? '', trimmed),
    );
    const byTopic = legislation.filter(
      (item) =>
        !byName.includes(item) &&
        matchesAllTerms(secondaryIndex.get(item.slug) ?? '', trimmed),
    );
    return [...byName, ...byTopic];
  }, [query]);

  const shown = results.slice(0, MAX_RESULTS);
  const open = query.trim().length >= 2;

  function openSearch() {
    if (active >= 0 && active < shown.length) {
      window.location.assign(`/mevzuat/${shown[active].slug}`);
      return;
    }
    const trimmed = query.trim();
    window.location.assign(
      trimmed ? `/mevzuat?q=${encodeURIComponent(trimmed)}` : '/mevzuat',
    );
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setQuery('');
      setActive(-1);
      return;
    }
    if (!open) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => (current + 1) % (shown.length + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) => (current <= 0 ? shown.length : current - 1));
    }
  }

  return (
    <div>
      {/*
        Etiket görünür bir başlık değil: büyük harf, geniş harf aralıklı
        ve yer tutucuyla aynı şeyi söyleyen uzun bir satırdı, hem demode
        duruyor hem de hero'da ikinci bir sol eksen açıyordu. Metin
        ekran okuyucu için duruyor, açıklama alanın altına indi.
      */}
      <label htmlFor="quick-search" className="sr-only">
        Adını, kısaltmasını veya Resmî Gazete sayısını yazarak mevzuatta ara
      </label>
      <form
        className="relative"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          openSearch();
        }}
      >
        <Search
          className="pointer-events-none absolute top-1/2 left-5 size-6 -translate-y-1/2 text-primary"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          id="quick-search"
          type="search"
          aria-describedby={`${listId}-durum`}
          aria-controls={open ? `${listId}-sonuclar` : undefined}
          aria-activedescendant={
            active >= 0 && active < shown.length
              ? `${listId}-sonuc-${active}`
              : undefined
          }
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          className="home-search-input h-[4.75rem] rounded-xl border-input bg-card pr-24 pl-14 text-md shadow-[var(--shadow-search)] md:pr-40 md:text-lg"
          placeholder="Mevzuatta ara…"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActive(-1);
              inputRef.current?.focus();
            }}
            aria-label="Aramayı temizle"
            className="absolute top-1/2 right-[4.75rem] grid size-10 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-ink md:right-[7.25rem]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
        <Button
          type="submit"
          size="lg"
          className="absolute top-2 right-2 h-[3.75rem] min-w-16 rounded-[0.65rem] px-4 text-base md:min-w-28 md:px-5"
        >
          <Search className="size-4 md:hidden" aria-hidden="true" />
          <span className="hidden md:inline">Ara</span>
          <ArrowRight className="hidden size-4 md:block" aria-hidden="true" />
        </Button>
      </form>

      {/* anında sonuç */}
      {open && (
        <div className="mt-4">
          <p id={`${listId}-durum`} className="sr-only" aria-live="polite">
            {results.length} kayıt bulundu. Ok tuşlarıyla gezinebilir, Enter ile
            açabilirsiniz.
          </p>
          {shown.length > 0 ? (
            <>
              <ul
                id={`${listId}-sonuclar`}
                aria-label="Arama sonuçları"
                className="grid gap-2"
              >
                {shown.map((item, index) => {
                  const areaId = item.categories[0] ?? 'izin';
                  return (
                    <li key={item.slug}>
                      <Link
                        id={`${listId}-sonuc-${index}`}
                        href={`/mevzuat/${item.slug}`}
                        style={areaStyle(areaId)}
                        onMouseEnter={() => setActive(index)}
                        className={`card card-link area-edge px-4 py-3.5 ${
                          active === index ? 'border-primary' : ''
                        }`}
                      >
                        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <span className="area-dot" aria-hidden="true" />
                          <span className="text-sm text-muted-foreground">
                            {categoryLabel.get(areaId) ?? item.type}
                          </span>
                          <span className="gazette ml-auto text-muted-foreground">
                            RG {item.gazetteNumber}
                          </span>
                        </span>
                        <span className="mt-1.5 block font-semibold leading-snug">
                          {item.title}
                        </span>
                        {item.primaryAnnex && (
                          <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                            Önce: {item.primaryAnnex}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={`/mevzuat?q=${encodeURIComponent(query.trim())}`}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {results.length > MAX_RESULTS
                  ? `${results.length} sonucun tamamını gör`
                  : 'Dizinde aç'}
                <CornerDownLeft className="size-3.5" aria-hidden="true" />
              </Link>
            </>
          ) : (
            <div className="card px-5 py-6">
              <p className="font-semibold">
                “{query.trim()}” için kayıt bulunamadı
              </p>
              <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                Kısaltma da deneyebilirsiniz: SKHKKY, ÇİLY, AYY, GEKAP, SEÖS. Ya
                da konudan başlayın.
              </p>
              <Link
                href="/kapsam"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Kapsam haritasına git
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
