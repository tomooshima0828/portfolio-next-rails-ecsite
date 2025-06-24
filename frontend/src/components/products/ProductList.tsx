'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProducts, fetchCategories, Product, Category } from '@/lib/apiClient';
import ProductCard from './ProductCard';
import Pagination from '../common/Pagination';

const ProductList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const perPage = 12;

  // 商品データを取得
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // テスト用に3秒の遅延を追加
      // await new Promise(resolve => setTimeout(resolve, 3000));
      const data = await fetchProducts(currentPage, perPage, selectedCategory);
      setProducts(data.products);
      setTotalPages(data.meta.total_pages);
      setTotalCount(data.meta.total_count);
      setError(null);
    } catch (err) {
      console.error('商品データの取得に失敗しました:', err);
      setError('商品データの取得に失敗しました。再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage, selectedCategory]);

  // カテゴリデータを取得
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('カテゴリデータの取得に失敗しました:', err);
      // カテゴリ取得失敗はクリティカルではないのでエラー表示はしない
    }
  };

  // 初回レンダリング時にデータを取得
  useEffect(() => {
    loadCategories();
  }, []);

  // ページやカテゴリが変更されたら商品を再取得
  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, loadProducts]);

  // ページ変更ハンドラ
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // カテゴリ変更ハンドラ
  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={loadProducts}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 管理者用の商品登録ボタン */}
      {user?.role === 'admin' && (
        <div className="mb-6 text-right">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            商品を登録する
          </Link>
        </div>
      )}

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(undefined)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
            ${selectedCategory === undefined 
              ? 'bg-indigo-100 text-indigo-800' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          すべて
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category.id 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 商品数表示 */}
      <div className="text-sm text-gray-500">
        {totalCount}件の商品が見つかりました
        {selectedCategory !== undefined && categories.find(c => c.id === selectedCategory) && 
          ` (カテゴリ: ${categories.find(c => c.id === selectedCategory)?.name})`}
      </div>

      {/* 商品リスト */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-gray-500">商品が見つかりませんでした。</p>
        </div>
      )}

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="py-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
