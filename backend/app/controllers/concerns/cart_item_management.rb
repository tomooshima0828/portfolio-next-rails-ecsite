# frozen_string_literal: true

module CartItemManagement
  extend ActiveSupport::Concern

  private

  def add_or_update_cart_item(product, quantity)
    existing_item = current_user.cart_items.find_by(product: product)

    if existing_item
      update_existing_cart_item(existing_item, quantity, product)
    else
      create_new_cart_item(product, quantity)
    end
  end

  def update_existing_cart_item(existing_item, quantity, product)
    new_quantity = existing_item.quantity + quantity

    if new_quantity > product.stock
      existing_item.errors.add(:quantity, 'The quantity exceeds the stock')
      return existing_item
    end

    existing_item.update(quantity: new_quantity)
    existing_item
  end

  def create_new_cart_item(product, quantity)
    cart_item = current_user.cart_items.build(product: product, quantity: quantity)
    cart_item.save
    cart_item
  end

  def render_cart_item_success(cart_item)
    render json: {
      status: { code: 201, message: 'Item added to cart' },
      cart_item: cart_item_response(cart_item),
      total: current_user.cart_total,
      items_count: current_user.cart_items_count
    }, status: :created
  end

  def render_cart_item_errors(cart_item)
    render json: {
      status: { code: 422, message: 'Failed to add item to cart' },
      errors: cart_item.errors.full_messages
    }, status: :unprocessable_entity
  end

  def cart_item_response(cart_item)
    {
      id: cart_item.id,
      quantity: cart_item.quantity,
      subtotal: cart_item.subtotal,
      product: {
        id: cart_item.product.id,
        name: cart_item.product.name,
        price: cart_item.product.price,
        stock: cart_item.product.stock,
        main_image_url: cart_item.product.main_image_url,
        category: {
          id: cart_item.product.category.id,
          name: cart_item.product.category.name
        }
      },
      created_at: cart_item.created_at,
      updated_at: cart_item.updated_at
    }
  end
end
