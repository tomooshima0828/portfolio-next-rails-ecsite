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

      # ユーザー情報をレスポンス用に整形する
      def user_response(user)
        {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone,
          role: user.role
        }
      end

      # 認証メソッド（実際のJWT認証はDevise JWTで実装）
      def authenticate_user!
        Rails.logger.info 'Base Controller - Authentication attempt'
        Rails.logger.info "Base Controller - Authorization header: #{request.headers['Authorization']}"
        Rails.logger.info "Base Controller - Current user: #{current_user&.id}"

        # 認証トークンがない場合は401エラー
        return if current_user

        Rails.logger.warn 'Base Controller - Authentication failed'
        render json: {
          status: { code: 401, message: '認証が必要です' }
        }, status: :unauthorized
      end

      def not_found
        render json: {
          status: { code: 404, message: 'リソースが見つかりません' }
        }, status: :not_found
      end
    end
  end
end
