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
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link className="group flex items-center gap-3" href="/" aria-label="Çevre Mevzuatı ana sayfa">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-2">
            <FileCheck2 className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block font-heading text-[17px] font-semibold tracking-[-0.02em]">çevre mevzuatı</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tesis navigasyonu</span>
          </span>
          </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex" aria-label="Ana menü">
          {nav.map((item) => (
            <Link key={item.href} className="transition-colors hover:text-foreground" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button nativeButton={false} render={<Link href="/mevzuat" aria-label="Mevzuatta ara" />} variant="outline" className="h-10 gap-2 rounded-xl px-3.5">
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Mevzuatta ara</span>
            <span className="sm:hidden">Ara</span>
          </Button>
          <details className="mobile-menu relative lg:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-border bg-background [&::-webkit-details-marker]:hidden">
              <Menu className="size-4" aria-hidden="true" />
              <span className="sr-only">Menüyü aç</span>
            </summary>
            <nav className="absolute right-0 top-12 grid min-w-60 gap-1 rounded-2xl border border-border bg-popover p-2 text-sm text-popover-foreground shadow-xl" aria-label="Mobil menü">
              {nav.map((item) => (
                <Link key={item.href} className="rounded-xl px-3 py-2.5 hover:bg-muted" href={item.href}>
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
