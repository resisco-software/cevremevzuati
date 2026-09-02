import { FileCheck2, Menu, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const nav = [
  { href: '/#alanlar', label: 'Mevzuat alanları' },
  { href: '/mevzuat', label: 'Mevzuat' },
  { href: '/kutuphane', label: 'Kütüphane' },
  { href: '/sozluk', label: 'Sözlük' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/90 bg-background/88 backdrop-blur-2xl">
      <div className="site-frame flex h-16 items-center justify-between">
        <Link
          className="group flex items-center gap-3"
          href="/"
          aria-label="Çevre Mevzuatı ana sayfa"
        >
          <span className="grid size-9 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[0_1px_0_oklch(1_0_0/0.18)_inset] transition-transform duration-200 group-hover:-translate-y-px">
            <FileCheck2 className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block text-[15px] font-semibold tracking-[-0.025em]">
              çevre mevzuatı
            </span>
            <span className="meta-type mt-1.5 block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              Tesis navigasyonu
            </span>
          </span>
        </Link>

        <nav
          className="hidden h-full items-center gap-1 text-[13px] text-muted-foreground lg:flex"
          aria-label="Ana menü"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              className="rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            nativeButton={false}
            render={<Link href="/mevzuat" aria-label="Mevzuatta ara" />}
            variant="outline"
            className="h-9 gap-2 rounded-[10px] bg-card px-3.5 text-[13px] shadow-none"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Mevzuatta ara</span>
            <span className="sm:hidden">Ara</span>
          </Button>
          <details className="mobile-menu relative lg:hidden">
            <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-[10px] border border-border bg-card [&::-webkit-details-marker]:hidden">
              <Menu className="size-4" aria-hidden="true" />
              <span className="sr-only">Menüyü aç</span>
            </summary>
            <nav
              className="absolute right-0 top-11 grid min-w-60 gap-1 rounded-xl border border-border bg-popover p-2 text-sm text-popover-foreground shadow-xl"
              aria-label="Mobil menü"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  className="rounded-lg px-3 py-2.5 hover:bg-muted"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
