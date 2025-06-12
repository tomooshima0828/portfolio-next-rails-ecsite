'use client';

import { useAppSelector, useAppDispatch } from '@/store/store';
import { increment, decrement } from '@/features/counter/counterSlice';

export default function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to E-Commerce App
        </h1>
        
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Redux Counter Example</h2>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => dispatch(decrement())}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Decrement
            </button>
            <span className="text-2xl font-bold">{count}</span>
            <button
              onClick={() => dispatch(increment())}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Increment
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
