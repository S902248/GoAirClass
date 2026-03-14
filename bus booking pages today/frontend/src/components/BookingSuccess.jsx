import React, { useEffect, useState } from 'react';
import { CheckCircle2, QrCode, Download, Share2, Home, Calendar, Clock, MapPin, Bus } from 'lucide-react';

const BookingSuccess = ({ bus, seats, setView }) => {

    // Auto-scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [bookingId] = useState(() => "GAC" + Math.random().toString(36).substr(2, 9).toUpperCase());

    // Safety check for page reload (if state is lost)
    if (!bus && (!seats || seats.length === 0)) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-[#f3f4f9] flex flex-col items-center justify-center px-4 text-center">
                <div className="bg-white p-12 rounded-[40px] shadow-xl max-w-md w-full">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black text-deep-navy mb-4">Confirmed!</h2>
                    <p className="text-gray-500 mb-8 font-bold text-sm">Your booking has been successfully processed. An e-ticket has been sent to your email.</p>

                    <div className="mb-10 inline-block px-6 py-2 bg-gray-50 rounded-full border border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Booking ID:</span>
                        <span className="text-[10px] font-black text-deep-navy uppercase tracking-widest">{bookingId}</span>
                    </div>

                    <button
                        onClick={() => setView('landing')}
                        className="w-full bg-deep-navy text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-black/10"
                    >
                        <Home className="h-4 w-4" /> Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#f3f4f9] flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">

                {/* Success Animation Area */}
                <div className="bg-white rounded-t-[40px] p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>

                    <h2 className="text-3xl font-black text-deep-navy mb-2">Booking Confirmed!</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Ticket details sent to your email</p>

                    <div className="mt-8 inline-block px-6 py-2 bg-gray-50 rounded-full border border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Booking ID:</span>
                        <span className="text-[10px] font-black text-deep-navy uppercase tracking-widest">{bookingId}</span>
                    </div>
                </div>

                {/* Ticket Details */}
                <div className="bg-white border-y-2 border-dashed border-gray-100 px-12 py-10">
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-gray-300 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Route</p>
                                    <p className="text-sm font-bold text-deep-navy">Pune to Mumbai</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Calendar className="h-5 w-5 text-gray-300 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-deep-navy">20 Feb, 2026</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Bus className="h-5 w-5 text-gray-300 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Seats</p>
                                    <p className="text-sm font-bold text-deep-navy">{seats.join(', ')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock className="h-5 w-5 text-gray-300 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Departure</p>
                                    <p className="text-sm font-bold text-deep-navy">{bus?.departure || '22:30'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-8 bg-gray-50 rounded-3xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Scan at boarding</p>
                            <div className="flex items-center gap-4 text-deep-navy">
                                <QrCode className="h-12 w-12" />
                                <div className="text-[10px] font-bold leading-relaxed opacity-50 uppercase tracking-tighter">
                                    Show this QR to the <br /> conductor upon entry
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Paid</p>
                            <p className="text-3xl font-black text-deep-navy">₹{(seats.length * (bus?.price || 1000)) + 45}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-b-[40px] p-12 pt-8">
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-4 border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-deep-navy hover:bg-gray-50 transition-all">
                            <Download className="h-4 w-4" /> Download Ticket
                        </button>
                        <button className="flex items-center justify-center gap-2 py-4 border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-deep-navy hover:bg-gray-50 transition-all">
                            <Share2 className="h-4 w-4" /> Share Trip
                        </button>
                    </div>

                    <button
                        onClick={() => setView('landing')}
                        className="w-full mt-6 bg-deep-navy text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-black/10"
                    >
                        <Home className="h-4 w-4" /> Back to Home
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BookingSuccess;
