# frozen_string_literal: true

module Api
  module V1
    class AuthController < Api::V1::BaseController
      # ログインしていない場合は認証エラーを返す
      before_action :authenticate_user!

      # GET /api/v1/auth/current_user
      # 現在のユーザー情報を返す
      def current_user_info
        render json: {
          status: { code: 200, message: '認証成功' },
          data: user_response(current_user)
        }
      end

      private

      # ユーザー情報をレスポンス用に整形する
      def user_response(user)
        {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone
        }
      end
    end
  end
end
