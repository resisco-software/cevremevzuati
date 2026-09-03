'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Etkin sayfa mühür rengiyle altı çizilir; dolgu kullanılmaz. */
export function NavLinks({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav
      className="hidden min-w-0 items-center gap-6 text-sm lg:flex"
      aria-label="Ana menü"
    >
      {items.map((item) => {
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
            className={`rounded-full px-3 py-1.5 transition-colors ${
              active
                ? 'bg-accent font-medium text-forest'
                : 'text-lead hover:bg-card hover:text-ink'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
