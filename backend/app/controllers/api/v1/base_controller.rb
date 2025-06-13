module Api
  module V1
    class BaseController < ApplicationController
      # APIではCSRF保護を無効化
      protect_from_forgery with: :null_session
      skip_before_action :verify_authenticity_token
    end
  end
end
