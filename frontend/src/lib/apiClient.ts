const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, any>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

// example of generic function 1 with async (function declaration)
// async function example<Type>(arg: Type): Promise<Type> {
//   const result = await Promise.resolve(arg);
//   return result;
// }

// example of generic function 2 with async (arrow function)
// const example = async <Type>(arg: Type): Promise<Type> => {
//   const result = await Promise.resolve(arg);
//   return result;
// };

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { method = 'GET', body, headers = {} } = options;

  // Next.jsのSSR実行時にwindowがないエラーを防ぐため、ブラウザ環境でのみlocalStorageを参照
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'no-cache',
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw new Error(error.message || 'エラーが発生しました');
    }

    // 204 No Content の場合は空のオブジェクトを返す
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// ユーザー関連の型定義
export type User = {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
};

export type AuthResponse = {
  status: {
    code: number;
    message: string;
  };
  data?: User;
  token?: string;
  errors?: string[];
};

// 認証関連のAPI関数

// ユーザー登録
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  address: string;
  phone: string;
}): Promise<AuthResponse> => {
  return apiClient<AuthResponse>('/signup', {
    method: 'POST',
    body: { user: userData },
  });
};

// ログイン
export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  return apiClient<AuthResponse>('/login', {
    method: 'POST',
    body: { user: credentials },
  });
};

// ログアウト
export const logoutUser = async (): Promise<AuthResponse> => {
  return apiClient<AuthResponse>('/logout', {
    method: 'DELETE',
  });
};

// 現在のユーザー情報を取得
export const getCurrentUser = async (): Promise<AuthResponse> => {
  return apiClient<AuthResponse>('/me');
};

// 使用例
export const fetchHello = async (): Promise<{ message: string }> => {
  return apiClient<{ message: string }>('/hello');
};
