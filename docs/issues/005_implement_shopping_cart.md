
# Issue 005: Implement Shopping Cart Features
# Issue 005: ショッピングカート機能の実装

## 1. Overview
## 1. 概要

This issue covers the implementation of shopping cart features for the EC site. This includes adding products to the cart, viewing the cart, updating product quantities in the cart, and removing products from the cart. These features are essential for users to collect and manage products they intend to purchase before proceeding to checkout.

本Issueは、ECサイトのショッピングカート機能を実装するためのものです。これには、商品をカートに追加する、カートを表示する、カート内の商品数量を更新する、カートから商品を削除するなどの機能が含まれます。これらの機能は、ユーザーが購入を希望する商品を決済前に収集・管理するために不可欠です。

## 2. Related Requirements
## 2. 関連要件

- **U-009: Add to Cart / カートに追加**
  - Users can add products to their shopping cart from the product details page.
  - Specify the quantity to add.
  - Validate that the quantity does not exceed available stock.
- **U-009: カートに追加**
  - ユーザーは商品詳細ページから商品をショッピングカートに追加できる。
  - 追加する数量を指定できる。
  - 数量が在庫数を超えないようにバリデーションを行う。

- **U-010: View Cart / カート表示**
  - Users can view all items in their shopping cart.
  - Display product details (image, name, price) and quantity for each item.
  - Show subtotal for each item and total for the entire cart.
- **U-010: カート表示**
  - ユーザーはショッピングカート内のすべての商品を表示できる。
  - 各商品の詳細（画像、名前、価格）と数量を表示する。
  - 各商品の小計とカート全体の合計を表示する。

- **U-011: Update Cart / カート更新**
  - Users can update the quantity of products in their cart.
  - Users can remove products from their cart.
- **U-011: カート更新**
  - ユーザーはカート内の商品数量を更新できる。
  - ユーザーはカートから商品を削除できる。

## 3. Tasks
## 3. タスク

### 3.1. Backend (Ruby on Rails)
### 3.1. バックエンド (Ruby on Rails)

- **T-001: Create CartItem Model and Migrations / CartItemモデルとマイグレーションの作成**
  - Define attributes: user_id, product_id, quantity, etc.
  - 属性定義: user_id, product_id, quantity など
  - Implement associations with User and Product models.
  - UserモデルとProductモデルとの関連付けを実装する。

- **T-002: Implement API Endpoints for Cart Management / カート管理用APIエンドポイントの実装**
  - `POST /api/v1/cart_items`: Add a product to the cart (requires authentication).
  - `POST /api/v1/cart_items`: 商品をカートに追加（認証が必要）。
  - `GET /api/v1/cart_items`: Retrieve the current user's cart items (requires authentication).
  - `GET /api/v1/cart_items`: 現在のユーザーのカート内商品を取得（認証が必要）。
  - `PATCH /api/v1/cart_items/:id`: Update the quantity of a cart item (requires authentication).
  - `PATCH /api/v1/cart_items/:id`: カート内商品の数量を更新（認証が必要）。
  - `DELETE /api/v1/cart_items/:id`: Remove a product from the cart (requires authentication).
  - `DELETE /api/v1/cart_items/:id`: カートから商品を削除（認証が必要）。

- **T-003: Implement Business Logic for Cart Management / カート管理のビジネスロジック実装**
  - Validate that the quantity does not exceed available stock when adding or updating.
  - 追加または更新時に、数量が在庫数を超えないようにバリデーションを行う。
  - Handle merging cart items when a user adds the same product multiple times.
  - ユーザーが同じ商品を複数回追加した場合のカート内商品のマージを処理する。
  - Calculate subtotals and totals.
  - 小計と合計を計算する。

- **T-004: Write RSpec Tests for Models and APIs / モデルとAPIのRSpecテスト作成**
  - Ensure models and API endpoints function as expected.
  - モデルとAPIエンドポイントが期待通りに機能することを確認する。
  - Test validation rules and business logic.
  - バリデーションルールとビジネスロジックをテストする。

### 3.2. Frontend (Next.js)
### 3.2. フロントエンド (Next.js)

- **T-005: Create "Add to Cart" Component for Product Details Page / 商品詳細ページ用の「カートに追加」コンポーネントの作成**
  - Implement quantity selector.
  - 数量セレクターを実装する。
  - Show available stock information.
  - 利用可能な在庫情報を表示する。
  - Display success/error messages after adding to cart.
  - カートに追加した後の成功/エラーメッセージを表示する。

- **T-006: Create Shopping Cart Page / ショッピングカートページの作成**
  - Fetch and display cart items from the API.
  - APIからカート内商品を取得して表示する。
  - Display product details, quantity, and subtotal for each item.
  - 各商品の詳細、数量、小計を表示する。
  - Show cart total.
  - カート合計を表示する。
  - Implement quantity update controls.
  - 数量更新コントロールを実装する。
  - Implement remove item functionality.
  - 商品削除機能を実装する。

- **T-007: Implement Cart State Management / カートの状態管理の実装**
  - Use Redux or Zustand for managing cart state.
  - ReduxまたはZustandを使用してカートの状態を管理する。
  - Implement actions for adding, updating, and removing items.
  - 商品の追加、更新、削除のためのアクションを実装する。
  - Ensure cart state persists across page navigation.
  - ページ遷移後もカートの状態が維持されるようにする。

- **T-008: Create Cart Icon with Item Count in Header / ヘッダーにアイテム数を表示するカートアイコンの作成**
  - Display the number of items in the cart.
  - カート内の商品数を表示する。
  - Link to the shopping cart page.
  - ショッピングカートページへのリンクを設定する。

- **T-009: Create UI Components for Cart / カート用UIコンポーネントの作成**
  - `CartItem`, `CartSummary`, `QuantitySelector`, etc.
  - `CartItem`, `CartSummary`, `QuantitySelector` など。

- **T-010: Write Tests for Components and Pages / コンポーネントとページのテスト作成**
  - Use Jest and React Testing Library.
  - Jest と React Testing Library を使用する。

## 4. Acceptance Criteria
## 4. 受け入れ基準

### 4.1. Add to Cart / カートに追加
- **AC-001:** Users can add products to their cart from the product details page.
- **AC-001:** ユーザーは商品詳細ページから商品をカートに追加できること。
- **AC-002:** Users can specify the quantity to add.
- **AC-002:** ユーザーは追加する数量を指定できること。
- **AC-003:** An error message is displayed if the user tries to add more than the available stock.
- **AC-003:** ユーザーが在庫数以上の数量を追加しようとした場合、エラーメッセージが表示されること。
- **AC-004:** A success message is displayed after successfully adding a product to the cart.
- **AC-004:** 商品をカートに追加した後、成功メッセージが表示されること。
- **AC-005:** Adding the same product multiple times updates the quantity in the cart rather than creating duplicate entries.
- **AC-005:** 同じ商品を複数回追加すると、重複したエントリを作成するのではなく、カート内の数量が更新されること。

### 4.2. View Cart / カート表示
- **AC-006:** Users can view all items in their shopping cart on the cart page.
- **AC-006:** ユーザーはカートページで自分のショッピングカート内のすべての商品を表示できること。
- **AC-007:** Each cart item displays the product image, name, price, quantity, and subtotal.
- **AC-007:** 各カート内商品には、商品画像、名前、価格、数量、小計が表示されること。
- **AC-008:** The cart page shows the total price for all items.
- **AC-008:** カートページにはすべての商品の合計価格が表示されること。
- **AC-009:** The cart icon in the header shows the current number of items in the cart.
- **AC-009:** ヘッダーのカートアイコンには、カート内の現在の商品数が表示されること。

### 4.3. Update Cart / カート更新
- **AC-010:** Users can update the quantity of products in their cart.
- **AC-010:** ユーザーはカート内の商品数量を更新できること。
- **AC-011:** An error message is displayed if the user tries to update to a quantity that exceeds the available stock.
- **AC-011:** ユーザーが在庫数を超える数量に更新しようとした場合、エラーメッセージが表示されること。
- **AC-012:** Users can remove products from their cart.
- **AC-012:** ユーザーはカートから商品を削除できること。
- **AC-013:** The cart subtotal and total are updated automatically when quantities are changed or items are removed.
- **AC-013:** 数量が変更されたり、商品が削除されたりすると、カートの小計と合計が自動的に更新されること。

### 4.4. General / 全般
- **AC-014:** Backend APIs for cart management are functional and return correct data.
- **AC-014:** カート管理のためのバックエンドAPIが機能し、正しいデータを返すこと。
- **AC-015:** Frontend components are responsive and display correctly on various screen sizes.
- **AC-015:** フロントエンドコンポーネントはレスポンシブであり、様々な画面サイズで正しく表示されること。
- **AC-016:** All related tests (RSpec, Jest/RTL) pass.
- **AC-016:** 関連するすべてのテスト（RSpec, Jest/RTL）がパスすること。
- **AC-017:** Cart functionality is only available to authenticated users.
- **AC-017:** カート機能は認証済みユーザーのみが利用可能であること。
- **AC-018:** Guest users are redirected to the login page when attempting to add items to the cart.
- **AC-018:** ゲストユーザーがカートに商品を追加しようとすると、ログインページにリダイレクトされること。

## 5. Authentication and Authorization
## 5. 認証と認可

- All cart-related API endpoints require user authentication.
- すべてのカート関連APIエンドポイントはユーザー認証を必要とします。
- Cart items are associated with the authenticated user.
- カート内商品は認証されたユーザーに関連付けられます。
- Users can only view, update, and remove their own cart items.
- ユーザーは自分のカート内商品のみを表示、更新、削除できます。

## 6. Implementation Details & Key Points
## 6. 実装詳細と重要ポイント

### 6.1. Database Design
### 6.1. データベース設計

**CartItem Model Structure:**
```ruby
class CartItem < ApplicationRecord
  belongs_to :user
  belongs_to :product

  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :user_id, uniqueness: { scope: :product_id }
  validate :quantity_within_stock

  def subtotal
    product.price * quantity
  end
end
```

**Key Points:**
- **Unique Constraint**: `user_id` + `product_id` prevents duplicate cart entries
- **Business Logic**: Real-time stock validation and subtotal calculation
- **Future-Ready**: Designed for order conversion (cart → order flow)

**重要ポイント：**
- **ユニーク制約**: `user_id` + `product_id` でカート内重複を防止
- **ビジネスロジック**: リアルタイム在庫チェックと小計計算
- **将来対応**: 注文変換フローを考慮した設計（cart → order）

### 6.2. Redux Implementation
### 6.2. Redux実装

**State Management with Redux Toolkit:**
```typescript
// Store Configuration
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Async Actions
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await apiClient('/cart_items');
  return response;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload: { product_id: number; quantity: number }) => {
    const response = await apiClient('/cart_items', {
      method: 'POST',
      body: { cart_item: payload }
    });
    return response;
  }
);

// State Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    itemsCount: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.cart_items;
        state.total = parseFloat(action.payload.total);
        state.itemsCount = action.payload.items_count;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // Optimistic updates for better UX
        const existingItem = state.items.find(item => 
          item.product.id === action.payload.product.id
        );
        if (existingItem) {
          existingItem.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      });
  },
});
```

**Redux Benefits:**
- **Global State**: Cart state accessible from any component
- **Predictable Updates**: All state changes through actions
- **Optimistic UI**: Immediate UI updates for better UX
- **TypeScript Integration**: Full type safety

**Reduxの利点：**
- **グローバル状態**: どのコンポーネントからもカート状態にアクセス可能
- **予測可能な更新**: すべての状態変更はアクションを通じて実行
- **楽観的UI**: より良いUXのための即座のUI更新
- **TypeScript統合**: 完全な型安全性

### 6.3. Critical Bug Fixes & Solutions
### 6.3. 重要なバグ修正と解決策

#### A. Active Storage Image Display Issue
#### A. Active Storage画像表示問題

**Problem**: Next.js Image component couldn't handle 302 redirects from Active Storage URLs
**問題**: Next.js ImageコンポーネントがActive StorageのURLの302リダイレクトを処理できない

**Error**: 500 Internal Server Error for image requests
**エラー**: 画像リクエストで500 Internal Server Error

**Solution**: Switch from Next.js Image to regular img tag for Active Storage URLs
**解決策**: Active Storage URLに対してNext.js ImageからRegular img tagに変更

```typescript
// Before (causing 500 errors)
<Image src={item.product.main_image_url} width={96} height={96} />

// After (working solution)
<img 
  src={item.product.main_image_url}
  alt={item.product.name}
  className="w-full h-full object-cover"
  onError={(e) => {
    e.currentTarget.style.display = 'none';
  }}
/>
```

**Root Cause**: Next.js Image optimization pipeline can't process redirect URLs
**根本原因**: Next.js Image最適化パイプラインがリダイレクトURLを処理できない

#### B. Active Storage URL Generation Issue
#### B. Active Storage URL生成問題

**Problem**: `main_image_url` returning null due to missing URL options
**問題**: URL optionsの不備により`main_image_url`がnullを返す

**Solution**: Set ActiveStorage::Current.url_options in Product model
**解決策**: Productモデル内でActiveStorage::Current.url_optionsを設定

```ruby
def main_image_url
  return unless main_image.attached?

  begin
    if Rails.env.development?
      ActiveStorage::Current.url_options = { 
        host: 'localhost', port: 3001, protocol: 'http' 
      }
    end
    Rails.application.routes.url_helpers.url_for(main_image)
  rescue => e
    Rails.logger.error "Failed to generate image URL: #{e.message}"
    nil
  end
end
```

#### C. API Authentication Issues
#### C. API認証問題

**Problem**: Wrong API endpoints and token response format
**問題**: 誤ったAPIエンドポイントとトークンレスポンス形式

**Corrections**:
- Endpoint: `/api/v1/login` (not `/api/v1/auth/sign_in`)
- Token path: `.token` (not `.data.token`)

**修正**:
- エンドポイント: `/api/v1/login`（`/api/v1/auth/sign_in`ではない）
- トークンパス: `.token`（`.data.token`ではない）

### 6.4. Cart to Order Flow Design
### 6.4. カートから注文への流れの設計

**Future Implementation Pattern:**
```ruby
# Order creation process
class OrdersController < ApplicationController
  def create
    ActiveRecord::Base.transaction do
      # 1. Create order record
      @order = current_user.orders.build(order_params)
      @order.total_amount = current_user.cart_items.sum(&:subtotal)
      @order.save!
      
      # 2. Convert cart items to order items
      current_user.cart_items.each do |cart_item|
        @order.order_items.create!(
          product: cart_item.product,
          quantity: cart_item.quantity,
          price: cart_item.product.price,  # Snapshot pricing
          product_name: cart_item.product.name
        )
      end
      
      # 3. Update stock
      current_user.cart_items.each do |cart_item|
        cart_item.product.decrement!(:stock, cart_item.quantity)
      end
      
      # 4. Clear cart
      current_user.cart_items.destroy_all
    end
  end
end
```

**Key Design Principles:**
- **Data Snapshot**: Preserve pricing and product info at purchase time
- **Atomic Operations**: Use database transactions for data consistency
- **Stock Management**: Real-time inventory tracking
- **Cart Lifecycle**: Clear cart after successful order creation

**主要設計原則：**
- **データスナップショット**: 購入時の価格と商品情報を保持
- **アトミック操作**: データ整合性のためのデータベーストランザクション
- **在庫管理**: リアルタイム在庫追跡
- **カートライフサイクル**: 注文成功後のカートクリア

### 6.5. Testing Strategy
### 6.5. テスト戦略

**Backend Testing (RSpec):**
- Model validations and business logic
- API endpoint functionality
- Authentication and authorization
- Error handling scenarios

**Frontend Testing (Jest/RTL):**
- Component rendering and interactions
- Redux state management
- Async action handling
- User experience flows

**バックエンドテスト (RSpec):**
- モデルバリデーションとビジネスロジック
- APIエンドポイント機能
- 認証と認可
- エラー処理シナリオ

**フロントエンドテスト (Jest/RTL):**
- コンポーネントレンダリングと相互作用
- Redux状態管理
- 非同期アクション処理
- ユーザーエクスペリエンスフロー

### 6.6. Performance Considerations
### 6.6. パフォーマンス考慮事項

**Optimizations Implemented:**
- **Eager Loading**: `includes(product: :category)` for N+1 query prevention
- **Optimistic Updates**: Immediate UI feedback without waiting for API response
- **Memoization**: Redux selectors for computed values
- **Image Optimization**: Proper error handling and fallbacks

**実装された最適化：**
- **Eager Loading**: N+1クエリ防止のための`includes(product: :category)`
- **楽観的更新**: APIレスポンスを待たない即座のUIフィードバック
- **メモ化**: 計算値に対するReduxセレクター
- **画像最適化**: 適切なエラーハンドリングとフォールバック

## 7. Notes
## 7. 備考

- For MVP, the following features are out of scope but will be considered for future implementation:
- MVPでは、以下の機能はスコープ外ですが、将来的な実装のために考慮されます：
  - Save for later functionality
  - 後で購入するための保存機能
  - Cart expiration (items automatically removed after X days)
  - カートの有効期限（X日後に商品が自動的に削除される）
  - Wishlist functionality
  - ウィッシュリスト機能

- The cart implementation should be designed with the checkout process (Issue 006) in mind, as there will be a natural flow from cart to checkout.
- カートの実装は、カートから決済へと自然に流れるため、決済プロセス（Issue 006）を考慮して設計する必要があります。
