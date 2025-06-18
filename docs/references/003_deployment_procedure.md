# Deployment Procedure デプロイ手順書

This document outlines the deployment procedure for the portfolio application. The backend is a Rails API deployed on Render, and the frontend is a Next.js application deployed on Vercel. The database is hosted on Supabase.
このドキュメントは、ポートフォリオアプリケーションのデプロイ手順をまとめたものです。バックエンドはRenderにデプロイされたRails API、フロントエンドはVercelにデプロイされたNext.jsアプリケーションです。データベースはSupabaseでホストされています。

## 1. Database Setup (Supabase)
## 1. データベース設定 (Supabase)

### Prerequisites 前提条件
- A Supabase account.
- Supabaseアカウントがあること。

### Setup Steps 設定手順
1. Log in to your Supabase account.
Supabaseアカウントにログインします。
2. Click on "New project".
「New project」をクリックします。
3. Choose your organization and give your project a name (e.g., `portfolio-ecsite-db`).
組織を選択し、プロジェクト名を入力します（例: `portfolio-ecsite-db`）。
4. Choose a strong database password and save it securely. Remember this password as it will be part of your database connection string below.
強力なデータベースパスワードを設定し、安全に保管します。このパスワードはデータベース接続文字列の一部となるため、覚えておいてください。
5. Select a region (e.g., `Northeast Asia (Tokyo)` or your preferred region).
リージョンを選択します（例: `Northeast Asia (Tokyo)` または任意のリージョン）。
6. Click "Create new project". Wait for the project to be provisioned.
「Create new project」をクリックします。プロジェクトがプロビジョニングされるまで待ちます。
7. Once the project is created, navigate to **Connect** (located in the header) > **Connect to your project**.
プロジェクトが作成されたら、**Connect**（ヘッダーにある） > **Connect to your project** に移動します。
8. Under the **Connection string** tab, find the **Transaction pooler** that starts with `postgresql://postgres:[YOUR-PROJECT-ID]@[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`. This is the `DATABASE_URL` you will use for your Rails application.
**Connection string** タブで、`postgresql://postgres:[YOUR-PROJECT-ID]@[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres` で始まる **Transaction pooler** を見つけます。これがRailsアプリケーションで使用する `DATABASE_URL` です。
   - **Important**: Ensure you are using the **Transaction pooling** connection string for Render, as it's generally recommended for serverless environments and applications that may open many short-lived connections.
   - **重要**: Renderには、一般的にサーバーレス環境や多数の短期的な接続を開く可能性のあるアプリケーションに推奨されるため、**Transaction pooling** の接続文字列を使用していることを確認してください。
   - Replace `[YOUR-PASSWORD]` with the database password you set during project creation.
   `[YOUR-PASSWORD]` をプロジェクト作成時に設定したデータベースパスワードに置き換えてください。

## 2. Backend Deployment (Rails on Render)
## 2. バックエンドのデプロイ (Rails on Render)

### Prerequisites
- A Render account.
- A Supabase project has been created and the database connection string (pooling) is ready.
- The application code is pushed to a GitHub repository.
### 前提条件
-   Renderアカウントがあること。
-   Supabaseプロジェクトが作成済みで、データベース接続文字列（コネクションプーリング）が準備できていること。
-   アプリケーションコードがGitHubリポジトリにプッシュされていること。

### Deployment Steps デプロイ手順
1.  Log in to the Render dashboard and create a **New Web Service**.
Renderダッシュボードにログインし、**New Web Service** を作成します。
2.  Connect your GitHub repository.
GitHubリポジトリを連携します。
3.  Configure the service with the following settings:
以下の設定でサービスを構成します:
    -   **Name**: A unique name for your service (e.g., `portfolio-next-rails-ecsite-backend`).
    -   **Root Directory**: `backend`
    -   **Runtime**: `Docker`
    -   **Region**: `Singapore (Southeast Asia)`
    -   **Instance Type**: `Free`
    -   **Repository**: `https://github.com/tomooshima0828/portfolio-next-rails-ecsite`
    -   **Branch**: `main`
    -   **Git Credentials**: `your-email-address@your-email.com`
    -   **Root Directory**: `backend`
    -   **Dockerfile Path**: `backend/ Dockerfile`
    -   **Environment Variables**: See the section below.
4.  Click **Create Web Service** to start the initial deployment.
**Create Web Service** をクリックして、初回デプロイを開始します。

### Environment Variables 環境変数
-   `DATABASE_URL`: The transaction pooling URL of your Supabase project.
SupabaseプロジェクトのトランザクションプーリングURL。
-   `RAILS_MASTER_KEY`: The contents of your local `config/master.key` file.
ローカルの `config/master.key` ファイルの中身。
-   `RAILS_ENV`: The environment in which the application is running (e.g., `production`).
アプリケーションが実行されている環境（例: `production`）。
-   `PORT`: The port on which the application is running (e.g., `3000`).
アプリケーションが実行されているポート（例: `3000`）。
-   `FRONTEND_URL`: The URL of your deployed Vercel frontend (e.g., `https://portfolio-next-rails-ecsite.vercel.app`).
VercelにデプロイしたフロントエンドのURL（例: `https://portfolio-next-rails-ecsite.vercel.app`）。CORS設定で使用されます。

### Database Seeding データベースの初期データ投入
-   The `backend/bin/docker-entrypoint` script is configured to automatically run `rails db:prepare` (which creates and migrates the database) and `rails db:seed` on server startup.
`backend/bin/docker-entrypoint` スクリプトにより、サーバー起動時に `rails db:prepare`（データベースの作成とマイグレーション）と `rails db:seed` が自動的に実行されるように設定されています。
-   Alternatively, you can run seed commands manually using the **Shell** tab in the Render dashboard.
または、Renderダッシュボードの **Shell** タブから手動でシードコマンドを実行することも可能です。

## 3. Frontend Deployment (Next.js on Vercel)
## 3. フロントエンドのデプロイ (Next.js on Vercel)

### Prerequisites
-   A Vercel account.
-   The backend has been deployed and its URL is known.
### 前提条件
-   Vercelアカウントがあること。
-   バックエンドがデプロイ済みで、そのURLがわかっていること。

### Deployment Steps
1.  Log in to the Vercel dashboard and create a **New Project**.
2.  Import your GitHub repository.
3.  Configure the project with the following settings:
    -   **Framework Preset**: `Next.js`
    -   **Root Directory**: `frontend`
4.  Add the necessary environment variables.
5.  Click **Deploy** to start the deployment.
### デプロイ手順
1.  Vercelダッシュボードにログインし、**New Project** を作成します。
2.  GitHubリポジトリをインポートします。
3.  以下の設定でプロジェクトを構成します：
    -   **Framework Preset**: `Next.js`
    -   **Root Directory**: `frontend`
4.  必要な環境変数を追加します。
5.  **Deploy** をクリックして、デプロイを開始します。

### Environment Variables 環境変数
-   `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed Render backend, including the API path (e.g., `https://portfolio-next-rails-ecsite-backend.onrender.com/api/v1`).
RenderにデプロイしたバックエンドのURL。APIパスを含みます（例: `https://portfolio-next-rails-ecsite-backend.onrender.com/api/v1`）。

## 4. Post-Deployment Confirmation デプロイ後の確認

1.  Access the URL provided by Vercel to check if the frontend is displayed correctly.
2.  Attempt to log in using the credentials of the user created by the seed data.
3.  Open the browser's developer console to check for any network or CORS errors.

1.  Vercelから提供されたURLにアクセスし、フロントエンドが正しく表示されることを確認します。
2.  シードデータで作成されたユーザーの認証情報を使って、ログインを試みます。
3.  ブラウザの開発者コンソールを開き、ネットワークエラーやCORSエラーが発生していないか確認します。
