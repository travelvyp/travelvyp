/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverExternalPackages: ["@prisma/client", "bcryptjs", "pdfkit"],
  },
};

module.exports = nextConfig;