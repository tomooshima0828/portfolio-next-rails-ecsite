'use client';

import ProductForm from '@/components/products/ProductForm';

function NewProductPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">新しい商品を登録</h1>
            <p className="mt-1 text-sm text-gray-500">商品の詳細情報を入力してください。</p>
          </div>
          <div className="p-6">
            <ProductForm />
          </div>
        </div>
      </div>
    </main>
  );
}

// このページは管理者のみがアクセスできるように、後ほど認証HOCでラップします。
// export default withAdminAuth(NewProductPage);
export default NewProductPage;
