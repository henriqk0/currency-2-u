import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/external-api/:path*",
        destination: process.env.API_URL + "/api/:path*"
      },
      {
        source: "/internal-api/:path*",
        destination: process.env.NEXT_PUBLIC_SITE_URL + "/api/:path*"
      }
    ];
  }
};

export default nextConfig;
