import { useEffect, useState } from 'react';
import { Plane, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import flightApi from '../../../api/flightApi';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card p-5 flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-black text-gray-800 mt-0.5">{value ?? '—'}</p>
        </div>
    </div>
);

const FlightsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [statsRes, bookingsRes, trendRes] = await Promise.all([
                    flightApi.getDashboardStats(),
                    flightApi.getRecentBookings(),
                    flightApi.getBookingTrend(),
                ]);
                setStats(statsRes.stats);
                setRecentBookings(bookingsRes.bookings || []);
                setTrend(trendRes.trend || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const maxCount = Math.max(...trend.map(d => d.count), 1);

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                    <Plane size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Flights Dashboard</h1>
                    <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">System Overview</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Plane} label="Total Flights" value={stats?.totalFlights} color="bg-sky-500" />
                <StatCard icon={Calendar} label="Today's Bookings" value={stats?.todaysBookings} color="bg-[#d84e55]" />
                <StatCard icon={DollarSign} label="Total Revenue" value={stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0'} color="bg-emerald-500" />
                <StatCard icon={TrendingUp} label="Upcoming Flights" value={stats?.upcomingFlights} color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-6">Booking Trend (Last 7 Days)</h2>
                    {trend.length === 0 ? (
                        <p className="text-gray-400 text-sm py-10 text-center font-bold">No data available</p>
                    ) : (
                        <div className="flex items-end gap-4 h-48">
                            {trend.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-xs font-black text-gray-500">{d.count}</span>
                                    <div
                                        className="w-full bg-gradient-to-t from-sky-400 to-sky-500 rounded-t-xl transition-all duration-500 shadow-md shadow-sky-100"
                                        style={{ height: `${Math.max((d.count / maxCount) * 100, 4)}%` }}
                                    />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{d.date.slice(5)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden flex flex-col">
                    <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-4">Recent Bookings</h2>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {loading ? (
                            [...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)
                        ) : recentBookings.length === 0 ? (
                            <p className="text-gray-400 text-sm py-10 text-center font-bold">No recent bookings</p>
                        ) : recentBookings.map(b => (
                            <div key={b._id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center group hover:border-sky-200 transition-colors">
                                <div>
                                    <p className="text-xs font-black text-gray-800 truncate max-w-[120px]">{b.userId?.fullName || 'Guest'}</p>
                                    <p className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5">{b.flightId?.flightNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-emerald-600">₹{b.totalAmount}</p>
                                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest
                                        ${b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                          b.bookingStatus === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {b.bookingStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightsDashboard;
