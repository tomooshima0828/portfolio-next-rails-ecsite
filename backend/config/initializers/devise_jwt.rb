Devise.setup do |config|
  # JWT用のシークレットキーを設定
  config.jwt do |jwt|
    # シークレットキーを環境変数から取得するか、ランダムに生成
    jwt.secret = ENV['DEVISE_JWT_SECRET_KEY'] || SecureRandom.hex(64)
    
    # JWTの有効期限を設定（30日）
    jwt.expiration_time = 30.days.to_i
  end
end
