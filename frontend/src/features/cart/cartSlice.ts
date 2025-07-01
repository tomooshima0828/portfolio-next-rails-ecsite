import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/apiClient';

// Define the structure of the error response
interface ErrorResponse {
  response?: {
    data?: {
      status?: {
        message?: string;
      };
    };
  };
}

// Define the structure of a cart item
// カートに入っている商品1つ分のデータの形（設計図）
export interface CartItem {
  id: number;
  quantity: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    main_image_url: string | null;
    category: {
      id: number;
      name: string;
    };
  };
  created_at: string;
  updated_at: string;
}

// Define the structure of the fetch cart response
interface FetchCartResponse {
  cart_items: CartItem[];
  total: number;
  items_count: number;
}

// Define the structure of the add to cart response
interface AddToCartResponse {
  total: number;
  items_count: number;
  cart_item: CartItem;
}

// Define the structure of the update cart item response
interface UpdateCartItemResponse {
  total: number;
  items_count: number;
  cart_item: CartItem;
}

// Define the structure of the remove from cart response
interface RemoveFromCartResponse {
  total: number;
  items_count: number;
  cartItemId: number;
}

// Define the structure of the whole cart state
// カート全体の状態の形（設計図）で、Reduxで管理
export interface CartState {
  items: CartItem[];
  total: number;
  itemsCount: number;
  loading: boolean;
  error: string | null;
}

// Initial state for the cart
// カートの初期状態を定義
const initialState: CartState = {
  items: [],
  total: 0,
  itemsCount: 0,
  loading: false,
  error: null,
};

// AsyncThunk Actions バックエンドとの通信を行う非同期アクションを定義
// `createAsyncThunk`: 非同期処理の「実行内容そのもの」を記述

// fetchCartItems カートの中身の全部のデータをサーバーから取得する
export const fetchCartItems = createAsyncThunk<FetchCartResponse, void>(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient<FetchCartResponse>('/cart_items');
      return response;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as ErrorResponse).response?.data?.status?.message || 'Failed to fetch cart items'
        : 'Failed to fetch cart items';
      return rejectWithValue(errorMessage);
    }
  }
);

// addToCart 商品をカートに追加する
export const addToCart = createAsyncThunk<AddToCartResponse, { product_id: number; quantity: number }>(
  'cart/addToCart',
  async (payload: { product_id: number; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient<AddToCartResponse>('/cart_items', {
        method: 'POST',
        body: { cart_item: payload }
      });
      return response;
    } catch (error: unknown) {
      console.error('CartSlice: API request failed', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as ErrorResponse).response?.data?.status?.message || 'Failed to add to cart'
        : 'Failed to add to cart';
      return rejectWithValue(errorMessage);
    }
  }
);

// updateCartItem カート内の商品の数量を更新する
export const updateCartItem = createAsyncThunk<UpdateCartItemResponse, { id: number; quantity: number }>(
  'cart/updateCartItem',
  async (payload: { id: number; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient<UpdateCartItemResponse>(`/cart_items/${payload.id}`, {
        method: 'PATCH',
        body: { cart_item: { quantity: payload.quantity } }
      });
      return response;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as ErrorResponse).response?.data?.status?.message || 'Failed to update cart'
        : 'Failed to update cart';
      return rejectWithValue(errorMessage);
    }
  }
);

// removeFromCart カートから商品を削除する
export const removeFromCart = createAsyncThunk<RemoveFromCartResponse, number>(
  'cart/removeFromCart',
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient<{total: number; items_count: number}>(`/cart_items/${cartItemId}`, {
        method: 'DELETE'
      });
      return { cartItemId, total: response.total, items_count: response.items_count };
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as ErrorResponse).response?.data?.status?.message || 'Failed to remove from cart'
        : 'Failed to remove from cart';
      return rejectWithValue(errorMessage);
    }
  }
);

// Redux Slice

// cartSliceの本体で、状態、リデューサー、アクションを自動的に生成
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  // reducersは同期的な状態変更ロジックを定義
  // サーバーとのAPI通信無しでフロントエンドだけで処理を行う、副作用は行わない
  // cartSlice.actions.clearCart() などのアクションを定義
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemsCount = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  // extraReducersは非同期アクションの状態管理を定義
  // サーバーとのAPI通信を行う、副作用を伴う処理を定義
  // createAsyncThunkで定義した非同期処理の結果に応じて、状態をどのように変更するかを定義
    //  pending: リクエストが開始されたときの状態
    //  fulfilled: リクエストが成功したときの状態
    //  rejected: リクエストが失敗したときの状態
  extraReducers: (builder) => {
    builder
      // fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart_items;
        state.total = action.payload.total;
        state.itemsCount = action.payload.items_count;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.total;
        state.itemsCount = action.payload.items_count;
        
        // アイテムが既存の場合は更新、新規の場合は追加
        const existingIndex = state.items.findIndex(
          item => item.product.id === action.payload.cart_item.product.id
        );
        
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload.cart_item;
        } else {
          state.items.push(action.payload.cart_item);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateCartItem
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.total;
        state.itemsCount = action.payload.items_count;
        
        const index = state.items.findIndex(item => item.id === action.payload.cart_item.id);
        if (index >= 0) {
          state.items[index] = action.payload.cart_item;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // removeFromCart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.total;
        state.itemsCount = action.payload.items_count;
        
        state.items = state.items.filter(item => item.id !== action.payload.cartItemId);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;