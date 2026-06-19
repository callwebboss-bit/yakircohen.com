import type { NextConfig } from "next";
import { getLegacyRedirects } from "@/lib/legacy-redirects";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/**": ["./next.config.ts"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // www → canonical (no-www). Must come first so all other rules apply to the clean host.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.yakircohen.com" }],
        destination: "https://yakircohen.com/:path*",
        permanent: true,
      },
      // Strip WooCommerce ?add-to-cart= parameter that Google still crawls from the old WP site.
      {
        source: "/:path*",
        has: [{ type: "query", key: "add-to-cart" }],
        destination: "/:path*",
        permanent: true,
      },
      ...getLegacyRedirects(),
      // Strip .html extensions (produced by Pagefind crawling .next/server/app)
      {
        source: "/:path(.*)\\.html",
        destination: "/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
