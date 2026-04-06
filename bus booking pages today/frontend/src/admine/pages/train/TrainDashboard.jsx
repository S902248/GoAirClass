import React from 'react';
import {
    Train,
    Ticket,
    CalendarCheck,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Clock,
    Loader2
} from 'lucide-react';
import Axios from '../../../api/Axios';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const StatCard = ({ label, value, trend, icon: Icon, color }) => (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
        <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon className="h-7 w-7 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-black uppercase ${trend > 0 ? 'text-emerald-500' : 'text-[#d84e55]'}`}>
                {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Math.abs(trend)}%
            </div>
        </div>
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</h3>
        <p className="text-3xl font-black text-deep-navy tracking-tight">{value}</p>
    </div>
);

const TrainDashboard = () => {
    const [loading, setLoading] = React.useState(true);
    const [statsData, setStatsData] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await Axios.get('/admin/train/reports');
                if (response.data.success) {
                    setStatsData(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching train stats:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase font-black text-gray-400 gap-3">
                <Loader2 className="animate-spin" />
                Updating Analytics...
            </div>
        );
    }

    const stats = [
        { 
            label: 'Total Trains', 
            value: statsData?.totalTrains || '0', 
            trend: 2.5, 
            icon: Train, 
            color: 'bg-indigo-500' 
        },
        { 
            label: 'Total Bookings', 
            value: statsData?.totalBookings?.toLocaleString() || '0', 
            trend: 15.4, 
            icon: Ticket, 
            color: 'bg-emerald-500' 
        },
        { 
            label: 'Today Bookings', 
            value: statsData?.todayBookings || '0', 
            trend: 8.2, 
            icon: CalendarCheck, 
            color: 'bg-[#d84e55]' 
        },
        { 
            label: 'Revenue', 
            value: `₹${(statsData?.totalRevenue / 100000).toFixed(1)}L`, 
            trend: 22.1, 
            icon: TrendingUp, 
            color: 'bg-purple-500' 
        },
    ];

    const chartData = statsData?.bookingTrend?.map(item => ({
        name: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
        bookings: item.count
    })) || [];

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-gray-50 min-h-screen">
            <div>
                <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tight mb-2">Train Dashboard</h1>
                <p className="text-gray-400 font-bold uppercase text-sm tracking-[0.2em]">Railway Operations & Analytics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Analytics */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm min-h-[450px] flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Booking Analytics</h2>
                            <select className="bg-gray-50 border-none rounded-xl py-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="flex-1 min-h-[300px]">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#d84e55" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#d84e55" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '20px', 
                                                border: 'none', 
                                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                                                fontSize: '12px',
                                                fontWeight: '900',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="bookings" 
                                            stroke="#d84e55" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorBookings)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex-1 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <TrendingUp className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No analytics data available yet</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="space-y-8">
                    <div className="bg-[#d84e55] rounded-[40px] p-10 text-white shadow-2xl shadow-red-200">
                        <h2 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                            <Zap className="fill-white" size={24} />
                            Quick Monitor
                        </h2>
                        <div className="space-y-4">
                            <div className="w-full bg-white/10 p-6 rounded-3xl group">
                                <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-60 flex items-center gap-2">
                                    <Clock size={12} /> Live Status
                                </p>
                                <p className="text-sm font-black uppercase tracking-tight">12 Trains currently running</p>
                            </div>
                            <div className="w-full bg-white/10 p-6 rounded-3xl group">
                                <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">System</p>
                                <p className="text-sm font-black uppercase tracking-tight font-black">Generate Daily PNR Report</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm">
                        <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-8 text-gray-400">System Logs</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <p className="text-[10px] font-black text-deep-navy uppercase tracking-widest">Train API Connected</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <p className="text-[10px] font-black text-deep-navy uppercase tracking-widest">PNR Server Sync: OK</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainDashboard;
