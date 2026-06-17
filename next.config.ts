import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  images: {
    ...(isStaticExport ? { unoptimized: true } : {}),
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cms.widartoimpact.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["gsap", "lucide-react", "@radix-ui/react-dialog"],
  },
};

export default nextConfig;
