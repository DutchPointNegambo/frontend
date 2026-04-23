import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { createOrder } from '../utils/api'

const Checkout = () => {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        guestInfo: formData,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.numericPrice,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: cartTotal,
        serviceCharge: cartTotal * 0.1,
        total: cartTotal * 1.1
      }

      const response = await createOrder(payload)
      
      if (response.success) {
        // Redirect to Stripe Checkout link provided by user
        window.location.href = "https://buy.stripe.com/test_3cIcN71o9gRw01Vb0H4Ja00"
      }
    } catch (err) {
      console.error('Error placing order:', err)
      setError('Failed to place order. Please try again.')
      setLoading(false)
    }
  }


  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingCart size={40} className="text-navy-300" />
          </div>
          <h1 className="text-3xl font-bold text-navy-950 mb-4">Your Cart is Empty</h1>
          <p className="text-navy-500 mb-10">
            Looks like you haven't added any items yet. Browse our menu and discover delicious dishes!
          </p>
          <Link
            to="/foods"
            className="inline-block px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-500/20"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-white pb-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-navy-600 hover:text-navy-950 transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-navy-950 mb-2">Checkout</h1>
        <p className="text-navy-500 mb-10">{cartCount} item{cartCount > 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Cart Items — Left */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-navy-100/50 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-navy-950">
                <h2 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <ShoppingCart size={16} />
                  Your Items
                </h2>
                <button
                  onClick={() => { clearCart(); }}
                  className="text-white/60 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-navy-50">
                {cartItems.map((item) => (
                  <div key={item.id} className="px-6 py-5 flex items-center gap-5 hover:bg-navy-50/30 transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-navy-950 truncate">{item.name}</h3>
                      <p className="text-teal-600 font-bold text-sm mt-1">
                        Rs. {item.numericPrice.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-navy-100 hover:bg-navy-200 flex items-center justify-center transition-colors"
                      >
                        <Minus size={14} className="text-navy-700" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-navy-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-navy-100 hover:bg-navy-200 flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} className="text-navy-700" />
                      </button>
                    </div>
                    <div className="text-right min-w-[70px]">
                      <p className="text-navy-950 font-bold">
                        Rs. {(item.numericPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <Link
              to="/foods"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary + Form — Right */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-navy-100/50 overflow-hidden">
              <div className="px-6 py-4 bg-navy-950">
                <h2 className="text-white font-bold text-sm uppercase tracking-widest">Order Summary</h2>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-navy-500">Subtotal ({cartCount} items)</span>
                  <span className="text-navy-950 font-bold">Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-navy-500">Service Charge (10%)</span>
                  <span className="text-navy-950 font-bold">Rs. {(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-navy-100 pt-3 flex justify-between">
                  <span className="text-navy-950 font-bold uppercase tracking-widest text-sm">Total</span>
                  <span className="text-xl font-bold text-teal-600">Rs. {(cartTotal * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Guest Details Form */}
            <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl shadow-sm border border-navy-100/50 overflow-hidden">
              <div className="px-6 py-4 bg-navy-950">
                <h2 className="text-white font-bold text-sm uppercase tracking-widest">Guest Details</h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-sm text-navy-950"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-sm text-navy-950"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-sm text-navy-950"
                    placeholder="07XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-1">Special Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-sm text-navy-950 resize-none"
                    placeholder="Any dietary requirements or allergies?"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Place Order — Rs. {(cartTotal * 1.1).toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
