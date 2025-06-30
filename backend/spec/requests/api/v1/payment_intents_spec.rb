require 'rails_helper'

RSpec.describe "Api::V1::PaymentIntents", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/api/v1/payment_intents/create"
      expect(response).to have_http_status(:success)
    end
  end

end
