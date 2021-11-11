/** @type {import('next').NextConfig} */
module.exports = {
  basePath: '/pachi-patch',
  assetPrefix: '/pachi-patch/',
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com'],
    loader: 'custom',
  },
};
