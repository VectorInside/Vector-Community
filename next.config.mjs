/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: "Vector Comunity Control Panel",
    NEXT_PUBLIC_ENV: "development",
  },
  async redirects() {
    return [
      {
        source: '/brand-profile',
        destination: '/profile?tab=strategy',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
