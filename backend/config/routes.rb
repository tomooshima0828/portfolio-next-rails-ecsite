# frozen_string_literal: true

Rails.application.routes.draw do
  # RailsをAPIモードで動作させるために、Deviseのデフォルトルート（ログイン、ログアウト、登録など）をスキップ
  devise_for :users, skip: :all

  namespace :api do
    namespace :v1 do
      get 'hello', to: 'hello#index'

      # ユーザー認証関連のAPIエンドポイント
      post 'signup', to: 'registrations#create'
      post 'login', to: 'sessions#create'
      delete 'logout', to: 'sessions#destroy'
      get 'auth/current_user', to: 'auth#current_user_info'

      # 商品関連のAPIエンドポイント
      resources :products, only: %i[index show create]

      # カテゴリ関連のAPIエンドポイント
      resources :categories, only: [:index]

      # カート関連のAPIエンドポイント
      resources :cart_items, only: %i[index show create update destroy]
    end
  end

  # Active Storageのルートを明示的に設定する
  # これをcatch-allルートより前に置くことで、画像URLへのリクエストが正しく処理される
  # 必要なルートを明示的に設定する
  direct_upload_routes = lambda do
    # BLOBのリダイレクト(302リダイレクト経由でファイルを取得): 署名付きIDとファイル名に基づいてリダイレクトを行う
    get  '/blobs/redirect/:signed_id/*filename' => 'active_storage/blobs/redirect#show'
    # BLOBのプロキシ(Railsサーバーが仲介してファイルを取得): 署名付きIDとファイル名に基づいてプロキシを生成する
    get  '/blobs/:signed_id/*filename' => 'active_storage/blobs/proxy#show'
    # 複数の画像表現形式(サムネイル画像、トリミングされた画像、グレースケール変換画像など)のリダイレクト: 署名付きBLOB IDと変更キーとファイル名に基づいてリダイレクトを行う
    get  '/representations/redirect/:signed_blob_id/:variation_key/*filename' =>
         'active_storage/representations/redirect#show'
    # 複数の画像表現形式のプロキシ: 署名付きBLOB IDと変更キーとファイル名に基づいてプロキシを生成する
    get  '/representations/:signed_blob_id/:variation_key/*filename' => 'active_storage/representations/proxy#show'
    # ローカルディスクストレージサービス: エンコードされたキーとファイル名に基づいてディスクを生成する
    get  '/disk/:encoded_key/*filename' => 'active_storage/disk#show'
    # 直接アップロード: 直接アップロードリクエストを処理する
    post '/direct_uploads' => 'active_storage/direct_uploads#create'
  end
  # 上記で定義したルートを'/rails/active_storage'パス配下に配置し、
  # 'rails_active_storage'という名前空間を与える
  scope '/rails/active_storage', as: :rails_active_storage, &direct_upload_routes

  # フロントエンドのルーティングはNext.jsが担当するため、存在しないルートは404を返す
  match '*path', to: 'application#not_found', via: :all
end
