# Devise 認証システムの全体像

このドキュメントでは、Railsアプリケーションで使用されるDevise認証システムの全体像を図解します。

## 1. Deviseの基本アーキテクチャ

```mermaid
graph TD
    A[ユーザー] -->|リクエスト| B[Railsアプリケーション]
    B --> C[Devise Engine]
    C --> D[Deviseモジュール]
    D --> E[認証]
    D --> F[登録]
    D --> G[パスワードリセット]
    D --> H[メール確認]
    D --> I[アカウントロック]
    E --> J[データベース]
    F --> J
    G --> J
    H --> J
    I --> J
```

## 2. 認証フロー

```mermaid
sequenceDiagram
    participant ユーザー
    participant ビュー
    participant コントローラー
    participant Devise
    participant データベース

    ユーザー->>ビュー: ログインフォームに入力
    ビュー->>コントローラー: メールとパスワードを送信
    コントローラー->>Devise: authenticate_user!
    Devise->>データベース: ユーザーを検索
    データベース-->>Devise: ユーザーデータを返す
    alt 認証成功
        Devise-->>コントローラー: 認証成功
        コントローラー-->>ビュー: ダッシュボードを表示
    else 認証失敗
        Devise-->>コントローラー: エラー
        コントローラー-->>ビュー: エラーメッセージを表示
    end
```

## 3. Deviseのモジュール構成

```mermaid
classDiagram
    class Devise {
        +authenticate_user!
        +current_user
        +user_signed_in?
        +sign_in(user)
        +sign_out(user)
    }
    
    class DatabaseAuthenticatable {
        +valid_password?
        +authenticate
    }
    
    class Registerable {
        +sign_up
        +update_without_password
    }
    
    class Recoverable {
        +reset_password
        +send_reset_password_instructions
    }
    
    class Rememberable {
        +remember_me
        +forget_me
    }
    
    class Validatable {
        +validates_presence_of :email
        +validates_presence_of :password
    }
    
    class Confirmable {
        +confirm!
        +send_confirmation_instructions
    }
    
    class Lockable {
        +lock_access!
        +unlock_access!
    }
    
    class Timeoutable {
        +timeout_in
    }
    
    class Trackable {
        +sign_in_count
        +current_sign_in_at
        +last_sign_in_at
        +current_sign_in_ip
        +last_sign_in_ip
    }
    
    Devise <|-- DatabaseAuthenticatable
    Devise <|-- Registerable
    Devise <|-- Recoverable
    Devise <|-- Rememberable
    Devise <|-- Validatable
    Devise <|-- Confirmable
    Devise <|-- Lockable
    Devise <|-- Timeoutable
    Devise <|-- Trackable
```

## 4. 現在のプロジェクトのJWT認証フロー

```mermaid
sequenceDiagram
    participant フロントエンド as フロントエンド (Next.js)
    participant バックエンド as バックエンド (Rails API)
    participant データベース as データベース

    フロントエンド->>バックエンド: 1. ログインリクエスト (email/password)
    バックエンド->>データベース: 2. ユーザー認証
    データベース-->>バックエンド: 3. ユーザーデータ
    バックエンド->>バックエンド: 4. JWTトークン生成
    バックエンド-->>フロントエンド: 5. JWTトークン返却
    フロントエンド->>フロントエンド: 6. トークンをlocalStorageに保存
    フロントエンド->>バックエンド: 7. 認証付きリクエスト (Authorizationヘッダー)
    バックエンド->>バックエンド: 8. トークン検証
    バックエンド-->>フロントエンド: 9. 認証済みデータ
```

## 5. Deviseのディレクトリ構造

```
app/
├── models/
│   └── user.rb                 # DeviseのUserモデル
├── controllers/
│   ├── application_controller.rb
│   └── users/                  # カスタムコントローラー
│       ├── registrations_controller.rb
│       └── sessions_controller.rb
├── views/
│   └── devise/                 # Deviseのビュー
│       ├── sessions/
│       ├── registrations/
│       ├── passwords/
│       └── ...
└── mailers/
    └── user_mailer.rb          # メーラー
```

## 6. 主要な設定ファイル

### 初期化ファイル (`config/initializers/devise.rb`)

```rubn
# メール送信の設定
config.mailer_sender = 'your-email@example.com'


# パスワードの最小長
config.password_length = 6..128

# メール確認の有効期限
config.confirm_within = 3.days

# パスワードリセットの有効期限
config.reset_password_within = 6.hours
```

### ルーティング (`config/routes.rb`)

```ruby
devise_for :users, controllers: {
  sessions: 'users/sessions',
  registrations: 'users/registrations',
  passwords: 'users/passwords'
}
```

## 7. よく使うヘルパーメソッド

### コントローラー内
- `before_action :authenticate_user!` - ログイン必須のアクションを指定
- `current_user` - 現在ログイン中のユーザーを取得
- `user_signed_in?` - ユーザーがログイン中かどうかをチェック
- `sign_in(@user)` - ユーザーをログイン状態にする
- `sign_out(@user)` - ユーザーをログアウト状態にする

### ビュー内
- `user_signed_in?` - ユーザーがログイン中かどうか
- `current_user` - 現在のユーザーオブジェクト
- `user_session` - 現在のセッション情報

## 8. セキュリティに関する注意点

1. **パスワードの取り扱い**
   - パスワードは必ずハッシュ化して保存
   - 平文でのパスワード送信はHTTPSを使用

2. **CSRF対策**
   - APIモードでは`null_session`を使用
   - 通常のWebアプリでは`protect_from_forgery`を有効に

3. **セッション管理**
   - セッションハイジャック対策のため、`config.secret_key_base`を適切に設定
   - セッションタイムアウトの設定を検討

4. **JWTの取り扱い**
   - トークンの有効期限を適切に設定
   - トークンはクライアント側で安全に保管（localStorage/sessionStorage）
   - 必要に応じてリフレッシュトークンを実装

このドキュメントは、Deviseを使用した認証システムの実装と理解をサポートするためのものです。プロジェクトの要件に応じて、適切なカスタマイズを行ってください。
