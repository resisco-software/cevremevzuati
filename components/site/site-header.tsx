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
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-background">
      <div className="site-frame flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex shrink-0 flex-col justify-center"
          aria-label="Çevre Mevzuatı ana sayfa"
        >
          <span className="font-display text-lg font-bold leading-none tracking-[-0.015em] group-hover:text-lead">
            Çevre Mevzuatı
          </span>
          <span className="label mt-1 leading-none">
            Tesis navigasyonu · {legislation.length} kayıt
          </span>
        </Link>

        <NavLinks items={nav} />

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/mevzuat"
            aria-label="Mevzuatta ara"
            className="grid size-10 place-items-center border border-rule-strong text-lead hover:border-ink hover:text-ink xl:hidden"
          >
            <Search className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/mevzuat"
            className="hidden h-10 items-center gap-2 border border-rule-strong px-3.5 text-sm text-lead hover:border-ink hover:text-ink xl:inline-flex"
          >
            <Search className="size-4" aria-hidden="true" />
            Ara
          </Link>
          <Link
            href="/#alanlar"
            className="hidden h-10 items-center gap-2 bg-seal px-4 text-sm font-medium text-primary-foreground hover:bg-lead lg:inline-flex"
          >
            Rotamı oluştur
          </Link>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
