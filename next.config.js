/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
  // Enable static exports for deployment
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
