/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
    allowedDevOrigins: ['192.168.0.148', 'localhost:3000'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: "Vector Comunity Control Panel",
    NEXT_PUBLIC_ENV: "development",
  }
};

export default nextConfig;
