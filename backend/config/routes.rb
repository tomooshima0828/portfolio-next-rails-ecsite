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

      # その他のAPIルート
    end
  end

  # フロントエンドのルーティングはNext.jsが担当するため、存在しないルートは404を返す
  match '*path', to: 'application#not_found', via: :all
end
