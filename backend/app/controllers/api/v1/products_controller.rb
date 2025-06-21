class Api::V1::ProductsController < Api::V1::BaseController
  skip_before_action :authenticate_user!, only: [:index, :show]

  # GET /api/v1/products
  def index
    @products = Product.with_category

    # カテゴリでフィルタリング
    if params[:category_id].present?
      @products = @products.where(category_id: params[:category_id])
    end

    # ページネーション
    @products = @products.page(params[:page] || 1).per(params[:per_page] || 10)

    render json: {
      products: @products.as_json(include: :category),
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
    render json: @product.as_json(include: :category)
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Product not found' }, status: :not_found
  end
end
