import type { NextConfig } from 'next';
import { networkInterfaces } from 'node:os';

const isProd = process.env.NODE_ENV === 'production';

let internalHost: string | undefined;

function getInternalHost() {
  if (isProd) return;
  if (internalHost) return internalHost;

  const interfaces = networkInterfaces();
  const address = Object.values(interfaces).flatMap((netInterface) => {
    return netInterface?.filter((i) => i.family === 'IPv4' && !i.internal);
  })[0]?.address;

  internalHost = address;
}

function getAssetPrefix(disable = false) {
  if (isProd || disable) return;

  return `http://${getInternalHost()}:3000`;
}

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: getAssetPrefix(true),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    reactCompiler: true,
  },
} satisfies NextConfig;

export default nextConfig;
