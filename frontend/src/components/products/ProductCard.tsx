'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/apiClient';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  // 価格をフォーマット（日本円表示）
  const formattedPrice = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(product.price);

  // 在庫状況に応じたラベルとスタイル
  const stockLabel = product.stock > 0 
    ? `在庫: ${product.stock}点` 
    : '在庫切れ';
  
  const stockStyle = product.stock > 0 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 w-full bg-gray-200">
          {/* 実際の画像がある場合はここに表示。今回はダミー画像 */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <span>商品画像</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStyle}`}>
              {stockLabel}
            </span>
          </div>
          
          {product.category && (
            <div className="mt-2">
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {product.category.name}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
