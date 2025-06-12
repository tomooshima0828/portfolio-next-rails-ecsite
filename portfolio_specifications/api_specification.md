# API Specification Document
# API仕様書

## 1. Introduction
## 1. はじめに

This document defines the API specifications for the Portfolio EC Site.
本文書は、ポートフォリオECサイトのAPI仕様を定義するものです。

### Architecture / アーキテクチャ
- The backend is built with Ruby on Rails in API mode.
- バックエンドはRuby on RailsをAPIモードで使用しています。
- The frontend is a Next.js application that communicates with the Rails API.
- フロントエンドはNext.jsアプリケーションで、Rails APIと通信します。
- This separation of concerns allows for better scalability and maintainability.
- このような関心の分離により、スケーラビリティと保守性が向上します。

### 1.1. Base URL / ベースURL
All API endpoints are prefixed with `/api/v1`.
全てのAPIエンドポイントは `/api/v1` をプレフィックスとします。

Development: `http://localhost:3001/api/v1` (Rails backend)
開発環境: `http://localhost:3001/api/v1` (Railsバックエンド)

Production: (To be determined)
本番環境: (未定)

### 1.2. Authentication / 認証
Authentication is primarily handled using JSON Web Tokens (JWT).
認証は主にJSON Web Token (JWT) を使用して行われます。
Authenticated requests must include an `Authorization` header with the `Bearer <token>` scheme.
認証が必要なリクエストは、`Authorization` ヘッダーに `Bearer <token>` スキームでトークンを含める必要があります。

### 1.3. Data Format / データ形式
All request and response bodies are in JSON format.
全てのリクエストボディおよびレスポンスボディはJSON形式です。
`Content-Type: application/json`
`Accept: application/json`

### 1.4. HTTP Status Codes / HTTPステータスコード
Standard HTTP status codes will be used. Common codes include:
標準的なHTTPステータスコードを使用します。主なコードは以下の通りです。
- `200 OK`: Request successful. / リクエスト成功。
- `201 Created`: Resource successfully created. / リソース作成成功。
- `204 No Content`: Request successful, no content to return. / リクエスト成功、返すコンテンツなし。
- `400 Bad Request`: Invalid request (e.g., validation error). / 不正なリクエスト（例：バリデーションエラー）。
- `401 Unauthorized`: Authentication failed or not provided. / 認証失敗または未提供。
- `403 Forbidden`: Authenticated user does not have permission. / 認証済みユーザーに権限なし。
- `404 Not Found`: Resource not found. / リソースが見つかりません。
- `500 Internal Server Error`: Server-side error. / サーバーサイドエラー。

---

## 2. Authentication API / 認証API

### 2.1. User Registration (U-001)
### 2.1. ユーザー新規登録 (U-001)

- **Endpoint**: `POST /users/register`
- **Description**: Registers a new user.
- **説明**: 新しいユーザーを登録します。
- **Authentication**: Not required.
- **認証**: 不要。

- **Request Body**:
- **リクエストボディ**:
  ```json
  {
    "user": {
      "name": "string (required)",
      "email": "string (required, unique, valid email format)",
      "password": "string (required, min 8 characters with at least one letter and one number)",
      "password_confirmation": "string (required, matches password)"
    }
  }
  ```

- **Response**:
- **レスポンス**:
  - **`201 Created`**:
    ```json
    {
      "user": {
        "id": "integer",
        "name": "string",
        "email": "string"
      },
      "message": "User registered successfully."
      // "message": "ユーザー登録が成功しました。"
    }
    ```
  - **`400 Bad Request`** (Validation errors):
  - **`400 Bad Request`** (バリデーションエラー):
    ```json
    {
      "errors": {
        "email": ["has already been taken"], // ["すでに使用されています"],
        "password": ["is too short (minimum is 8 characters with at least one letter and one number)"] // ["短すぎます（最小8文字、少なくとも1文字と1数字を含む）"]
        // ... other errors
      }
    }
    ```

### 2.2. User Login (U-002)
### 2.2. ユーザーログイン (U-002)

- **Endpoint**: `POST /users/login`
- **Description**: Logs in as an existing user.
- **説明**: 既存のユーザーとしてログインします。
- **Authentication**: Not required.
- **認証**: 不要。

- **Request Body**:
- **リクエストボディ**:
  ```json
  {
    "user": {
      "email": "string (required)",
      "password": "string (required)"
    }
  }
  ```

- **Response**:
- **レスポンス**:
  - **`200 OK`**:
    ```json
    {
      "user": {
        "id": "integer",
        "name": "string",
        "email": "string"
      },
      "token": "string (JWT)",
      "message": "Login successful."
      // "message": "ログイン成功。"
    }
    ```
  - **`401 Unauthorized`** (Invalid credentials):
  - **`401 Unauthorized`** (認証情報が無効):
    ```json
    {
      "error": "Invalid email or password."
      // "error": "メールアドレスまたはパスワードが無効です。"
    }
    ```

### 2.3. User Logout (U-002)
### 2.3. ユーザーログアウト (U-002)
- **Note**: JWT-based logout is primarily a client-side operation (deleting the token).
- **注意**: JWTベースのログアウトは主にクライアント側の操作です（トークンの削除）。
- If server-side token blocklisting is implemented, an endpoint like `POST /users/logout` could be added.
- サーバー側でトークンのブラックリスト管理を実装する場合、`POST /users/logout` のようなエンドポイントを追加できます。

### 2.4. Admin Login (A-001)
### 2.4. 管理者ログイン (A-001)
- **Endpoint**: `POST /admin/login`
- **Description**: Logs in as an administrator.
- **説明**: 管理者としてログインします。
- **Authentication**: Not required.
- **認証**: 不要。
- **Request Body**: Similar to User Login, but for admin credentials.
- **リクエストボディ**: ユーザーログインと同様ですが、管理者用の認証情報を使用します。
  ```json
  {
    "admin": {
      "email": "string (required)",
      "password": "string (required)"
    }
  }
  ```
- **Response**: Similar to User Login, but for admin user and potentially different scope/permissions in token.
- **レスポンス**: ユーザーログインと同様ですが、管理者ユーザーの情報と、トークンには異なるスコープ/権限が含まれる可能性があります。
  - **`200 OK`**:
    ```json
    {
      "admin": {
        "id": "integer",
        "email": "string"
      },
      "token": "string (JWT for admin)",
      "message": "Admin login successful."
      // "message": "管理者ログイン成功。"
    }
    ```
  - **`401 Unauthorized`**:
    ```json
    {
      "error": "Invalid admin email or password."
      // "error": "管理者メールアドレスまたはパスワードが無効です。"
    }
    ```
---

## 3. Product API / 商品API

### 3.1. Get Product List (U-005)
### 3.1. 商品一覧取得 (U-005)

- **Endpoint**: `GET /products`
- **Description**: Retrieves a list of products. Supports pagination and filtering.
- **説明**: 商品一覧を取得します。ページネーションとフィルタリングをサポートします。
- **Authentication**: Optional. (e.g., user-specific pricing or recommendations if logged in)
- **認証**: 任意。（例：ログインユーザー向けの特別価格やおすすめ商品など）

- **Query Parameters**:
- **クエリパラメータ**:
  - `page` (integer, optional, default: 1): Page number for pagination. / ページネーションのためのページ番号。
  - `per_page` (integer, optional, default: 10): Number of items per page. / 1ページあたりのアイテム数。
  - `category_id` (integer, optional): Filter by category ID. / カテゴリIDでフィルタリング。
  - `sort_by` (string, optional, e.g., `price_asc`, `price_desc`, `created_at_desc`): Sorting criteria. / 並び替え基準。
  - `keyword` (string, optional): Search keyword for product name/description (U-007). / 商品名・説明の検索キーワード (U-007)。

- **Response**:
- **レスポンス**:
  - **`200 OK`**:
    ```json
    {
      "products": [
        {
          "id": "integer",
          "name": "string",
          "price": "decimal",
          "description_short": "string", // Short description for list view
                                        // 一覧表示用の短い説明
          "main_image_url": "string",
          "category": {
            "id": "integer",
            "name": "string"
          }
          // ... other relevant fields for list view
        }
      ],
      "pagination": {
        "current_page": "integer",
        "per_page": "integer",
        "total_pages": "integer",
        "total_count": "integer"
      }
    }
    ```

### 3.2. Get Product Details (U-006)
### 3.2. 商品詳細取得 (U-006)

- **Endpoint**: `GET /products/:id`
- **Description**: Retrieves details for a specific product.
- **説明**: 特定の商品の詳細を取得します。
- **Authentication**: Optional.
- **認証**: 任意。

- **Path Parameters**:
- **パスパラメータ**:
  - `id` (integer, required): ID of the product. / 商品のID。

- **Response**:
- **レスポンス**:
  - **`200 OK`**:
    ```json
    {
      "product": {
        "id": "integer",
        "name": "string",
        "price": "decimal",
        "description_full": "string", // Full description
                                     // 完全な説明
        "images": [
          {"url": "string", "is_main": "boolean"},
          {"url": "string", "is_main": "boolean"}
        ],
        "stock_quantity": "integer",
        "category": {
          "id": "integer",
          "name": "string"
        }
        // ... other detailed fields
      }
    }
    ```
  - **`404 Not Found`**:
    ```json
    {
      "error": "Product not found."
      // "error": "商品が見つかりません。"
    }
    ```

---
(Further endpoints like Cart, Order, Admin Product Management will be added here)
(ここにカート、注文、管理者商品管理などのエンドポイントが追加されます)
