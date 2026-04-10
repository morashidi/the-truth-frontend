import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Tell Next.js its workspace root is the frontend folder,
  // preventing confusion from the root-level package.json/lockfile
  outputFileTracingRoot: path.join(__dirname, "../"),

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
