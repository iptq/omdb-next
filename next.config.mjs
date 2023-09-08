/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

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
