import { useEffect, useState } from 'react';
import { Ticket, Eye, XCircle, Search } from 'lucide-react';
import flightApi from '../../../api/flightApi';

const FlightBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const data = await flightApi.getAllBookings();
            setBookings(data.bookings || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id, bookingStatus) => {
        try {
            await flightApi.updateBookingStatus(id, bookingStatus);
            setSelected(null);
            load();
        } catch (e) { console.error(e); }
    };

    const filtered = bookings.filter(b => {
        const q = search.toLowerCase();
        const matchSearch = !search ||
            b._id?.includes(q) ||
            b.userId?.fullName?.toLowerCase().includes(q) ||
            b.flightId?.flightNumber?.toLowerCase().includes(q);
        const matchStatus = !statusFilter || b.bookingStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-screen relative">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Ticket size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Flight Bookings</h1>
                    <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">{bookings.length} BOOKINGS REGISTERED</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="SEARCH BOOKING ID OR USER..."
                        value={search} onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select className="w-full sm:w-48 px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                    value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">ALL STATUS</option>
                    <option>Confirmed</option>
                    <option>Cancelled</option>
                    <option>In-Progress</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                {['Booking ID', 'User', 'Flight', 'Route', 'Travel Date', 'Pax', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={10} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={10} className="px-5 py-16 text-center text-gray-400 font-bold uppercase tracking-wider">No bookings found</td></tr>
                            ) : filtered.map(b => (
                                <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-4 font-black font-mono text-gray-500">{b._id?.slice(-8).toUpperCase()}</td>
                                    <td className="px-5 py-4 font-black text-gray-800">{b.userId?.fullName || 'Guest'}</td>
                                    <td className="px-5 py-4 font-black text-gray-600">{b.flightId?.flightNumber || '—'}</td>
                                    <td className="px-5 py-4 text-[10px] font-bold text-gray-500 tracking-wider whitespace-nowrap">
                                        {b.flightId?.fromAirport?.airportCode} → {b.flightId?.toAirport?.airportCode}
                                    </td>
                                    <td className="px-5 py-4 font-bold text-gray-600 whitespace-nowrap">{b.travelDate ? new Date(b.travelDate).toLocaleDateString() : '—'}</td>
                                    <td className="px-5 py-4 font-black text-center">{b.passengers?.length || 0}</td>
                                    <td className="px-5 py-4 font-black text-emerald-600">₹{b.totalAmount}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${b.paymentStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{b.paymentStatus}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${b.bookingStatus === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : b.bookingStatus === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{b.bookingStatus}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setSelected(b)} className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-all" title="View"><Eye size={16} /></button>
                                            {b.bookingStatus !== 'Cancelled' && (
                                                <button onClick={() => updateStatus(b._id, 'Cancelled')} className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all" title="Cancel">
                                                    <XCircle size={16} />
                                                </button>
                                            )}
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

export default FlightBookings;
