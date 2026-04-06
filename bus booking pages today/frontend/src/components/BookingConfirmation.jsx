import React, { useMemo } from 'react';
import { CheckCircle, Download, Share2, RotateCcw, MapPin, Clock, Users, CreditCard, CalendarDays, ArrowRight, Phone } from 'lucide-react';

const BookingConfirmation = ({ bus, seats, boarding, dropping, searchParams, paymentInfo, setView }) => {
    const randomFallbackId = useMemo(() => 'RB' + Math.random().toString(36).substr(2, 8).toUpperCase(), []);
    const bookingId = paymentInfo?.bookingId || randomFallbackId;

    const total = paymentInfo?.total ?? seats?.reduce((a, s) => a + (s?.price || 850), 0) ?? 0;
    const baseFare = paymentInfo?.baseFare ?? total;
    const gst = paymentInfo?.gst ?? 0;

    return (
        <div className="min-h-screen bg-[#F7F8F9] font-sans pt-28 pb-20">
            <div className="max-w-[780px] mx-auto px-4">
                {/* Success Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 mb-4 animate-in zoom-in-75 duration-500">
                        <CheckCircle className="h-10 w-10 text-emerald-500 stroke-[1.5]" />
                    </div>
                    <h1 className="text-[32px] font-black text-gray-900 tracking-tight">Booking Confirmed!</h1>
                    <p className="text-[15px] font-semibold text-gray-500 mt-2">Your ticket has been booked successfully. Have a great trip!</p>
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-5 py-2.5 rounded-full mt-4">
                        <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest">Booking ID</span>
                        <span className="text-[15px] font-black text-emerald-800">{bookingId}</span>
                    </div>
                </div>

                {/* Ticket Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Top Bar */}
                    <div className="bg-gradient-to-r from-[#D84E55] to-[#c14b52] px-8 py-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-70">Bus Operator</p>
                                <h2 className="text-[22px] font-black mt-0.5">{bus?.name || 'Express Bus'}</h2>
                                <p className="text-[13px] font-semibold opacity-70 mt-0.5">{bus?.type || 'A/C Seater'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-70">Journey Date</p>
                                <p className="text-[18px] font-black mt-0.5">{searchParams?.date || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Route info */}
                    <div className="px-8 py-6 border-b border-dashed border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">From</p>
                                <p className="text-[18px] font-black text-gray-900">{bus?.departurePoint || searchParams?.fromCity || 'Origin'}</p>
                                <p className="text-[13px] font-bold text-gray-500 mt-0.5">{bus?.departure || '--:--'}</p>
                                <p className="text-[11px] font-semibold text-gray-400 mt-1 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {boarding?.location || 'As per boarding point'}
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <div className="h-px w-16 bg-gray-200" />
                                    <ArrowRight className="h-4 w-4" />
                                    <div className="h-px w-16 bg-gray-200" />
                                </div>
                                {bus?.duration && (
                                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {bus.duration}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">To</p>
                                <p className="text-[18px] font-black text-gray-900">{bus?.arrivalPoint || searchParams?.toCity || 'Destination'}</p>
                                <p className="text-[13px] font-bold text-gray-500 mt-0.5">{bus?.arrival || '--:--'}</p>
                                <p className="text-[11px] font-semibold text-gray-400 mt-1 flex items-center gap-1 justify-end">
                                    <MapPin className="h-3 w-3" /> {dropping?.location || 'As per dropping point'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Seat & Passenger */}
                    <div className="px-8 py-6 border-b border-dashed border-gray-200 grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Seats Booked</p>
                            <div className="flex flex-wrap gap-2">
                                {seats?.map((s, i) => (
                                    <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[12px] font-black px-3 py-1 rounded-lg">
                                        {s?.label || `S${i + 1}`} • {s?.deck === 'upper' ? 'Upper' : 'Lower'}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Passenger</p>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#D84E55]" />
                                <span className="text-[16px] font-black text-gray-800 uppercase tracking-wide">
                                    {paymentInfo?.passengerName || JSON.parse(localStorage.getItem('userData') || '{}')?.name || 'Guest'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Passengers</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[16px] font-black text-gray-800">{seats?.length || 1} Person{(seats?.length || 1) > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Fare Breakup */}
                    <div className="px-8 py-6 border-b border-dashed border-gray-200">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Fare Details</p>
                        <div className="space-y-2.5">
                            <div className="flex justify-between text-[13px]">
                                <span className="font-semibold text-gray-500">Base Fare</span>
                                <span className="font-bold text-gray-700">₹{baseFare}</span>
                            </div>
                            <div className="flex justify-between text-[13px]">
                                <span className="font-semibold text-gray-500">GST (5%)</span>
                                <span className="font-bold text-gray-700">₹{gst}</span>
                            </div>
                            {paymentInfo?.couponApplied && (
                                <div className="flex justify-between text-[13px]">
                                    <span className="font-semibold text-emerald-600">Coupon: {paymentInfo.couponCode}</span>
                                    <span className="font-bold text-emerald-600">-₹{paymentInfo.discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <span className="text-[15px] font-black text-gray-900">Amount Paid</span>
                                <span className="text-[20px] font-black text-gray-900">₹{total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment info bottom */}
                    <div className="px-8 py-5 bg-gray-50/60 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-[13px] font-bold text-gray-500">
                            <CreditCard className="h-4 w-4" /> Payment Successful
                        </div>
                        <div className="flex items-center gap-2.5 text-[13px] font-bold text-gray-500">
                            <CalendarDays className="h-4 w-4" /> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button 
                        onClick={() => setView(`ticket/${bookingId}`)}
                        className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-white border border-gray-200 rounded-2xl font-black text-[14px] text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:border-gray-300 active:scale-95"
                    >
                        <Download className="h-5 w-5" /> Get E-Ticket
                    </button>
                    <button 
                        onClick={() => setView(`ticket/${bookingId}`)}
                        className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-white border border-gray-200 rounded-2xl font-black text-[14px] text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:border-gray-300 active:scale-95"
                    >
                        <Share2 className="h-5 w-5" /> Share Ticket
                    </button>
                    <button
                        onClick={() => setView('/')}
                        className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-[#D84E55] hover:bg-[#C13E44] rounded-2xl font-black text-[14px] text-white transition-all shadow-xl shadow-red-500/20 active:scale-95"
                    >
                        <RotateCcw className="h-5 w-5" /> Book Another
                    </button>
                </div>

                {/* Support info */}
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex items-center gap-4">
                    <div className="bg-blue-100 p-2.5 rounded-xl"><Phone className="h-5 w-5 text-blue-600" /></div>
                    <div>
                        <p className="text-[13px] font-black text-blue-800">Need help with your booking?</p>
                        <p className="text-[12px] font-semibold text-blue-600">Call us at 1800-102-7370 or chat with us</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
