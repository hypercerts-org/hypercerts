/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NFT_STORAGE_TOKEN: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN,
  },
};

module.exports = nextConfig;
