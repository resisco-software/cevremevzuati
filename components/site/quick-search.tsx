'use client';

import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useRef, useState } from 'react';

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

/** Kullanıcıya aramanın ne kabul ettiğini gösteren gerçek örnekler. */
const examples = ['SKHKKY', 'atiksu', 'GEKAP', 'sıfır atık', '32029'];

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
  const router = useRouter();
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
      setActive((current) =>
        current <= 0 ? shown.length : current - 1,
      );
    } else if (event.key === 'Enter') {
      if (active >= 0 && active < shown.length) {
        event.preventDefault();
        router.push(`/mevzuat/${shown[active].slug}`);
      } else {
        event.preventDefault();
        router.push(`/mevzuat?q=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  return (
    <div>
      <label htmlFor="quick-search" className="eyebrow">
        Adını, kısaltmasını veya Resmî Gazete sayısını yazın
      </label>
      <div className="relative mt-2.5">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="quick-search"
          type="search"
          aria-describedby={`${listId}-durum`}
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          className="field h-16 pr-12 pl-12 text-md"
          placeholder="Örn. SKHKKY, atiksu, 32029…"
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
            className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* örnek sorgular: aramanın neyi kabul ettiğini gösterir */}
      {!open && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Deneyin:</span>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setQuery(example);
                inputRef.current?.focus();
              }}
              className="pill"
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {/* anında sonuç */}
      {open && (
        <div className="mt-4">
          <p id={`${listId}-durum`} className="sr-only" aria-live="polite">
            {results.length} kayıt bulundu. Ok tuşlarıyla gezinebilir,
            Enter ile açabilirsiniz.
          </p>
          {shown.length > 0 ? (
            <>
              <ul aria-label="Arama sonuçları" className="grid gap-2">
                {shown.map((item, index) => {
                  const areaId = item.categories[0] ?? 'izin';
                  return (
                    <li key={item.slug}>
                      <Link
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
                Kısaltma da deneyebilirsiniz: SKHKKY, ÇİLY, AYY, GEKAP, SEÖS.
                Ya da konudan başlayın.
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
