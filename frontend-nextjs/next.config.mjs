/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "images.unsplash.com",
      "source.unsplash.com",
    ],
  },
  // experimental: {
  //   serverActions: true,
  // },

};

export default nextConfig;
