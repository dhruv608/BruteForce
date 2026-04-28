import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "dsa-tracker-student-images-471613014213-ap-south-1-an.s3.ap-south-1.amazonaws.com",
      },
    ],
    qualities: [100, 75],
  },

  serverExternalPackages: ["@prisma/client", "prisma", "ioredis", "bullmq"],
};

export default nextConfig;
