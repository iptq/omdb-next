/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ppy.sh",
        port: "",
      },
    ],
  },
};

export default nextConfig;
