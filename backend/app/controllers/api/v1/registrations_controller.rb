module Api
  module V1
    class RegistrationsController < Api::V1::BaseController
      # ユーザー登録
      def create
        user = User.new(user_params)
        user.jti = SecureRandom.uuid # JTIを生成
    
        if user.save
          sign_in(user)
          # devise-jwtが自動的にJWTトークンを生成するので、それを取得
          token = request.env['warden-jwt_auth.token']
      
          render json: {
            status: { code: 200, message: 'ユーザー登録が完了しました' },
            data: user_response(user),
            token: token
          }
        else
          render json: {
            status: { code: 422, message: 'ユーザー登録に失敗しました' },
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  
    private
  
    def user_params
      params.require(:user)
            .permit(
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
      }
    end
  end
end
