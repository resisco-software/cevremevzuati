import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Kütüphane ve mevzuat dizini aynı aracı gösteriyordu; tek adrese indirildi.
      { source: '/kutuphane', destination: '/mevzuat', permanent: true },
    ];
  },
};

export default nextConfig;
