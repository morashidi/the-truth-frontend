import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy /api/* to the backend service
  // - In production (Vercel): Vercel edge rewrites handle this via vercel.json,
  //   but Next.js rewrites cover the SSR/middleware layer as well.
  // - In local dev: proxies to the Express server running on port 6500.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "/_/backend/api/:path*"
            : "http://localhost:6500/api/:path*",
      },
    ];
  },
};

export default nextConfig;
