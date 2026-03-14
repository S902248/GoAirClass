import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, User, Hotel, Ban, Tag } from 'lucide-react';
import { getMyBookings, cancelMyBooking } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';

const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase();
    const map = {
        confirmed: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-rose-100 text-rose-700',
        pending: 'bg-amber-100 text-amber-700'
    };
    return <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${map[s] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const HotelBookings = () => {
    const { hasPerm } = useHotelOperator();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    if (!hasPerm('ViewBookings')) {
        return <div className="p-8 text-center text-red-500 font-bold">Access Denied: You do not have permission to view bookings.</div>;
    }

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getMyBookings();
            setBookings(data.bookings || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
        try {
            await cancelMyBooking(id);
            fetchBookings();
        } catch (err) { alert(err?.error || 'Cancellation failed'); }
    };

    const filtered = useMemo(() => {
        if (!search) return bookings;
        const lower = search.toLowerCase();
        return bookings.filter(b =>
            b.bookingId?.toLowerCase().includes(lower) ||
            b.guestDetails?.name?.toLowerCase().includes(lower) ||
            b.hotelId?.hotelName?.toLowerCase().includes(lower) ||
            b.userId?.name?.toLowerCase().includes(lower)
        );
    }, [bookings, search]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Bookings</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage reservations across your properties</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden p-6 md:p-8">
                {/* Search */}
                <div className="relative w-full md:w-96 mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200"
                        placeholder="Search by ID, guest name, or hotel..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Booking ID', 'Hotel & Room', 'Guest', 'Dates', 'Amount', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div></td></tr>)
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-16 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No bookings found</td></tr>
                            ) : filtered.map(b => (
                                <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-4 font-mono text-xs font-bold text-gray-500">{b.bookingId}</td>
                                    <td className="px-4 py-4">
                                        <div className="font-black text-gray-700">{b.hotelId?.hotelName || 'N/A'}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="text-xs text-gray-400 font-bold">{b.roomType || b.roomId?.roomType} Room</div>
                                            {b.assignedRoomNumber && (
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-wider border border-blue-100 flex items-center gap-1">
                                                    <Tag className="h-2.5 w-2.5" /> {b.assignedRoomNumber}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-bold text-[10px]">
                                                {b.guestDetails?.name?.charAt(0) || b.userId?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-700">{b.guestDetails?.name || b.userId?.name || 'N/A'}</div>
                                                <div className="text-[10px] text-gray-400">{b.guestDetails?.phone || b.userId?.phoneNumber}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-xs font-bold text-gray-600 flex items-center gap-1"><Calendar className="h-3 w-3 text-gray-400" /> {new Date(b.checkIn).toLocaleDateString()}</div>
                                        <div className="text-[10px] font-bold text-gray-400 ml-4 border-l border-gray-200 pl-2 mt-1">{new Date(b.checkOut).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-4 py-4 font-black text-fuchsia-600">₹{b.totalAmount?.toLocaleString()}</td>
                                    <td className="px-4 py-4"><StatusBadge status={b.status} /></td>
                                    <td className="px-4 py-4">
                                        {b.status === 'confirmed' && (
                                            <button onClick={() => handleCancel(b._id)} title="Cancel Booking"
                                                className="p-2 bg-red-50 text-[#d84e55] hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                                                <Ban className="h-3.5 w-3.5" /> Cancel
                                            </button>
                                        )}
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
