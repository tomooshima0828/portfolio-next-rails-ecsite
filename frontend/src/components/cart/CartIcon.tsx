'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchCartItems } from '@/features/cart/cartSlice';

export default function CartIcon() {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { itemsCount, loading } = useAppSelector((state) => state.cart);
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのマウントを確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 認証済みかつマウント済みの場合のみカートデータを取得
    if (isMounted && isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [isAuthenticated, dispatch, isMounted]);

  // マウント前は何も表示しない（SSRでは常に何も表示しない）
  if (!isMounted) {
    return null;
  }

  // 未認証の場合は表示しない
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
      title="Shopping Cart"
    >
      <ShoppingCartIcon className="h-6 w-6" />
      
      {/* カート内商品数のバッジ */}
      {itemsCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemsCount > 99 ? '99+' : itemsCount}
        </span>
      )}
      
      {/* ローディング時のインジケーター */}
      {loading && (
        <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          <div className="animate-spin rounded-full h-3 w-3 border-t border-white border-opacity-50"></div>
        </span>
      )}
    </Link>
  );
}