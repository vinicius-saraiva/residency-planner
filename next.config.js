/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/residency-planner',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig 