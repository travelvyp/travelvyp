import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que Webpack intente bundlear paquetes con binarios nativos
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "prisma",
      "bcryptjs",
      "@react-pdf/renderer",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
