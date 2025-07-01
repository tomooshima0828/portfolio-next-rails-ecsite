# frozen_string_literal: true

Rails.application.configure do
  # Stripe configuration
  config.stripe = {
    publishable_key: ENV.fetch('STRIPE_PUBLISHABLE_KEY', 'pk_test_placeholder'),
    secret_key: ENV.fetch('STRIPE_SECRET_KEY', 'sk_test_placeholder'),
    webhook_secret: ENV.fetch('STRIPE_WEBHOOK_SECRET', 'whsec_placeholder')
  }
end

# Set Stripe API key
Stripe.api_key = Rails.application.config.stripe[:secret_key]
