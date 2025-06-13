# Issue 002: Implement User Authentication Features (ユーザー認証機能の実装)

## Overview (概要)
This issue covers the implementation of basic user authentication features (new user registration, login, logout) for the EC site.
ECサイトの基本的なユーザー認証機能（新規会員登録、ログイン、ログアウト）を実装します。

## Background (背景)
With the development environment setup (Issue 001) completed, we are ready to start developing the core features of the application. User authentication is a prerequisite for many subsequent features and should be implemented early.
開発環境のセットアップ（Issue 001）が完了し、アプリケーションのコア機能開発を開始する準備が整いました。ユーザー認証は、多くの後続機能の前提となるため、初期に実装します。

## Goals (目的)
- Users can register new accounts. (ユーザーが新規にアカウントを登録できること。)
- Registered users can log in and log out. (登録済みユーザーがログインおよびログアウトできること。)

## Target Features (対象機能)
- **U-001: New User Registration (新規会員登録)**
    - Description: Users can register by entering information such as email address, password, name, and address.
    - 説明: ユーザーはメールアドレス、パスワード、氏名、住所等の情報を入力して会員登録ができる。
    - Details:
    - 詳細:
        - Email format validation is performed.
        - メールアドレス形式のバリデーションを行う。
        - Passwords are stored in hashed format.
        - パスワードはハッシュ化して保存する。
        - (Optional) Send confirmation email after registration.
        - (任意) 登録完了後、確認メールを送信する。
- **U-002: Login/Logout (ログイン・ログアウト)**
    - Description: Registered users can log in with their email address and password, and log out.
    - 説明: 登録済みのユーザーはメールアドレスとパスワードでログインできる。ログアウトも可能。
    - Details:
    - 詳細:
        - Error message is displayed when login fails.
        - ログイン失敗時にはエラーメッセージを表示する。
        - Session is maintained after successful login.
        - ログイン成功後はセッションを維持する。

## Scope of Work (作業範囲)
- **Backend (Ruby on Rails)**
    - Create User model (email, password_digest, name, address, etc.)
    - Userモデルの作成 (メールアドレス、パスワードダイジェスト、氏名、住所など)
    - Implement registration API endpoints
    - 新規登録APIエンドポイントの実装
    - Implement login API endpoints (including session management)
    - ログインAPIエンドポイントの実装 (セッション管理を含む)
    - Implement logout API endpoints
    - ログアウトAPIエンドポイントの実装
    - Implement password hashing (e.g., `bcrypt`)
    - パスワードハッシュ化の実装 (e.g., `bcrypt`)
    - Implement email format validation
    - メールアドレス形式バリデーションの実装
    - (Optional) Prepare email sending functionality (e.g., Action Mailer, external services like SendGrid/Mailgun)
    - (任意) メール送信機能の準備 (e.g., Action Mailer, SendGrid/Mailgunなどの外部サービス連携)
- **Frontend (Next.js)**
    - Create registration page
    - 新規登録ページの作成
    - Create login page
    - ログインページの作成
    - Implement registration and login forms
    - 登録フォーム、ログインフォームの実装
    - API integration (registration, login, logout)
    - API連携 (登録、ログイン、ログアウト処理)
    - Global state management for authentication (e.g., Redux, Context API)
    - 認証状態のグローバル管理 (e.g., Redux, Context API)
    - UI control based on authentication state (e.g., toggle login/logout buttons)
    - 認証状態に応じた表示制御 (e.g., ログイン/ログアウトボタンの切り替え)
- **Database (PostgreSQL)**
    - Define `users` table schema
    - `users` テーブルスキーマ定義

## Out of Scope (非対象範囲)
- U-003: My Page (マイページ)
- U-004: Password Reset (パスワードリセット)
- Administrator Authentication (管理者認証機能)
- OAuth Authentication (Google, Facebook, etc.) (OAuth認証 (Google, Facebook等))
- Two-Factor Authentication (二要素認証)

## Definition of Done (完了条件)
- New users can register with the specified information.
- 新規ユーザーが指定された情報で登録できること。
- Registered user information is correctly saved in the database (passwords are hashed).
- 登録されたユーザー情報がデータベースに正しく保存されること（パスワードはハッシュ化されている）。
- Registered users can log in with correct credentials.
- 登録済みユーザーが正しい認証情報でログインできること。
- User session is maintained after login.
- ログイン後、ユーザーセッションが維持されること。
- Logged-in users can log out.
- ログイン済みユーザーがログアウトできること。
- Appropriate error messages are displayed on login failure.
- ログイン失敗時に適切なエラーメッセージが表示されること。
- Frontend and backend API integration works correctly.
- フロントエンドとバックエンドのAPI連携が正しく動作すること。
- Backend tests are written with RSpec (models, request tests, etc.).
- RSpecによるバックエンドのテストが記述されていること（モデル、リクエストテストなど）。
- (Optional) Code quality is ensured with ESLint/Rubocop.
- (任意) ESLint/Rubocopによるコード品質が担保されていること。

## Related Issues (関連Issue)
- #3 (Prerequisite Issue) (前提Issue)

## Notes (備考)
- Consider security measures (CSRF protection, session fixation protection, etc.).
- セキュリティ対策（CSRF対策、セッション固定化対策など）も考慮すること。
- API design should follow RESTful principles.
- API設計はRESTfulな原則に従うことを推奨。
