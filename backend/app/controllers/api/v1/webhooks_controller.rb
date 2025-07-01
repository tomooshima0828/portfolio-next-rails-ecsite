# frozen_string_literal: true

module Api
  module V1
    class WebhooksController < ApplicationController
      # CSRF protection is not needed for webhooks
      skip_before_action :verify_authenticity_token

      def stripe
        payload = request.body.read
        sig_header = request.env['HTTP_STRIPE_SIGNATURE']
        endpoint_secret = Rails.application.config.stripe[:webhook_secret]

        begin
          event = Stripe::Webhook.construct_event(
            payload, sig_header, endpoint_secret
          )
        rescue JSON::ParserError => e
          Rails.logger.error "Invalid JSON: #{e.message}"
          render json: { error: 'Invalid JSON' }, status: :bad_request
          return
        rescue Stripe::SignatureVerificationError => e
          Rails.logger.error "Signature verification failed: #{e.message}"
          render json: { error: 'Invalid signature' }, status: :bad_request
          return
        end

        # Handle the event
        case event['type']
        when 'payment_intent.succeeded'
          handle_payment_success(event['data']['object'])
        when 'payment_intent.payment_failed'
          handle_payment_failure(event['data']['object'])
        else
          Rails.logger.info "Unhandled event type: #{event['type']}"
        end

        render json: { status: 'success' }, status: :ok
      end

      private

      def handle_payment_success(payment_intent)
        stripe_payment_intent_id = payment_intent['id']
        user_id = payment_intent['metadata']['user_id']

        Rails.logger.info "Payment succeeded for user #{user_id}, PaymentIntent: #{stripe_payment_intent_id}"

        # Find or create order
        user = User.find_by(id: user_id)
        return unless user

        # Create order from cart
        order = create_order_from_cart(user, stripe_payment_intent_id, payment_intent)

        if order.persisted?
          # Clear cart after successful payment
          user.cart_items.destroy_all
          Rails.logger.info "Order created successfully: #{order.id}"
        else
          Rails.logger.error "Failed to create order: #{order.errors.full_messages}"
        end
      end

      def handle_payment_failure(payment_intent)
        stripe_payment_intent_id = payment_intent['id']
        user_id = payment_intent['metadata']['user_id']

        Rails.logger.warn "Payment failed for user #{user_id}, PaymentIntent: #{stripe_payment_intent_id}"

        # Update order status if exists
        order = Order.find_by(stripe_payment_intent_id: stripe_payment_intent_id)
        order&.update(status: 'cancelled')
      end

      def create_order_from_cart(user, stripe_payment_intent_id, payment_intent)
        total_amount = payment_intent['amount'].to_f

        Order.create(
          user: user,
          total_amount: total_amount,
          status: 'paid',
          stripe_payment_intent_id: stripe_payment_intent_id
        )
      end
    end
  end
end
