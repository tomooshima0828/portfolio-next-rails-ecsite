'use client';

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch } from '@/store/store';
import { updateCartItem, removeFromCart } from '@/features/cart/cartSlice';
import type { CartItem as CartItemType } from '@/features/cart/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock || newQuantity === quantity) {
      return;
    }

    setIsUpdating(true);
    try {
      const result = await dispatch(updateCartItem({
        id: item.id,
        quantity: newQuantity
      }));

      if (updateCartItem.fulfilled.match(result)) {
        setQuantity(newQuantity);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    if (window.confirm('Remove this item from cart?')) {
      setIsUpdating(true);
      try {
        await dispatch(removeFromCart(item.id));
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const incrementQuantity = () => {
    if (quantity < item.product.stock) {
      handleQuantityChange(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="flex items-center py-6 border-b border-gray-200">
      {/* 商品画像 */}
      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
        {item.product.main_image_url ? (
          // Use regular img tag for Active Storage URLs with redirects
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.product.main_image_url}
            alt={item.product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide image if loading fails
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextSibling) {
                (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div 
          className="w-full h-full bg-gray-200 flex items-center justify-center"
          style={{ display: item.product.main_image_url ? 'none' : 'flex' }}
        >
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      </div>

      {/* 商品情報 */}
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {item.product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {item.product.category.name}
            </p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {formatPrice(item.product.price)}
            </p>
          </div>

          {/* 削除ボタン */}
          <button
            onClick={handleRemoveItem}
            disabled={isUpdating}
            className="text-gray-400 hover:text-red-500 disabled:opacity-50"
            title="カートから削除"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        {/* 数量コントロールと小計 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <label htmlFor={`quantity-${item.id}`} className="sr-only">
              Quantity
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                type="button"
                onClick={decrementQuantity}
                disabled={quantity <= 1 || isUpdating}
                className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <input
                id={`quantity-${item.id}`}
                type="number"
                min="1"
                max={item.product.stock}
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    setQuantity(value);
                  }
                }}
                onBlur={() => handleQuantityChange(quantity)}
                disabled={isUpdating}
                className="w-16 px-2 py-1 text-center text-gray-900 border-0 focus:ring-0 disabled:opacity-50 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
              <button
                type="button"
                onClick={incrementQuantity}
                disabled={quantity >= item.product.stock || isUpdating}
                className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <span className="ml-2 text-xs text-gray-500">
              (Stock: {item.product.stock})
            </span>
          </div>

          {/* 小計 */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              Subtotal: {formatPrice(item.subtotal)}
            </p>
            {isUpdating && (
              <p className="text-xs text-gray-500 mt-1">Updating...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}