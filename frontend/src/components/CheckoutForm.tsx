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
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'An error occurred during payment')
          onError?.(error.message || 'Payment failed')
        } else {
          setMessage('An unexpected error occurred')
          onError?.('An unexpected error occurred')
        }
      } else {
        // Payment succeeded
        setMessage('Payment successful! Redirecting...')
        onSuccess?.()
        router.push('/checkout/success')
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
          <span className="font-bold text-lg">¥{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
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
          `Pay ¥${totalAmount.toLocaleString()}`
        )}
      </button>
    </form>
  )
}