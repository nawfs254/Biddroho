/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '192.168.0.176',
    '192.168.0.176:3000',
    'localhost',
    'localhost:3000',
  ],
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    cpus: 2,
    workerThreads: false,
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
