// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

import { withSentryConfig } from "@sentry/nextjs";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    // https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-next/next.config.js
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  transpilePackages: ["@hypercerts-org/sdk"],
  output: 'export'
};

export default withSentryConfig(
  nextConfig,
  { silent: true },
  { hideSourcemaps: false },
);
