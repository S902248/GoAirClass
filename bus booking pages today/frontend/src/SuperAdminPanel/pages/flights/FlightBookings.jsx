import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import Axios from '../../../api/Axios';

const FlightBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Axios.get('/flight-bookings')
            .then(res => setBookings(res.data.bookings || []))
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600">
                    <Calendar size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Flight Bookings</h1>
                    <p className="text-slate-500 text-sm font-medium">Track all flight reservations</p>
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Booking ID', 'Flight', 'Travel Date', 'Passengers', 'Total Amount', 'Payment', 'Status'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(5)].map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></td></tr>)
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-16 text-center text-slate-500 font-medium">No flight bookings found</td></tr>
                        ) : bookings.map(b => (
                            <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs text-slate-500">{b._id.slice(-8).toUpperCase()}</td>
                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{b.flightId?.flightNumber || '—'}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{b.travelDate ? new Date(b.travelDate).toLocaleDateString() : '—'}</td>
                                <td className="px-4 py-3 font-bold">{b.passengers?.length || 0}</td>
                                <td className="px-4 py-3 font-bold text-emerald-600">₹{b.totalAmount}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${b.paymentStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' : b.paymentStatus === 'Failed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{b.paymentStatus}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : b.bookingStatus === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{b.bookingStatus}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FlightBookings;
