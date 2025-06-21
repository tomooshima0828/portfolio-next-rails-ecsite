'use client';

import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, Product, Category } from '@/lib/apiClient';
import ProductCard from './ProductCard';
import Pagination from '../common/Pagination';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const perPage = 12;

  // 商品データを取得
  const loadProducts = async () => {
    setIsLoading(true);
    try {
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
  };

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
  }, [currentPage, selectedCategory]);

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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
