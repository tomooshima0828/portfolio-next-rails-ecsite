'use client';

import { useState, useEffect } from 'react';
import { fetchHello } from '@/lib/apiClient';

export default function Home() {
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
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
    </main>
  );
}
