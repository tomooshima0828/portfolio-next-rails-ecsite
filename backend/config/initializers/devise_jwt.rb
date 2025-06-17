# frozen_string_literal: true

Devise.setup do |config|
  # JWT用のシークレットキーを設定
  config.jwt do |jwt|
    # シークレットキーを環境変数から取得するか、ランダムに生成
    jwt.secret = ENV['DEVISE_JWT_SECRET_KEY'] || SecureRandom.hex(64)

    # JWTの有効期限を設定（30日）
    jwt.expiration_time = 30.days.to_i

    # トークンを発行するリクエストのパスとメソッドを指定
    # ログインと新規登録時にトークンを発行
    jwt.dispatch_requests = [
      ['POST', %r{^/api/v1/login$}],
      ['POST', %r{^/api/v1/signup$}]
    ]

    # トークンを失効させるリクエストのパスとメソッドを指定
    # ログアウト時にトークンを失効
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/v1/logout$}]
    ]
  end
end
