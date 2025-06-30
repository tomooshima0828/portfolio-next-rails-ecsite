'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchCartItems, clearError } from '@/features/cart/cartSlice';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  const { items, total, itemsCount, loading, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    // 認証チェック
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }

    // 認証済みの場合、カートデータを取得
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [isAuthenticated, authLoading, dispatch, router]);

  useEffect(() => {
    // エラーがある場合、一定時間後にクリア
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // 認証チェック中の表示
  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart <span className="text-gray-600">ショッピングカート</span>
          </h1>
          
          {itemsCount > 0 && (
            <p className="mt-2 text-gray-600">
              {itemsCount} item{itemsCount !== 1 ? 's' : ''} in your cart
            </p>
          )}
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* ローディング状態 */}
        {loading && items.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* カートが空の場合 */}
            {items.length === 0 ? (
              <EmptyCart />
            ) : (
              /* カートに商品がある場合 */
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                {/* カートアイテム一覧 */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">
                        Cart Items
                      </h2>
                    </div>
                    
                    <div className="px-6">
                      {items.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* カートサマリー */}
                <div className="lg:col-span-4 mt-8 lg:mt-0">
                  <CartSummary
                    total={total}
                    itemsCount={itemsCount}
                    loading={loading}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}