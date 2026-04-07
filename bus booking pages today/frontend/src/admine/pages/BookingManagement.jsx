import React, { useState, useEffect } from 'react';
import { Search, Filter, Ban, CheckCircle, CreditCard, ChevronRight, XCircle, User } from 'lucide-react';
import { getScopedBookings, getAllOperators } from '../../api/adminApi';


const BookingManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedOperator, setSelectedOperator] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOperators();
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [selectedOperator]);

    const fetchOperators = async () => {
        try {
            const data = await getAllOperators();
            // getAllOperators directly returns an array
            setOperators(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching operators:', err);
        }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            // Pass the selectedOperator to filter on the backend
            const data = await getScopedBookings(selectedOperator);
            setBookings(data?.bookings || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            // TODO: Implement cancel API call if needed, for now keep status update
            setBookings(bookings.map(b =>
                b._id === id ? { ...b, status: 'Cancelled' } : b
            ));
        }
    };

    const filteredBookings = bookings.filter(b => {
        const bookingId = b._id || '';
        const passengerName = b.passengerName || '';
        const busName = b.bus?.busName || 'N/A';

        const matchesSearch = bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            busName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = statusFilter === 'All' || b.paymentStatus === statusFilter || b.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight mb-2">Bus Bookings</h1>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">Manage all passenger seat reservations</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Operator Filter */}
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <select
                            value={selectedOperator}
                            onChange={(e) => setSelectedOperator(e.target.value)}
                            className="bg-white border-2 border-gray-100 rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest focus:border-[#d84e55] outline-none transition-all cursor-pointer min-w-[200px]"
                        >
                            <option value="all">All Operators</option>
                            {operators.map(op => (
                                <option key={op._id} value={op._id}>{op.companyName || op.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search ID, Bus or Passenger..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-medium focus:border-[#d84e55] focus:ring-4 focus:ring-red-50 transition-all w-64 md:w-80"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border-2 border-gray-100 rounded-2xl py-3 px-6 text-sm font-black uppercase tracking-widest focus:border-[#d84e55] outline-none transition-all cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking ID</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Passenger</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bus / Route</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Seat / Price</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-10 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Fetching Reservations...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-10 py-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                                    No Bookings Found
                                </td>
                            </tr>
                        ) : filteredBookings.map((b) => (
                            <tr key={b._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-10 py-8 font-black text-deep-navy uppercase tracking-tighter text-xs">
                                    {b._id.substring(b._id.length - 8).toUpperCase()}
                                </td>
                                <td className="px-10 py-8">
                                    <p className="font-bold text-deep-navy uppercase tracking-tight text-sm">{b.passengerName}</p>
                                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{b.travelDate}</p>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-deep-navy uppercase tracking-tight">{b.bus?.busName || 'N/A'}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {b.route ? `${b.route.fromCity || b.route.from} → ${b.route.toCity || b.route.to}` : 'N/A'}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="font-black text-deep-navy uppercase tracking-tighter text-xs">{b.seatNumbers?.join(', ') || b.seatNumber}</p>
                                    <p className="text-[10px] font-black text-[#d84e55] uppercase tracking-widest">₹{(b.totalFare || 0).toLocaleString()}</p>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${(b.paymentStatus === 'Completed' || b.status === 'Confirmed') ? 'bg-emerald-50 text-emerald-600' :
                                        (b.paymentStatus === 'Cancelled' || b.status === 'Cancelled') ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {b.paymentStatus === 'Completed' ? 'Confirmed' : (b.status || b.paymentStatus)}
                                    </span>
                                </td>
                                <td className="px-10 py-8">
                                    {(b.paymentStatus !== 'Cancelled' && b.status !== 'Cancelled') && (
                                        <button
                                            onClick={() => handleCancel(b._id)}
                                            className="p-3 bg-red-50 text-[#d84e55] rounded-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                                            title="Cancel Booking"
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingManagement;
