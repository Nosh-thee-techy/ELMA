/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/counties", destination: "/explore", permanent: false },
      { source: "/transparency", destination: "/explore", permanent: false },
      { source: "/safety", destination: "/channels/phone", permanent: false },
      { source: "/about", destination: "/", permanent: false },
      { source: "/emergency", destination: "/app", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
