/** @type {import('next').NextConfig} */
module.exports = {
  assetPrefix: './',
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com'],
    loader: 'custom',
  },
};
