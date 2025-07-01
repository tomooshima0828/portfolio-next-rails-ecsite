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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-lg sm:text-xl font-bold text-gray-900">
              <span className="hidden sm:inline">E-Commerce App</span>
              <span className="sm:hidden">E-Commerce</span>
            </Link>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            <CartIcon />
            {isAuthenticated ? (
              <>
                <Link
                  href="/mypage"
                  className={`px-2 sm:px-3 py-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${pathname === '/mypage' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="hidden sm:block">My Page</span>
                  <span className="sm:hidden">My Page</span>
                  <span className="hidden sm:block text-xs text-gray-500">マイページ</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-2 sm:px-3 py-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                >
                  <span className="hidden sm:block">Logout</span>
                  <span className="sm:hidden">Logout</span>
                  <span className="hidden sm:block text-xs text-gray-500">ログアウト</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className={`px-2 sm:px-3 py-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${pathname === '/signup' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="hidden sm:block">Sign Up</span>
                  <span className="sm:hidden">Sign up</span>
                  <span className="hidden sm:block text-xs text-gray-500">新規登録</span>
                </Link>
                <Link
                  href="/login"
                  className={`px-2 sm:px-3 py-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${pathname === '/login' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="hidden sm:block">Login</span>
                  <span className="sm:hidden">Login</span>
                  <span className="hidden sm:block text-xs text-gray-500">ログイン</span>
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
