# Issue 003: Deploy Application and Set Up CI/CD (アプリケーションのデプロイとCI/CDのセットアップ)

## Overview (概要)
This issue covers the deployment of the application to production environments (Vercel, Render, Supabase) and the setup of a CI/CD pipeline using GitHub Actions.
このIssueでは、アプリケーションの本番環境（Vercel, Render, Supabase）へのデプロイと、GitHub Actions を用いたCI/CDパイプラインのセットアップを行います。

## Background (背景)
With basic features being developed, it's important to establish a deployment and integration workflow early. This ensures that we can continuously deliver new features and maintain code quality automatically.
基本的な機能開発が進んできたため、早期にデプロイと統合のワークフローを確立することが重要です。これにより、新機能の継続的なデリバリーとコード品質の自動的な維持が可能になります。

## Goals (目的)
- Deploy the frontend, backend, and database to their respective cloud services. (フロントエンド、バックエンド、データベースをそれぞれのクラウドサービスにデプロイすること。)
- Automate the deployment process upon changes to the `main` branch. (`main`ブランチへの変更時にデプロイプロセスが自動化されること。)
- Automate code linting (Rubocop, ESLint) for every push to the repository. (リポジトリへのプッシュごとにコードのリンティング（Rubocop, ESLint）が自動的に実行されること。)

## Target Features (対象機能)
- **D-001: Initial Deployment (初回デプロイ)**
    - Description: Deploy the Next.js frontend to Vercel, the Rails backend to Render, and set up the PostgreSQL database on Supabase.
    - 説明: Next.jsフロントエンドをVercelに、RailsバックエンドをRenderにデプロイし、PostgreSQLデータベースをSupabaseにセットアップする。
    - Details:
    - 詳細:
        - Connect GitHub repository to Vercel and Render. (GitHubリポジトリをVercelとRenderに接続する。)
        - Configure environment variables for each service. (各サービスで環境変数を設定する。)
        - Migrate the database schema to Supabase. (データベーススキーマをSupabaseにマイグレーションする。)
- **D-002: Continuous Deployment (CD) (継続的デプロイ)**
    - Description: Configure Vercel and Render to automatically trigger a new deployment when a pull request is merged or a push is made to the `main` branch.
    - 説明: `main`ブランチへのプルリクエストのマージまたはプッシュがあった場合に、VercelとRenderが自動的に新しいデプロイをトリガーするように設定する。
- **D-003: Continuous Integration (CI) (継続的インテグレーション)**
    - Description: Set up a GitHub Actions workflow to run linters.
    - 説明: リンターを実行するためのGitHub Actionsワークフローをセットアップする。
    - Details:
    - 詳細:
        - Create a workflow file (e.g., `.github/workflows/lint.yml`). (ワークフローファイル（例: `.github/workflows/lint.yml`）を作成する。)
        - The workflow should run `rubocop` for the backend and `eslint` for the frontend on every push. (ワークフローはプッシュごとにバックエンドの`rubocop`とフロントエンドの`eslint`を実行する。)
        - The workflow status (pass/fail) should be visible on pull requests. (ワークフローのステータス（成功/失敗）がプルリクエストに表示されるようにする。)

## Scope of Work (作業範囲)
- **Deployment (デプロイ)**
    - Vercel: Create a new project and link it to the `frontend` directory of the GitHub repository. (Vercel: 新規プロジェクトを作成し、GitHubリポジトリの`frontend`ディレクトリにリンクする。)
    - Render: Create a new Web Service and link it to the `backend` directory of the GitHub repository. (Render: 新規Webサービスを作成し、GitHubリポジトリの`backend`ディレクトリにリンクする。)
    - Supabase: Create a new project and obtain the database connection URL. (Supabase: 新規プロジェクトを作成し、データベース接続URLを取得する。)
    - Application: Configure environment variables for production in both Rails and Next.js. (アプリケーション: RailsとNext.jsの両方で本番用の環境変数（`.env`）を設定する。)
- **GitHub Actions**
    - Create a `.github/workflows/lint.yml` file. (`.github/workflows/lint.yml`ファイルを作成する。)
    - Define jobs for running Rubocop and ESLint. (RubocopとESLintを実行するためのジョブを定義する。)

## Out of Scope (非対象範囲)
- Setting up staging/preview environments. (ステージング/プレビュー環境の構築。)
- Automated testing pipeline (will be covered in a separate issue). (自動テストパイプライン（別のIssueで対応）。)
- Database seeding in production. (本番環境でのデータベースシーディング。)

## Definition of Done (完了条件)
- The frontend application is accessible via a Vercel URL. (フロントエンドアプリケーションがVercelのURLでアクセス可能であること。)
- The backend application is accessible via a Render URL. (バックエンドアプリケーションがRenderのURLでアクセス可能であること。)
- The frontend can successfully communicate with the backend API. (フロントエンドがバックエンドAPIと正常に通信できること。)
- Deployments are automatically triggered on pushes to the `main` branch. (`main`ブランチへのプッシュでデプロイが自動的にトリガーされること。)
- The GitHub Actions workflow for linting runs successfully on every push. (リンティング用のGitHub Actionsワークフローがプッシュごとに正常に実行されること。)
- Pull requests show the status of the linting checks. (プルリクエストにリンティングチェックのステータスが表示されること。)

## Related Issues (関連Issue)
- None (なし)

## Notes (備考)
Ensure that secrets like API keys and database URLs are stored securely as environment variables and not committed to the repository.
APIキーやデータベースURLなどの秘密情報は、リポジトリにコミットせず、環境変数として安全に保管すること。
