Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'hello', to: 'hello#index'
      # その他のAPIルート
    end
  end

  # フロントエンドのルーティングはNext.jsが担当するため、存在しないルートは404を返す
  match '*path', to: 'application#not_found', via: :all
end
