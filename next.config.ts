import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export para despliegue en S3 — sin servidor Node.js requerido
  output: 'export',
  images: {
    // next/image optimization API no está disponible en static export
    unoptimized: true,
  },
};

export default nextConfig;
