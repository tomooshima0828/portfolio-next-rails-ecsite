const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, any>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { method = 'GET', body, headers = {} } = options;

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

// 使用例
export const fetchHello = async (): Promise<{ message: string }> => {
  return apiClient<{ message: string }>('/hello');
};
