'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { fetchHello } from '@/lib/apiClient';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const data = await fetchHello();
        setMessage(data.message);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching data:', err);
        const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
        setError(`バックエンドからのデータ取得に失敗しました: ${errorMessage}`);
      }
    };

    getMessage();
  }, []);

  // エラーが発生した場合の表示
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full p-6 bg-red-50 rounded-lg shadow">
          <h2 className="text-xl font-bold text-red-800 mb-4">Error Occurred</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            E-Commerce App
            <span className="block text-2xl text-gray-600 mt-2">Eコマースアプリ</span>
          </h1>
          
          {isAuthenticated && user ? (
            <div className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              <p>Welcome back, {user.name}!</p>
              <p className="text-lg text-gray-500">{user.name}さん、おかえりなさい！</p>
            </div>
          ) : (
            <div className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              <p>Login to check your order history.</p>
              <p className="text-lg text-gray-500">ログインすると、注文履歴の確認ができます。</p>
            </div>
          )}
          
          <div className="mt-10">
            <Link
              href="/products"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
            >
              View Products / 商品一覧
            </Link>
          </div>
          
          {message && (
            <div className="mt-8 p-4 bg-green-50 rounded-md max-w-2xl mx-auto">
              <p className="text-green-800 text-center">Connection Test: {message}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
