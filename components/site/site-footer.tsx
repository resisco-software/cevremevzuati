import Link from 'next/link';

import { ExternalLink } from '@/components/site/external-link';
import { lastSourceCheck, legislation } from '@/lib/legislation-data';

const columns = [
  {
    heading: 'İçerik',
    links: [
      { href: '/#alanlar', label: 'Tesisime göre rota' },
      { href: '/mevzuat', label: 'Mevzuat dizini' },
      { href: '/kapsam', label: 'Kapsam haritası' },
      { href: '/sozluk', label: 'Mevzuat sözlüğü' },
    ],
  },
  {
    heading: 'Site',
    links: [
      { href: '/metodoloji', label: 'Kaynak ve yöntem' },
      { href: '/kunye', label: 'Künye ve iletişim' },
      { href: '/gizlilik', label: 'Gizlilik ve KVKK' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="ruled-strong mt-20">
      <div className="site-frame grid gap-10 py-12 lg:grid-cols-[1.4fr_repeat(2,0.7fr)]">
        <div className="measure">
          <p className="font-display text-lg font-semibold">Çevre Mevzuatı</p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Sanayi tesislerinin çevre mevzuatındaki yerini bulmasına yardımcı
            olan, resmî kaynağa dayalı mevzuat navigasyonu. {legislation.length}{' '}
            kaydın tamamı madde düzeyinde Resmî Gazete bağlantısı taşır.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Bu site hukuki görüş üretmez. Bağlayıcı metin, Resmî Gazete&apos;de
            yayımlanan ve yürürlükte olan düzenlemenin kendisidir.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="label">{column.heading}</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-seal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="ruled">
        <div className="site-frame record flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Çevre Mevzuatı</span>
          <span>
            En son kaynak kontrolü: {lastSourceCheck()} ·{' '}
            <ExternalLink
              href="https://karbonmevzuati.com"
              className="underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-seal"
              iconClassName="ml-1 inline size-3"
            >
              karbonmevzuati.com
            </ExternalLink>
          </span>
        </div>
      </div>
    </footer>
  );
}
