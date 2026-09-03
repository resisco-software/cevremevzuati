import { Search } from 'lucide-react';
import Link from 'next/link';

import { MobileNav } from '@/components/site/mobile-nav';
import { NavLinks } from '@/components/site/nav-links';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { legislation } from '@/lib/legislation-data';

const nav = [
  { href: '/#alanlar', label: 'Tesisime göre' },
  { href: '/mevzuat', label: 'Mevzuat' },
  { href: '/kapsam', label: 'Kapsam' },
  { href: '/sozluk', label: 'Sözlük' },
  { href: '/metodoloji', label: 'Kaynak ve yöntem' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule/80 bg-paper/80 backdrop-blur-xl">
      <div className="site-frame flex h-[4.25rem] items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="Çevre Mevzuatı ana sayfa"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-seal text-sm font-semibold text-primary-foreground"
          >
            Ç
          </span>
          <span className="flex flex-col justify-center">
            <span className="font-display text-lg font-semibold leading-none tracking-[-0.02em] group-hover:text-seal">
              Çevre Mevzuatı
            </span>
            <span className="label mt-1.5 leading-none">
              {legislation.length} kayıt · tesis rotası
            </span>
          </span>
        </Link>

        <NavLinks items={nav} />

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/mevzuat"
            aria-label="Mevzuatta ara"
            className="grid size-10 place-items-center rounded-xl border border-rule bg-card text-lead hover:border-seal hover:text-ink xl:hidden"
          >
            <Search className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/mevzuat"
            className="hidden h-10 items-center gap-2 rounded-xl border border-rule bg-card px-3.5 text-sm text-lead hover:border-seal hover:text-ink xl:inline-flex"
          >
            <Search className="size-4" aria-hidden="true" />
            Ara
          </Link>
          <Link
            href="/#alanlar"
            className="hidden h-10 items-center gap-2 rounded-xl bg-seal px-4 text-sm font-medium text-primary-foreground hover:bg-forest lg:inline-flex"
          >
            Rotamı oluştur
          </Link>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
