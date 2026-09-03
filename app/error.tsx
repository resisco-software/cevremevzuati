'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="icerik" className="site-frame max-w-3xl py-20 lg:py-28">
      <p className="label">Hata</p>
      <h1 className="display-xl measure mt-4">Sayfa şu anda gösterilemiyor.</h1>
      <p className="mt-5 text-base leading-7 text-muted-foreground">
        Beklenmeyen bir hata oluştu. Teknik ayrıntı ziyaretçiye iletilmez.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-11 items-center bg-seal px-4 text-sm font-medium text-primary-foreground hover:bg-ink"
        >
          Yeniden dene
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center border border-rule-strong px-4 text-sm hover:border-ink"
        >
          Ana sayfa
        </Link>
      </div>
    </main>
  );
}
