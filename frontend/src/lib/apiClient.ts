const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
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
    if (body instanceof FormData) {
      // FormDataの場合はJSON.stringifyしない
      config.body = body;
      // Content-Typeヘッダを削除してブラウザに自動設定させる
      delete (config.headers as Record<string, string>)['Content-Type'];
    } else {
      config.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        // Rails APIからの構造化されたエラーレスポンスを適切に処理
        errorMessage =
          errorData?.status?.message || // { status: { message: '...' } } 形式
          errorData.message || // { message: '...' } 形式
          errorData.error || // { error: '...' } 形式
          JSON.stringify(errorData); // 上記以外の場合は全体を文字列化
      } catch {
        // JSONのパースに失敗した場合、レスポンスボディをテキストとして取得しようと試みる
        try {
          const textError = await response.text();
          if (textError) {
            errorMessage = textError;
          }
          // テキストボディが空の場合は、初期のHTTPステータスエラーメッセージが使われる
        } catch (textError) {
          // テキストの読み取りにも失敗した場合は、初期のエラーメッセージが最終的に使用される
          console.error('Failed to parse error response as JSON or text.', textError);
        }
      }
      throw new Error(errorMessage);
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
  role: 'admin' | 'general'; // ユーザーの役割を追加
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
  return apiClient<AuthResponse>('/auth/current_user');
};

// 使用例
export const fetchHello = async (): Promise<{ message: string }> => {
  return apiClient<{ message: string }>('/hello');
};

// 商品関連の型定義
export type Category = {
  id: number;
  name: string;
  description: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  category?: Category;
  main_image_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductsResponse = {
  products: Product[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
};

// 商品一覧を取得
export const fetchProducts = async (page = 1, perPage = 10, categoryId?: number): Promise<ProductsResponse> => {
  let endpoint = `/products?page=${page}&per_page=${perPage}`;
  if (categoryId) {
    endpoint += `&category_id=${categoryId}`;
  }
  return apiClient<ProductsResponse>(endpoint);
};

// 商品詳細を取得
export const fetchProduct = async (id: number): Promise<Product> => {
  return apiClient<Product>(`/products/${id}`);
};

// 商品を新規作成（画像アップロード対応）
export const createProduct = async (formData: FormData): Promise<Product> => {
  // ファイルを送信するため、Content-TypeはapiClient内で設定せず、
  // ブラウザに自動で設定させる（multipart/form-dataになる）
  return apiClient<Product>('/products', {
    method: 'POST',
    body: formData as unknown as Record<string, unknown>, // 型キャストが必要
    headers: {
      // 'Content-Type': 'multipart/form-data' はブラウザが自動で設定するので不要
    },
  });
};

// カテゴリ一覧を取得
export const fetchCategories = async (): Promise<Category[]> => {
  return apiClient<Category[]>('/categories');
};
