import { Leaf, Search } from 'lucide-react';
import Link from 'next/link';

import { MobileNav } from '@/components/site/mobile-nav';
import { NavLinks } from '@/components/site/nav-links';
import { ThemeToggle } from '@/components/site/theme-toggle';

const nav = [
  { href: '/mevzuat', label: 'Mevzuat' },
  { href: '/kapsam', label: 'Kapsam' },
  { href: '/sozluk', label: 'Sözlük' },
  { href: '/metodoloji', label: 'Kaynak' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="site-frame flex h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Çevre Mevzuatı ana sayfa"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4.5" aria-hidden="true" />
          </span>
          <span className="text-md font-semibold tracking-[-0.02em]">
            Çevre Mevzuatı
          </span>
        </Link>

        <NavLinks items={nav} />

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/mevzuat"
            aria-label="Mevzuatta ara"
            className="btn inline-flex items-center justify-center btn-quiet size-10 lg:hidden"
          >
            <Search className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/#alanlar" className="btn btn-primary hidden h-10 px-4 text-sm lg:inline-flex">
            Tesisime göre
          </Link>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
