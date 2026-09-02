const TURKISH_FOLD: Record<string, string> = {
  ı: 'i',
  İ: 'i',
  I: 'i',
  i: 'i',
  ş: 's',
  Ş: 's',
  ç: 'c',
  Ç: 'c',
  ğ: 'g',
  Ğ: 'g',
  ü: 'u',
  Ü: 'u',
  ö: 'o',
  Ö: 'o',
  â: 'a',
  Â: 'a',
  î: 'i',
  Î: 'i',
  û: 'u',
  Û: 'u',
};

/**
 * Aramada kullanılan tek normalizasyon fonksiyonu.
 * Türkçe karakterleri ASCII karşılığına indirir; böylece "atiksu" da
 * "ATIKSU" da "atıksu" kaydını bulur. Girdi ve dizin aynı fonksiyondan
 * geçmelidir.
 */
export function fold(value: string) {
  let out = '';
  for (const char of value) {
    out += TURKISH_FOLD[char] ?? char.toLowerCase();
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** Boşluğa göre ayrılmış arama terimlerinin tümü metinde geçiyor mu? */
export function matchesAllTerms(haystack: string, query: string) {
  const foldedHaystack = fold(haystack);
  return fold(query)
    .split(' ')
    .filter(Boolean)
    .every((term) => foldedHaystack.includes(term));
}
