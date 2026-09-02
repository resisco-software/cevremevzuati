import { ArrowUpRight, FileCheck2 } from 'lucide-react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="inverse-panel border-t border-border">
      <div className="site-frame grid gap-10 py-12 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-background/10">
              <FileCheck2 className="size-4.5" aria-hidden="true" />
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.025em]">
              çevre mevzuatı
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-background/74">
            Sanayi tesislerinin çevre mevzuatındaki yerini bulmasına yardımcı
            olan, resmî kaynağa dayalı mevzuat navigasyonu.
          </p>
          <p className="mt-4 text-xs leading-5 text-background/64">
            Bu site hukuki görüş üretmez; düzenleme, madde, ek ve resmî kaynak
            ilişkisini gösterir.
          </p>
        </div>
        <div>
          <p className="meta-type mb-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-background/58">
            İçerik
          </p>
          <div className="grid gap-3 text-sm text-background/82">
            <Link className="hover:text-background" href="/kapsam">
              Kapsam haritası
            </Link>
            <Link className="hover:text-background" href="/mevzuat">
              Mevzuat dizini
            </Link>
            <Link className="hover:text-background" href="/kutuphane">
              Kütüphane
            </Link>
            <Link className="hover:text-background" href="/sozluk">
              Mevzuat sözlüğü
            </Link>
            <Link className="hover:text-background" href="/metodoloji">
              Kaynak ve yöntem
            </Link>
          </div>
        </div>
        <div>
          <p className="meta-type mb-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-background/58">
            Uzmanlık siteleri
          </p>
          <a
            className="inline-flex items-center gap-2 text-sm font-semibold text-background hover:underline"
            href="https://karbonmevzuati.com"
          >
            karbonmevzuati.com
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-xs leading-5 text-background/64">
            Karbon, iklim ve emisyon ticaret sistemi düzenlemeleri için.
          </p>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="site-frame meta-type flex flex-col gap-2 py-5 text-[11px] text-background/58 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Çevre Mevzuatı</span>
          <span>Son kaynak kontrolü: 2 Eylül 2026</span>
        </div>
      </div>
    </footer>
  );
}
