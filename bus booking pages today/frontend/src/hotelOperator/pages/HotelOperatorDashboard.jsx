import React, { useState, useEffect } from 'react';
import { Hotel, BedDouble, BookOpen, TrendingUp, RefreshCw } from 'lucide-react';
import { getDashboardStats } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
    <div className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm flex items-center gap-5">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            {loading
                ? <div className="h-8 w-16 bg-gray-100 rounded-xl animate-pulse mt-1" />
                : <p className="text-3xl font-black text-gray-800 mt-0.5">{value ?? 0}</p>}
        </div>
    </div>
);

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const StatusBadge = ({ status }) => {
    const map = {
        confirmed: 'bg-emerald-50 text-emerald-600',
        pending: 'bg-amber-50 text-amber-600',
        cancelled: 'bg-red-50 text-[#d84e55]',
    };
    return <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${map[status] || 'bg-gray-50 text-gray-400'}`}>{status}</span>;
};

const HotelOperatorDashboard = () => {
    const { operator } = useHotelOperator();
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data.stats);
            setRecent(data.recentBookings || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const STATS = [
        { icon: Hotel, label: 'Total Hotels', value: stats?.totalHotels, color: 'bg-fuchsia-500' },
        { icon: BedDouble, label: 'Total Rooms', value: stats?.totalRooms, color: 'bg-purple-500' },
        { icon: BookOpen, label: "Today's Bookings", value: stats?.todayBookings, color: 'bg-indigo-500' },
        { icon: TrendingUp, label: 'Monthly Bookings', value: stats?.monthlyBookings, color: 'bg-violet-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Dashboard</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Welcome back, <span className="text-fuchsia-500">{operator?.name}</span>
                    </p>
                </div>
                <button onClick={fetchStats} className="p-3 bg-white border-2 border-gray-100 rounded-2xl hover:border-fuchsia-200 hover:text-fuchsia-500 transition-all shadow-sm">
                    <RefreshCw className="h-4 w-4" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {STATS.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
                <div className="px-7 py-5 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-black text-gray-800 uppercase tracking-tight">Recent Bookings</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{recent.length} recent</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/60">
                                {['Booking ID', 'Hotel', 'Guest', 'Check-in', 'Amount', 'Status'].map(h => (
                                    <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="py-12 text-center">
                                    <div className="w-6 h-6 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin mx-auto" />
                                </td></tr>
                            ) : recent.length === 0 ? (
                                <tr><td colSpan="6" className="py-12 text-center text-xs font-black text-gray-300 uppercase tracking-widest">No bookings yet</td></tr>
                            ) : recent.map(b => (
                                <tr key={b._id} className="hover:bg-gray-50/40 transition-colors">
                                    <td className="px-6 py-4 font-black text-gray-600 text-xs uppercase">{b._id?.slice(-7).toUpperCase()}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{b.hotelId?.hotelName || '—'}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-600">{b.userName || b.userId?.fullName || '—'}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{fmt(b.checkInDate)}</td>
                                    <td className="px-6 py-4 text-sm font-black text-fuchsia-500">₹{(b.totalAmount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HotelOperatorDashboard;
