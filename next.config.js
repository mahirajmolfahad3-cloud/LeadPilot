/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allows production builds to complete even if ESLint errors exist
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allows production builds to complete even if type errors exist
    // Remove this once you've verified the build is clean locally
    ignoreBuildErrors: false,
  },
}
module.exports = nextConfig
