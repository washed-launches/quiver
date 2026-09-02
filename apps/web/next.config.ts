import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@quiver/sdk"],
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "/docs/[[...slug]]": ["../../docs/**/*"],
  },
  async rewrites() {
    const dest = process.env.API_UPSTREAM ?? "";
    if (!dest || dest.includes("127.0.0.1") || dest.includes("localhost")) return [];
    return [{ source: "/api/:path*", destination: `${dest.replace(/\/$/, "")}/:path*` }];
  },
};

export default nextConfig;
