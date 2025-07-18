# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Webhooks' do
  describe 'GET /stripe' do
    it 'returns http success' do
      get '/api/v1/webhooks/stripe'
      expect(response).to have_http_status(:success)
    end
  end
end
