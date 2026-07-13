import type { NextConfig } from "next";
import { getLegacyRedirects } from "@/lib/legacy-redirects";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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
  /**
   * Report-Only: collect violations without blocking.
   * Tighten to enforce after reviewing browser reports / Vercel logs.
   */
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self' https://wa.me https://api.whatsapp.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.elfsight.com https://core.service.elfsight.com https://*.elfsight.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.elfsight.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com https://*.elfsight.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://region1.google-analytics.com https://*.elfsight.com https://core.service.elfsight.com https://wa.me https://api.whatsapp.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com https://*.elfsight.com",
      "media-src 'self' blob: https:",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join("; "),
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

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
