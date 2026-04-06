import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, ArrowRight, Star, ShieldCheck, Download, XCircle, Search, HelpCircle, Map, Users, Hotel, Hash, Phone, Tag, Bed, User, Plane, Train, AlertCircle, RefreshCcw } from 'lucide-react';
import { getUserBookings } from '../api/bookingApi';
import { getUserHotelBookings } from '../api/hotelApi';
import flightApi from '../api/flightApi';
import trainApi from '../api/trainApi';
import { toast } from 'react-toastify';

const CancelledBookings = ({ setView }) => {
    const navigate = useNavigate();
    const [busBookings, setBusBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [flightBookings, setFlightBookings] = useState([]);
    const [trainBookings, setTrainBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCancelledBookings();
    }, []);

    const fetchCancelledBookings = async () => {
        try {
            setLoading(true);
            const [busData, hotelData, flightData, trainData] = await Promise.all([
                getUserBookings().catch(() => []),
                getUserHotelBookings().catch(() => ({ bookings: [] })),
                flightApi.getUserBookings().catch(() => ({ bookings: [] })),
                trainApi.getUserBookings().catch(() => ({ success: false, bookings: [] }))
            ]);
            
            setBusBookings(busData || []);
            setHotelBookings(hotelData?.bookings || []);
            setFlightBookings(flightData?.bookings || []);
            setTrainBookings(trainData?.success ? trainData.bookings : []);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError('Could not load your cancelled bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (path) => {
        if (setView) setView(path);
        else navigate('/' + path);
    };

    // --- Unified filtering for cancelled only ---
    const allMerged = [
        ...busBookings.map(b => ({ ...b, type: 'bus', sortDate: new Date(b.travelDate || b.createdAt) })),
        ...hotelBookings.map(h => ({ ...h, type: 'hotel', sortDate: new Date(h.checkInDate || h.createdAt) })),
        ...flightBookings.map(f => ({ ...f, type: 'flight', sortDate: new Date(f.departureTime || f.createdAt) })),
        ...trainBookings.map(t => ({ ...t, type: 'train', sortDate: new Date(t.journeyDate || t.createdAt) }))
    ].sort((a, b) => b.sortDate - a.sortDate);

    const cancelledOnly = allMerged.filter(b => {
        const s = (b.status || b.bookingStatus || b.paymentStatus)?.toLowerCase();
        return s === 'cancelled' || s === 'refunded' || b.cancellationDetails?.isCancelled;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F8F9] flex flex-col items-center justify-center pt-28 text-center px-4">
                <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-black uppercase tracking-widest text-[10px]">Retrieving Cancellation History...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F7F8F9] flex flex-col items-center justify-center pt-28 px-4 text-center">
                <XCircle className="h-16 w-16 text-rose-500 mb-6 mx-auto opacity-20" />
                <h2 className="text-2xl font-black text-gray-900 mb-2">Error Loading Data</h2>
                <p className="text-gray-500 font-bold text-sm mb-8">{error}</p>
                <button onClick={fetchCancelledBookings} className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-lg shadow-rose-100">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8F9] pb-24 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 pt-28 pb-12">
                <div className="max-w-[1000px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-rose-50 rounded-xl">
                                    <XCircle className="w-5 h-5 text-rose-500" />
                                </div>
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Archived Journeys</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Cancelled Bookings</h1>
                            <p className="text-gray-400 font-bold mt-1 text-sm">View and track your refund status for cancelled trips</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={fetchCancelledBookings}
                                className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-gray-600 transition-all"
                                title="Refresh History"
                            >
                                <RefreshCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 mt-12">
                {cancelledOnly.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-xl shadow-gray-200/20 flex flex-col items-center">
                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                            <XCircle className="h-12 w-12 text-gray-200" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">No cancelled tickets</h2>
                        <p className="text-gray-400 font-bold mb-10 max-w-sm text-sm uppercase tracking-wide">You don't have any cancelled bookings in your history.</p>
                        <button
                            onClick={() => handleNavigate('my-bookings')}
                            className="bg-[#006ce4] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#0053a6] transition-all shadow-2xl shadow-blue-200 active:scale-95"
                        >
                            <Ticket className="h-4 w-4" />
                            View All Bookings
                        </button>
                    </div>
                ) : (
                    /* List */
                    <div className="space-y-8">
                        {cancelledOnly.map((item) => {
                            if (item.type === 'bus') return <BusCancelledCard key={item._id} booking={item} />;
                            if (item.type === 'hotel') return <HotelCancelledCard key={item._id} booking={item} />;
                            if (item.type === 'flight') return <FlightCancelledCard key={item._id} booking={item} />;
                            if (item.type === 'train') return <TrainCancelledCard key={item._id} booking={item} />;
                            return null;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Train Cancelled Card ───────────────────────────────────────────────────────
const TrainCancelledCard = ({ booking }) => (
    <div className="bg-white rounded-[2rem] border-2 border-rose-100 shadow-xl shadow-rose-200/10 overflow-hidden flex flex-col md:flex-row grayscale-[0.3] opacity-90 transition-all">
        <div className="flex-1 p-8 md:p-10">
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-1">
                            <Train className="h-2.5 w-2.5" /> Train
                        </div>
                        <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-1">
                            Cancelled
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 flex items-center flex-wrap gap-3">
                        {booking.train?.name}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PNR: {booking.pnr} • Date: {booking.journeyDate}</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-rose-500 uppercase mb-1">Refund Amount</p>
                    <p className="text-xl font-black text-rose-600">₹{booking.refundAmount || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-4 opacity-60 bg-gray-50/50 p-5 rounded-[1.5rem]">
                <div className="text-right">
                    <p className="text-lg font-black text-gray-900">{booking.source?.code}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase">{booking.source?.name}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
                <div className="text-left">
                    <p className="text-lg font-black text-gray-900">{booking.destination?.code}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase">{booking.destination?.name}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 italic">
                <AlertCircle className="w-3 h-3" />
                Refund {booking.isRefunded ? 'Completed' : 'Initiated and will reflect in 5-7 working days.'}
            </div>
        </div>
    </div>
);

// ─── Hotel Cancelled Card ──────────────────────────────────────────────────────
const HotelCancelledCard = ({ booking }) => (
    <div className="bg-white rounded-[2rem] border-2 border-rose-100 shadow-xl shadow-rose-200/10 overflow-hidden flex flex-col md:flex-row grayscale-[0.3] opacity-90 transition-all">
        <div className="flex-1 p-8 md:p-10">
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-1">
                            <Hotel className="h-2.5 w-2.5" /> Hotel
                        </div>
                        <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-1">
                            Cancelled
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">{booking.hotelId?.hotelName}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3" /> {booking.hotelId?.city}
                    </p>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-rose-500 uppercase mb-1">Refund Amount</p>
                    <p className="text-xl font-black text-rose-600">₹{booking.cancellationDetails?.refundAmount || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-[1.5rem] mb-4 opacity-60">
                <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Check-In</p>
                    <p className="text-xs font-black text-gray-800">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                </div>
                <div className="border-l border-gray-200 pl-6">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Check-Out</p>
                    <p className="text-xs font-black text-gray-800">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 italic">
                <AlertCircle className="w-3 h-3" />
                {booking.cancellationReason ? `Reason: ${booking.cancellationReason}` : 'Cancellation processed.'}
            </div>
        </div>
    </div>
);

// ─── Flight Cancelled Card ─────────────────────────────────────────────────────
const FlightCancelledCard = ({ booking }) => {
    const details = booking.flightId || {};
    const cancellation = booking.cancellationDetails || {};
    
    return (
        <div className="bg-white rounded-[2rem] border-2 border-rose-100 shadow-xl shadow-rose-200/10 overflow-hidden flex flex-col md:flex-row grayscale-[0.3] opacity-90 transition-all">
            <div className="flex-1 p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-1">
                                <Plane className="h-2.5 w-2.5" /> Flight
                            </div>
                            <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-1">
                                Cancelled
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">{details.airlineId?.name || 'Airline'}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PNR: {booking.pnr} • {booking.seatType || 'Economy'}</p>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center min-w-[120px]">
                        <p className="text-[9px] font-black text-rose-500 uppercase mb-1">Refund Amount</p>
                        <p className="text-xl font-black text-rose-600">₹{cancellation.refundAmount || 0}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 bg-gray-50/50 p-5 rounded-[1.5rem] mb-4 opacity-60">
                    <div className="text-right flex-1">
                        <p className="text-lg font-black text-gray-900">{details.fromAirport?.code}</p>
                    </div>
                    <Plane className="w-4 h-4 text-gray-300 rotate-90" />
                    <div className="text-left flex-1">
                        <p className="text-lg font-black text-gray-900">{details.toAirport?.code}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 italic">
                    <AlertCircle className="w-3 h-3" />
                    Refund {cancellation.refundStatus === 'Refunded' ? 'Completed' : 'being processed.'}
                </div>
            </div>
        </div>
    );
};

// ─── Bus Cancelled Card ────────────────────────────────────────────────────────
const BusCancelledCard = ({ booking }) => (
    <div className="bg-white rounded-[2rem] border-2 border-rose-100 shadow-xl shadow-rose-200/10 overflow-hidden flex flex-col md:flex-row grayscale-[0.3] opacity-90 transition-all">
        <div className="flex-1 p-8 md:p-10">
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" /> Bus
                        </div>
                        <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-1">
                            Cancelled
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">{booking.bus?.busName || 'Bus Operator'}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">PNR: {booking.pnrNumber || 'N/A'} • {new Date(booking.travelDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-rose-500 uppercase mb-1">Refund Status</p>
                    <p className="text-xs font-black text-rose-600 uppercase tracking-widest">Processing</p>
                </div>
            </div>

            <div className="flex items-center gap-6 bg-gray-50/50 p-5 rounded-[1.5rem] mb-4 opacity-60">
                <p className="text-sm font-black text-gray-700">{booking.boardingPoint?.split(',')[0]} → {booking.droppingPoint?.split(',')[0]}</p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 italic">
                <AlertCircle className="w-3 h-3" />
                This ticket has been permanently cancelled.
            </div>
        </div>
    </div>
);

export default CancelledBookings;
