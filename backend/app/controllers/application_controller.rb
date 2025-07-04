# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::RequestForgeryProtection
  include ActionController::Cookies
  # JSONリクエスト（API）に対してはCSRF保護をスキップする
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  before_action :set_csrf_cookie

  # Deviseの設定
  before_action :configure_permitted_parameters, if: :devise_controller?

  def not_found
    render json: { error: 'Not Found' }, status: :not_found
  end

  private

  def set_csrf_cookie
    cookies['CSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  # Deviseのパラメータ設定
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name address phone])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name address phone])
  end
end
