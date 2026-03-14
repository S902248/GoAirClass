import React, { useState, useEffect } from 'react';
import { Eye, XCircle, RefreshCw } from 'lucide-react';
import { getAllHotelBookings, cancelHotelBooking } from '../../../api/hotelApi';


const StatusBadge = ({ status }) => {
    const map = {
        confirmed: 'bg-emerald-50 text-emerald-600',
        pending: 'bg-amber-50 text-amber-600',
        cancelled: 'bg-red-50 text-[#d84e55]',
        refunded: 'bg-indigo-50 text-indigo-600',
    };
    return (
        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${map[status?.toLowerCase()] || 'bg-gray-50 text-gray-400'}`}>
            {status}
        </span>
    );
};

const HotelBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getAllHotelBookings();
            setBookings(data?.bookings || data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const filtered = bookings.filter(b => {
        const matchSearch =
            b._id?.toLowerCase().includes(search.toLowerCase()) ||
            b.userName?.toLowerCase().includes(search.toLowerCase()) ||
            b.hotelId?.hotelName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || b.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchSearch && matchStatus;
    });

    const fmt = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Hotel Bookings</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">All hotel reservations</p>
                </div>
                <div className="flex gap-3">
                    <input type="text" placeholder="Search by ID, user, hotel..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bg-white border-2 border-gray-100 rounded-2xl py-3 px-5 text-sm font-medium w-64 focus:border-[#d84e55] outline-none transition-all" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white border-2 border-gray-100 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                        {['All', 'Confirmed', 'Pending', 'Cancelled', 'Refunded'].map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-50">
                                {['Booking ID', 'Guest', 'Hotel', 'Room Type', 'Check-in', 'Check-out', 'Guests', 'Amount', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="10" className="py-14 text-center">
                                    <div className="w-8 h-8 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin mx-auto" />
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="10" className="py-14 text-center text-xs font-black text-gray-300 uppercase tracking-widest">No Bookings Found</td></tr>
                            ) : filtered.map(b => (
                                <tr key={b._id} className="hover:bg-gray-50/40 transition-colors group">
                                    <td className="px-5 py-4 font-black text-gray-700 text-xs uppercase">{b._id?.slice(-8).toUpperCase()}</td>
                                    <td className="px-5 py-4 text-sm font-bold text-gray-700">{b.userName || b.userId?.fullName || '—'}</td>
                                    <td className="px-5 py-4 text-sm font-bold text-gray-600">{b.hotelId?.hotelName || '—'}</td>
                                    <td className="px-5 py-4 text-sm font-bold text-gray-500">{b.roomType || '—'}</td>
                                    <td className="px-5 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{fmt(b.checkInDate)}</td>
                                    <td className="px-5 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{fmt(b.checkOutDate)}</td>
                                    <td className="px-5 py-4 text-sm font-black text-gray-700">{b.guests}</td>
                                    <td className="px-5 py-4 text-sm font-black text-[#d84e55]">₹{(b.totalAmount || 0).toLocaleString()}</td>
                                    <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:scale-110 transition-all"><Eye className="h-3.5 w-3.5" /></button>
                                            {b.status?.toLowerCase() !== 'cancelled' && (
                                                <button className="p-2 bg-red-50 text-[#d84e55] rounded-xl hover:scale-110 transition-all" title="Cancel">
                                                    <XCircle className="h-3.5 w-3.5" /></button>
                                            )}
                                            <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:scale-110 transition-all" title="Refund">
                                                <RefreshCw className="h-3.5 w-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HotelBookings;
