require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/TestWork0430',
  reactStrictMode: true,
  images: {
    domains: ['openweathermap.org'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;