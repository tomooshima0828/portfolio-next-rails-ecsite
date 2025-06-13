# Issue 001: Set up Development Environment / 開発環境セットアップ

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

3. **CORS Configuration / CORS設定**
   - Configure CORS to allow requests from frontend
   - Set up allowed origins in `config/initializers/cors.rb`
   - Enable credentials for cross-origin requests
   - Configure CSRF protection for API endpoints

4. **Next.js Frontend / Next.js フロントエンド**
   - Initialize Next.js app within Docker
   - Configure environment variables
   - Development server starts successfully

5. **PostgreSQL Database / PostgreSQL データベース**
   - PostgreSQL service starts successfully
   - Configure database connection in `config/database.yml`
   - Set up user authentication and permissions
   - Initialize database and run migrations

6. **Git Ignore Configuration / Git無視設定**
   - Set up `.gitignore` files for both frontend and backend
   - Ignore sensitive files (`.env`, `node_modules/`, etc.)
   - Handle OS-specific files (`.DS_Store`, `Thumbs.db`)
   - Configure IDE/editor specific files (`.vscode/`, `.idea/`)

7. **Basic Verification / 基本検証**
   - Next.js frontend is accessible via browser
   - Rails backend is accessible

## Steps to Update .gitignore / .gitignoreの更新手順

If you need to update `.gitignore` after files have been tracked:

1. Add patterns to the appropriate `.gitignore` file
2. Remove files from Git's index (without deleting actual files):
   ```bash
   git rm -r --cached .
   git add .
   git commit -m "chore: update .gitignore and stop tracking ignored files"
   ```
3. Push changes to remote repository
4. Team members should also run the same commands to update their local repositories

## Best Practices / ベストプラクティス

- Keep `.gitignore` files organized by project structure
- Document any non-standard ignore patterns
- Review `.gitignore` when adding new dependencies or tools
- Consider using global gitignore for editor/IDE specific files

## CORS Configuration Details / CORS設定の詳細

### Backend Configuration / バックエンド設定

1. **CORS Initializer** (`config/initializers/cors.rb`):
   ```ruby
   Rails.application.config.middleware.insert_before 0, Rack::Cors do
     allow do
       origins [
         'http://localhost:3000',      # Local development
         'http://frontend:3000',        # Frontend in Docker
         'http://127.0.0.1:3000',      # IPv4 localhost
         'http://0.0.0.0:3000'         # All network interfaces
       ]


       resource '*',
         headers: :any,
         methods: [:get, :post, :put, :patch, :delete, :options, :head],
         expose: ['Authorization', 'X-CSRF-Token'],
         max_age: 600,
         credentials: true
     end
   end
   ```

2. **Application Controller** (`app/controllers/application_controller.rb`):
   ```ruby
   class ApplicationController < ActionController::API
     include ActionController::RequestForgeryProtection
     include ActionController::Cookies
     protect_from_forgery with: :null_session
     before_action :set_csrf_cookie

     private

     def set_csrf_cookie
       cookies['CSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
     end
   end
   ```

3. **Development Environment** (`config/environments/development.rb`):
   ```ruby
   # Allow requests from Docker containers
   config.hosts << "backend"
   config.hosts << "backend:3000"
   ```

### Frontend Configuration / フロントエンド設定

1. **API Client** (`src/lib/apiClient.ts`):
   ```typescript
   const config: RequestInit = {
     method,
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json',
       ...headers,
     },
     mode: 'cors',
     credentials: 'include',  // Include credentials (cookies, HTTP authentication)
     cache: 'no-cache',
   };
   ```

2. **Next.js Config** (`next.config.ts`):
   ```typescript
   async rewrites() {
     return [
       {
         source: "/api/:path*",
         destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://backend:3000'}/api/:path*`,
       },
     ];
   },
   ```

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
