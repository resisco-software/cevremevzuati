import Link from 'next/link';
import { Search } from 'lucide-react';

const shortcuts = [
  { q: 'SKHKKY', label: 'SKHKKY' },
  { q: 'ÇİLY', label: 'ÇİLY' },
  { q: 'AYY', label: 'AYY' },
  { q: 'ÇED', label: 'ÇED' },
  { q: 'GEKAP', label: 'GEKAP' },
  { q: 'atıksu', label: 'Atıksu' },
];

/** Ana sayfa araması doğrudan mevzuat dizinine gider. */
export function HomeSearch() {
  return (
    <div>
      <form action="/mevzuat" method="get" role="search" className="search-field">
        <label htmlFor="home-search" className="sr-only">
          Mevzuatta ara
        </label>
        <Search className="size-5 shrink-0 text-ochre" aria-hidden="true" />
        <input
          id="home-search"
          name="q"
          type="search"
          autoComplete="off"
          placeholder="Kısaltma, başlık veya RG sayısı…"
          className="min-w-0 flex-1 bg-transparent font-display text-lg outline-none placeholder:text-lead/70"
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center rounded-xl bg-seal px-4 text-sm font-semibold text-primary-foreground hover:bg-ink"
        >
          Ara
        </button>
      </form>
      <p className="mt-3 text-sm text-muted-foreground">
        Adını biliyorsanız yazın. Tesisi tarif etmek için aşağıya inin.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {shortcuts.map((item) => (
          <li key={item.q}>
            <Link
              href={`/mevzuat?q=${encodeURIComponent(item.q)}`}
              className="filter-chip"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
