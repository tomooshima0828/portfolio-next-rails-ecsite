'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading')
  
  const paymentIntent = searchParams.get('payment_intent')
  const redirectStatus = searchParams.get('redirect_status')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    // Check payment status
    if (redirectStatus === 'succeeded') {
      setPaymentStatus('success')
    } else if (redirectStatus === 'processing') {
      // Payment is still processing
      setPaymentStatus('loading')
      // You might want to poll for status updates here
    } else {
      setPaymentStatus('error')
    }
  }, [user, isLoading, router, redirectStatus])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {paymentStatus === 'loading' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="animate-spin h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
              <p className="text-gray-600 mb-6">
                Your payment is being processed. Please wait...
              </p>
            </>
          )}

          {paymentStatus === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed and will be processed shortly.
              </p>
              {paymentIntent && (
                <p className="text-sm text-gray-500 mb-6">
                  Payment ID: {paymentIntent}
                </p>
              )}
              <div className="space-y-3">
                <Link
                  href="/products"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/profile"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Orders
                </Link>
              </div>
            </>
          )}

          {paymentStatus === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h2>
              <p className="text-gray-600 mb-6">
                Unfortunately, your payment could not be processed. Please try again or contact support.
              </p>
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Try Again
                </Link>
                <Link
                  href="/cart"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Cart
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}