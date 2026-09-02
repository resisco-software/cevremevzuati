import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

const themeScript = `try{const s=localStorage.getItem('cevremevzuati-theme');const d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL('https://cevremevzuati.com'),
  title: 'Çevre Mevzuatı | Tesisiniz için mevzuat navigasyonu',
  description:
    'Sanayi tesisleri için resmî kaynağa dayalı çevre mevzuatı navigasyonu, mevzuat kütüphanesi ve sözlük.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'Çevre Mevzuatı',
    title: 'Çevre Mevzuatı',
    description: 'Tesisiniz için doğrulanabilir mevzuat navigasyonu',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Çevre Mevzuatı — Tesisiniz için doğrulanabilir mevzuat navigasyonu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Çevre Mevzuatı',
    description: 'Tesisiniz için doğrulanabilir mevzuat navigasyonu',
    images: ['/og.png'],
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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
