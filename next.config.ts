import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Keep picsum.photos
        port: '',
        pathname: '/**',
      },
      // Add other potential image source domains here if needed later
      // For example, if you scrape from 'example-news.com':
      // {
      //   protocol: 'https',
      //   hostname: 'example-news.com',
      //   port: '',
      //   pathname: '/images/**',
      // },
    ],
  },
};

export default nextConfig;
