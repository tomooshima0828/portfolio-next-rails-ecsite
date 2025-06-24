# frozen_string_literal: true

FactoryBot.define do
  factory :product do
    name { 'MyString' }
    description { 'MyText' }
    price { '1000' }
    stock { 1 }
    category { association(:category) }
  end
end
