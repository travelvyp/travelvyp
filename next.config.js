/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: "/itinerario",
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma", "bcryptjs", "@react-pdf/renderer"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;
