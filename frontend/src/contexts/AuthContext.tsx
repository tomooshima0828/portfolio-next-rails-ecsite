import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, loginUser, registerUser, logoutUser, getCurrentUser } from '@/lib/apiClient';

// 認証コンテキストの型定義
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    address: string;
    phone: string;
  }) => Promise<AuthResponse>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

// デフォルト値を持つコンテキストを作成
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => ({ status: { code: 0, message: '' } }),
  register: async () => ({ status: { code: 0, message: '' } }),
  logout: async () => { },
  error: null,
  checkAuth: async () => false,
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
        // トークンを保存
        saveToken(response.token);
        // ユーザー情報を取得して状態を更新
        await checkAuth();
        return response;
      } else {
        const errorMessage = response.status.message || 'ログインに失敗しました';
        setError(errorMessage);
        setIsLoading(false);
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '認証中にエラーが発生しました';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
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
        // トークンを保存
        saveToken(response.token);
        // ユーザー情報を取得して状態を更新
        await checkAuth();
        return response;
      } else {
        const errorMessage = response.status.message || '登録に失敗しました';
        setError(errorMessage);
        setIsLoading(false);
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登録中にエラーが発生しました';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // ログアウト処理
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // バックエンドにログアウトリクエストを送信
      await logoutUser();
      // トークンを削除
      removeToken();
      // ユーザー状態をリセット
      setUser(null);
      setIsLoading(false);
    } catch (error) {
      // エラーが発生してもローカルの認証状態はクリアする
      removeToken();
      setUser(null);

      const errorMessage = error instanceof Error ? error.message : 'ログアウト中にエラーが発生しました';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // 初期化時にユーザー情報を取得
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };

    initAuth();
  }, []);

  // 認証状態を確認する関数
  const checkAuth = async (): Promise<boolean> => {
    // SSR時はlocalStorageにアクセスしない
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return false;
    }

    const token = localStorage.getItem('auth_token');

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return false;
    }

    // ローディング状態を開始（トークンがある場合のみ）
    setIsLoading(true);
    try {
      const response = await getCurrentUser();

      if (response.status.code === 200 && response.data) {
        setUser(response.data);
        return true;
      } else {
        // 正常レスポンスだがデータがない場合などもトークンは無効とみなす
        removeToken();
        setUser(null);
        return false;
      }
    } catch (error) {
      // API呼び出しが失敗した場合（例: 401 Unauthorized）、
      // トークンは無効なので削除する
      console.error('Check auth failed, removing token:', error);
      removeToken();
      setUser(null);
      return false;
    } finally {
      // 成功・失敗にかかわらずローディング状態を終了
      setIsLoading(false);
    }
  };

  // コンテキストの値を設定
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
