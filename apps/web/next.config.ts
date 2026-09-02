import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@quiver/sdk"],
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const dest = process.env.API_UPSTREAM ?? "http://127.0.0.1:4001";
    return [{ source: "/api/:path*", destination: `${dest}/:path*` }];
  },
};

export default nextConfig;
