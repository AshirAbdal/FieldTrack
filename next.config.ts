// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        '127.0.0.1:5500'
      ],
      allowedForwardedHosts: [
        'localhost:3000',
        '127.0.0.1:3000',
        '127.0.0.1:5500'
      ]
    }
  }
}

module.exports = nextConfig