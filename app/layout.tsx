import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';

import { SiteCommandPalette } from '@/components/site/site-command-palette';
import {
  publisherName,
  publisherUrl,
  siteDescription,
  siteName,
  siteUrl,
} from '@/lib/site';
import './globals.css';

/**
 * Tipografi.
 *
 * Yazı tipleri depo içinden yükleniyor. Önce `geist` paketinin kendi
 * yükleyicisi kullanılıyordu; geliştirme sunucusu
 * /fonts/geist-sans/Geist-Variable.woff2 adresini 404 döndürdüğü için
 * site aylardır yedek yığınla, yani sistem sans'ıyla render oluyordu.
 * Tasarım da farkında olmadan o yedek fontla değerlendirilmiş.
 *
 * Değişken eksen 100-900; başlıkta 620, gövdede 400 kullanılıyor.
 * Monospace yalnızca Resmî Gazete sayısı, tarih ve kısayol tuşu gibi
 * hizalanması gereken verilerde.
 */
const sans = localFont({
  src: './fonts/Geist-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-sans-local',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: false,
});

const mono = localFont({
  src: './fonts/GeistMono-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-mono-local',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
  adjustFontFallback: false,
});

/*
  Tema, ilk boyamadan önce uygulanır; yanıp sönme olmaz.
  Kayıt yoksa veya 'system' ise işletim sistemi tercihi izlenir.
*/
const themeScript = `try{var s=localStorage.getItem('cevremevzuati-theme-v2');var d=s==='dark'||(s!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Çevre Mevzuatı | Tesisiniz için mevzuat navigasyonu',
    template: '%s | Çevre Mevzuatı',
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: publisherName, url: publisherUrl }],
  creator: publisherName,
  publisher: publisherName,
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName,
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Çevre Mevzuatı — Tesisiniz için doğrulanabilir mevzuat navigasyonu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-3 focus:outline-offset-2 focus:outline-ring/60"
        >
          İçeriğe atla
        </a>
        {children}
        <SiteCommandPalette />
        <Analytics />
      </body>
    </html>
  );
}
