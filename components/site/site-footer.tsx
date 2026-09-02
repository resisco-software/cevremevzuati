import { FileCheck2 } from 'lucide-react';
import Link from 'next/link';

import { ExternalLink } from '@/components/site/external-link';
import { lastSourceCheck } from '@/lib/legislation-data';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="inverse-panel border-t border-border">
      <div className="site-frame grid gap-10 py-12 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-background/10">
              <FileCheck2 className="size-4.5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-[-0.02em]">
              çevre mevzuatı
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-background/80">
            Sanayi tesislerinin çevre mevzuatındaki yerini bulmasına yardımcı
            olan, resmî kaynağa dayalı mevzuat navigasyonu.
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-background/70">
            Bu site hukuki görüş üretmez; düzenleme, madde, ek ve resmî kaynak
            ilişkisini gösterir.
          </p>
        </div>
        <div>
          <h2 className="meta-type mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-background/65">
            İçerik
          </h2>
          <div className="grid gap-3 text-sm text-background/85">
            <Link className="hover:text-background hover:underline" href="/#alanlar">
              Tesisime göre rota
            </Link>
            <Link className="hover:text-background hover:underline" href="/mevzuat">
              Mevzuat dizini
            </Link>
            <Link className="hover:text-background hover:underline" href="/kapsam">
              Kapsam haritası
            </Link>
            <Link className="hover:text-background hover:underline" href="/sozluk">
              Mevzuat sözlüğü
            </Link>
            <Link className="hover:text-background hover:underline" href="/metodoloji">
              Kaynak ve yöntem
            </Link>
            <Link className="hover:text-background hover:underline" href="/izleme">
              Mevzuat izleme
            </Link>
          </div>
        </div>
        <div>
          <h2 className="meta-type mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-background/65">
            Uzmanlık siteleri
          </h2>
          <ExternalLink
            href="https://karbonmevzuati.com"
            className="inline-flex items-center gap-2 text-sm font-semibold text-background hover:underline"
            iconClassName="size-3.5"
          >
            karbonmevzuati.com
          </ExternalLink>
          <p className="mt-3 max-w-xs text-sm leading-6 text-background/70">
            Karbon, iklim ve emisyon ticaret sistemi düzenlemeleri için.
          </p>
          <h2 className="meta-type mt-8 mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-background/65">
            Site
          </h2>
          <div className="grid gap-3 text-sm text-background/85">
            <Link className="hover:text-background hover:underline" href="/kunye">
              Künye ve iletişim
            </Link>
            <Link className="hover:text-background hover:underline" href="/gizlilik">
              Gizlilik ve KVKK
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-background/15">
        <div className="site-frame meta-type flex flex-col gap-2 py-5 text-xs text-background/65 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} Çevre Mevzuatı</span>
          <span>En son kaynak kontrolü: {lastSourceCheck()}</span>
        </div>
      </div>
    </footer>
  );
}
