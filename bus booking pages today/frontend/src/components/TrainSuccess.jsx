import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    CheckCircle2, 
    Download, 
    MessageCircle, 
    ArrowLeft, 
    Train, 
    Calendar, 
    Clock, 
    MapPin, 
    User, 
    Hash,
    Share2,
    Ticket
} from 'lucide-react';
import trainApi from '../api/trainApi';
import { toast } from 'react-toastify';

const TrainSuccess = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await trainApi.getBookingDetails(bookingId);
                if (res.success) {
                    setBooking(res.booking);
                } else {
                    toast.error(res.message || "Failed to load booking details");
                }
            } catch (error) {
                console.error("Error fetching booking:", error);
                toast.error("An error occurred while fetching booking details");
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) fetchBooking();
    }, [bookingId]);

    const handleDownloadPDF = () => {
        if (!bookingId) return;
        const url = trainApi.getTicketPDFURL(bookingId);
        window.open(url, '_blank');
    };

    const handleWhatsAppShare = () => {
        if (!booking) return;
        const text = `Train Booking Confirmed! PNR: ${booking.pnr}, Train: ${booking.train.number} - ${booking.train.name}, Date: ${booking.journeyDate}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold animate-pulse">Confirming your journey...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center max-w-md px-6">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Hash size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Booking Not Found</h2>
                    <p className="text-slate-500 mb-8">We couldn't retrieve the details for this booking. Please check your account dashboard.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-[#d84e55] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#c13e44] transition-all">
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                {/* Success Header Area */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 shadow-xl shadow-green-100/50">
                        <CheckCircle2 className="text-green-600 w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Booking Confirmed!</h1>
                    <p className="text-slate-500 font-medium">Your tickets have been sent to <span className="text-slate-900 font-bold">{booking.contactDetails.email}</span></p>
                </div>

                {/* Main Ticket Card */}
                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    {/* Top Section - PNR & Status */}
                    <div className="bg-slate-900 p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-1">PNR NUMBER</p>
                            <h2 className="text-3xl font-black tracking-widest text-[#d84e55]">{booking.pnr}</h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">STATUS</p>
                                <p className="text-xs font-black text-green-400 uppercase tracking-widest">Confirmed</p>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">QUOTA</p>
                                <p className="text-xs font-black uppercase tracking-widest">{booking.quota || 'General'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section - Train Info */}
                    <div className="p-8 border-b border-dashed border-slate-200 relative">
                        {/* Decorative side cutouts */}
                        <div className="absolute -left-4 top-full -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full border border-slate-100 shadow-inner"></div>
                        <div className="absolute -right-4 top-full -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full border border-slate-100 shadow-inner"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-red-50 text-[#d84e55] rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Train size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 leading-tight">{booking.train.name}</h3>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Train #{booking.train.number}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                            {/* Source */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <MapPin size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Boarding</span>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900">{booking.source.name}</h4>
                                <p className="text-xs font-bold text-slate-500">{booking.source.code}</p>
                            </div>

                            {/* Journey Arrow */}
                            <div className="flex flex-col items-center gap-2 px-4 w-full md:w-auto">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{booking.journeyDate}</span>
                                <div className="h-px bg-slate-200 w-full min-w-[120px] relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-white border border-slate-100 rounded-full flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-[#d84e55] rounded-full"></div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 flex items-center gap-1">
                                    <Clock size={12} />
                                    16h 05m
                                </span>
                            </div>

                            {/* Destination */}
                            <div className="flex-1 text-left md:text-right">
                                <div className="flex items-center md:justify-end gap-2 text-slate-400 mb-2">
                                    <MapPin size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Arrival</span>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900">{booking.destination.name}</h4>
                                <p className="text-xs font-bold text-slate-500">{booking.destination.code}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section - Passengers */}
                    <div className="p-8 pb-10">
                        <div className="flex items-center gap-2 text-slate-400 mb-6">
                            <User size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Passenger details</span>
                        </div>

                        <div className="space-y-4">
                            {booking.passengers.map((p, idx) => (
                                <div key={idx} className="bg-slate-50 p-6 rounded-3xl flex flex-wrap justify-between items-center gap-4 border border-slate-100 shadow-sm transition-all hover:bg-slate-100/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h5 className="font-black text-slate-900">{p.name}</h5>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.age} Yrs • {p.gender}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">COACH</p>
                                            <p className="text-sm font-black text-slate-900">{booking.allocatedSeats[idx]?.coachNumber || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">SEAT</p>
                                            <p className="text-sm font-black text-[#d84e55]">{booking.allocatedSeats[idx]?.seatNumber || '-'}</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">BERTH</p>
                                            <p className="text-xs font-bold text-slate-700">{booking.allocatedSeats[idx]?.berthType || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Amount Banner */}
                    <div className="px-8 py-5 bg-[#d84e55]/5 border-t border-red-100 flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#d84e55] uppercase tracking-[0.2em]">Total Booking Amount</span>
                        <span className="text-2xl font-black text-slate-900">₹{booking.totalFare}</span>
                    </div>
                </div>

                {/* Actions & Utilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center justify-center gap-3 bg-[#d84e55] text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200/50 hover:bg-[#c13e44] hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                        <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                        Download E-Ticket
                    </button>
                    <button 
                        onClick={handleWhatsAppShare}
                        className="flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-200 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-200/50 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <MessageCircle size={18} className="text-green-500" />
                        Share on WhatsApp
                    </button>
                </div>

                {/* Bottom Navigation */}
                <div className="mt-12 text-center animate-in fade-in duration-1000 delay-500">
                    <div className="flex items-center justify-center gap-8">
                        <Link to="/" className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-[#d84e55] transition-colors flex items-center gap-2">
                            <ArrowLeft size={14} />
                            Go to Home
                        </Link>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <button className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-[#d84e55] transition-colors flex items-center gap-2">
                            <Ticket size={14} />
                            My Bookings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainSuccess;
