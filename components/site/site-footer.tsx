import { ArrowUpRight, FileCheck2 } from 'lucide-react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-12">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-background/10">
              <FileCheck2 className="size-4.5" aria-hidden="true" />
            </span>
            <span className="font-heading text-lg font-semibold">çevre mevzuatı</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-background/65">
            Sanayi tesislerinin çevre mevzuatındaki yerini bulmasına yardımcı olan, resmî kaynağa dayalı mevzuat navigasyonu.
          </p>
          <p className="mt-4 text-xs leading-5 text-background/50">
            Bu site hukuki görüş üretmez; düzenleme, madde, ek ve resmî kaynak ilişkisini gösterir.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-background/45">İçerik</p>
          <div className="grid gap-3 text-sm text-background/75">
            <Link className="hover:text-background" href="/mevzuat">Mevzuat dizini</Link>
            <Link className="hover:text-background" href="/kutuphane">Kütüphane</Link>
            <Link className="hover:text-background" href="/sozluk">Mevzuat sözlüğü</Link>
            <Link className="hover:text-background" href="/metodoloji">Kaynak ve yöntem</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-background/45">Uzmanlık siteleri</p>
          <a className="inline-flex items-center gap-2 text-sm font-semibold text-background hover:underline" href="https://karbonmevzuati.com">
            karbonmevzuati.com
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-xs leading-5 text-background/50">Karbon, iklim ve emisyon ticaret sistemi düzenlemeleri için.</p>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-5 text-xs text-background/45 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>© 2026 Çevre Mevzuatı</span>
          <span>Son kaynak kontrolü: 2 Eylül 2026</span>
        </div>
      </div>
    </footer>
  );
}
