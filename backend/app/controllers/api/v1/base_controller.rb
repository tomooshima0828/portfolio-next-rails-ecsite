module Api
  module V1
    class BaseController < ApplicationController
      # RailsのAPIモードではCSRF保護を無効化
      protect_from_forgery with: :null_session
      skip_before_action :verify_authenticity_token
      
      # レスポンスをJSON形式に設定
      respond_to :json
      
      # エラーハンドリング
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      
      private
      
      def not_found
        render json: {
          status: { code: 404, message: 'リソースが見つかりません' }
        }, status: :not_found
      end
    end
  end
end
