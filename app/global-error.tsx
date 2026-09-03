'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          lineHeight: 1.6,
          color: '#172c26',
          background: '#f5f7f5',
        }}
      >
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px' }}>
          <p style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 13 }}>
            Hata
          </p>
          <h1 style={{ fontSize: '2rem', lineHeight: 1.2 }}>
            Sayfa şu anda gösterilemiyor.
          </h1>
          <p>
            Beklenmeyen bir hata oluştu. Teknik ayrıntı ziyaretçiye iletilmez.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: '10px 16px',
              border: 0,
              background: '#135d48',
              color: '#fff',
              font: 'inherit',
              cursor: 'pointer',
            }}
          >
            Yeniden dene
          </button>
        </main>
      </body>
    </html>
  );
}
