/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // updated key for next 16+
  serverExternalPackages: ['viem'],

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;