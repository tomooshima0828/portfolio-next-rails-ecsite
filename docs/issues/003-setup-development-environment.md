# Set up Development Environment / 開発環境セットアップ

## Description / 説明
Set up the Docker-based development environment for the Portfolio EC Site project.
ポートフォリオECサイトプロジェクトのDockerベース開発環境をセットアップします。

## Acceptance Criteria / 受け入れ基準
1. **Docker Configuration / Docker設定**
   - Create `Dockerfile` for Rails and Next.js
   - Create `docker-compose.yml` for all services
   - Ensure inter-service communication

2. **Ruby on Rails Backend / Ruby on Rails バックエンド**
   - Initialize Rails app within Docker
   - Configure database connection
   - Bundle install and create databases
   - Rails server starts successfully

3. **Next.js Frontend / Next.js フロントエンド**
   - Initialize Next.js app within Docker
   - Next.js dev server starts successfully

4. **PostgreSQL Database / PostgreSQL データベース**
   - PostgreSQL service starts successfully
   - Data persistence is enabled

5. **Basic Verification / 基本検証**
   - Next.js frontend is accessible via browser
   - Rails backend is accessible

## File Structure / ファイル構成
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
