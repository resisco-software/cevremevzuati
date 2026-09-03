import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';

import { siteDescription, siteName, siteUrl } from '@/lib/site';
import './globals.css';

/**
 * Tipografi: gövde ve başlıklar Geist Sans.
 * Serif başlık denemesi kaldırıldı; resmî belge görünümünü pekiştiriyordu,
 * oysa hedef mevzuat.gov.tr'den ayrışmak. Monospace yalnızca Resmî Gazete
 * sayısı ve tarih gibi hizalanması gereken verilerde kalır.
 */
const recordMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-record',
  display: 'swap',
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
  icons: {
    icon: '/favicon.svg',
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
      className={`${GeistSans.variable} ${recordMono.variable}`}
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
      </body>
    </html>
  );
}
