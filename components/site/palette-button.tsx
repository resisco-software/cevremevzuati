'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

/**
 * Üst bardaki arama düğmesi. Komut paletini açar ve klavye kısayolunu
 * görünür kılar; kısayolun varlığı yazılı olmadan kimse kullanmaz.
 *
 * Geniş ekranda bir arama alanı gibi görünür, çünkü sitenin birincil
 * eylemi arama. Yükseklik üst bardaki diğer denetimlerle aynı: 40 piksel.
 */
export function PaletteButton() {
  // Tembel başlatıcı: efekt içinde setState çağırmadan platformu okur.
  // Sunucuda false döner, kbd üzerinde suppressHydrationWarning var.
  const [mac] = useState(
    () =>
      typeof navigator !== 'undefined' &&
      /Mac|iPhone|iPad/.test(navigator.userAgent),
  );

  function open() {
    window.dispatchEvent(new Event('cevremevzuati:palet'));
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="hidden h-10 w-44 items-center gap-2.5 rounded-lg border border-input bg-card pr-2 pl-3 text-sm text-muted-foreground hover:border-primary hover:text-ink lg:inline-flex xl:w-56"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span>Ara</span>
        <kbd
          className="ml-auto rounded border border-border px-1.5 py-0.5 font-mono text-xs"
          suppressHydrationWarning
        >
          {mac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>

      <button
        type="button"
        onClick={open}
        aria-label="Ara"
        className="grid size-10 shrink-0 place-items-center rounded-lg border border-input bg-card text-muted-foreground hover:border-primary hover:text-ink lg:hidden"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>
    </>
  );
}
