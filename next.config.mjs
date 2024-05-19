const isProd = process.env.NODE_ENV === 'production';

let internalHost = null;

if (!isProd) {
    const { internalIpV4 } = await import('internal-ip');
    internalHost = await internalIpV4();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    assetPrefix: isProd ? null : `http://${internalHost}:3000`,
};

export default nextConfig;