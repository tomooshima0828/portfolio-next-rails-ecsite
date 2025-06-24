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
  const stockLabel = product.stock >= 10
    ? '在庫あり'
    : product.stock > 0
      ? `残り${product.stock}点`
      : '在庫切れ'

  const stockStyle = product.stock >= 10
    ? 'bg-green-100 text-green-800'
    : product.stock > 0
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800';

  // 画像URLをそのまま使用（RailsのActiveStorageは完全なURLを返す）
  const imageUrl = product.main_image_url || null;

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 ease-in-out group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2 h-10 line-clamp-2">{product.description}</p>

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
