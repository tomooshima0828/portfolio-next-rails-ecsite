'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProductList from '@/components/products/ProductList';

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダーセクション */}
        <div className="text-center mb-8">
          {isMounted && !isLoading && !isAuthenticated || !user ? (
            <div className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
                E-Commerce App
                <span className="block text-2xl text-gray-600 mt-2">Eコマースアプリ</span>
              </h1>
              <p>ログインすると、注文履歴の確認や商品の購入ができます。</p>
              <div className="mt-4 space-x-4">
                <Link
                  href="/login"
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  新規登録
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* 商品一覧セクション */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">商品一覧</h2>
          <ProductList />
        </div>
      </div>
    </main>
  );
}
