function isPrivateOrLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === 'metadata.google.internal' ||
    host.endsWith('.internal')
  )
    return true;
  if (host === '::1' || host === '[::1]') return true;
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (ipv4) {
    const octets = ipv4.slice(1).map(Number);
    if (octets.some((part) => part > 255)) return true;
    const [a, b] = octets;
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
  }
  return false;
}

/** İzleme özeti yalnızca bilinen HTTPS worker adresinden alınır. */
export function monitorSummaryUrl(service: string): URL | null {
  try {
    const url = new URL('/api/summary', service);
    if (url.protocol !== 'https:') return null;
    if (url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    if (isPrivateOrLocalHostname(host)) return null;
    if (host === 'izleme.cevremevzuati.com') return url;
    if (host === 'cevremevzuati-monitor.workers.dev') return url;
    if (/^cevremevzuati-monitor\.[a-z0-9-]+\.workers\.dev$/.test(host))
      return url;
    return null;
  } catch {
    return null;
  }
}
