# frozen_string_literal: true

class CartItem < ApplicationRecord
  belongs_to :user
  belongs_to :product

  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :user_id, uniqueness: { scope: :product_id }
  validate :quantity_within_stock

  scope :for_user, ->(user) { where(user: user) }

  def subtotal
    quantity * product.price
  end

  private

  def quantity_within_stock
    return unless product && quantity

    errors.add(:quantity, '在庫数を超えています') if quantity > product.stock
  end
end
