import { ArrowRight, FileCheck2, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/site/mobile-nav';
import { NavLinks } from '@/components/site/nav-links';
import { ThemeToggle } from '@/components/site/theme-toggle';

const nav = [
  { href: '/#alanlar', label: 'Tesisime göre' },
  { href: '/mevzuat', label: 'Mevzuat' },
  { href: '/kapsam', label: 'Kapsam haritası' },
  { href: '/sozluk', label: 'Sözlük' },
  { href: '/metodoloji', label: 'Kaynak ve yöntem' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-2xl">
      <div className="site-frame flex h-16 items-center justify-between gap-4">
        <Link
          className="group flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60"
          href="/"
          aria-label="Çevre Mevzuatı ana sayfa"
        >
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground shadow-[0_1px_0_oklch(1_0_0/0.18)_inset] transition-transform duration-200 group-hover:-translate-y-px">
            <FileCheck2 className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block text-base font-semibold tracking-[-0.02em]">
              çevre mevzuatı
            </span>
            <span className="meta-type mt-1.5 block text-xs uppercase tracking-[0.1em] text-muted-foreground">
              Tesis navigasyonu
            </span>
          </span>
        </Link>

        <NavLinks items={nav} />

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {/* Küçük ekranda arama ikon buton olarak kalır, gizlenmez. */}
          <Button
            nativeButton={false}
            render={<Link href="/mevzuat" aria-label="Mevzuatta ara" />}
            variant="outline"
            className="inline-flex size-10 items-center justify-center rounded-md bg-card p-0 shadow-none xl:hidden"
          >
            <Search className="size-4" aria-hidden="true" />
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/mevzuat" />}
            variant="outline"
            className="hidden h-10 gap-2 rounded-md bg-card px-3.5 text-sm shadow-none xl:inline-flex"
          >
            <Search className="size-4" aria-hidden="true" />
            Mevzuatta ara
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/#alanlar" />}
            className="hidden h-10 gap-2 rounded-md px-3.5 text-sm shadow-none lg:inline-flex"
          >
            Rotamı oluştur
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
