/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ant-design/icons'],
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
  experimental: {
    optimizePackageImports: ['@ant-design/icons'],
  },
}

module.exports = nextConfig