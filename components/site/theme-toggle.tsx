'use client';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'cevremevzuati-theme';

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

export function ThemeToggle() {
  function toggleTheme() {
    const nextDark = !document.documentElement.classList.contains('dark');
    applyTheme(nextDark);
    window.localStorage.setItem(STORAGE_KEY, nextDark ? 'dark' : 'light');
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="relative size-9 rounded-[10px] bg-card shadow-none"
      onClick={toggleTheme}
      aria-label="Renk temasını değiştir"
      title="Açık veya koyu temaya geç"
    >
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
    </Button>
  );
}
