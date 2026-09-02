import type { Metadata } from 'next';
import { ArrowRight, Compass, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export const metadata: Metadata = {
  title: 'Sayfa bulunamadı | Çevre Mevzuatı',
  description:
    'Aradığınız sayfa bulunamadı. Kapsam haritası ve mevzuat dizininden devam edin.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="icerik" className="min-h-[70vh] bg-background">
        <div className="site-frame max-w-3xl py-20 lg:py-28">
          <p className="section-kicker">Hata 404</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Bu sayfa bulunamadı.
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Adres değişmiş, kayıt kaldırılmış veya bağlantı eksik olabilir.
            Aradığınız düzenlemeye mevzuat dizininden ulaşabilirsiniz; konuyu
            bilmiyorsanız kapsam haritasından başlayın.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/mevzuat" />}
              className="h-11 gap-2 rounded-md px-4"
            >
              <Search className="size-4" aria-hidden="true" />
              Mevzuat dizininde ara
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/kapsam" />}
              variant="outline"
              className="h-11 gap-2 rounded-md bg-card px-4"
            >
              <Compass className="size-4" aria-hidden="true" />
              Kapsam haritası
            </Button>
          </div>
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-sm font-semibold">Sık kullanılan sayfalar</p>
            <ul className="mt-3 grid gap-2 text-sm">
              <li>
                <Link
                  href="/#alanlar"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  Tesisime göre okuma rotası
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link
                  href="/sozluk"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  Mevzuat sözlüğü
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link
                  href="/metodoloji"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  Kaynak ve yöntem
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
