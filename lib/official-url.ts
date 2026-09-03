const OFFICIAL_HOSTS = new Set([
  'www.resmigazete.gov.tr',
  'resmigazete.gov.tr',
  'www.mevzuat.gov.tr',
  'mevzuat.gov.tr',
]);

/** Yalnızca Resmî Gazete ve mevzuat.gov.tr HTTPS adreslerini kabul eder. */
export function isOfficialSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      OFFICIAL_HOSTS.has(url.hostname)
    );
  } catch {
    return false;
  }
}

export function officialSourceUrl(value: string | undefined | null): string | null {
  if (!value || !isOfficialSourceUrl(value)) return null;
  return value;
}
