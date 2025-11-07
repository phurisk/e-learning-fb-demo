/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    forceSwcTransforms: true,
  },
  serverRuntimeConfig: {
    apiTimeout: 300000, // 5 minutes
  },
  images: {
    unoptimized: true,
    domains: ['img.youtube.com', 'i.ytimg.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'autoplay=*, fullscreen=*, picture-in-picture=*'
          },
        ],
      },
    ];
  },
  webpack(config, { isServer }) {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvas: false,
    }

    if (isServer) {
      config.externals = [...(config.externals || []), "canvas"]
    }

    return config
  },
};

export default nextConfig;
