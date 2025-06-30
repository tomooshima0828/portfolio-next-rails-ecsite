# frozen_string_literal: true

FactoryBot.define do
  factory :cart_item do
    user { nil }
    product { nil }
    quantity { 1 }
  end
end
