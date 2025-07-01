'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProductList from '@/components/products/ProductList';
import { ExclamationTriangleIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2">
        {/* ヘッダーセクション */}
        <div className="text-center mb-6 sm:mb-8">
          {isMounted && !isLoading && !isAuthenticated || !user ? (
            <div className="mt-2 px-2 sm:px-0 max-w-3xl mx-auto">
              <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl md:text-3xl lg:text-3xl mb-3 sm:mb-4">
                E-Commerce App
                <span className="block text-base sm:text-lg text-gray-600 mt-1 sm:mt-2">Eコマースアプリ</span>
              </h1>
              <div className="mb-4">
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 sm:p-4 max-w-sm sm:max-w-md mx-auto">
                  <div className="text-center text-gray-900 mb-3">
                    <p className="text-sm sm:text-base"><strong>Operation Check Steps</strong></p>
                    <p className="text-sm sm:text-base"><strong>動作確認手順</strong></p>
                  </div>
                  <div className="text-left text-sm text-gray-900 space-y-1">
                    <p>1. Press &apos;Login&apos; button ログインボタンをクリック</p>
                    <p>2. Select products 商品を選択</p>
                    <p>3. Add products to cart カートに商品を追加</p>
                    <p>4. Proceed to checkout 決済画面へ遷移</p>
                    <p>5. Enter test card info テストカード情報を入力</p>
                    <p>6. Press &apos;Pay&apos; button 支払いボタンをクリック</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-md max-w-sm sm:max-w-md mx-auto">
                  <div className="flex items-start space-x-2">
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Notice:</strong> This application is deployed using free tiers of Render, Vercel, and Supabase, so initial loading may be slow.
                      </p>
                      <p className="text-sm text-yellow-800 mt-1">
                        <strong>ご注意:</strong> このアプリケーションはRender、Vercel、Supabaseの無料枠を利用してデプロイされているため初動が遅くなる場合があります。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* 商品一覧セクション */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product List <span className="text-gray-600">商品一覧</span></h2>
          <ProductList />
        </div>
      </div>
    </main>
  );
}
