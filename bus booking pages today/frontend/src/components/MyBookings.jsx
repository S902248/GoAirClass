import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, ArrowRight, Star, ShieldCheck, Download, XCircle, Search, HelpCircle, Map, Users, Hotel, Hash, Phone, Tag, Bed, User, Plane } from 'lucide-react';
import { getUserBookings } from '../api/bookingApi';
import { getUserHotelBookings } from '../api/hotelApi';
import flightApi from '../api/flightApi';

const MyBookings = ({ setView }) => {
    const navigate = useNavigate();
    const [busBookings, setBusBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [flightBookings, setFlightBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // all, bus, hotel, flight
    const [statusFilter, setStatusFilter] = useState('upcoming'); // upcoming, completed, cancelled
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const [busData, hotelData, flightData] = await Promise.all([
                getUserBookings(),
                getUserHotelBookings(),
                flightApi.getUserBookings()
            ]);
            setBusBookings(busData || []);
            setHotelBookings(hotelData?.bookings || []);
            setFlightBookings(flightData?.bookings || []);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError('Could not load your bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'confirmed': 
            case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-200';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const handleNavigate = (path) => {
        if (setView) setView(path);
        else navigate('/' + path);
    };

    // --- Unified filtering and sorting ---
    const allMerged = [
        ...busBookings.map(b => ({ ...b, type: 'bus', sortDate: new Date(b.travelDate || b.createdAt) })),
        ...hotelBookings.map(h => ({ ...h, type: 'hotel', sortDate: new Date(h.checkInDate || h.createdAt) })),
        ...flightBookings.map(f => ({ ...f, type: 'flight', sortDate: new Date(f.departureTime || f.createdAt) }))
    ].sort((a, b) => b.sortDate - a.sortDate);

    const filtered = allMerged.filter(b => {
        const tabMatch = activeTab === 'all' || b.type === activeTab;

        // Match status grouping
        const s = (b.status || b.bookingStatus)?.toLowerCase();
        let statusMatch = false;
        if (statusFilter === 'upcoming') statusMatch = s === 'confirmed' || s === 'pending' || s === 'completed';
        else if (statusFilter === 'completed') statusMatch = s === 'completed'; // Should be checked based on date
        else if (statusFilter === 'cancelled') statusMatch = s === 'cancelled';

        return tabMatch && statusMatch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F8F9] flex flex-col items-center justify-center pt-28 text-center px-4">
                <div className="w-16 h-16 border-4 border-[#006ce4]/20 border-t-[#006ce4] rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-black uppercase tracking-widest text-[10px]">Syncing your journeys...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F7F8F9] flex flex-col items-center justify-center pt-28 px-4 text-center">
                <XCircle className="h-16 w-16 text-red-500 mb-6 mx-auto opacity-20" />
                <h2 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-500 font-bold text-sm mb-8">{error}</p>
                <button onClick={fetchBookings} className="px-8 py-4 bg-[#006ce4] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#0053a6] transition-all shadow-lg shadow-blue-100">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8F9] pb-24 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 pt-28 pb-0">
                <div className="max-w-[1000px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Bookings</h1>
                            <p className="text-gray-400 font-bold mt-1 text-sm">Manage your bus, hotel and flight reservations</p>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200/50 w-fit">
                            {['all', 'bus', 'hotel', 'flight'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab === 'all' ? 'All' : tab === 'bus' ? 'Buses' : tab === 'hotel' ? 'Hotels' : 'Flights'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-8 border-t border-gray-50 pt-0">
                        {['upcoming', 'completed', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`py-4 relative text-[11px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'text-[#006ce4]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {status}
                                {statusFilter === status && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#006ce4] rounded-t-full shadow-lg shadow-blue-200"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 mt-12">
                {filtered.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-xl shadow-gray-200/20 flex flex-col items-center">
                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                            <Ticket className="h-12 w-12 text-gray-200" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">No {statusFilter} bookings</h2>
                        <p className="text-gray-400 font-bold mb-10 max-w-sm text-sm uppercase tracking-wide">Take a break and plan your next destination with us!</p>
                        <button
                            onClick={() => handleNavigate('landing')}
                            className="bg-[#006ce4] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#0053a6] transition-all shadow-2xl shadow-blue-200 active:scale-95"
                        >
                            <Search className="h-4 w-4" />
                            Book Now
                        </button>
                    </div>
                ) : (
                    /* List */
                    <div className="space-y-8">
                        {filtered.map((item) => {
                            if (item.type === 'bus') return <BusBookingCard key={item._id} booking={item} getStatusStyles={getStatusStyles} handleNavigate={handleNavigate} />;
                            if (item.type === 'hotel') return <HotelBookingCard key={item._id} booking={item} getStatusStyles={getStatusStyles} handleNavigate={handleNavigate} />;
                            if (item.type === 'flight') return <FlightBookingCard key={item._id} booking={item} getStatusStyles={getStatusStyles} handleNavigate={handleNavigate} />;
                            return null;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Flight Card ---
const FlightBookingCard = ({ booking, getStatusStyles, handleNavigate }) => {
    const flight = booking.flightId || {};
    const airline = flight.airlineId || {};
    const departure = new Date(booking.departureTime || flight.departureTime);
    const arrival = new Date(booking.arrivalTime || flight.arrivalTime);

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl hover:border-blue-100 transition-all group">
            <div className="flex-1 p-8 md:p-10 relative">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-1">
                                <Plane className="h-2.5 w-2.5" /> Flight
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            {airline.name || 'Airline'}
                            <span className="text-[10px] text-gray-400">{flight.flightNumber}</span>
                        </h3>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(booking.bookingStatus)} shadow-sm`}>
                            {booking.bookingStatus}
                        </span>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">PNR: {booking.pnr}</span>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 mb-10 bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-50">
                    <div className="text-right">
                        <p className="text-2xl font-black text-gray-900 leading-none">{flight.fromAirport?.code || 'DEL'}</p>
                        <p className="text-xl font-black text-gray-900 mt-2">{departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex flex-col items-center px-6">
                        <div className="flex items-center w-full min-w-[120px]">
                            <div className="w-2.5 h-2.5 rounded-full border-[3px] border-gray-200" />
                            <div className="h-0.5 bg-gray-100 flex-1 relative">
                                <Plane className="h-5 w-5 text-gray-300 absolute left-1/2 -translate-x-1/2 -top-2.5" />
                            </div>
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                        </div>
                    </div>
                    <div className="text-left">
                        <p className="text-2xl font-black text-gray-900 leading-none">{flight.toAirport?.code || 'BOM'}</p>
                        <p className="text-xl font-black text-gray-900 mt-2">{arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><Calendar className="w-3.5 h-3.5" /> Date</p>
                        <p className="text-xs font-black text-gray-800">{departure.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><Users className="w-3.5 h-3.5" /> Travellers</p>
                        <p className="text-xs font-black text-gray-800">{booking.passengers?.length || 1}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><ShieldCheck className="w-3.5 h-3.5" /> Seats</p>
                        <p className="text-xs font-black text-gray-800">{booking.passengers?.map(p => p.seatNumber).join(', ') || 'Auto'}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><HelpCircle className="w-3.5 h-3.5" /> Ticket</p>
                        <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Details</button>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-72 bg-gray-50/50 p-8 md:p-10 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 opacity-60">Total Fare</p>
                    <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{booking.totalAmount}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">{booking.paymentStatus}</p>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={() => window.open(`http://localhost:5000/api/tickets/${booking._id}/pdf`, '_blank')}
                        className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-gray-900 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Download className="w-4 h-4" /> E-Ticket
                    </button>
                    <button className="w-full py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" /> Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Existing Sub-components ---
const BusBookingCard = ({ booking, getStatusStyles, handleNavigate }) => {
    // ... (unchanged)
    const busName = booking.bus?.busName || 'Bus Operator';
    const busType = booking.bus?.busType || 'AC / Non AC';
    const busNumber = booking.bus?.busNumber || '';
    let dateObj = new Date(booking.travelDate || booking.createdAt);
    const journeyDate = dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl hover:border-blue-100 transition-all group">
            <div className="flex-1 p-8 md:p-10 relative">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" /> Bus
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 flex items-center flex-wrap gap-3">
                            {busName}
                            {busNumber && (
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 transition-colors">
                                    {busNumber}
                                </span>
                            )}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{busType}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)} shadow-sm`}>
                            {booking.status}
                        </span>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">PNR: {booking.pnrNumber || booking._id?.substring(0, 8).toUpperCase()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 mb-10 bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-50">
                    <div className="text-right">
                        <p className="text-xl font-black text-gray-900 leading-none">{booking.boardingPoint?.split(',')[0] || 'Origin'}</p>
                        <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mt-2">Boarding</p>
                    </div>
                    <div className="flex flex-col items-center px-6">
                        <div className="flex items-center w-full">
                            <div className="w-2.5 h-2.5 rounded-full border-[3px] border-gray-200" />
                            <div className="h-0.5 bg-gray-100 w-20" />
                            <ArrowRight className="h-5 w-5 text-gray-300 mx-2" />
                            <div className="h-0.5 bg-gray-100 w-20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                        </div>
                    </div>
                    <div className="text-left">
                        <p className="text-xl font-black text-gray-900 leading-none">{booking.droppingPoint?.split(',')[0] || 'Destination'}</p>
                        <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mt-2">Dropping</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><Calendar className="w-3.5 h-3.5" /> Date</p>
                        <p className="text-xs font-black text-gray-800">{journeyDate}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><Users className="w-3.5 h-3.5" /> Passenger</p>
                        <p className="text-xs font-black text-gray-800 truncate">{booking.passengerName || (booking.passengers?.[0]?.name || 'Guest')}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><ShieldCheck className="w-3.5 h-3.5" /> Seat(s)</p>
                        <p className="text-xs font-black text-gray-800">{booking.seatNumbers?.join(', ') || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><HelpCircle className="w-3.5 h-3.5" /> Help</p>
                        <button className="text-[10px] font-black text-[#006ce4] hover:underline uppercase tracking-widest">Support</button>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-72 bg-gray-50/50 p-8 md:p-10 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between">
                <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 opacity-60">Total Amount</p>
                    <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{booking.totalFare || 0}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${booking.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {booking.paymentStatus === 'Paid' ? 'Confirmed' : 'Pending'}
                    </p>
                </div>

                <div className="space-y-3">
                    <button className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-gray-900 transition-all flex items-center justify-center gap-2 shadow-sm">
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                    {booking.status === 'Cancelled' ? (
                        <button disabled className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                            Cancelled
                        </button>
                    ) : (
                        <button
                            onClick={() => handleNavigate(`cancel-ticket/${booking._id}`)}
                            className="w-full py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                        >
                            <XCircle className="w-4 h-4" /> Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const HotelBookingCard = ({ booking, getStatusStyles, handleNavigate }) => {
    const hotelName = booking.hotelId?.hotelName || 'Premium Hotel';
    const city = booking.hotelId?.city || '';
    const roomType = booking.roomType || booking.roomId?.roomType || 'Standard Room';
    const checkIn = new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const checkOut = new Date(booking.checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleDownloadInvoice = async () => {
        try {
            const { downloadInvoice } = await import('../api/hotelApi');
            const data = await downloadInvoice(booking._id);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_${booking._id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download invoice.');
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl hover:border-blue-100 transition-all group">
            <div className="flex-1 p-8 md:p-10 relative">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-1">
                                <Hotel className="h-2.5 w-2.5" /> Hotel
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{hotelName}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1.5 leading-none">
                            <MapPin className="h-3 w-3" /> {city}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)} shadow-sm`}>
                            {booking.status}
                        </span>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">ID: {booking.bookingId || booking._id?.substring(0, 8).toUpperCase()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10 bg-blue-50/30 p-6 rounded-[1.5rem] border border-blue-50/50">
                    <div>
                        <p className="text-[9px] font-black tracking-widest text-blue-400 uppercase mb-2 flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> Check-In
                        </p>
                        <p className="text-lg font-black text-gray-900 leading-none">{checkIn}</p>
                    </div>
                    <div className="border-l border-blue-100 pl-6">
                        <p className="text-[9px] font-black tracking-widest text-blue-400 uppercase mb-2 flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> Check-Out
                        </p>
                        <p className="text-lg font-black text-gray-900 leading-none">{checkOut}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><Bed className="w-3.5 h-3.5" /> Room</p>
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-black text-gray-800 leading-tight">{roomType}</p>
                            {booking.assignedRoomNumber && (
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md inline-block w-fit">
                                    Room: {booking.assignedRoomNumber}
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><Users className="w-3.5 h-3.5" /> Guests</p>
                        <p className="text-xs font-black text-gray-800">{booking.guests || 1} Person(s)</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><User className="w-3.5 h-3.5" /> Guest</p>
                        <p className="text-xs font-black text-gray-800 truncate">{booking.guestName}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 opacity-60"><HelpCircle className="w-3.5 h-3.5" /> Support</p>
                        <button className="text-[10px] font-black text-[#006ce4] hover:underline uppercase tracking-widest">Help</button>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-72 bg-gray-50/50 p-8 md:p-10 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between">
                <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 opacity-60">Total Fare</p>
                    <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{booking.totalPrice || 0}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${booking.paymentStatus === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {booking.paymentStatus === 'Completed' ? 'Paid' : 'Pending'}
                    </p>
                </div>

                <div className="space-y-3.5">
                    <button
                        onClick={handleDownloadInvoice}
                        className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-gray-900 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Download Invoice
                    </button>
                    {booking.status === 'cancelled' ? (
                        <button disabled className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                            Cancelled
                        </button>
                    ) : (
                        <button
                            onClick={() => handleNavigate(`cancel-hotel/${booking._id}`)}
                            className="w-full py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                        >
                            <XCircle className="w-4 h-4" /> Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
