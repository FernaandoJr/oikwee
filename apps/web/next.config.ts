import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: { position: 'bottom-right' },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
	
};

export default nextConfig;
