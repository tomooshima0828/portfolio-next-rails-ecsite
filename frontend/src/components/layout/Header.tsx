'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

// CartIconをクライアントサイドでのみ読み込む
const CartIcon = dynamic(
  () => import('@/components/cart/CartIcon'),
  { 
    ssr: false,
    loading: () => (
      <div className="relative p-2 text-gray-600">
        <div className="h-6 w-6"></div>
      </div>
    )
  }
);

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('failed to logout:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex
          ">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                E-Commerce App
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <CartIcon />
            {isAuthenticated ? (
              <>
                <Link
                  href="/mypage"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/mypage' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  My Page
                  <span className="block text-xs text-gray-500">マイページ</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                >
                  Logout
                  <span className="block text-xs text-gray-500">ログアウト</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/signup' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  Sign Up
                  <span className="block text-xs text-gray-500">新規登録</span>
                </Link>
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/login' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  Login
                  <span className="block text-xs text-gray-500">ログイン</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
