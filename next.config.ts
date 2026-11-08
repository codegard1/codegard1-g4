import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 256, 384, 500],
    qualities: [60, 75, 80, 95],
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/blog/1", permanent: true },
      { source: "/posts", destination: "/blog/posts", permanent: true },
      { source: "/collection", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
