# frozen_string_literal: true

module Api
  module V1
    class PaymentIntentsController < BaseController
      def create
        Rails.logger.info "PaymentIntent create - User: #{current_user&.id}"

        # Calculate total amount from user's cart
        total_amount = calculate_cart_total
        Rails.logger.info "PaymentIntent create - Total amount: #{total_amount}"

        if total_amount <= 0
          Rails.logger.warn "PaymentIntent create - Empty cart for user #{current_user&.id}"
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

        Rails.logger.info "PaymentIntent created successfully: #{payment_intent.id}"

        render json: {
          client_secret: payment_intent.client_secret,
          amount: total_amount,
          currency: 'jpy'
        }, status: :created
      rescue Stripe::StripeError => e
        Rails.logger.error "Stripe error: #{e.message}"
        Rails.logger.error "Stripe error details: #{e.backtrace.first(10)}"
        render json: { error: 'Payment processing error' }, status: :unprocessable_entity
      rescue StandardError => e
        Rails.logger.error "Payment intent error: #{e.message}"
        Rails.logger.error "Error details: #{e.backtrace.first(10)}"
        render json: { error: 'Internal server error' }, status: :internal_server_error
      end

      private

      def calculate_cart_total
        current_user.cart_total
      end
    end
  end
end
