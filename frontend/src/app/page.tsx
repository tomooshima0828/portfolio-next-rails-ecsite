'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { fetchHello } from '@/lib/apiClient';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMessage = async () => {
      console.log('Fetching message from backend...');
      try {
        console.log('Calling fetchHello()...');
        const data = await fetchHello();
        console.log('Received data:', data);
        setMessage(data.message);
        setError(null);
      } catch (err: unknown) {
        console.error('Error in getMessage:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to fetch data from backend: ${errorMessage}`);
      }
    };

    getMessage();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <nav className="w-full max-w-5xl mx-auto p-4 flex justify-between items-center bg-white shadow-md mb-8 rounded-lg">
        <div>
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            Portfolio E-Commerce App
          </Link>
        </div>
        <div>
          {isAuthenticated && user ? (
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/login" className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </Link>
              <Link href="/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center flex-grow w-full">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Portfolio E-Commerce App
          </h1>

          <div className="mt-8 text-center">
            <h2 className="font-semibold mb-4 text-gray-800">Backend Connection Test</h2>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-lg text-gray-800">{message}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
