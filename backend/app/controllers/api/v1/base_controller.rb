# frozen_string_literal: true

module Api
  module V1
    class BaseController < ApplicationController
      # RailsのAPIモードではCSRF保護を無効化
      protect_from_forgery with: :null_session
      skip_before_action :verify_authenticity_token

      # レスポンスをJSON形式に設定
      respond_to :json

      # デフォルトで認証を要求
      # 注意: 認証不要なエンドポイントでは個別にskip_before_actionする
      before_action :authenticate_user!

      # エラーハンドリング
      rescue_from ActiveRecord::RecordNotFound, with: :not_found

      private

      # 認証メソッド（実際のJWT認証はDevise JWTで実装）
      def authenticate_user!
        # 認証トークンがない場合は401エラー
        unless current_user
          render json: {
            status: { code: 401, message: '認証が必要です' }
          }, status: :unauthorized
        end
      end

      def not_found
        render json: {
          status: { code: 404, message: 'リソースが見つかりません' }
        }, status: :not_found
      end
    end
  end
end
