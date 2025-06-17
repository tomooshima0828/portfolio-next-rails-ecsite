'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/lib/apiClient';

const MyPage = () => {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useAuth();
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // ローカルストレージにトークンがあるか確認
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.log('No token found in localStorage, redirecting to home');
      router.push('/');
      return;
    }
    
    // ユーザーが既に設定されていれば、ローディングを停止
    if (user) {
      setLocalUser(user);
      setPageLoading(false);
      return;
    }
    
    // ユーザーが設定されていない場合、認証状態を確認
    const verifyAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const isAuth = await checkAuth();
        
        if (isAuth) {
          console.log('Authentication successful');
          setPageLoading(false);
        } else {
          console.log('Authentication failed, redirecting to home');
          router.push('/');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/');
      }
    };
    
    verifyAuth();
  }, [user, checkAuth, router]);

  // ユーザー情報が更新されたら、ローカルの状態も更新
  useEffect(() => {
    if (user) {
      setLocalUser(user);
      setPageLoading(false);
    }
  }, [user]);

  // ロード中の表示
  if (pageLoading || isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <p className="text-center text-gray-700">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">My Page</h1>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">マイページ</h1>

        {localUser && (
          <div className="mt-6">
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information / ユーザー情報</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">Name / 氏名:</span> {localUser.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email / メールアドレス:</span> {localUser.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Address / 住所:</span> {localUser.address}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Phone / 電話番号:</span> {localUser.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Home / ホーム
              </Link>
              <button
                onClick={() => router.push('/')}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Shopping / ショッピングに戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyPage;
