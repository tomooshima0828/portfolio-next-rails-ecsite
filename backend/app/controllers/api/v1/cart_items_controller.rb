# frozen_string_literal: true

module Api
  module V1
    class CartItemsController < BaseController
      include CartItemManagement

      before_action :set_cart_item, only: %i[show update destroy]

      # GET /api/v1/cart_items
      def index
        cart_items = current_user.cart_items.includes(:product)

        render json: {
          cart_items: cart_items.map { |item| cart_item_response(item) },
          total: current_user.cart_total,
          items_count: current_user.cart_items_count
        }
      end

      # GET /api/v1/cart_items/:id
      def show
        render json: {
          cart_item: cart_item_response(@cart_item)
        }
      end

      # POST /api/v1/cart_items
      def create
        product = Product.find(cart_item_params[:product_id])
        quantity = cart_item_params[:quantity].to_i

        cart_item = add_or_update_cart_item(product, quantity)

        if cart_item.persisted?
          render_cart_item_success(cart_item)
        else
          render_cart_item_errors(cart_item)
        end
      end

      # PATCH/PUT /api/v1/cart_items/:id
      def update
        if @cart_item.update(cart_item_params)
          render json: {
            status: { code: 200, message: 'カートを更新しました' },
            cart_item: cart_item_response(@cart_item),
            total: current_user.cart_total,
            items_count: current_user.cart_items_count
          }
        else
          render json: {
            status: { code: 422, message: 'カートの更新に失敗しました' },
            errors: @cart_item.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/cart_items/:id
      def destroy
        @cart_item.destroy!

        render json: {
          status: { code: 200, message: 'カートから削除しました' },
          total: current_user.cart_total,
          items_count: current_user.cart_items_count
        }
      end

      private

      def set_cart_item
        @cart_item = current_user.cart_items.find(params[:id])
      end

      def cart_item_params
        params.require(:cart_item).permit(:product_id, :quantity)
      end
    end
  end
end
