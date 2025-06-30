import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/rails/active_storage/disk/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/rails/active_storage/blobs/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/rails/active_storage/representations/**',
      },
    ],
  },
  // Next.js 15.3.3ではswcMinifyオプションは不要
  // 開発環境でのAPIプロキシ設定
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://backend:3000'}/api/:path*`,
      },
    ];
  },
  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/signup',
        permanent: true, // 308 ステータスコード（永続的リダイレクト）
      },
    ];
  },
  // 開発サーバーの設定
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

export default nextConfig;
