'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Ana menü. Yükseklik 40 piksele sabitlendi; üst bardaki diğer
 * denetimlerle aynı optik satırda durması için.
 */
export function NavLinks({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav
      className="hidden min-w-0 items-center gap-1 text-sm md:flex"
      aria-label="Ana menü"
    >
      {items.map((item) => {
        const path = item.href.split('#')[0] || '/';
        const active =
          path === '/'
            ? pathname === '/'
            : pathname === path || pathname.startsWith(`${path}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex h-10 items-center rounded-lg px-3 whitespace-nowrap transition-colors ${
              active
                ? 'bg-secondary font-medium text-ink'
                : 'text-muted-foreground hover:bg-secondary hover:text-ink'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
