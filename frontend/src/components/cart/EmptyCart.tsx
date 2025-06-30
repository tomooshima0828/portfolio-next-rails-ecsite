'use client';

import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <ShoppingCartIcon className="mx-auto h-24 w-24 text-gray-400" />
      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Your cart is empty
      </h2>
      <p className="mt-2 text-gray-600">
        Add your favorite items to get started
      </p>
      
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Shop Now
        </Link>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Browse our collection of products and find something you love!</p>
      </div>
    </div>
  );
}