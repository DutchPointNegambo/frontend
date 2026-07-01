import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, CreditCard, CheckCircle, Lock } from 'lucide-react'
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
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1) // 1: Guest Info, 2: Payment Info
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [cardErrors, setCardErrors] = useState({})

  // ── Card validation helpers (From Booking Modal) ─────────────────────────
  const luhnCheck = (num) => {
    const digits = num.replace(/\s/g, '')
    let sum = 0, alt = false
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10)
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0
  }

  const detectBrand = (num) => {
    const n = num.replace(/\s/g, '')
    if (/^4/.test(n)) return 'visa'
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard'
    if (/^3[47]/.test(n)) return 'amex'
    if (/^6(?:011|5)/.test(n)) return 'discover'
    return ''
  }

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  const validateCard = () => {
    const errs = {}
    const num = cardDetails.number.replace(/\s/g, '')
    if (!num || num.length < 13) errs.number = 'Card number is required'
    else if (!luhnCheck(num)) errs.number = 'Invalid card number'

    if (!cardDetails.expiry) errs.expiry = 'Expiry is required'
    else {
      const m = cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)
      if (!m) errs.expiry = 'Use MM/YY format'
      else {
        const expY = 2000 + parseInt(m[2], 10), expM = parseInt(m[1], 10), now = new Date()
        if (expY < now.getFullYear() || (expY === now.getFullYear() && expM < now.getMonth() + 1))
          errs.expiry = 'Card has expired'
      }
    }
    if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) errs.cvv = '3 or 4 digits'
    if (!cardDetails.name?.trim()) errs.name = 'Cardholder name is required'

    setCardErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateField = (name, value) => {
    let error = ''
    
    if (name === 'name') {
      if (!value.trim()) {
        error = 'Full name is required'
      } else if (value.trim().length < 3) {
        error = 'Name must be at least 3 characters'
      }
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        error = 'Email address is required'
      } else if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address'
      }
    }

    if (name === 'phone') {
      const phoneClean = value.replace(/\s/g, '')
      const phoneRegex = /^[0-9]{10}$/
      if (!value.trim()) {
        error = 'Phone number is required'
      } else if (!phoneRegex.test(phoneClean)) {
        error = 'Enter a valid number'
      }
    }

    setFormErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }

  const validateForm = () => {
    const nameValid = validateField('name', formData.name)
    const emailValid = validateField('email', formData.email)
    const phoneValid = validateField('phone', formData.phone)
    return nameValid && emailValid && phoneValid
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Prevent invalid characters in phone field
    if (name === 'phone') {
      const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }))
      validateField(name, sanitizedValue)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      validateField(name, value)
    }
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setStep(2)
      setError(null)
      window.scrollTo(0, 0)
    } else {
      setError('Please fix the errors in the form before proceeding.')
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    
    if (!validateCard()) {
      setError('Please check your card details.')
      return
    }

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
        total: cartTotal * 1.1,
        cardDetails: {
          ...cardDetails,
          number: cardDetails.number.replace(/\s/g, '')
        }
      }

      const response = await createOrder(payload)
      
      if (response.success) {
        clearCart()
        navigate(`/payment-success/${response.orderId}`)
      }
    } catch (err) {
      console.error('Error placing order:', err)
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
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
                    <div className="w-20 h-20 rounded-xl bg-navy-50 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                      {item.image && (item.image.startsWith('http') || item.image.startsWith('/')) ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">{item.image || '🍽️'}</span>
                      )}
                    </div>
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


          {/* Progress Indicator (Mobile) */}
          <div className="lg:hidden mb-6 flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${step === 1 ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-navy-50 text-navy-400'}`}>
              Guest Info
            </div>
            <div className="w-8 h-px bg-navy-100" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${step === 2 ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-navy-50 text-navy-400'}`}>
              Payment
            </div>
          </div>

          {/* Order Summary + Form — Right */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator (Desktop) */}
            <div className="hidden lg:flex items-center justify-center gap-4 mb-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${step === 1 ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-navy-100 text-navy-400'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${step === 1 ? 'border-white' : 'border-navy-200'}`}>1</span>
                Guest Info
              </div>
              <div className="w-8 h-px bg-navy-200" />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${step === 2 ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-navy-100 text-navy-400'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${step === 2 ? 'border-white' : 'border-navy-200'}`}>2</span>
                Payment
              </div>
            </div>

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

            {/* Multi-Step Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-navy-100/50 overflow-hidden">
              <div className="px-6 py-4 bg-navy-950">
                <h2 className="text-white font-bold text-sm uppercase tracking-widest">
                  {step === 1 ? 'Guest Details' : 'Secure Payment'}
                </h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                
                {step === 1 ? (
                  /* Step 1: Guest Details */
                  <form onSubmit={handleNextStep} className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-1 pl-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        maxLength={50}
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.name ? 'border-red-500' : 'border-navy-200'} focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-sm text-navy-950`}
                        placeholder="Your name"
                      />
                      {formErrors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1 pl-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-1 pl-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        maxLength={100}
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.email ? 'border-red-500' : 'border-navy-200'} focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-sm text-navy-950`}
                        placeholder="your@email.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1 pl-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-1 pl-1">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.phone ? 'border-red-500' : 'border-navy-200'} focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-sm text-navy-950`}
                        placeholder="07XXXXXXXX"
                      />
                      {formErrors.phone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1 pl-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-1 pl-1">Special Notes</label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-sm text-navy-900 resize-none"
                        placeholder="Any dietary requirements?"
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold uppercase tracking-widest">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-navy-950 text-white hover:bg-navy-900 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
                    >
                      Continue to Payment
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                ) : (
                  /* Step 2: Payment Details */
                  <form onSubmit={handlePlaceOrder} className="space-y-4 animate-fade-in">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1 pl-1">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            value={cardDetails.number}
                            onChange={e => {
                              setCardDetails(c => ({ ...c, number: formatCardNumber(e.target.value) }));
                              setCardErrors(e2 => ({ ...e2, number: undefined }));
                            }}
                            maxLength={19}
                            className={`w-full bg-navy-50 border rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 transition-all text-sm ${cardErrors.number ? 'border-red-300 focus:ring-red-400' : 'border-navy-100 focus:ring-teal-500/20'}`}
                          />
                          {detectBrand(cardDetails.number) && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-teal-600 uppercase">
                              {detectBrand(cardDetails.number)}
                            </span>
                          )}
                        </div>
                        {cardErrors.number && <p className="text-red-500 text-[10px] font-bold mt-1 pl-1">{cardErrors.number}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1 pl-1">Expiry</label>
                          <input 
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={e => {
                              setCardDetails(c => ({ ...c, expiry: formatExpiry(e.target.value) }));
                              setCardErrors(e2 => ({ ...e2, expiry: undefined }));
                            }}
                            maxLength={5}
                            className={`w-full bg-navy-50 border rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 transition-all text-sm ${cardErrors.expiry ? 'border-red-300 focus:ring-red-400' : 'border-navy-100 focus:ring-teal-500/20'}`}
                          />
                          {cardErrors.expiry && <p className="text-red-500 text-[10px] font-bold mt-1 pl-1">{cardErrors.expiry}</p>}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1 pl-1">CVV</label>
                          <input 
                            type="password"
                            placeholder="•••"
                            value={cardDetails.cvv}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                              setCardDetails(c => ({ ...c, cvv: v }));
                              setCardErrors(e2 => ({ ...e2, cvv: undefined }));
                            }}
                            maxLength={4}
                            className={`w-full bg-navy-50 border rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 transition-all text-sm ${cardErrors.cvv ? 'border-red-300 focus:ring-red-400' : 'border-navy-100 focus:ring-teal-500/20'}`}
                          />
                          {cardErrors.cvv && <p className="text-red-500 text-[10px] font-bold mt-1 pl-1">{cardErrors.cvv}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1 pl-1">Cardholder Name</label>
                        <input 
                          type="text"
                          placeholder="JANE SMITH"
                          value={cardDetails.name}
                          onChange={e => {
                            setCardDetails(c => ({ ...c, name: e.target.value.toUpperCase() }));
                            setCardErrors(e2 => ({ ...e2, name: undefined }));
                          }}
                          className={`w-full bg-navy-50 border rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 transition-all text-sm ${cardErrors.name ? 'border-red-300 focus:ring-red-400' : 'border-navy-100 focus:ring-teal-500/20'}`}
                        />
                        {cardErrors.name && <p className="text-red-500 text-[10px] font-bold mt-1 pl-1">{cardErrors.name}</p>}
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] text-navy-400 flex items-center gap-1.5 mb-4 pl-1">
                        <Lock size={10} /> Secure validation for Dutch Point Resort.
                      </p>

                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold uppercase tracking-widest mb-4">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 py-4 rounded-xl text-sm font-bold uppercase tracking-widest border border-navy-100 text-navy-600 hover:bg-navy-50 transition-all"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-[2] py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Paying...
                            </>
                          ) : (
                            <>
                              <CreditCard size={16} />
                              Pay Rs. {(cartTotal * 1.1).toFixed(2)}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Checkout
