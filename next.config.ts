import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
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
