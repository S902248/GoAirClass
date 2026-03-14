import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHotelBookings } from '../../slices/hotelBookingSlice';
import { CalendarCheck, Hotel, User as UserIcon, Calendar } from 'lucide-react';

const statusColors = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
    pending: 'bg-amber-100 text-amber-700',
};

const HotelBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector((state) => state.hotelBookings);

    useEffect(() => { dispatch(fetchAllHotelBookings()); }, [dispatch]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600">
                    <CalendarCheck size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hotel Bookings</h1>
                    <p className="text-slate-500 text-sm font-medium">All hotel reservations across the platform</p>
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Booking ID', 'Hotel', 'Room Type', 'Guest', 'Check-In', 'Check-Out', 'Total', 'Status'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(5)].map((_, i) => <tr key={i}><td colSpan={8}><div className="h-12 px-4 py-2"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></div></td></tr>)
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan={8} className="px-4 py-16 text-center text-slate-500 font-medium">No hotel bookings yet</td></tr>
                        ) : bookings.map(b => (
                            <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3">
                                    <span className="text-[10px] font-mono font-bold text-slate-400">#{b._id?.slice(-8).toUpperCase()}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Hotel size={14} className="text-slate-400 flex-shrink-0" />
                                        <span className="font-semibold text-slate-800 dark:text-white">{b.hotelId?.hotelName || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">
                                        {b.roomId?.roomType || 'Standard'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <UserIcon size={14} className="text-slate-400" />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{b.guestName || b.userId?.name || 'Guest'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400"><Calendar size={12} />{b.checkInDate}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400"><Calendar size={12} />{b.checkOutDate}</div>
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">₹{b.totalPrice?.toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[b.status] || 'bg-slate-100 text-slate-600'}`}>
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HotelBookings;
