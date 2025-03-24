import type { NextConfig } from "next";




/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

export default nextConfig;
