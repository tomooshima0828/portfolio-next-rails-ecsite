import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, loginUser, registerUser, logoutUser, getCurrentUser } from '@/lib/apiClient';

// 認証コンテキストの型定義
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    address: string;
    phone: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  error: string | null;
};

// デフォルト値を持つコンテキストを作成
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => ({ status: { code: 0, message: '' } }),
  register: async () => ({ status: { code: 0, message: '' } }),
  logout: async () => {},
  error: null,
});

// コンテキストを使用するためのカスタムフック
export const useAuth = () => useContext(AuthContext);

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // トークンをローカルストレージに保存する関数
  const saveToken = (token: string) => {
    localStorage.setItem('auth_token', token);
  };

  // トークンをローカルストレージから削除する関数
  const removeToken = () => {
    localStorage.removeItem('auth_token');
  };

  // ログイン処理
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginUser({ email, password });
      
      if (response.status.code === 200 && response.data && response.token) {
        setUser(response.data);
        saveToken(response.token);
      } else {
        setError(response.status.message);
      }
      
      setIsLoading(false);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An authentication error occurred');
      setIsLoading(false);
      throw error;
    }
  };

  // ユーザー登録処理
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    address: string;
    phone: string;
  }): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await registerUser(userData);
      
      if (response.status.code === 200 && response.data && response.token) {
        setUser(response.data);
        saveToken(response.token);
      } else {
        setError(response.status.message);
      }
      
      setIsLoading(false);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'A registration error occurred');
      setIsLoading(false);
      throw error;
    }
  };

  // ログアウト処理
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await logoutUser();
      setUser(null);
      removeToken();
    } catch (error) {
      setError('An error occurred during logout.');
    } finally {
      setIsLoading(false);
    }
  };

  // 初期化時にユーザー情報を取得
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // ローカルストレージにトークンがあるか確認
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          // 現在のユーザー情報を取得
          const response = await getCurrentUser();
          
          if (response.status.code === 200 && response.data) {
            setUser(response.data);
          } else {
            // トークンが無効な場合は削除
            removeToken();
          }
        } catch (error) {
          console.error('Authentication error:', error);
          removeToken();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // コンテキスト値
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
