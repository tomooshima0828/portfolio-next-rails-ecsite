# frozen_string_literal: true

class Product < ApplicationRecord
  # URLヘルパーをモデル内で使えるようにする
  include Rails.application.routes.url_helpers
  belongs_to :category
  has_one_attached :main_image

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :with_category, -> { includes(:category) }

  def main_image_url
    # 画像がアタッチされている場合のみ、そのURLを生成して返す
    return unless main_image.attached?

    # ホスト名を含む完全なURLを生成する
    Rails.application.routes.url_helpers.url_for(main_image)
  end
end
