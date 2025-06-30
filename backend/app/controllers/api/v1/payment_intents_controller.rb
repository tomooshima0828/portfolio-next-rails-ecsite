class Api::V1::PaymentIntentsController < ApplicationController
  before_action :authenticate_user!

  def create
    begin
      # Calculate total amount from user's cart
      total_amount = calculate_cart_total
      
      if total_amount <= 0
        render json: { error: 'Cart is empty or invalid' }, status: :bad_request
        return
      end

      # Create PaymentIntent with Stripe
      payment_intent = Stripe::PaymentIntent.create(
        amount: total_amount.to_i,
        currency: 'jpy',
        automatic_payment_methods: {
          enabled: true
        },
        metadata: {
          user_id: current_user.id,
          cart_items_count: current_user.cart_items.count
        }
      )

      render json: {
        client_secret: payment_intent.client_secret,
        amount: total_amount,
        currency: 'jpy'
      }, status: :created

    rescue Stripe::StripeError => e
      Rails.logger.error "Stripe error: #{e.message}"
      render json: { error: 'Payment processing error' }, status: :unprocessable_entity
    rescue StandardError => e
      Rails.logger.error "Payment intent error: #{e.message}"
      render json: { error: 'Internal server error' }, status: :internal_server_error
    end
  end

  private

  def calculate_cart_total
    current_user.cart_total
  end
end
