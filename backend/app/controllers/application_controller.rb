class ApplicationController < ActionController::API
  include ActionController::RequestForgeryProtection
  include ActionController::Cookies
  # APIリクエストに対してはCSRF保護を無効にする
  protect_from_forgery with: :null_session
  before_action :set_csrf_cookie

  def not_found
    render json: { error: "Not Found" }, status: :not_found
  end

  private

  def set_csrf_cookie
    cookies['CSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end
end
