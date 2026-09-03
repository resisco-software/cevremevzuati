export const siteUrl = 'https://cevremevzuati.com';

export const siteName = 'Çevre Mevzuatı';

export const publisherName = 'Resisco Mühendislik A.Ş.';

export const publisherEmail = 'info@resisco.com';

export const siteDescription =
  'Sanayi tesisleri için resmî kaynağa dayalı çevre mevzuatı navigasyonu, mevzuat kütüphanesi ve sözlük.';

/** Tam URL üretir; canonical ve yapısal veri için kullanılır. */
export function absoluteUrl(path: string) {
  return path === '/' ? siteUrl : `${siteUrl}${path}`;
}

/**
 * Sayfa bazlı Open Graph verisi.
 * Next.js'te bir sayfa openGraph tanımlarsa üst düzeydeki nesneyi tamamen
 * değiştirir; görsel ve site bilgisi bu yüzden her sayfada yeniden verilir.
 */
export function openGraphFor({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    type: 'website' as const,
    locale: 'tr_TR',
    siteName,
    title,
    description,
    url: path,
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: `${title} — ${siteName}`,
      },
    ],
  };
}
