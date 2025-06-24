# frozen_string_literal: true

module Api
  module V1
    class CategoriesController < Api::V1::BaseController
      skip_before_action :authenticate_user!, only: [:index]

      # GET /api/v1/categories
      def index
        @categories = Category.all
        render json: @categories
      end
    end
  end
end
