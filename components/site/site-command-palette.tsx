'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  CommandPalette,
  type CommandItem,
} from '@/components/ui/command-palette';
import {
  categories,
  glossary,
  legislation,
  primarySearchText,
  secondarySearchText,
} from '@/lib/legislation-data';

const pages = [
  { path: '/mevzuat', label: 'Mevzuat dizini', keywords: 'liste ara dizin' },
  { path: '/kapsam', label: 'Kapsam haritası', keywords: 'alan konu harita' },
  { path: '/sozluk', label: 'Mevzuat sözlüğü', keywords: 'terim tanım' },
  { path: '/metodoloji', label: 'Kaynak ve yöntem', keywords: 'doğrulama' },
  { path: '/kunye', label: 'Künye ve iletişim', keywords: 'hakkında' },
  { path: '/gizlilik', label: 'Gizlilik ve KVKK', keywords: 'çerez veri' },
];

const categoryLabel = new Map(
  categories.map((category) => [category.id, category.shortLabel]),
);

/**
 * Site geneli komut paleti.
 * Resmî portalda arama tek bir kutuya sıkışır; burada 85 düzenleme,
 * 60 tanım ve sayfalar tek listede ve her yerden ⌘K ile açılıyor.
 */
function buildItems(): CommandItem[] {
  const records: CommandItem[] = legislation.map((item) => ({
    id: `mevzuat:${item.slug}`,
    label: item.title,
    hint: `${item.type} · RG ${item.gazetteNumber}`,
    keywords: [
      primarySearchText(item),
      secondarySearchText(item),
      item.categories.map((id) => categoryLabel.get(id) ?? '').join(' '),
    ].join(' '),
  }));

  const terms: CommandItem[] = glossary.map((entry) => ({
    id: `sozluk:${entry.term}|${entry.source}`,
    label: entry.term,
    hint: `Tanım · ${entry.article}`,
    keywords: `tanım sözlük ${entry.term} ${entry.source} ${entry.tags.join(' ')}`,
  }));

  const areas: CommandItem[] = categories.map((category) => ({
    id: `alan:${category.id}`,
    label: category.label,
    hint: 'Çevre alanı',
    keywords: `alan konu ${category.shortLabel} ${category.subtopics.join(' ')}`,
  }));

  const routes: CommandItem[] = pages.map((page) => ({
    id: `sayfa:${page.path}`,
    label: page.label,
    hint: 'Sayfa',
    keywords: `sayfa ${page.keywords}`,
  }));

  return [...records, ...areas, ...terms, ...routes];
}

export function SiteCommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const items = useMemo(() => buildItems(), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }
      // Yazı alanında değilken eğik çizgi de paleti açar.
      if (event.key === '/' && !open) {
        const target = event.target as HTMLElement | null;
        const typing =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable);
        if (!typing) {
          event.preventDefault();
          setOpen(true);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Paleti başka bileşenler de açabilsin (üst bardaki düğme gibi).
  useEffect(() => {
    function onRequest() {
      setOpen(true);
    }
    window.addEventListener('cevremevzuati:palet', onRequest);
    return () => window.removeEventListener('cevremevzuati:palet', onRequest);
  }, []);

  const onSelect = useCallback(
    (item: CommandItem) => {
      setOpen(false);
      const [kind, rest] = item.id.split(':');
      if (kind === 'mevzuat') router.push(`/mevzuat/${rest}`);
      else if (kind === 'alan') router.push(`/mevzuat?alan=${rest}`);
      else if (kind === 'sayfa') router.push(rest);
      else if (kind === 'sozluk') {
        const term = rest.split('|')[0];
        router.push(`/sozluk?q=${encodeURIComponent(term)}`);
      }
    },
    [router],
  );

  if (!open) return null;

  return (
    <CommandPalette
      open={open}
      items={items}
      onSelect={onSelect}
      onDismiss={() => setOpen(false)}
      focusOnOpen
      maxRows={7}
      label="Site araması"
      placeholder="Kayıt, terim veya sayfa ara…"
      emptyLabel="Eşleşme yok. Kısaltma deneyin: SKHKKY, ÇİLY, GEKAP."
    />
  );
}
