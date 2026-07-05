import React, { useState, useEffect } from 'react'
import { fetchMyEventBookings, fetchPayHereParams } from '../utils/api'
import Footer from '../components/Footer'
import { Calendar, Users, MapPin, CreditCard, Download, ExternalLink, PartyPopper, CheckCircle2, Clock, XCircle } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const STATUS_ICONS = {
    pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    confirmed: { icon: CheckCircle2, color: 'text-teal-500', bg: 'bg-teal-50' },
    completed: { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' },
    cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' }
}

const PAYMENT_STATUS = {
    pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100' },
    deposit_paid: { label: 'Advance Paid', color: 'text-orange-600', bg: 'bg-orange-100' },
    fully_paid: { label: 'Fully Paid', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    refunded: { label: 'Refunded', color: 'text-gray-600', bg: 'bg-gray-100' }
}

export default function MyEvents() {
  // Helper to handle payment completion
  const handleCompletePayment = async (booking) => {
    try {
      const params = await fetchPayHereParams(booking._id);
      // Build a form to submit to PayHere (or redirect if URL provided)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = params.payhereUrl || 'https://sandbox.payhere.lk/pay/checkout'; // fallback
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'payhereUrl') return; // skip URL key
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Failed to retrieve payment params', err);
      alert('Unable to start payment. Please try again later.');
    }
  };
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchMyEventBookings()
                setBookings(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const generateInvoice = (booking) => {
        const doc = new jsPDF()
        const logoUrl = 'https://res.cloudinary.com/dtdgufs9u/image/upload/v1772345832/ChatGPT_Image_Feb_13_2026_02_11_36_PM_jgcxnu.png'
        
        // Helper for colors
        const colors = {
            navy: [15, 23, 42],
            teal: [13, 148, 136],
            gray: [100, 116, 139],
            lightGray: [241, 245, 249]
        }

        const formatCurrency = (amount) => {
            return `Rs. ${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }

        const addContent = (imgData = null) => {
            // Header Background
            doc.setFillColor(...colors.navy)
            doc.rect(0, 0, 210, 50, 'F')
            
            // Logo
            if (imgData) {
                doc.addImage(imgData, 'PNG', 20, 10, 30, 30)
            } else {
                doc.setTextColor(255, 255, 255)
                doc.setFontSize(22)
                doc.setFont(undefined, 'bold')
                doc.text('DP', 25, 28)
            }
            
            // Resort Info
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(18)
            doc.setFont(undefined, 'bold')
            doc.text('DUTCH POINT RESORT', 60, 20)
            
            doc.setFontSize(9)
            doc.setFont(undefined, 'normal')
            doc.text([
                '111/1c Pitipana St, Negombo 11500, Sri Lanka',
                'Phone: 076 421 9211 | Email: dutchpointresort@gmail.com',
                'Web: www.dutchpointresort.com'
            ], 60, 28)

            // Invoice Title & Ref
            doc.setFontSize(24)
            doc.setFont(undefined, 'bold')
            doc.text('INVOICE', 190, 25, { align: 'right' })
            doc.setFontSize(10)
            doc.text(`REF: ${booking.bookingRef}`, 190, 32, { align: 'right' })
            doc.setFont(undefined, 'normal')
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 37, { align: 'right' })

            // Bill To & Event Details Section
            doc.setTextColor(...colors.navy)
            doc.setFontSize(11)
            doc.setFont(undefined, 'bold')
            doc.text('BILLED TO:', 20, 65)
            doc.text('EVENT DETAILS:', 110, 65)
            
            doc.setDrawColor(...colors.lightGray)
            doc.line(20, 68, 90, 68)
            doc.line(110, 68, 190, 68)

            doc.setFont(undefined, 'normal')
            doc.setFontSize(10)
            // Guest Info
            const guestName = `${booking.guestInfo?.firstName || ''} ${booking.guestInfo?.lastName || ''}`
            doc.text([
                guestName,
                booking.guestInfo?.email || '',
                booking.guestInfo?.phone || ''
            ], 20, 75)

            // Event Info
            doc.text([
                `Event Type: ${(booking.eventType || '').toUpperCase()}`,
                `Date: ${new Date(booking.eventDate).toLocaleDateString()}`,
                `Slot: ${(booking.timeSlot || '').toUpperCase()}`,
                `Guests: ${booking.guests || 0} People`
            ], 110, 75)

            // Table Calculation
            const decPrice = booking.decoration?.price || 0
            const pph = booking.foodPackage?.pricePerHead || 0
            const foodTotal = pph * (booking.guests || 0)
            
            const tableBody = [
                [
                    'Event Decoration', 
                    (booking.decoration?.name || 'Standard').toUpperCase(), 
                    '1', 
                    decPrice > 0 ? formatCurrency(decPrice) : 'Base'
                ],
                [
                    'Food Package', 
                    `${(booking.foodPackage?.name || 'Standard').toUpperCase()}\n(${formatCurrency(pph)} per head)`, 
                    (booking.guests || 0).toString(), 
                    formatCurrency(foodTotal)
                ],
            ]

            // Add addons
            if (booking.addons && booking.addons.length > 0) {
                booking.addons.forEach(addon => {
                    tableBody.push([addon.name, 'Add-on', '1', formatCurrency(addon.price)])
                })
            }

            autoTable(doc, {
                startY: 100,
                head: [['Description', 'Selection', 'Qty', 'Amount']],
                body: tableBody,
                theme: 'grid',
                headStyles: { 
                    fillColor: colors.navy,
                    textColor: [255, 255, 255],
                    fontSize: 10,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { cellWidth: 60 },
                    1: { cellWidth: 60 },
                    2: { cellWidth: 20, halign: 'center' },
                    3: { cellWidth: 40, halign: 'right' }
                },
                styles: { fontSize: 9, cellPadding: 5 }
            })

            const finalY = doc.lastAutoTable.finalY || 150

            // Financial Summary
            const summaryX = 130
            doc.setFontSize(10)
            doc.setFont(undefined, 'normal')
            doc.setTextColor(...colors.gray)
            
            doc.text('Total Amount:', summaryX, finalY + 15)
            doc.setTextColor(...colors.navy)
            doc.setFont(undefined, 'bold')
            doc.text(formatCurrency(booking.totalAmount), 190, finalY + 15, { align: 'right' })

            doc.setFont(undefined, 'normal')
            doc.setTextColor(...colors.gray)
            doc.text('Paid Amount:', summaryX, finalY + 22)
            doc.setTextColor(...colors.teal)
            doc.setFont(undefined, 'bold')
            doc.text(formatCurrency(booking.paidAmount), 190, finalY + 22, { align: 'right' })

            if (Number(booking.totalAmount) > Number(booking.paidAmount)) {
                doc.setDrawColor(...colors.navy)
                doc.setLineWidth(0.5)
                doc.line(summaryX, finalY + 26, 190, finalY + 26)
                
                doc.setFontSize(11)
                doc.setTextColor(220, 38, 38) // Red 600
                doc.text('Balance Due:', summaryX, finalY + 33)
                doc.text(formatCurrency(booking.totalAmount - booking.paidAmount), 190, finalY + 33, { align: 'right' })
            }


            // Payment Metadata
            doc.setFontSize(8)
            doc.setTextColor(...colors.gray)
            doc.setFont(undefined, 'normal')
            const paymentDetails = [
                `Payment Method: ${booking.paymentMethod?.toUpperCase() || 'CARD'}`,
                booking.paymentDetails?.transactionId ? `Transaction ID: ${booking.paymentDetails.transactionId}` : null
            ].filter(Boolean)
            doc.text(paymentDetails, 20, finalY + 15)

            // Terms & Conditions
            const footerY = 250
            doc.setDrawColor(...colors.lightGray)
            doc.line(20, footerY, 190, footerY)
            
            doc.setFontSize(8)
            doc.setTextColor(...colors.gray)
            doc.setFont(undefined, 'bold')
            doc.text('TERMS & CONDITIONS', 20, footerY + 8)
            doc.setFont(undefined, 'normal')
            const terms = [
                '1. This invoice is generated electronically and does not require a physical signature.',
                '2. All bookings are subject to availability and the resort\'s general terms and conditions.',
                '3. Advance payments are non-refundable unless stated otherwise in the cancellation policy.',
                '4. Please present a copy of this invoice (digital or print) upon arrival at the resort.'
            ]
            doc.text(terms, 20, footerY + 14)

            // Final Footer
            doc.setFontSize(10)
            doc.setTextColor(...colors.navy)
            doc.setFont(undefined, 'bold')
            doc.text('THANK YOU FOR YOUR BUSINESS!', 105, 285, { align: 'center' })

            doc.save(`Invoice_${booking.bookingRef}.pdf`)
        }

        // Try to load image first
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            const dataURL = canvas.toDataURL('image/png')
            addContent(dataURL)
        }
        img.onerror = () => {
            addContent(null)
        }
        img.src = logoUrl
    }

    return (
        <div className="min-h-screen bg-sand-50 flex flex-col">
            <div className="flex-grow pt-28 pb-20 max-w-5xl mx-auto w-full px-6">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-900/20">
                        <PartyPopper size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-navy-950 font-serif">My Event Bookings</h1>
                        <p className="text-navy-500 font-light mt-1">Manage your celebrations and download invoices</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-navy-50 shadow-sm">
                        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-navy-400 animate-pulse font-medium">Fetching your reservations...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
                        <XCircle size={48} className="mx-auto text-red-400 mb-4" />
                        <h3 className="text-xl font-bold text-red-900 mb-2">Failed to load bookings</h3>
                        <p className="text-red-600 font-light mb-6">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-red-700 transition-all">
                            Try Again
                        </button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border border-navy-50 shadow-sm">
                        <div className="w-24 h-24 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Calendar size={40} className="text-sand-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-navy-950 mb-3 font-serif">No Events Booked Yet</h3>
                        <p className="text-navy-400 max-w-sm mx-auto font-light leading-relaxed mb-10">
                            Your scheduled celebrations will appear here. Start by exploring our beautiful venues and packages.
                        </p>
                        <a href="/event-management" className="inline-flex items-center gap-3 px-8 py-4 bg-navy-950 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-navy-900 transition-all shadow-xl shadow-navy-950/20">
                            Start Booking <ExternalLink size={16} />
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map(booking => {
                            const Status = STATUS_ICONS[booking.status] || STATUS_ICONS.pending
                            const Payment = PAYMENT_STATUS[booking.paymentStatus] || PAYMENT_STATUS.pending
                            
                            return (
                                <div key={booking._id} className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-navy-50 shadow-xl shadow-navy-900/5 hover:shadow-2xl transition-all duration-300 group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Left: Status & Main Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${Status.bg} ${Status.color}`}>
                                                    <Status.icon size={12} /> {booking.status}
                                                </span>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${Payment.bg} ${Payment.color}`}>
                                                    <CreditCard size={12} /> {Payment.label}
                                                </span>
                                                <span className="text-[10px] font-mono text-navy-300 ml-auto bg-navy-50 px-2 py-1 rounded-lg">
                                                    {booking.bookingRef}
                                                </span>
                                            </div>

                                            <h3 className="text-3xl font-bold text-navy-950 mb-6 font-serif capitalize">
                                                {booking.eventType} Party
                                            </h3>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-sand-50 text-sand-600 rounded-xl"><Calendar size={18} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-0.5">Date & Slot</p>
                                                        <p className="text-sm font-bold text-navy-700">{new Date(booking.eventDate).toLocaleDateString()} · <span className="capitalize">{booking.timeSlot}</span></p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-sand-50 text-sand-600 rounded-xl"><Users size={18} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-0.5">Guest Count</p>
                                                        <p className="text-sm font-bold text-navy-700">{booking.guests} People</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-sand-50 text-sand-600 rounded-xl"><MapPin size={18} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-0.5">Decoration</p>
                                                        <p className="text-sm font-bold text-navy-700 capitalize">{booking.decoration?.name || booking.decoration || '—'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Financials & Action */}
                                        <div className="md:w-64 bg-navy-50 rounded-3xl p-6 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-navy-400 font-medium">Total Amount</span>
                                                    <span className="font-bold text-navy-900">Rs. {booking.totalAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-navy-400 font-medium">Paid</span>
                                                    <span className="font-bold text-emerald-600">Rs. {booking.paidAmount.toLocaleString()}</span>
                                                </div>
                                                {booking.totalAmount > booking.paidAmount && (
                                                    <div className="pt-2 border-t border-navy-100 flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Balance</span>
                                                        <span className="text-sm font-bold text-amber-600">Rs. {(booking.totalAmount - booking.paidAmount).toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button 
                                                onClick={() => generateInvoice(booking)}
                                                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-white text-navy-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-navy-900 hover:text-white transition-all shadow-sm border border-navy-100"
                                            >
                                                <Download size={14} /> Invoice
                                            </button>
                                            {booking.paymentStatus === 'pending' && (
                                            <button
                                                onClick={() => handleCompletePayment(booking)}
                                                className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:from-teal-600 hover:to-blue-700 transition-all shadow-lg"
                                            >
                                                Complete Payment
                                            </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {booking.addons.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-navy-50 flex flex-wrap gap-2">
                                            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest w-full mb-1">Extras Added:</span>
                                            {booking.addons.map((a, i) => (
                                                <span key={i} className="px-3 py-1 bg-navy-50 text-navy-600 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" /> {a.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
