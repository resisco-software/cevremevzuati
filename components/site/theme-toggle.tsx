'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'cevremevzuati-theme';

type ThemeChoice = 'light' | 'dark' | 'system';

const order: ThemeChoice[] = ['system', 'light', 'dark'];

const meta: Record<ThemeChoice, { label: string; description: string }> = {
  system: { label: 'Sistem', description: 'sistem temasını izliyor' },
  light: { label: 'Açık', description: 'açık tema' },
  dark: { label: 'Koyu', description: 'koyu tema' },
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readChoice(): ThemeChoice {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : 'system';
  } catch {
    return 'system';
  }
}

/** Sunucuda ve ilk boyamada "sistem" varsayılır; head'deki betik temayı zaten uygular. */
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

export function ThemeToggle() {
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);

  const selectNext = useCallback(() => {
    const next = order[(order.indexOf(choice) + 1) % order.length];
    try {
      if (next === 'system') window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* depolama kapalıysa tema yalnızca bu sekmede geçerli olur */
    }
    applyTheme(next);
    emit();
  }, [choice]);

  const current = meta[choice];
  const Icon = choice === 'system' ? Monitor : choice === 'dark' ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={selectNext}
      suppressHydrationWarning
      className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-card px-2.5 text-sm font-medium hover:bg-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/60 xl:px-3"
      aria-label={`Tema: ${current.description}. Değiştirmek için tıklayın.`}
      title={`Tema: ${current.description}`}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="hidden text-sm xl:inline" aria-hidden="true">
        {current.label}
      </span>
    </button>
  );
}
