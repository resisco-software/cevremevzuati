'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Masaüstü ana menü. Bulunulan sayfa aria-current ile işaretlenir. */
export function NavLinks({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav
      className="hidden h-full min-w-0 items-center gap-0.5 text-sm text-muted-foreground lg:flex"
      aria-label="Ana menü"
    >
      {items.map((item) => {
        // '/#alanlar' gibi çapa bağlantıları yalnızca ana sayfada aktiftir.
        const path = item.href.split('#')[0] || '/';
        const active =
          path === '/'
            ? pathname === '/' && item.href.includes('#')
            : pathname === path || pathname.startsWith(`${path}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-md px-2.5 py-2 whitespace-nowrap transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60 ${
              active ? 'bg-muted font-semibold text-foreground' : ''
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
