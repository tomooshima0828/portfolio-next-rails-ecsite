# Issue 004: Implement Product Display Features
# Issue 004: 商品表示機能の実装

## 1. Overview
## 1. 概要

This issue is to implement the product display features for the EC site. This includes displaying a list of products, showing detailed information for a specific product, and allowing users to view products by category. These features are essential for users to browse and find products they are interested in.

本Issueは、ECサイトの商品表示機能を実装するためのものです。これには、商品一覧の表示、特定商品の詳細情報の表示、カテゴリ別の商品表示が含まれます。これらの機能は、ユーザーが興味のある商品を閲覧し、見つけるために不可欠です。

## 2. Related Requirements
## 2. 関連要件

- **U-005: Product List Display / 商品一覧表示**
  - Display registered products in a list format on the homepage.
  - Accessible to all users without login.
  - Show product image, name, and price.
  - Implement pagination.
  - (Future) Implement sorting (new arrivals, price, etc.).
- **U-005: 商品一覧表示**
  - ホームページに、登録されている商品を一覧形式で表示する。
  - ログインせずに誰でも閲覧可能とする。
  - 商品画像、商品名、価格を表示する。
  - ページネーション機能を実装する。
  - （将来的に）並び替え機能（新着順、価格順など）を実装する。

- **U-006: Product Details Display / 商品詳細表示**
  - Display detailed information for a specific product.
  - Accessible to all users without login.
  - Show multiple product images, detailed description, price, and inventory status.
- **U-006: 商品詳細表示**
  - 特定の商品の詳細情報を表示する。
  - ログインせずに誰でも閲覧可能とする。
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
- **T-002: Implement API Endpoints for Products (Public Access) / 商品用APIエンドポイントの実装 (公開アクセス)**
  - `GET /api/v1/products`: Retrieve a list of products (with pagination and category filtering). Ensure no authentication is required.
  - `GET /api/v1/products`: 商品一覧取得 (ページネーション、カテゴリ絞り込み対応)。認証が不要であることを確認する。
  - `GET /api/v1/products/:id`: Retrieve details of a specific product. Ensure no authentication is required.
  - `GET /api/v1/products/:id`: 特定商品詳細取得。認証が不要であることを確認する。
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

- **T-006: Create Product List Page (to serve as Homepage) / 商品一覧ページ（ホームページとして機能）の作成**
  - This page will serve as the main homepage of the application.
  - このページはアプリケーションのメインホームページとして機能する。
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
- **AC-009:** The product list page and product detail pages are accessible to all users without requiring login.
- **AC-009:** 商品一覧ページおよび商品詳細ページは、ログインせずに誰でもアクセス可能であること。
- **AC-010:** The homepage of the application displays the product list.
- **AC-010:** アプリケーションのホームページには商品一覧が表示されること。

## 5. Image Storage / 画像の保存

- Manage images using Rails Active Storage. / RailsのActive Storageを利用して画像を管理します。

### Development Environment / 開発環境
- Use Active Storage's local disk service (`:local`). Uploaded files will be stored in the `storage/` directory.
- Active Storageのローカルディスクサービス (`:local`) を使用します。アップロードされたファイルは `storage/` ディレクトリに保存されます。

### Production Environment / 本番環境
- Use **Cloudinary** via Active Storage. This provides a reliable and scalable solution for image storage and delivery in production.
- Active Storageを通じて **Cloudinary** を使用します。これにより、本番環境での画像ストレージと配信に信頼性が高くスケーラブルなソリューションを提供します。

#### Cloudinary Integration / Cloudinaryの導入

##### Backend Configuration / バックエンド設定

- Added the `cloudinary` gem to the Gemfile.
- Gemfileに`cloudinary` gemを追加しました。
- Configured Active Storage to use Cloudinary in production environment (`config/storage.yml` and `config/environments/production.rb`).
- 本番環境でActive StorageがCloudinaryを使用するように設定しました（`config/storage.yml`と`config/environments/production.rb`）。
- Set environment variables for Cloudinary credentials in Render:
- Renderで以下のCloudinary認証情報の環境変数を設定しました：
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Configured URL generation for Active Storage in production:
- 本番環境でのActive StorageのURL生成を設定しました：
  ```ruby
  config.active_storage.default_url_options = { host: ENV['RENDER_EXTERNAL_HOSTNAME'] || 'portfolio-next-rails-ecsite.onrender.com' }
  Rails.application.routes.default_url_options = { host: ENV['RENDER_EXTERNAL_HOSTNAME'] || 'portfolio-next-rails-ecsite.onrender.com', protocol: 'https' }
  ```

##### Frontend Integration / フロントエンド連携

- Installed the `next-cloudinary` package for optimized image rendering.
- 最適化された画像レンダリングのために`next-cloudinary`パッケージをインストールしました。
- Created a reusable `CloudinaryImage` component that detects Cloudinary URLs and applies optimizations.
- CloudinaryのURLを検出して最適化を適用する再利用可能な`CloudinaryImage`コンポーネントを作成しました。
- Updated product list and detail pages to use the `CloudinaryImage` component instead of Next.js `Image` component.
- 商品一覧と詳細ページを更新し、Next.jsの`Image`コンポーネントの代わりに`CloudinaryImage`コンポーネントを使用するようにしました。
- Set the Cloudinary cloud name in frontend environment variables:
- フロントエンドの環境変数にCloudinaryのクラウド名を設定しました：
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

## 6. Notes / 備考
- For MVP, advanced search functionality (U-007) is out of scope for this issue but will be considered for future implementation.
- MVPでは、高度な検索機能（U-007）はこのIssueのスコープ外とするが、将来的な実装のために考慮する。
- Sorting functionality for the product list (U-005 detail) is also considered a future enhancement.
- 商品一覧の並び替え機能（U-005詳細）も将来の拡張機能として考慮する。

## 7. Additional Implementations / 追加実装

During the implementation of product display features, it became necessary to add product registration functionality to verify the display. This led to the following additional implementations.

商品表示機能の実装過程で、表示を確認するための商品登録機能が必要となりました。それに伴い、以下の追加実装を行いました。

### 7.0. Production Environment Optimizations / 本番環境の最適化

本番環境でのデプロイと安定的な運用のために、以下の最適化を行いました。

#### PostgreSQL接続の最適化

Renderの無料プランではPostgreSQL接続に制限があり、以下の問題が発生しました：

- `PG::DuplicatePstatement`: プリペアドステートメントが重複するエラー
- `ActiveModel::MissingAttributeError`: ActiveStorageのブロブテーブルでの属性欠落エラー

##### Prepared Statementとは

Prepared Statement（プリペアドステートメント）は、SQLクエリのテンプレートのようなものです。通常のSQLクエリでは毎回完全なSQLを実行しますが、Prepared Statementでは一度テンプレートを準備（prepare）し、その後は変数の値だけを変えて何度も実行できます。

例えば：

**通常のSQLクエリ**:
```sql
SELECT * FROM products WHERE id = 1;
SELECT * FROM products WHERE id = 2;
```

**Prepared Statementの場合**:
```sql
-- テンプレートを準備
PREPARE product_query AS SELECT * FROM products WHERE id = $1;

-- 値を変えて実行
EXECUTE product_query(1);
EXECUTE product_query(2);
```

これは本来、パフォーマンス向上のための機能ですが、Renderの無料プランでは逆に問題を引き起こしていました。

##### 発生していた問題の詳細

1. **`PG::DuplicatePstatement`エラー**:
   - 同じ名前のPrepared Statementが重複して作成されようとした
   - 原因: アプリケーションの再起動やコネクションプールの問題で、古いPrepared Statementが残ったまま

2. **接続リソースの枯渇**:
   - Prepared Statementがメモリを消費し、限られたリソースを圧迫
   - 結果として新しい接続が作れなくなる

3. **ActiveStorageの問題**:
   - データベースのスキーマと実際のテーブル構造の不一致
   - 接続問題によりマイグレーションが正しく適用されていない

これらの問題を解決するために、以下の対策を実装しました：

1. **PostgreSQL接続設定の最適化** (`config/database.yml`):
   ```yaml
   production:
     prepared_statements: false  # Prepared Statementを完全に無効化
     statement_limit: 0          # Prepared Statementの数を0に制限
     advisory_locks: false       # アドバイザリロックも無効化して負荷軽減
     
     # 接続プール設定
     pool: 3                     # 同時接続数を少なく保つ
     connect_timeout: 30         # 接続タイムアウトを設定
     idle_timeout: 60            # アイドル接続を早めに切断
     reconnect: true             # 接続が切れた場合に自動再接続
   ```

2. **プリペアドステートメントの無効化** (`config/initializers/fix_postgresql_connection.rb`):
   
   ```ruby
   # PostgreSQL接続の問題を解決するための包括的な対策
   if Rails.env.production?
     # PostgreSQLアダプタを修正
     if defined?(ActiveRecord::ConnectionAdapters::PostgreSQLAdapter)
       module PostgreSQLPreparedStatementsFix
         # Prepared Statementを作成せず、通常のSQLとして扱う
         def prepare_statement(sql, binds)
           sql  # そのままSqlを返す（Prepared Statementにしない）
         end
         
         # キャッシュを使わずに直接クエリを実行
         def exec_no_cache(sql, name, binds)
           log(sql, name, binds) do
             with_raw_connection do |conn|
               result = conn.async_exec(sql)
               ActiveRecord::Result.new(result.fields, result.values)
             end
           end
         end
         
         # トランザクション終了時に自動的にキャッシュをクリア
         def commit_db_transaction
           super
         ensure
           clear_cache!
         end
       end

       # モンキーパッチを適用(モンキーパッチとは、既存のコード（この場合はRailsのPostgreSQLアダプタ）の動作を、外部から変更する技術)
       ActiveSupport.on_load(:active_record) do
         ActiveRecord::ConnectionAdapters::PostgreSQLAdapter.prepend(PostgreSQLPreparedStatementsFix)
       end
     end
     
     # アプリケーション起動時に実行
     Rails.application.config.after_initialize do
       # 既存のプリペアドステートメントをクリア
       begin
         ActiveRecord::Base.connection.execute("DEALLOCATE ALL")
         Rails.logger.info "Successfully deallocated all prepared statements on startup"
       rescue => e
         Rails.logger.error "Failed to deallocate prepared statements: #{e.message}"
       end
     end
   end
   ```

これらの対策により、Renderの無料プランでのデータベース接続の安定性が向上し、アプリケーションが正常に動作するようになりました。

##### 実装のポイントと効果

1. **根本原因への対処**:
   - Prepared Statementを完全に無効化することで、根本的な問題を解決
   - 単に設定を変えるだけでなく、Railsの内部動作もモンキーパッチで変更

2. **リソース使用の最適化**:
   - 接続数を制限し、不要な接続をすぐに解放
   - メモリ使用量を削減

3. **クリーンな状態の維持**:
   - アプリケーション起動時に古いPrepared Statementをクリア
   - トランザクション終了時にもキャッシュをクリア

これらの対策により、Renderの無料プランという制限された環境でも、安定したデータベース接続を実現できました。結果として、アプリケーションは正常に動作し、商品画像のCloudinary経由での表示やユーザー認証機能が正常に機能するようになりました。

### 7.1. Admin Role and Product Registration / 管理者権限と商品登録機能

- **Requirement / 要件:** To register products, a distinction between general users and administrators was needed. A feature was implemented to display a "Register Product" button only to logged-in administrators.
- **要件:** 商品を登録するために、一般ユーザーと管理者との区別が必要でした。管理者でログインしている場合にのみ「商品を登録する」ボタンを表示する機能を実装しました。

- **Backend (Rails) / バックエンド (Rails):**
  - Added a `role` column to the `users` table (0: general, 1: admin).
  - `users`テーブルに`role`カラムを追加しました (0: general, 1: admin)。
  - Defined an `enum` for `role` in the `User` model.
  - `User`モデルに`role`の`enum`を定義しました。
  - Included the `role` in the JWT payload and API responses to securely transmit user roles to the frontend.
  - JWTペイロードとAPIレスポンスに`role`を含め、ユーザーの役割をフロントエンドに安全に渡すようにしました。

- **Frontend (Next.js) / フロントエンド (Next.js):**
  - Updated the `User` type in `apiClient.ts` to include the `role` property.
  - `apiClient.ts`の`User`型に`role`プロパティを追加しました。
  - In `ProductList.tsx`, used the `useAuth` hook to check the user's role and conditionally render the "Register Product" button, linking to `/admin/products/new`.
  - `ProductList.tsx`で`useAuth`フックを使用してユーザーの役割を確認し、「商品を登録する」ボタンを条件付きで表示させ、`/admin/products/new`へリンクするようにしました。

### 7.2. Absolute URL Generation for Images / 画像URLの絶対パス化

- **Issue / 課題:** After product registration, images were not displayed on the frontend. This was because Rails was generating relative URLs for Active Storage, which the frontend (running on a different port) could not resolve.
- **課題:** 商品登録後、フロントエンドで画像が表示されませんでした。これは、RailsがActive StorageのURLを相対パスで生成しており、別ポートで動作するフロントエンドが解決できなかったためです。

- **Solution / 解決策:**
  - In `config/environments/development.rb`, set `config.action_controller.default_url_options` to specify the host and port of the backend server.
  - `config/environments/development.rb`に`config.action_controller.default_url_options`を設定し、バックエンドサーバーのホストとポートを明記しました。
  - This ensures that Active Storage generates absolute URLs (e.g., `http://localhost:3001/...`), allowing the frontend to correctly display the images.
  - これにより、Active Storageが絶対URL（例: `http://localhost:3001/...`）を生成し、フロントエンドが正しく画像を表示できるようになりました。
