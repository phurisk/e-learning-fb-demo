/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ปิด strict mode เพื่อลด compatibility warnings
  experimental: {
    // ใช้ swc compiler
    forceSwcTransforms: true,
  },
  // เพิ่ม API route timeout สำหรับการอัปโหลดไฟล์ขนาดใหญ่
  serverRuntimeConfig: {
    // จะใช้ได้เฉพาะใน server-side
    apiTimeout: 300000, // 5 minutes
  },

  images: {
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
        // Apply CORS headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};

export default nextConfig;
