const withNextIntl = require("next-intl/plugin")(
  "./src/libs/next-intl/i18n.ts",
);

/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
};

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));
