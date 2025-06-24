# frozen_string_literal: true

module Api
  module V1
    class ProductsController < Api::V1::BaseController
      # TODO: ログイン機能実装後、createをonlyから削除する
      skip_before_action :authenticate_user!, only: %i[index show create]
      before_action :set_product, only: %i[show update destroy]

      # GET /api/v1/products
      def index
        @products = Product.with_category

        # カテゴリでフィルタリング
        @products = @products.where(category_id: params[:category_id]) if params[:category_id].present?

        # ページネーション
        @products = @products.page(params[:page] || 1).per(params[:per_page] || 10)

        render json: {
          products: @products.as_json(include: :category, methods: :main_image_url),
          meta: {
            current_page: @products.current_page,
            total_pages: @products.total_pages,
            total_count: @products.total_count
          }
        }
      end

      # GET /api/v1/products/:id
      def show
        @product = Product.with_category.find(params[:id])
        render json: @product.as_json(include: :category, methods: :main_image_url)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Product not found' }, status: :not_found
      end

      # POST /api/v1/products
      def create
        @product = Product.new(product_params)
        if @product.save
          render json: @product.as_json(include: :category, methods: :main_image_url), status: :created
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/products/:id
      def update
        if @product.update(product_params)
          render json: @product
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/products/:id
      def destroy
        @product.destroy
        head :no_content
      end

      private

      def set_product
        @product = Product.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Product not found' }, status: :not_found
      end

      def product_params
        params.require(:product).permit(
          :name,
          :description,
          :price,
          :stock,
          :category_id,
          :main_image
        )
      end
    end
  end
end
