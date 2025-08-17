/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      // 若未來換網域，例如 api.example.com，就再加一條：
      // { protocol: 'https', hostname: 'api.example.com', port: '', pathname: '/uploads/**' },
    ],
  },
};

module.exports = nextConfig;
