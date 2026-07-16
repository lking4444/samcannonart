import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: "100mb",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d26dvpuofn8byw.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;