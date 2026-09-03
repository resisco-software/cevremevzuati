'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'cevremevzuati-theme-v2';

type ThemeChoice = 'light' | 'dark' | 'system';

const order: ThemeChoice[] = ['system', 'light', 'dark'];

const meta: Record<ThemeChoice, { short: string; long: string }> = {
  system: { short: 'Sistem', long: 'sistem temasını izliyor' },
  light: { short: 'Açık', long: 'açık tema' },
  dark: { short: 'Koyu', long: 'koyu tema' },
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

/*
  Kayıt yoksa sistem tercihi izlenir. Bu, head'deki satır içi betikle
  aynı varsayımdır; ikisi ayrışırsa düğme yanlış tema adını gösterir.
*/
function readChoice(): ThemeChoice {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' || stored === 'system'
      ? stored
      : 'system';
  } catch {
    return 'system';
  }
}

function serverChoice(): ThemeChoice {
  return 'system';
}

function applyTheme(choice: ThemeChoice) {
  const dark =
    choice === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : choice === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

/**
 * Tema anahtarı. Önceki sürümde yalnızca mevcut durumun adı yazıyordu
 * ("Sistem") ve bunun bir tema anahtarı olduğu anlaşılmıyordu; artık
 * "Tema" sözcüğü görünür etikette yer alıyor.
 */
export function ThemeToggle() {
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);

  const selectNext = useCallback(() => {
    const next = order[(order.indexOf(choice) + 1) % order.length];
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* depolama kapalıysa tema yalnızca bu sekmede geçerli olur */
    }
    applyTheme(next);
    for (const listener of listeners) listener();
  }, [choice]);

  const current = meta[choice];
  const Icon = choice === 'system' ? Monitor : choice === 'dark' ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={selectNext}
      suppressHydrationWarning
      className="btn inline-flex items-center justify-center btn-quiet h-10 gap-2 px-2.5 text-sm text-muted-foreground hover:text-ink sm:px-3"
      aria-label={`Tema: ${current.long}. Değiştirmek için tıklayın.`}
      title={`Tema: ${current.long}`}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline" aria-hidden="true">
        Tema: <span className="text-ink">{current.short}</span>
      </span>
    </button>
  );
}
