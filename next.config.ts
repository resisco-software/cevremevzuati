import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * vinext App Router HTML'e kendi satır içi betiklerini gömer; bu yüzden
 * production CSP'de script-src 'unsafe-inline' kalır. eval kapalıdır.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  isDev ? "img-src 'self' data: blob:" : "img-src 'self' data:",
  "font-src 'self'",
  isDev
    ? "connect-src 'self' ws: wss: http://localhost:* http://127.0.0.1:*"
    : "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // Kütüphane ve mevzuat dizini aynı aracı gösteriyordu; tek adrese indirildi.
      { source: '/kutuphane', destination: '/mevzuat', permanent: true },
    ];
  },
  async headers() {
    const allPaths = ['/', '/:path*'];
    return [
      ...allPaths.map((source) => ({ source, headers: securityHeaders })),
      ...allPaths.map((source) => ({
        source,
        has: [{ type: 'header' as const, key: 'x-forwarded-proto', value: 'https' }],
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      })),
    ];
  },
};

export default nextConfig;
