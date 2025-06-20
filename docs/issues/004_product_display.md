# Issue 004: Implement Product Display Features
# Issue 004: 商品表示機能の実装

## 1. Overview
## 1. 概要

This issue is to implement the product display features for the EC site. This includes displaying a list of products, showing detailed information for a specific product, and allowing users to view products by category. These features are essential for users to browse and find products they are interested in.

本Issueは、ECサイトの商品表示機能を実装するためのものです。これには、商品一覧の表示、特定商品の詳細情報の表示、カテゴリ別の商品表示が含まれます。これらの機能は、ユーザーが興味のある商品を閲覧し、見つけるために不可欠です。

## 2. Related Requirements
## 2. 関連要件

- **U-005: Product List Display / 商品一覧表示**
  - Display registered products in a list format.
  - Show product image, name, and price.
  - Implement pagination.
  - (Future) Implement sorting (new arrivals, price, etc.).
- **U-005: 商品一覧表示**
  - 登録されている商品を一覧形式で表示する。
  - 商品画像、商品名、価格を表示する。
  - ページネーション機能を実装する。
  - （将来的に）並び替え機能（新着順、価格順など）を実装する。

- **U-006: Product Details Display / 商品詳細表示**
  - Display detailed information for a specific product.
  - Show multiple product images, detailed description, price, and inventory status.
- **U-006: 商品詳細表示**
  - 特定の商品の詳細情報を表示する。
  - 商品の複数の画像、詳細な説明文、価格、在庫状況などを表示する。

- **U-008: Category-Based Product Display / カテゴリ別商品表示**
  - Allow users to filter and display products by category.
- **U-008: カテゴリ別商品表示**
  - 商品をカテゴリ別に絞り込んで表示できる。

## 3. Tasks
## 3. タスク

### 3.1. Backend (Ruby on Rails)
### 3.1. バックエンド (Ruby on Rails)

- **T-001: Create Product Model and Migrations / Productモデルとマイグレーションの作成**
  - Define attributes: name, description, price, stock, category, images, etc.
  - 属性定義: name, description, price, stock, category, images など
- **T-002: Implement API Endpoints for Products / 商品用APIエンドポイントの実装**
  - `GET /api/v1/products`: Retrieve a list of products (with pagination and category filtering).
  - `GET /api/v1/products`: 商品一覧取得 (ページネーション、カテゴリ絞り込み対応)
  - `GET /api/v1/products/:id`: Retrieve details of a specific product.
  - `GET /api/v1/products/:id`: 特定商品詳細取得
- **T-003: Implement API Endpoint for Categories / カテゴリ用APIエンドポイントの実装**
  - `GET /api/v1/categories`: Retrieve a list of categories.
  - `GET /api/v1/categories`: カテゴリ一覧取得
- **T-004: Seed Initial Product and Category Data / 初期商品・カテゴリデータの投入**
  - Create seed data for development and testing.
  - 開発・テスト用の初期データを作成する。
- **T-005: Write RSpec Tests for Models and APIs / モデルとAPIのRSpecテスト作成**
  - Ensure models and API endpoints function as expected.
  - モデルとAPIエンドポイントが期待通りに機能することを確認する。

### 3.2. Frontend (Next.js)
### 3.2. フロントエンド (Next.js)

- **T-006: Create Product List Page / 商品一覧ページの作成**
  - Fetch and display products from the API.
  - APIから商品を取得して表示する。
  - Implement pagination UI.
  - ページネーションUIを実装する。
  - Implement category filtering UI (e.g., sidebar or dropdown).
  - カテゴリ絞り込みUI（例: サイドバー、ドロップダウン）を実装する。
- **T-007: Create Product Details Page / 商品詳細ページの作成**
  - Fetch and display details of a specific product from the API.
  - APIから特定商品の詳細を取得して表示する。
  - Display multiple images (e.g., image gallery or carousel).
  - 複数画像表示（例: イメージギャラリー、カルーセル）。
- **T-008: Create Category Navigation / カテゴリナビゲーションの作成**
  - Display a list of categories for navigation.
  - ナビゲーション用のカテゴリ一覧を表示する。
- **T-009: Implement State Management for Products and Categories (if necessary) / 商品・カテゴリのState管理実装 (必要であれば)**
  - Use Redux or Zustand for managing application state.
  - ReduxまたはZustandを使用してアプリケーションの状態を管理する。
- **T-010: Create UI Components for Product Display / 商品表示用UIコンポーネントの作成**
  - `ProductCard`, `ProductImageGallery`, `CategoryList`, etc.
  - `ProductCard`, `ProductImageGallery`, `CategoryList` など。
- **T-011: Write Tests for Components and Pages / コンポーネントとページのテスト作成**
  - Use Jest and React Testing Library.
  - Jest と React Testing Library を使用する。

## 4. Acceptance Criteria
## 4. 受け入れ基準

### 4.1. Product List Page / 商品一覧ページ
- **AC-001:** All registered products are displayed with their image, name, and price.
- **AC-001:** 登録されているすべての商品が画像、名前、価格と共に表示されること。
- **AC-002:** Products are paginated if the total number exceeds a certain limit (e.g., 10 per page).
- **AC-002:** 商品の総数が一定数（例: 1ページあたり10件）を超える場合、ページネーションが機能すること。
- **AC-003:** Users can filter products by selecting a category.
- **AC-003:** ユーザーがカテゴリを選択して商品を絞り込めること。

### 4.2. Product Details Page / 商品詳細ページ
- **AC-004:** Clicking on a product in the list page navigates to its details page.
- **AC-004:** 商品一覧ページで商品をクリックすると、その商品の詳細ページに遷移すること。
- **AC-005:** The details page displays the product's name, multiple images, full description, price, and stock status.
- **AC-005:** 詳細ページに商品の名前、複数の画像、完全な説明、価格、在庫状況が表示されること。

### 4.3. General / 全般
- **AC-006:** Backend APIs for products and categories are functional and return correct data.
- **AC-006:** 商品およびカテゴリに関するバックエンドAPIが機能し、正しいデータを返すこと。
- **AC-007:** Frontend components are responsive and display correctly on various screen sizes.
- **AC-007:** フロントエンドコンポーネントはレスポンシブであり、様々な画面サイズで正しく表示されること。
- **AC-008:** All related tests (RSpec, Jest/RTL) pass.
- **AC-008:** 関連するすべてのテスト（RSpec, Jest/RTL）がパスすること。

## 5. Image Storage / 画像の保存

### Development Environment / 開発環境
- Use local storage for simplicity.
- シンプルさのためローカルストレージを使用する。

### Production Environment / 本番環境
- Use Cloudinary for image storage and delivery.
- 画像の保存と配信にCloudinaryを使用する。

## 6. Notes / 備考
- For MVP, advanced search functionality (U-007) is out of scope for this issue but will be considered for future implementation.
- MVPでは、高度な検索機能（U-007）はこのIssueのスコープ外とするが、将来的な実装のために考慮する。
- Sorting functionality for the product list (U-005 detail) is also considered a future enhancement.
- 商品一覧の並び替え機能（U-005詳細）も将来の拡張機能として考慮する。
