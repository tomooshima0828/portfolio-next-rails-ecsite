'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchProduct, Product } from '@/lib/apiClient';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.id) return;
      // Next.jsではproducts/[id] のようなファイル構造にすると、URLの [id] の部分を params.id という文字列で受け取ることができる
      // そのため、parseIntで10進数の数値に変換する必要がある
      const productId = parseInt(params.id as string, 10);

      // IDが数字でない場合（例: /products/new）は、エラーとして処理
      if (isNaN(productId)) {
        setError('商品が見つかりませんでした。');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchProduct(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('商品データの取得に失敗しました:', err);
        setError('商品データの取得に失敗しました。再度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  // 価格をフォーマット（日本円表示）
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  // 在庫状況に応じたラベルとスタイル
  const getStockInfo = (stock: number) => {
    if (stock >= 10) {
      return {
        label: '在庫あり',
        style: 'bg-green-100 text-green-800',
      };
    } else if (stock > 0) {
      return {
        label: `残り${stock}点`,
        style: 'bg-yellow-100 text-yellow-800',
      };
    } else {
      return {
        label: '在庫切れ',
        style: 'bg-red-100 text-red-800',
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="max-w-2xl w-full p-6 bg-red-50 rounded-lg shadow">
          <h2 className="text-xl font-bold text-red-800 mb-4">エラーが発生しました</h2>
          <p className="text-red-700">{error || '商品が見つかりませんでした。'}</p>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              再読み込み
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stockInfo = getStockInfo(product.stock);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <nav className="mb-8">
          <ol className="flex text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                ホーム
              </Link>
            </li>
            <li className="mx-2">/</li>
            {product.category && (
              <>
                <li>
                  <Link 
                    href={`/?category=${product.category.id}`}
                    className="hover:text-gray-700"
                  >
                    {product.category.name}
                  </Link>
                </li>
                <li className="mx-2">/</li>
              </>
            )}
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* 商品画像（左側） */}
            <div className="md:w-1/2">
              <div className="h-80 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">商品画像</span>
              </div>
            </div>

            {/* 商品情報（右側） */}
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                {product.category && (
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mb-2">
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">（税込）</span>
                </div>
              </div>

              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${stockInfo.style}`}>
                  {stockInfo.label}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-2">商品説明</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>

              <div className="flex space-x-4">
                <button
                  disabled={product.stock <= 0}
                  className={`flex-1 px-6 py-3 rounded-md font-medium text-white 
                    ${product.stock > 0 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  カートに追加
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
