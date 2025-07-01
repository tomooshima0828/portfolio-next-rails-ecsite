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
        const isAuth = await checkAuth();
        
        if (isAuth) {
          setPageLoading(false);
        } else {
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
        <h1 className="text-2xl font-bold text-center text-gray-800">My Page マイページ</h1>

        {localUser && (
          <div className="mt-6">
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information ユーザー情報</h2>
              <div className="overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 pr-6 text-sm font-medium text-gray-900 w-1/3">
                        Name 氏名
                      </td>
                      <td className="py-3 text-sm text-gray-700">
                        {localUser.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 text-sm font-medium text-gray-900 w-1/3">
                        Email メールアドレス
                      </td>
                      <td className="py-3 text-sm text-gray-700">
                        {localUser.email}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 text-sm font-medium text-gray-900 w-1/3">
                        Address 住所
                      </td>
                      <td className="py-3 text-sm text-gray-700">
                        {localUser.address}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 text-sm font-medium text-gray-900 w-1/3">
                        Phone 電話番号
                      </td>
                      <td className="py-3 text-sm text-gray-700">
                        {localUser.phone}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center">
                Back to Shopping ショッピングに戻る
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyPage;
