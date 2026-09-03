'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLinks({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav
      className="hidden min-w-0 items-center gap-1 text-sm lg:flex"
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
            className={`rounded-lg px-3 py-2 whitespace-nowrap transition-colors ${
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
