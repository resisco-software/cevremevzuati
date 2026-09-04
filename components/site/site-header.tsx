import Image from 'next/image';

import Link from '@/components/site/safe-link';
import { MobileNav } from '@/components/site/mobile-nav';
import { NavLinks } from '@/components/site/nav-links';
import { PaletteButton } from '@/components/site/palette-button';
import { ThemeToggle } from '@/components/site/theme-toggle';

const nav = [
  { href: '/mevzuat', label: 'Mevzuat' },
  { href: '/kapsam', label: 'Kapsam' },
  { href: '/sozluk', label: 'Sözlük' },
  { href: '/metodoloji', label: 'Kaynak' },
];

/**
 * Üst bar.
 *
 * Önce üç grup `justify-between` ile diziliyordu; bu, menüyü ne sola
 * dayalı ne ortalı bırakan iki tane 136 pikselli ölü boşluk üretiyordu.
 * Artık marka ve menü tek grup olarak sola çapalı, eylemler `ml-auto`
 * ile sağa itiliyor: tek ve amaçlı bir esnek boşluk kalıyor.
 *
 * Bütün denetimler 40 piksel yüksekliğinde ve aynı köşe yarıçapında;
 * eskiden 36, 37 ve 40 karışıktı.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="site-frame flex h-16 items-center gap-8">
        <Link
          href="/"
          className="flex h-10 shrink-0 items-center gap-2.5 rounded-lg"
          aria-label="Çevre Mevzuatı ana sayfa"
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0"
            aria-hidden="true"
          />
          <span className="text-base font-semibold tracking-[-0.015em] whitespace-nowrap">
            Çevre Mevzuatı
          </span>
        </Link>

        <NavLinks items={nav} />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <PaletteButton />
          <ThemeToggle />
          <Link
            href="/#alanlar"
            className="hidden h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 lg:inline-flex"
          >
            Tesisime göre
          </Link>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
