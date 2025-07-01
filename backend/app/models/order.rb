# frozen_string_literal: true

class Order < ApplicationRecord
  # アソシエーション
  belongs_to :user

  # enumでステータスを定義
  enum :status, {
    pending: 'pending',
    processing: 'processing',
    paid: 'paid',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
    refunded: 'refunded'
  }

  # バリデーション
  validates :total_amount, presence: true, numericality: { greater_than: 0 }
  validates :status, presence: true
  validates :stripe_payment_intent_id, uniqueness: true, allow_nil: true

  # スコープ
  scope :paid_orders, -> { where(status: 'paid') }
  scope :recent, -> { order(created_at: :desc) }

  # メソッド
  def payment_completed?
    paid? || delivered? || shipped?
  end

  def can_be_cancelled?
    pending? || processing?
  end
end
