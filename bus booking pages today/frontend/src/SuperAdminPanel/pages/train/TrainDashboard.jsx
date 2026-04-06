import { useState, useEffect } from 'react';
import { 
    Train, 
    BookOpen, 
    DollarSign, 
    MapPin, 
    TrendingUp, 
    ArrowUpRight,
    Users
} from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import ChartCard from '../../components/common/ChartCard';
import trainApi from '../../../api/trainApi';
import { toast } from 'react-toastify';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const TrainDashboard = () => {
    const [stats, setStats] = useState({
        totalTrains: 0,
        totalBookings: 0,
        todayBookings: 0,
        totalRevenue: 0,
        activeRoutes: 0,
        weeklyData: [],
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await trainApi.getDashboardStats();
                if (res.success) {
                    setStats(res.stats);
                }
            } catch (error) {
                toast.error('Failed to load dashboard stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statsData = [
        { title: 'TOTAL TRAINS', value: stats.totalTrains.toLocaleString(), icon: Train, trend: 2.5, color: 'info' },
        { title: 'TOTAL BOOKINGS', value: stats.totalBookings.toLocaleString(), icon: BookOpen, trend: 15.4, color: 'success' },
        { title: 'TODAY BOOKINGS', value: stats.todayBookings.toLocaleString(), icon: TrendingUp, trend: 8.2, color: 'danger' },
        { title: 'REVENUE', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, icon: TrendingUp, trend: 22.1, color: 'purple' }
    ];

    const data = [
        { name: 'Mon', bookings: 0 },
        { name: 'Tue', bookings: 0 },
        { name: 'Wed', bookings: 0 },
        { name: 'Thu', bookings: 0 },
        { name: 'Fri', bookings: 0 },
        { name: 'Sat', bookings: 0 },
        { name: 'Sun', bookings: 0 }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Train Dashboard</h1>
                    <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest">Railway Operations & Analytics</p>
                </div>
                <button className="bg-train-primary hover:bg-train-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-train-primary/25 transition-all active:scale-95">
                    <TrendingUp size={18} />
                    <span>Download Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ChartCard title="Booking Analysis" subtitle="Daily ticket bookings for the current week">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.weeklyData.length > 0 ? stats.weeklyData : data}>
                                <defs>
                                    <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                    itemStyle={{fontWeight: 'bold', color: '#ea580c'}}
                                />
                                <Area type="monotone" dataKey="bookings" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorBook)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Recent Bookings</h3>
                        <button className="text-train-primary text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-5">
                        {stats.recentBookings.length > 0 ? (
                            stats.recentBookings.map((booking, idx) => (
                                <div key={booking._id || idx} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-train-primary-light/30 flex items-center justify-center text-train-primary shrink-0">
                                        <Users size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-bold text-sm truncate">{booking.user?.name || 'Guest User'}</p>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">{booking.status}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                                            {booking.train?.name} • {booking.source?.code} → {booking.destination?.code}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10px] font-bold text-slate-400">PNR: {booking.pnr}</span>
                                            <span className="text-[10px] font-bold text-slate-400">₹{booking.totalFare}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 mb-3">
                                    <BookOpen size={24} />
                                </div>
                                <p className="text-slate-400 font-bold text-sm">No recent bookings</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainDashboard;
