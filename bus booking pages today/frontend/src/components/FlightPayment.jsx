import React, { useState, useEffect } from 'react';
import {
    CreditCard, Smartphone, ShieldCheck,
    Lock, ArrowRight, CheckCircle2, Info
} from 'lucide-react';
import axios from '../api/Axios';

const FlightPayment = ({ flight, passengers, selectedSeats, contact, totalAmount, user, onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('razorpay');

    useEffect(() => {
        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    const handlePayment = async () => {
        try {
            setLoading(true);

            // 1. Create Booking in PENDING state
            const bookingPayload = {
                userId: (user?._id === 'guest' || !user?._id) ? null : user._id,
                flightId: flight._id,
                flightDetails: {
                    airline: flight.airlineId?.airlineName || flight.airlineName || 'Airline',
                    flightNumber: flight.flightNumber,
                    departureAirport: flight.fromAirport?.airportCode || flight.fromCode || 'DEP',
                    arrivalAirport: flight.toAirport?.airportCode || flight.toCode || 'ARR',
                    departureTime: flight.departureTime,
                    arrivalTime: flight.arrivalTime,
                    duration: flight.duration,
                    aircraft: flight.aircraftType
                },
                passengers: passengers.map(p => {
                    const seat = selectedSeats.find(s => s.passengerId === p.id);
                    return {
                        firstName: p.firstName,
                        lastName: p.lastName,
                        gender: p.gender,
                        dateOfBirth: p.dob,
                        seatNumber: seat?.seatNumber,
                        seatType: seat?.type,
                        seatPrice: Number(seat?.price) || 0
                    };
                }),
                contactDetails: {
                    email: contact.email,
                    phone: contact.mobile
                },
                travelDate: flight.departureTime,
                currency: 'INR',
                fareDetails: {
                    baseFare: flight.price * passengers.length,
                    taxes: Math.round(flight.price * passengers.length * 0.12),
                    seatFee: selectedSeats.reduce((acc, s) => acc + (Number(s.price) || 0), 0),
                    addons: 0,
                    discount: 0,
                    totalAmount: totalAmount
                }
            };

            const bookingRes = await axios.post('/flight-bookings/create', bookingPayload);
            const booking = bookingRes.data.booking;

            // 2. Create Razorpay Order
            const orderRes = await axios.post('/flight-payments/create-order', {
                amount: totalAmount,
                receipt: booking.bookingId
            });

            const order = orderRes.data.order;

            // 3. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_5Wf3Xf3Xf3Xf3X',
                amount: order.amount,
                currency: order.currency,
                name: 'Antigravity Flights',
                description: `Flight Booking ${booking.pnr}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        // 4. Verify Payment on Backend
                        const verifyRes = await axios.post('/flight-payments/verify', {
                            ...response,
                            bookingId: booking.bookingId
                        });

                        if (verifyRes.data.success) {
                            onComplete(booking);
                        }
                    } catch (err) {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: passengers[0] ? `${passengers[0].firstName} ${passengers[0].lastName}` : '',
                    email: contact.email || user?.email || '',
                    contact: contact.mobile || user?.mobile || ''
                },
                theme: { color: "#006ce4" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Payment initialization failed", err);
            alert("Failed to initialize payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <Lock className="w-6 h-6" />
                        <h2 className="font-black text-lg uppercase tracking-tight">Secure Payment</h2>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Payment Method</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setSelectedMethod('razorpay')}
                                    className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${selectedMethod === 'razorpay' ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-900/5' : 'border-gray-100 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-gray-900 uppercase">Razorpay Secure</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cards, UPI, Netbanking</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'razorpay' ? 'border-blue-600 bg-blue-600' : 'border-gray-200'}`}>
                                        {selectedMethod === 'razorpay' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Payment Rules</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="text-[11px] font-bold text-slate-600 leading-tight">Price locked for 15 minutes</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="text-[11px] font-bold text-slate-600 leading-tight">Instant PNR & Ticket generation</span>
                                </li>
                                <li className="flex gap-3">
                                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span className="text-[11px] font-bold text-slate-600 leading-tight">100% Secure PCI-DSS compliant checkout</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-10 bg-blue-50/50 rounded-[3rem] border border-blue-100 flex flex-col items-center gap-6">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2 font-black">Ready to Book?</p>
                            <h3 className="text-5xl font-black text-gray-900 tracking-tighter">₹{totalAmount.toLocaleString()}</h3>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className={`w-full max-w-sm py-5 ${loading ? 'bg-gray-400' : 'bg-[#f26a36] hover:bg-[#e05d2e]'} text-white rounded-3xl font-black text-lg uppercase tracking-widest transition-all shadow-2xl shadow-orange-200 flex items-center justify-center gap-4 group`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Lock className="w-6 h-6" />
                                    <span>Pay & Confirm</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightPayment;
