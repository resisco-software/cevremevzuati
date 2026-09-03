'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

/**
 * Üst bardaki arama düğmesi. Komut paletini açar ve klavye kısayolunu
 * görünür kılar; kısayolun varlığı yazılı olmadan kimse kullanmaz.
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
      {/* Geniş ekran: kısayolu gösteren, arama alanı görünümlü düğme */}
      <button
        type="button"
        onClick={open}
        className="hidden h-10 items-center gap-2.5 rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground hover:border-primary hover:text-ink lg:inline-flex"
      >
        <Search className="size-4" aria-hidden="true" />
        <span>Ara</span>
        <kbd
          className="ml-1 rounded border border-border px-1.5 py-0.5 font-mono text-xs"
          suppressHydrationWarning
        >
          {mac ? '⌘' : 'Ctrl'} K
        </kbd>
      </button>

      {/* Küçük ekran: yalnızca ikon */}
      <button
        type="button"
        onClick={open}
        aria-label="Ara"
        className="btn btn-quiet inline-flex size-10 items-center justify-center lg:hidden"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>
    </>
  );
}
