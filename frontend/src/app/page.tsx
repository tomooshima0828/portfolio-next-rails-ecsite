'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { fetchHello } from '@/lib/apiClient';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMessage = async () => {
      console.log('Fetching message from backend...');
      try {
        console.log('Calling fetchHello()...');
        const data = await fetchHello();
        console.log('Received data:', data);
        setMessage(data.message);
        setError(null);
      } catch (err: unknown) {
        console.error('Error in getMessage:', err);
        const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
        setError(`バックエンドからデータを取得できませんでした: ${errorMessage}`);
      }
    };

    getMessage();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <nav className="w-full max-w-5xl mx-auto p-4 flex justify-between items-center bg-white shadow-md mb-8 rounded-lg">
        <div>
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            ECサイト
          </Link>
        </div>
        <div>
          {isAuthenticated && user ? (
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">ようこそ、{user.name}さん</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/login" className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                ログイン
              </Link>
              <Link href="/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                新規登録
              </Link>
            </div>
          )}
        </div>
      </nav>
      {/* メインコンテンツを中央揃えにするために items-center justify-center を内側のdivに移動 */}
      <div className="flex flex-col items-center justify-center flex-grow w-full">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to E-Commerce App
        </h1>
        
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">バックエンド接続テスト</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-lg">{message}</p>
          )}
        </div>
      </div>
    </div>
    </main>
  );
}
