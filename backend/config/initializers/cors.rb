# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Docker環境とローカル開発環境の両方で動作するようにオリジンを設定
    origins [
      'http://localhost:3000',       # ローカル開発環境
      'http://frontend:3000',        # Dockerコンテナ内のフロントエンド
      'http://localhost:3001',       # ローカル開発環境（直接バックエンドにアクセスする場合）
      'http://127.0.0.1:3000',       # ローカル開発環境（IPv4）
      'http://0.0.0.0:3000',         # すべてのネットワークインターフェース
      'http://127.0.0.1:64553',      # ブラウザプレビューURL
      ENV['FRONTEND_URL'] || 'https://portfolio-next-rails-ecsite.vercel.app' # 本番環境のフロントエンドURL
    ]

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: %w[Authorization X-CSRF-Token],
             max_age: 600,
             credentials: true
  end
end
