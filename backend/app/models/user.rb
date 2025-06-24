# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  # JTIMatcherは、各ユーザーに一意のjti（JWT ID）を割り当て、トークンの無効化を可能にします
  include Devise::JWT::RevocationStrategies::JTIMatcher

  enum role: { general: 0, admin: 1 }

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  # バリデーション
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :address, presence: true
  validates :phone, presence: true

  # JWTトークンが有効かどうかを確認するメソッドで、payloadはトークンの内容を表す
  def jwt_payload
    {
      'jti' => jti, # JWT ID jtiはデータベースに保存され、トークンの有効性を検証するために使用されます
      'sub' => id, # 'sub' (Subject) user ID
      'scp' => 'user', # 'scp' (Scope) user トークンが持つ権限の範囲
      'aud' => 'client', # 'aud' (Audience) client
      'iat' => Time.now.to_i, # 'iat' (Issued At) issue time トークンが発行された時刻
      'role' => role # ユーザーの役割を追加
    }
  end
end
