'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import dynamic from 'next/dynamic';

// クライアントサイドでのみ読み込む
const AuthProvider = dynamic(
  () => import('@/contexts/AuthContext').then(mod => mod.AuthProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}
