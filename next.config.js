/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];  // required by @tiptap/pm
    return config;
  },
}

module.exports = nextConfig