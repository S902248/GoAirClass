import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, ShieldCheck, ChevronRight, CheckCircle2, Train, Calendar, Info, Loader2, Timer } from 'lucide-react';
import trainApi from '../api/trainApi';
import { toast } from 'react-toastify';

const TrainPayment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [activeMethod, setActiveMethod] = useState('UPI');
    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    const booking = state?.booking;
    const lockExpiresAt = state?.lockExpiresAt;
    const totalFare = booking?.totalFare || 0;

    // ─── Countdown Timer ───────────────────────────────────────────────────
    useEffect(() => {
        if (!lockExpiresAt) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(lockExpiresAt).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft('EXPIRED');
                toast.error("Reservation expired! Please restart booking.");
            } else {
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lockExpiresAt]);

    useEffect(() => {
        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        }
    }, []);

    const handlePay = async () => {
        if (timeLeft === 'EXPIRED') {
            return toast.error("Reservation expired. Cannot proceed with payment.");
        }

        setIsProcessing(true);
        try {
            // 1. Create Order on Backend
            const orderRes = await trainApi.createTrainPaymentOrder({
                amount: totalFare,
                bookingId: booking?._id
            });

            if (!orderRes.success) {
                throw new Error(orderRes.message || 'Failed to initialize payment');
            }

            // 2. Open Razorpay Checkout
            const options = {
                key: orderRes.key,
                amount: orderRes.amount,
                currency: orderRes.currency,
                name: "GoAirClass Trains",
                description: `Payment for PNR: ${booking?.pnr}`,
                order_id: orderRes.orderId,
                handler: async (response) => {
                    try {
                        // 3. Confirm Booking & Verify Payment on Backend
                        const verifyRes = await trainApi.confirmTrainBooking({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId: booking?._id
                        });

                        if (verifyRes.success) {
                            toast.success("Booking Confirmed Successfully!");
                            navigate(`/train-success/${verifyRes.booking._id}`);
                        } else {
                            toast.error(verifyRes.message || "Confirmation failed");
                        }
                    } catch (err) {
                        console.error('Confirmation Error:', err);
                        toast.error("Error confirming booking");
                    }
                },
                prefill: {
                    name: booking?.customerName,
                    email: booking?.contactDetails?.email,
                    contact: booking?.contactDetails?.phone
                },
                theme: {
                    color: "#d84e55"
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Payment Error:', error);
            toast.error(error.message || "Something went wrong with the payment");
            setIsProcessing(false);
        }
    };

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F2F5F9]">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-deep-navy mb-4">No Booking Found</h2>
                    <button onClick={() => navigate('/trains')} className="bg-[#d84e55] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs">Return to Search</button>
                </div>
            </div>
        );
    }

    const paymentMethods = [
        { id: 'UPI', name: 'UPI / Google Pay / PhonePe', icon: <Smartphone className="h-5 w-5" /> },
        { id: 'CARD', name: 'Credit / Debit Card', icon: <CreditCard className="h-5 w-5" /> },
        { id: 'NET', name: 'Net Banking', icon: <Building2 className="h-5 w-5" /> }
    ];

    return (
        <div className="min-h-screen bg-[#F2F5F9] pt-24 pb-12 font-inter">
            <div className="max-w-4xl mx-auto px-8">
                {/* Header & Timer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-green-600">
                            <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-xs">✓</div>
                            <span className="text-xs font-black uppercase tracking-widest">Details</span>
                        </div>
                        <div className="h-px w-8 bg-green-600" />
                        <div className="flex items-center gap-2 text-[#d84e55]">
                            <div className="h-8 w-8 rounded-full bg-[#d84e55] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-red-200">2</div>
                            <span className="text-xs font-black uppercase tracking-widest">Payment</span>
                        </div>
                    </div>

                    {timeLeft && (
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 animate-pulse ${timeLeft === 'EXPIRED' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
                            <Timer className="h-5 w-5" />
                            <div className="text-xs font-black uppercase tracking-[0.1em]">
                                {timeLeft === 'EXPIRED' ? 'Reservation Expired' : `Seats Reserved for: ${timeLeft}`}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Summary Mini Card */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-[#d84e55]">
                                    <Train className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-deep-navy uppercase tracking-tight">PNR: {booking.pnr}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{booking.journeyDate}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Allocated Seats</div>
                                <div className="flex gap-1">
                                    {booking.allocatedSeats?.map((s, i) => (
                                        <span key={i} className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded-lg">{s.coachNumber}-{s.seatNumber}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-deep-navy tracking-tight mb-8">Payment Methods</h3>

                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => timeLeft !== 'EXPIRED' && setActiveMethod(method.id)}
                                        className={`flex items-center justify-between p-6 rounded-[24px] border-2 transition-all cursor-pointer group ${timeLeft === 'EXPIRED' ? 'opacity-50 cursor-not-allowed' : activeMethod === method.id ? 'border-[#d84e55] bg-red-50/10' : 'border-gray-50 hover:border-red-100 bg-gray-50/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${activeMethod === method.id ? 'bg-[#d84e55] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-[#d84e55]'
                                                }`}>
                                                {method.icon}
                                            </div>
                                            <span className={`font-black text-sm uppercase tracking-widest ${activeMethod === method.id ? 'text-deep-navy' : 'text-gray-400'}`}>
                                                {method.name}
                                            </span>
                                        </div>
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${activeMethod === method.id ? 'border-[#d84e55] bg-[#d84e55]' : 'border-gray-200 group-hover:border-red-200'
                                            }`}>
                                            {activeMethod === method.id && <CheckCircle2 className="h-4 w-4 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 sticky top-32">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Final Summary</h4>
                                <div className="flex justify-between">
                                    <span className="text-sm font-bold text-gray-500">Total Fare</span>
                                    <span className="text-sm font-black text-deep-navy">₹{totalFare.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-bold text-gray-500">Service Fee</span>
                                    <span className="text-sm font-black text-green-600">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between">
                                    <span className="text-lg font-black text-deep-navy uppercase tracking-widest">Payable</span>
                                    <span className="text-2xl font-black text-[#d84e55]">₹{totalFare.toLocaleString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={handlePay}
                                disabled={isProcessing || timeLeft === 'EXPIRED'}
                                className="w-full bg-[#d84e55] text-white rounded-2xl py-6 mt-8 font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-200/60 hover:bg-[#c13e44] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Confirming...</span>
                                    </>
                                ) : (
                                    <span>Pay Securely</span>
                                )}
                            </button>
                            {timeLeft === 'EXPIRED' && (
                                <p className="mt-4 text-[10px] font-black text-red-500 text-center uppercase tracking-widest">Session Expired - Please re-book</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainPayment;
