/** Yapısal veriyi sayfaya gömer. İçerik yalnızca kendi verimizden üretilir. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
