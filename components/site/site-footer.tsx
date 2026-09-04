import Image from 'next/image';
import { ArrowUpRight, Building2 } from 'lucide-react';

import { ExternalLink } from '@/components/site/external-link';
import Link from '@/components/site/safe-link';
import { lastSourceCheck, legislation } from '@/lib/legislation-data';
import { publisherName, publisherUrl } from '@/lib/site';

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
      <div className="site-frame pt-10">
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Resisco Mühendislik</p>
              <p className="mt-1 font-semibold">
                Mevzuattan tesis uygulamasına
              </p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Çevre izin ve lisans, emisyon, SEÖS, atık yönetimi, sera gazı ve
                sürdürülebilirlik süreçlerinde profesyonel destek.
              </p>
            </div>
          </div>
          <a
            href={`${publisherUrl}/services`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            Uzmanlık alanlarını inceleyin
            <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only"> (yeni sekmede açılır)</span>
          </a>
        </div>
      </div>
      <div className="site-frame grid gap-10 py-12 lg:grid-cols-[1.4fr_repeat(2,0.7fr)]">
        <div className="measure">
          <p className="flex items-center gap-3 text-md font-semibold">
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="size-9 shrink-0"
              aria-hidden="true"
            />
            Çevre Mevzuatı
          </p>
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
        <p className="site-frame py-5 text-sm leading-7 text-muted-foreground">
          Bu siteyi{' '}
          <a
            href={publisherUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            {publisherName}
            <span className="sr-only"> (yeni sekmede açılır)</span>
          </a>{' '}
          geliştirir ve yayımlar. Sayfaları sunmak ve toplu ziyaret sayımı
          yapmak için teknik bağlantı verisi Vercel üzerinden işlenir; çerez
          kullanılmaz. İşlenen veri, saklama süreleri ve haklarınız:{' '}
          <Link
            href="/gizlilik"
            className="font-semibold text-primary hover:underline"
          >
            Gizlilik ve KVKK Aydınlatma Metni
          </Link>
          .
        </p>
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
