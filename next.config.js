/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/residency-planner',
  images: {
    unoptimized: true,
  },
  assetPrefix: '/residency-planner/',
  trailingSlash: true,
}

module.exports = nextConfig 