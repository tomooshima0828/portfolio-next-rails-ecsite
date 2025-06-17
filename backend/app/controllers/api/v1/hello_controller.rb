# frozen_string_literal: true

module Api
  module V1
    class HelloController < BaseController
      def index
        render json: { message: 'Hello from Rails API!' }
      end
    end
  end
end
