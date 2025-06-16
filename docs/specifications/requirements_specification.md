# Portfolio EC Site Requirements Specification
# ポートフォリオECサイト 要件定義書

* This document is a draft and may be modified or expanded as development progresses. *
*この要件定義書は初期の叩き台であり、開発を進める中で変更・追記される可能性があります。*

## 1. Overview
## 1. 概要
This document defines the requirements for an EC site to be developed as a portfolio.
本ドキュメントは、ポートフォリオとして開発するECサイトの要件を定義するものです。
This EC site includes basic features for users to browse and purchase products, and for administrators to manage products.
このECサイトは、ユーザーが商品を閲覧・購入でき、管理者が商品を管理できる基本的な機能を有します。

- **Project Name:** Portfolio EC Site (Tentative)
- **プロジェクト名:** ポートフォリオECサイト (仮)
- **Purpose:** To create a portfolio that demonstrates technical skills as a full-stack web developer
- **目的:** フルスタックウェブエンジニアとしての技術力を示すためのポートフォリオ作成
- **Main Technology Stack:**
- **主要技術スタック:**
    - Backend: Ruby on Rails
    - バックエンド: Ruby on Rails
    - Frontend: Next.js, TypeScript, Tailwind CSS, Redux
    - フロントエンド: Next.js, TypeScript, Tailwind CSS, Redux
    - Database: PostgreSQL
    - データベース: PostgreSQL
    - Storage: Cloudinary
    - ストレージ: Cloudinary
    - Deployment:
    - デプロイメント:
        - Backend: Render
        - バックエンド: Render
        - Frontend: Vercel
        - フロントエンド: Vercel
        - Database: Supabase
        - データベース: Supabase
    - Testing: RSpec, Capybara, Selenium
    - テスト: RSpec, Capybara, Selenium

## 2. Functional Requirements
## 2. 機能要件

### 2.1. User Features
### 2.1. ユーザー向け機能

#### 2.1.1. User Account Features
#### 2.1.1. 会員機能
- **U-001: New User Registration**
- **U-001: 新規会員登録**
    - Description: Users can register by entering information such as email address, password, name, and address.
    - 説明: ユーザーはメールアドレス、パスワード、氏名、住所等の情報を入力して会員登録ができる。
    - Details:
    - 詳細:
        - Email format validation is performed.
        - メールアドレス形式のバリデーションを行う。
        - Passwords are stored in hashed format.
        - パスワードはハッシュ化して保存する。
        - Registration completion email is sent (optional).
        - 登録完了後、確認メールを送信する（任意）。

- **U-002: Login/Logout**
- **U-002: ログイン・ログアウト**
    - Description: Registered users can log in with their email address and password, and log out.
    - 説明: 登録済みのユーザーはメールアドレスとパスワードでログインできる。ログアウトも可能。
    - Details:
    - 詳細:
        - Error message is displayed when login fails.
        - ログイン失敗時にはエラーメッセージを表示する。
        - Session is maintained after successful login.
        - ログイン成功後はセッションを維持する。

- **U-003: My Page**
- **U-003: マイページ**
    - Description: Logged-in users can view and edit their registered information.
    - 説明: ログインユーザーは自身の登録情報を確認・編集できる。
    - Details:
    - 詳細:
        - Registered information (name, address, etc.) can be changed.
        - 登録情報（氏名、住所など）の変更が可能。
        - Order history can be viewed.
        - 注文履歴の閲覧ができる。
        - Shipping address can be added or edited.
        - 配送先住所の追加・編集ができる。

- **U-004: Password Reset**
- **U-004: パスワードリセット**
    - Description: Users can send a password reset link to their registered email address and reset their password.
    - 説明: ユーザーは登録したメールアドレス宛にパスワードリセット用のリンクを送信し、パスワードを再設定できる。

#### 2.1.2. Product Features
#### 2.1.2. 商品機能
- **U-005: Product List Display**
- **U-005: 商品一覧表示**
    - Description: Registered products are displayed in a list.
    - 説明: 登録されている商品を一覧で表示する。
    - Details:
    - 詳細:
        - Product image, product name, and price are displayed.
        - 商品画像、商品名、価格を表示する。
        - Pagination function is implemented.
        - ページネーション機能を実装する。
        - (In the future) Sorting function (new arrival, price order, etc.) will be implemented.
        - （将来的に）並び替え機能（新着順、価格順など）を実装する。

- **U-006: Product Details Display**
- **U-006: 商品詳細表示**
    - Description: Detailed information of a specific product is displayed.
    - 説明: 特定の商品の詳細情報を表示する。
    - Details:
    - 詳細:
        - Multiple product images, detailed description, price, and inventory status are displayed.
        - 商品の複数の画像、詳細な説明文、価格、在庫状況などを表示する。

- **U-007: Product Search**
- **U-007: 商品検索**
    - Description: Users can search for products by keyword.
    - 説明: ユーザーはキーワードで商品を検索できる。
    - Details:
    - 詳細:
        - Product name and product description are searched.
        - 商品名、商品説明文などを対象に検索する。

- **U-008: Category-Based Product Display**
- **U-008: カテゴリ別商品表示**
    - Description: Products can be filtered and displayed by category.
    - 説明: 商品をカテゴリ別に絞り込んで表示できる。

#### 2.1.3. EC Features
#### 2.1.3. EC機能
- **U-009: Shopping Cart**
- **U-009: ショッピングカート**
    - Description: Users can add products to their shopping cart and view/edit its contents.
    - 説明: ユーザーは商品をショッピングカートに追加し、内容を確認・編集できる。
    - Details:
    - 詳細:
        - Products are added to the cart.
        - カートに商品を追加する。
        - Cart contents, product quantity, subtotal, and total amount are displayed.
        - カート内の商品一覧、各商品の数量、小計、合計金額を表示する。
        - Product quantity in the cart can be changed or deleted.
        - カート内の商品の数量を変更、または商品を削除できる。

- **U-010: Order Process**
- **U-010: 注文プロセス**
    - Description: Users can proceed with the purchase of products in their cart.
    - 説明: ユーザーはカート内の商品を購入するための手続きを行える。
    - Details:
    - 詳細:
        - Shipping address is selected or entered.
        - 配送先住所を選択・入力する。
        - Payment method is selected (PayJP credit card payment is implemented).
        - 支払い方法を選択する（PayJPによるクレジットカード決済を実装）。
        - Order contents are confirmed on the final confirmation screen.
        - 注文内容の最終確認画面を表示する。
        - Order is confirmed.
        - 注文を確定する。

- **U-011: Order Completion**
- **U-011: 注文完了**
    - Description: Users are notified that their order has been successfully completed.
    - 説明: 注文が正常に完了したことをユーザーに通知する。
    - Details:
    - 詳細:
        - Order completion page displays order number, etc.
        - 注文完了ページに注文番号などを表示する。
        - Order confirmation email is automatically sent to the registered email address.
        - 登録メールアドレス宛に注文確認メールを自動送信する。

### 2.2. Administrator Features
### 2.2. 管理者向け機能

#### 2.2.1. Administrator Authentication
#### 2.2.1. 管理者認証
- **A-001: Administrator Login**
- **A-001: 管理者ログイン**
    - Description: Administrators can log in to the management screen with their dedicated ID and password.
    - 説明: 管理者は専用のIDとパスワードで管理画面にログインできる。
    - Details:
    - 詳細:
        - Authentication route is separated from general users.

#### 2.2.2. Dashboard
#### 2.2.2. ダッシュボード
- **A-002: Summary Display**
- **A-002: サマリー表示**
    - Description: Administrators can view key indicators such as sales and order quantity on the dashboard.
    - 説明: 管理者は売上、注文件数などの主要な指標をダッシュボードで確認できる。
    - Details:
    - 詳細:
        - Display can be switched by period (in the future).

#### 2.2.3. Product Management (CRUD)
#### 2.2.3. 商品管理 (CRUD)
- **A-003: Product Registration**
- **A-003: 商品登録**
    - Description: Administrators can register new products in the system.
    - 説明: 管理者は新しい商品をシステムに登録できる。
    - Details:
    - 詳細:
        - Product name, product description, price, inventory quantity, product image, category, etc. can be set.
        - 商品名、商品説明、価格、在庫数、商品画像、カテゴリなどを設定できる。

- **A-004: Product Editing**
- **A-004: 商品編集**
    - Description: Administrators can edit registered product information.
    - 説明: 管理者は登録済みの商品情報を編集できる。

- **A-005: Product Deletion**
- **A-005: 商品削除**
    - Description: Administrators can delete registered products (logical deletion is recommended).
    - 説明: 管理者は登録済みの商品を削除できる（論理削除を推奨）。

- **A-006: Inventory Management**
- **A-006: 在庫管理**
    - Description: Administrators can update product inventory quantity.
    - 説明: 管理者は商品の在庫数を更新できる。

#### 2.2.4. Order Management
#### 2.2.4. 注文管理
- **A-007: Order List Display**
- **A-007: 注文一覧表示**
    - Description: Administrators can view all orders in a list.
    - 説明: 管理者は全ての注文を一覧で確認できる。
    - Details:
    - 詳細:
        - Order date, orderer, total amount, order status, etc. are displayed.
        - 注文日、注文者、合計金額、注文ステータスなどを表示。

- **A-008: Order Status Update**
- **A-008: 注文ステータス更新**
    - Description: Administrators can update the status of orders (e.g., payment pending, shipping preparation, shipped, canceled).
    - 説明: 管理者は注文のステータス（例: 入金待ち、発送準備中、発送済み、キャンセル）を更新できる。

#### 2.2.5. Customer Management
#### 2.2.5. 顧客管理
- **A-009: Customer List Display**
- **A-009: 顧客一覧表示**
    - Description: Administrators can view registered customer information in a list.
    - 説明: 管理者は登録されている顧客情報を一覧で確認できる。

## 3. Non-Functional Requirements (Simplified for MVP)
## 3. 非機能要件 (MVP段階では簡略化)

- **3.1. Performance:**
- **3.1. パフォーマンス:**
    - Response speed that does not stress users during normal operation.
    - 通常の操作において、ユーザーがストレスを感じない程度のレスポンス速度を保つこと。

- **3.2. Security:**
- **3.2. セキュリティ:**
    - Passwords are stored in hashed format.
    - パスワードはハッシュ化して保存する。
    - Basic vulnerability countermeasures such as SQL injection and XSS are implemented.
    - SQLインジェクション、XSSなどの基本的な脆弱性対策を施す。

- **3.3. Usability:**
- **3.3. ユーザビリティ:**
    - Intuitive and easy-to-understand interface is provided.
    - 直感的で分かりやすいインターフェースを提供する。

- **3.4. Operability/Maintainability:**
- **3.4. 運用・保守性:**
    - Code readability is improved, and maintainable structure is implemented.
    - コードの可読性を高め、保守しやすい構造にする。

## 4. Technology Selection (Reprinted)
## 4. 技術選定 (再掲)

- **Backend:** Ruby on Rails
- **バックエンド:** Ruby on Rails
- **Frontend:** Next.js (TypeScript)
- **フロントエンド:** Next.js (TypeScript)
- **Database:** PostgreSQL
- **データベース:** PostgreSQL
- **Deployment:**
- **デプロイメント:**
    - Backend: Render
    - バックエンド: Render
    - Frontend: Vercel
    - フロントエンド: Vercel
    - Database: Supabase
    - データベース: Supabase

## 5. Future Expansion Possibilities (Reference)
## 5. 今後の拡張可能性 (参考)

- Review feature / レビュー機能
- Favorite feature / お気に入り機能
- Coupon feature / クーポン機能
- Detailed access analysis / 詳細なアクセス分析

---

