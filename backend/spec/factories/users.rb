# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    email { Faker::Internet.unique.email }
    password { 'password123' }
    password_confirmation { 'password123' }
    # jtiカラムはdevise-jwtが自動で設定するため、通常ファクトリで明示的に設定する必要はありません。
    # もしテストで特定のjti値が必要な場合は、以下のように追加できます。
    # jti { SecureRandom.uuid }
  end
end
