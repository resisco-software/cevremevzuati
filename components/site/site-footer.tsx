import Link from 'next/link';

import { ExternalLink } from '@/components/site/external-link';
import { lastSourceCheck, legislation } from '@/lib/legislation-data';
import { publisherName } from '@/lib/site';

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
    <footer className="mt-16 border-t border-border">
      <div className="site-frame grid gap-10 py-12 lg:grid-cols-[1.4fr_repeat(2,0.7fr)]">
        <div className="measure">
          <p className="text-md font-semibold">Çevre Mevzuatı</p>
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
            <h2 className="eyebrow">{column.heading}</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-ink hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="site-frame flex flex-col gap-2 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {publisherName}
          </span>
          <span>
            En son kaynak kontrolü: {lastSourceCheck()} ·{' '}
            <ExternalLink
              href="https://karbonmevzuati.com"
              className="hover:text-ink hover:underline"
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
