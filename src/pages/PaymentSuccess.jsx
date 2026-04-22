import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, ShoppingBag, ArrowRight, Mail } from 'lucide-react'
import { confirmOrderPayment } from '../utils/api'

const PaymentSuccess = () => {
  const { orderId } = useParams()
  const [status, setStatus] = useState('processing') // processing, success, error

  useEffect(() => {
    const confirm = async () => {
      try {
        await confirmOrderPayment(orderId)
        setStatus('success')
      } catch (err) {
        console.error('Error confirming payment:', err)
        setStatus('error')
      }
    }

    if (orderId) {
      confirm()
    }
  }, [orderId])

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center px-4 pt-20 pb-10">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg, #0f2942, #1a4a72)' }}>
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            {status === 'success' ? (
              <CheckCircle size={48} className="text-teal-400 animate-bounce-subtle" />
            ) : status === 'error' ? (
              <span className="text-4xl">⚠️</span>
            ) : (
              <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {status === 'success' ? 'Payment Successful!' : status === 'error' ? 'Something went wrong' : 'Confirming Payment...'}
          </h1>
          <p className="text-white/70">
            {status === 'success' 
              ? 'Thank you for your order. We have received your payment.' 
              : status === 'error' 
                ? 'We could not confirm your payment automatically. Please contact support.' 
                : 'Please wait while we finalize your order...'}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {status === 'success' && (
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex items-start gap-4 animate-fade-in-up">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-navy-950 text-sm">Email Sent!</h3>
                <p className="text-navy-600 text-xs mt-1">
                  A confirmation email has been sent to your registered email address with your order details.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/foods"
              className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-navy-950 text-white hover:bg-navy-900 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Order More Food
            </Link>
            <Link
              to="/"
              className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest border border-navy-100 text-navy-600 hover:bg-navy-50 transition-all flex items-center justify-center gap-2"
            >
              Go to Home
              <ArrowRight size={18} />
            </Link>
          </div>

          <p className="text-center text-navy-300 text-[10px] uppercase tracking-widest font-bold">
            Order ID: {orderId}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
