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
            className={`whitespace-nowrap border-b-2 py-1 transition-colors ${
              active
                ? 'border-seal font-medium text-ink'
                : 'border-transparent text-lead hover:border-rule-strong hover:text-ink'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
