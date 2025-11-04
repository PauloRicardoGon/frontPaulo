import createNextPWA from '@ducanh2912/next-pwa';

const withPWA = createNextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  workboxOptions: {
    swSrc: 'sw/service-worker.ts',
  },
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
};

export default withPWA(nextConfig);
