module Api
  module V1
    class SessionsController < Api::V1::BaseController
      before_action :authenticate_user!, only: [:destroy, :show]
      
      # ログイン
      def create
        user = User.find_by(email: params[:user][:email])
    
        if user&.valid_password?(params[:user][:password])
          sign_in(user)
          token = request.env['warden-jwt_auth.token']
          Rails.logger.info "Generated token in SessionsController: #{token.inspect}"
      
          render json: {
            status: { code: 200, message: 'ログインに成功しました' },
            data: user_response(user),
            token: token
          }
        else
          render json: {
            status: { code: 401, message: 'メールアドレスまたはパスワードが正しくありません' }
          }, status: :unauthorized
        end
      end
  
      # ログアウト
      def destroy
        current_user.update(jti: SecureRandom.uuid)
        sign_out(current_user)
    
        render json: {
          status: { code: 200, message: 'ログアウトしました' }
        }
      end
  
      # 現在のユーザー情報を取得
      def show
        render json: {
          status: { code: 200 },
          data: user_response(current_user)
        }
      end
  
      private
  
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
