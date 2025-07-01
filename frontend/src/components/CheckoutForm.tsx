'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

interface CheckoutFormProps {
  totalAmount: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function CheckoutForm({ totalAmount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        console.error('Stripe payment error:', error)
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'An error occurred during payment')
          onError?.(error.message || 'Payment failed')
        } else {
          setMessage('An unexpected error occurred')
          onError?.('An unexpected error occurred')
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        setMessage('Payment successful! Redirecting...')
        onSuccess?.()
        
        // Add payment intent ID to the success URL
        const successUrl = `/checkout/success?payment_intent=${paymentIntent.id}&redirect_status=succeeded`
        router.push(successUrl)
      } else {
        setMessage('Payment is being processed...')
      }
    } catch {
      setMessage('An unexpected error occurred')
      onError?.('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span className="font-bold text-lg">¥{Math.floor(totalAmount).toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
        
        {/* Test Card Information for Demo */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <p className="text-sm text-blue-900 mb-2">To perform an operation check, please enter the test card information for items #1 to #3 below. The other fields are optional.</p>
          <p className="text-sm text-blue-900 mb-2">動作確認のため、以下のテストカードの情報の#1から#3までを入力してください。その他の項目は必須ではありません。</p>
          <hr className="border-blue-300 my-3" />
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>#1. Card Number カード番号:</strong> <span className="text-red-600 font-mono">4242 4242 4242 4242</span></p>
            <p><strong>#2. Expiration Date 有効期限:</strong> Any future date 未来の日付 (e.g., <span className="text-red-600 font-mono">12/34</span>)</p>
            <p><strong>#3. Security code セキュリティコード:</strong> Any 3 digits 3桁の数字 (e.g., <span className="text-red-600 font-mono">123</span>)</p>
          </div>
          <hr className="border-blue-300 my-3" />
          <p className="text-xs text-blue-600 mt-2">
            This is a Stripe test environment. No real payments will be processed.
          </p>
        </div>
        
        <PaymentElement />
      </div>

      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('successful') 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          `Pay ¥${Math.floor(totalAmount).toLocaleString()}`
        )}
      </button>
    </form>
  )
}