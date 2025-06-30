'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addToCart } from '@/features/cart/cartSlice';
import { useAuth } from '@/contexts/AuthContext';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  stock: number;
  price: number;
  className?: string;
}

export default function AddToCartButton({
  productId,
  productName,
  stock,
  price,
  className = ''
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { loading, error } = useAppSelector((state) => state.cart);
  
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのマウントを確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = async () => {
    // 認証チェック
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 在庫チェック
    if (stock <= 0) {
      return;
    }

    if (quantity > stock) {
      alert('Selected quantity exceeds available stock.');
      return;
    }

    try {
      const result = await dispatch(addToCart({
        product_id: productId,
        quantity: quantity
      }));

      if (addToCart.fulfilled.match(result)) {
        // 成功時の処理
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else if (addToCart.rejected.match(result)) {
        // エラー時の処理
        alert(result.payload || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('カートへの追加でエラーが発生しました:', err);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const isDisabled = stock <= 0 || loading;

  return (
    <div className="space-y-4">
      {/* 数量選択 */}
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity:
        </label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isDisabled}
            className="px-2 py-1 text-gray-900 border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            -
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 1 && value <= stock) {
                setQuantity(value);
              }
            }}
            className="w-16 px-2 py-1 text-center text-gray-900 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            disabled={isDisabled}
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock || isDisabled}
            className="px-2 py-1 text-gray-900 border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">
          (Stock: {stock})
        </span>
      </div>

      {/* 小計表示 */}
      <div className="text-sm text-gray-600">
        Subtotal: {new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: 'JPY'
        }).format(price * quantity)}
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 成功メッセージ */}
      {showSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">
            &ldquo;{productName}&rdquo; added to cart!
          </p>
        </div>
      )}

      {/* カートに追加ボタン */}
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`w-full px-6 py-3 rounded-md font-medium text-white transition-colors duration-200 ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        } ${className}`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : stock <= 0 ? (
          'Out of Stock'
        ) : (
          'Add to Cart'
        )}
      </button>

      {/* 認証が必要な場合のメッセージ */}
      {isMounted && !isAuthenticated && (
        <p className="text-sm text-gray-500 text-center">
          Please
          <button
            onClick={() => router.push('/login')}
            className="text-indigo-600 hover:text-indigo-500 underline ml-1"
          >
            login
          </button>
          to add items to cart
        </p>
      )}
    </div>
  );
}