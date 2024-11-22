import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3o574pyao1sq3.cloudfront.net",
        port: "",
        pathname: "/fashion/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
