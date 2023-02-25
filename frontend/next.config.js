/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEFAULT_CHAIN_ID: process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID,
    CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    NFT_STORAGE_TOKEN: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN,
    WEB3_STORAGE_TOKEN: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN,
  },
};

module.exports = nextConfig;
