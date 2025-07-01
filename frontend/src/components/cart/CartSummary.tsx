'use client';

import Link from 'next/link';

interface CartSummaryProps {
  total: number;
  itemsCount: number;
  loading?: boolean;
}

export default function CartSummary({ total, itemsCount, loading = false }: CartSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  // 送料計算（例: 10,000円以上で送料無料）
  const shippingThreshold = 10000;
  const shippingCost = total >= shippingThreshold ? 0 : 500;
  const finalTotal = total + shippingCost;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3">
        {/* 商品点数 */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items:</span>
          <span className="text-gray-900">{itemsCount} items</span>
        </div>

        {/* 小計 */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-gray-900">{formatPrice(total)}</span>
        </div>

        {/* 送料 */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping:</span>
          <span className="text-gray-900">
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>

        {/* 送料無料までの残り金額 */}
        {total > 0 && total < shippingThreshold && (
          <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
            {formatPrice(shippingThreshold - total)} more for free shipping
          </div>
        )}

        <hr className="border-gray-200" />

        {/* 合計 */}
        <div className="flex justify-between text-lg font-medium">
          <span className="text-gray-900">Total:</span>
          <span className="text-gray-900">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="mt-6 space-y-3">
        {itemsCount === 0 || loading ? (
          <button
            disabled={true}
            className="w-full px-6 py-3 rounded-md font-medium text-white transition-colors duration-200 bg-gray-400 cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Proceed to Checkout'
            )}
          </button>
        ) : (
          <Link
            href="/checkout"
            className="block w-full px-6 py-3 rounded-md font-medium text-white transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center"
          >
            Proceed to Checkout
          </Link>
        )}

        <Link
          href="/"
          className="block w-full px-6 py-3 border border-gray-300 rounded-md text-center text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Continue Shopping
        </Link>
      </div>

      {/* 注意事項 */}
      <div className="mt-6 text-xs text-gray-500">
        <p>* Prices include tax</p>
        <p>* Items may be unavailable due to stock conditions</p>
      </div>
    </div>
  );
}