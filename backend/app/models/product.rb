# frozen_string_literal: true

class Product < ApplicationRecord
  # URLヘルパーをモデル内で使えるようにする
  include Rails.application.routes.url_helpers
  belongs_to :category
  has_one_attached :main_image
  has_many :cart_items, dependent: :destroy

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :with_category, -> { includes(:category) }

  def main_image_url
    # 画像がアタッチされている場合のみ、そのURLを生成して返す
    return unless main_image.attached?

    # ActiveStorage::Current.url_optionsを設定してからURL生成
    begin
      if Rails.env.development?
        # 開発環境では明示的にホストとポートを設定
        ActiveStorage::Current.url_options = { host: 'localhost', port: 3001, protocol: 'http' }
      end

      Rails.application.routes.url_helpers.url_for(main_image)
    rescue StandardError => e
      # URL生成に失敗した場合はnilを返す
      Rails.logger.error "Failed to generate image URL: #{e.message}"
      nil
    end
  end
end
