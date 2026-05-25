import type { NextConfig } from "next";
import { getLegacyRedirects } from "@/lib/legacy-redirects";

const nextConfig: NextConfig = {
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
  async redirects() {
    return [
      ...getLegacyRedirects(),
      {
        source: "/portfolio",
        destination: "/video",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
