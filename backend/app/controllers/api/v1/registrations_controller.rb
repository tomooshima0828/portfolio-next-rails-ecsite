module Api
  module V1
    class RegistrationsController < Api::V1::BaseController
      # skip_before_action :authenticate_user!, only: [:create] # 必要に応じてコメント解除または追加

      # ユーザー登録
      def create
        user = User.new(user_params)
        user.jti = SecureRandom.uuid # JTIを生成

        if user.save
          # sign_in(user) # Deviseのsign_inヘルパー。JWTなので不要な場合もある
          # devise-jwtが自動的にJWTトークンを生成するので、それを取得
          # トークンは通常レスポンスヘッダーにセットされるので、明示的に取得・送信する必要がない場合もある
          # Rack::Request オブジェクトから warden-jwt_auth.token を取得するのは一般的
          token = request.env['warden-jwt_auth.token']

          render json: {
            status: { code: 200, message: 'ユーザー登録が完了しました。' }, # メッセージを少し変更
            data: user_response(user),
            token: token # フロントエンドでトークンを処理する場合に送信
          }
        else
          render json: {
            status: { code: 422, message: 'ユーザー登録に失敗しました。' }, # メッセージを少し変更
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.require(:user).permit(
          :name,
          :email,
          :password,
          :password_confirmation,
          :address,
          :phone
        )
      end

      def user_response(user)
        {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone
          # created_at や updated_at も必要であれば追加
        }
      end
    end # Class RegistrationsController の end
  end # Module V1 の end
end # Module Api の end
