const withNextIntl = require("next-intl/plugin")("./src/libs/i18n.ts");

/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: false,
  // experimental: {
  //   standalone: true,
  // },
};

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));
