import type { NextConfig } from "next";

/**
 * Pitch hosting:
 * - Preferred: push to GitHub → import on Vercel (free) — full Next.js support
 * - Optional static: set AHEERS_STATIC=1 for `output: "export"` (GitHub Pages)
 */
const isStatic = process.env.AHEERS_STATIC === "1";

const nextConfig: NextConfig = {
  ...(isStatic
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {
        async redirects() {
          return [
            { source: "/nexus", destination: "/admin", permanent: true },
            { source: "/nexus/:path*", destination: "/admin/:path*", permanent: true },
          ];
        },
      }),
};

export default nextConfig;
