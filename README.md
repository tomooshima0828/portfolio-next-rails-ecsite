# portfolio-next-rails-ecsite
# ポートフォリオ Next.js + Rails ECサイト

## 1. Local Development Setup / ローカル開発環境設定

### Setup Steps / セットアップ手順
1. Clone the repository / リポジトリをクローン
```
git clone git@github.com:tomooshima0828/portfolio-next-rails-ecsite.git
```
2. Navigate to the project directory / プロジェクトディレクトリに移動
```
cd portfolio-next-rails-ecsite
```
3. Build and run the containers / コンテナを構築して起動
```
docker compose build
docker compose up
```
4. Access the application / アプリケーションにアクセス
```
http://localhost:3000
```

### Linting / リント
```
# backend (Rubocop) executable on the root directory
docker compose run --rm backend bundle exec rubocop -A

# frontend (ESLint) executable on the root directory
docker compose run --rm frontend yarn run lint
```

## 2. Overview
## 2. 概要

## 3. Requirements Specification
## 3. 要件仕様

## 4. Implementation Plan
## 4. 実装計画

```
portfolio-next-rails-ecsite/
├── backend/
│   ├── Dockerfile
│   └── (Rails app files...)
├── frontend/
│   ├── Dockerfile
│   └── (Next.js app files...)
├── docker-compose.yml
└── portfolio_specifications/
    ├── api_specification.md
    ├── implementation_plan.md
    └── requirements_specification.md
```

## 5. Technology Selection
## 5. 技術選定

## 6. Database Schema
## 6. データベーススキーマ

## 7. ER Diagram
## 7. ER図

## 8. Database Connection / データベース接続

DBeaverなどのデータベースクライアントツールで接続する場合は以下の情報を使用してください。

### Development / 開発環境
- **Host**: `localhost`
- **Port**: 5432
- **Database**: `portfolio_development`
- **Username**: `postgres`
- **Password**: `password`

### Test / テスト環境
- **Database**: `portfolio_test`
- その他は開発環境と同様

## 9. Development Workflow / 開発ワークフロー

### Branch Naming Convention / ブランチ命名規則

```
{type}/{issue-number}-{slug-form-title}
```

#### Branch Types / ブランチの種類

| Type / 種類 | Purpose / 目的 | Example / 例 |
|-------------|----------------|--------------|
| `feature/` | New feature development / 新機能開発 | `feature/001-user-authentication` |
| `bugfix/`  | Bug fixes / バグ修正 | `bugfix/012-fix-login-error` |
| `hotfix/`  | Critical production fixes / 緊急の本番バグ修正 | `hotfix/015-fix-payment-issue` |
| `refactor/`| Code refactoring / リファクタリング | `refactor/020-improve-api-performance` |
| `docs/`    | Documentation updates / ドキュメント更新 | `docs/025-update-readme` |
| `chore/`   | Maintenance tasks / その他のメンテナンス | `chore/030-update-dependencies` |

#### Naming Rules / 命名規則

1. **Use slashes (/) to separate branch types**  
   **スラッシュ(/)でブランチタイプを区切る**  
   - 例: `feature/001-user-authentication`

2. **Prefix with issue number**  
   **Issue番号を先頭に付与**  
   - 例: `001-` (3桁のゼロパディング)
   - Issue番号がない場合は `000-` から開始

3. **Slug-form title**  
   **スラッグ形式のタイトル**  
   - 小文字の英数字とハイフンのみ使用
   - 単語はハイフンで区切る
   - 例: `setup-docker-environment`

### Basic Workflow / 基本的なワークフロー

1. **Start a new feature** / **新機能の作業を開始**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/001-user-authentication
   ```

2. **Commit changes** / **変更をコミット**:
   ```bash
   git add .
   git commit -m "feat: Implement input fields for user authentication"
   ```

3. **Push to remote** / **リモートにプッシュ**:
   ```bash
   git push -u origin feature/001-user-authentication
   ```

4. **Create a pull request** / **プルリクエストを作成**:
   - Create a pull request on GitHub/GitLab
   - Reference related issue (e.g., `#1`)
   - Get code review and merge

## 8. Issue Management / Issue管理方針

### Naming Convention / 命名規則
- File Name: `{issue-number}-{slug-form-title}.md`
  - Example: `001-setup-development-environment.md`
