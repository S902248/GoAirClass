import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    CheckCircle2, 
    Download, 
    Plane, 
    Calendar, 
    Clock, 
    User, 
    CreditCard, 
    ChevronRight,
    Printer,
    Home,
    Smartphone,
    Mail
} from 'lucide-react';
import axios from '../api/Axios';

const FlightBookingConfirmation = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            // 1. Always check sessionStorage first (set right before navigation)
            const cached = sessionStorage.getItem('lastBooking');
            if (cached) {
                const parsed = JSON.parse(cached);
                // Match bookingId in case user navigates back to old confirmation
                if (!parsed.bookingId || parsed.bookingId === bookingId || parsed._isDemo) {
                    setBooking(parsed);
                    setLoading(false);
                    return;
                }
            }

            // 2. Fallback: fetch from API (real confirmed bookings)
            try {
                const res = await axios.get(`/flight-bookings/${bookingId}`);
                if (res.data.success) {
                    setBooking(res.data.booking);
                }
            } catch (err) {
                console.error("Failed to fetch booking", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);


    const handleDownloadTicket = async () => {
        try {
            const response = await axios.get(`/tickets/${bookingId}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Ticket_${booking.pnr}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Failed to download ticket. Please try again later.");
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-slate-300">RETRIEVING BOOKING DETAILS...</div>;
    if (!booking) return <div className="p-20 text-center font-black text-rose-500">BOOKING NOT FOUND</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-32 font-inter">
            <div className="max-w-4xl mx-auto px-6">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-[2.5rem] shadow-xl shadow-emerald-200 mb-6 animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Booking Confirmed!</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        Your PNR: <span className="text-blue-600 underline scholarship font-black text-sm">{booking.pnr}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Main Receipt Card */}
                    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-900 p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Plane className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-white font-black uppercase text-lg tracking-tight">{booking.flightDetails.airline}</h2>
                                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{booking.flightDetails.flightNumber}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">Confirmed</span>
                            </div>
                        </div>

                        <div className="p-10">
                            {/* Route */}
                            <div className="flex items-center justify-between mb-12">
                                <div className="text-left">
                                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{booking.flightDetails.departureAirport}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departure</p>
                                    <p className="text-xs font-black text-slate-700 mt-2">{new Date(booking.flightDetails.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className="flex-1 flex flex-col items-center px-10">
                                    <div className="w-full h-[2px] bg-slate-100 relative flex items-center justify-center">
                                        <Plane className="w-5 h-5 text-blue-600 absolute bg-white p-0.5 rounded-full" />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-4">{booking.flightDetails.duration}</span>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{booking.flightDetails.arrivalAirport}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arrival</p>
                                    <p className="text-xs font-black text-slate-700 mt-2">{new Date(booking.flightDetails.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>

                            <div className="h-px bg-slate-50 w-full mb-10"></div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-900" />
                                        <span className="text-xs font-black text-slate-900">{new Date(booking.travelDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Booking ID</p>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-black text-slate-900">{booking.bookingId}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment</p>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-slate-900" />
                                        <span className="text-xs font-black text-slate-900">₹{booking.fareDetails.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tickets</p>
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-slate-900" />
                                        <span className="text-xs font-black text-slate-900">{booking.passengers.length} Traveller(s)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Passenger List */}
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Passenger Details</h4>
                                <div className="space-y-4">
                                    {booking.passengers.map((p, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xs font-black">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-xs font-black text-slate-900 uppercase">{p.firstName} {p.lastName}</span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase">Seat</p>
                                                    <p className="text-xs font-black text-slate-900 uppercase">{p.seatNumber || 'N/A'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase">Type</p>
                                                    <p className="text-xs font-black text-slate-900 uppercase">{p.seatType || 'Standard'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="mt-8 bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase">Email</p>
                                            <p className="text-xs font-black text-slate-900">{booking.contactDetails.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                                        <Smartphone className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase">Phone</p>
                                            <p className="text-xs font-black text-slate-900">{booking.contactDetails.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-blue-600 p-8 flex flex-col md:flex-row items-center gap-4">
                            <button 
                                onClick={handleDownloadTicket}
                                className="w-full md:flex-1 h-16 bg-white hover:bg-slate-50 text-blue-600 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/40"
                            >
                                <Download className="w-5 h-5" />
                                Download E-Ticket
                            </button>
                            <Link 
                                to="/"
                                className="w-full md:w-48 h-16 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all border border-blue-500/30"
                            >
                                <Home className="w-5 h-5" />
                                Home
                            </Link>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-slate-400 text-xs font-medium">A copy of your ticket has been sent to your registered email address.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightBookingConfirmation;
