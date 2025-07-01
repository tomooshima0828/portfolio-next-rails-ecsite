# frozen_string_literal: true

FactoryBot.define do
  factory :order do
    user
    status { 'pending' }
    total_amount { 1000 }
  end
end
