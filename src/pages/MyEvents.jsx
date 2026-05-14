import React, { useState, useEffect } from 'react'
import { fetchMyEventBookings } from '../utils/api'
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
        
        // Header
        doc.setFillColor(15, 23, 42) // Navy 950
        doc.rect(0, 0, 210, 40, 'F')
        
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(22)
        doc.text('DUTCH POINT RESORT', 20, 25)
        doc.setFontSize(10)
        doc.text('NEGOMBO, SRI LANKA', 20, 32)
        
        doc.setFontSize(20)
        doc.text('INVOICE', 150, 25)
        doc.setFontSize(10)
        doc.text(`Ref: ${booking.bookingRef}`, 150, 32)

        // Guest Info
        doc.setTextColor(15, 23, 42)
        doc.setFontSize(12)
        doc.setFont(undefined, 'bold')
        doc.text('Billed To:', 20, 60)
        doc.setFont(undefined, 'normal')
        doc.text(`${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`, 20, 67)
        doc.text(booking.guestInfo.email, 20, 73)
        if (booking.guestInfo.phone) doc.text(booking.guestInfo.phone, 20, 79)

        // Booking Info
        doc.setFont(undefined, 'bold')
        doc.text('Event Details:', 120, 60)
        doc.setFont(undefined, 'normal')
        doc.text(`Type: ${booking.eventType.toUpperCase()}`, 120, 67)
        doc.text(`Date: ${new Date(booking.eventDate).toLocaleDateString()}`, 120, 73)
        doc.text(`Slot: ${booking.timeSlot.toUpperCase()}`, 120, 79)

        // Table
        const tableData = [
            ['Description', 'Details', 'Amount'],
            ['Event Decoration', (booking.decoration?.name || booking.decoration || 'Standard').toUpperCase(), `Rs. ${booking.totalAmount.toLocaleString()}`], // This is a simplification, in real apps we'd store base price
            ['Food Package', (booking.foodPackage?.name || booking.foodPackage || 'Standard').toUpperCase(), 'Included'],
            ...booking.addons.map(a => [a.name, 'Add-on', `Rs. ${a.price.toLocaleString()}`])
        ]

        autoTable(doc, {
            startY: 95,
            head: [['Description', 'Category', 'Amount']],
            body: [
                ['Event Decoration', 'Decoration', 'Base Price'],
                ['Food Package', 'Catering', `Rs. ${booking.totalAmount.toLocaleString()}`], // Real logic would split this
                ...booking.addons.map(a => [a.name, 'Add-on', `Rs. ${a.price.toLocaleString()}`])
            ],
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }
        })

        const finalY = doc.lastAutoTable?.finalY || 150

        // Totals
        doc.setFont(undefined, 'bold')
        doc.text('Total Amount:', 140, finalY + 20)
        doc.text(`Rs. ${booking.totalAmount.toLocaleString()}`, 180, finalY + 20, { align: 'right' })
        
        doc.setTextColor(16, 185, 129) // Emerald 500
        doc.text('Amount Paid:', 140, finalY + 30)
        doc.text(`Rs. ${booking.paidAmount.toLocaleString()}`, 180, finalY + 30, { align: 'right' })

        if (booking.totalAmount > booking.paidAmount) {
            doc.setTextColor(245, 158, 11) // Amber 500
            doc.text('Balance Due:', 140, finalY + 40)
            doc.text(`Rs. ${(booking.totalAmount - booking.paidAmount).toLocaleString()}`, 180, finalY + 40, { align: 'right' })
        }

        // Footer
        doc.setTextColor(148, 163, 184)
        doc.setFontSize(8)
        doc.text('Thank you for choosing Dutch Point Resort. We look forward to hosting your event.', 105, 280, { align: 'center' })

        doc.save(`Invoice_${booking.bookingRef}.pdf`)
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
