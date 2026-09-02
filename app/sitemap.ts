import type { MetadataRoute } from 'next';

import { legislation } from '@/lib/legislation-data';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/kapsam'), lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/mevzuat'), lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/sozluk'), lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/metodoloji'), lastModified, changeFrequency: 'yearly', priority: 0.6 },
    { url: absoluteUrl('/izleme'), lastModified, changeFrequency: 'daily', priority: 0.6 },
    { url: absoluteUrl('/kunye'), lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: absoluteUrl('/gizlilik'), lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const recordRoutes: MetadataRoute.Sitemap = legislation.map((item) => ({
    url: absoluteUrl(`/mevzuat/${item.slug}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: item.status === 'Yürürlükten kaldırıldı' ? 0.3 : 0.8,
  }));

  return [...staticRoutes, ...recordRoutes];
}
