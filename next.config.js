/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi domain gambar untuk Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.com',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Konfigurasi webpack untuk mendukung library xlsx dan jspdf
  webpack: (config, { isServer }) => {
    // Untuk menghindari error saat build dengan library yang butuh browser env
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
      };
    }

    // Perlakukan xlsx sebagai external di sisi server
    if (isServer) {
      config.externals = [...(config.externals || []), 'xlsx'];
    }

    return config;
  },

  // Aktifkan logging environment variables (non-secret)
  env: {
    NEXT_PUBLIC_APP_NAME: 'TataDana',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Konfigurasi header keamanan
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // Redirect dari root ke dashboard jika sudah login (ditangani middleware)
  async redirects() {
    return [];
  },

  // Aktifkan React strict mode untuk development
  reactStrictMode: true,

  // Optimalkan ukuran bundle
  swcMinify: true,

  // Konfigurasi output untuk deployment
  output: 'standalone',
};

module.exports = nextConfig;
