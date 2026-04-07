import React, { useState, useEffect } from 'react';
import {
    Bus,
    Users,
    Navigation,
    Route as RouteIcon,
    CalendarCheck,
    TrendingUp,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ShieldCheck,
    Activity
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, BarChart, Bar, Legend 
} from 'recharts';
import { CardSkeleton, ChartSkeleton } from '../components/DashboardSkeleton';
import { getTransportDashboardSummary } from '../../api/adminApi';

const StatCard = ({ label, value, trend, icon: Icon, color, loading }) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
        <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</h3>
                {loading ? (
                    <div className="h-6 w-20 bg-gray-100 animate-pulse rounded" />
                ) : (
                    <p className="text-xl font-black text-deep-navy">{value}</p>
                )}
            </div>
        </div>
        {!loading && trend !== undefined && (
            <div className={`flex items-center gap-1 text-[9px] font-black uppercase ${trend >= 0 ? 'text-emerald-500' : 'text-[#d84e55]'}`}>
                {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(trend)}% Growth
            </div>
        )}
    </div>
);

const TransportDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const res = await getTransportDashboardSummary();
            if (res.success) {
                setData(res);
            }
        } catch (err) {
            console.error('Transport Dashboard Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        const interval = setInterval(fetchDashboard, 30000);
        return () => clearInterval(interval);
    }, []);

    const transportStats = [
        { label: 'Total Operators', value: data?.totalOperators || 0, icon: Users, color: 'bg-indigo-500' },
        { label: 'Total Buses', value: data?.totalBuses || 0, icon: Bus, color: 'bg-emerald-500' },
        { label: 'Active Buses', value: data?.activeBuses || 0, icon: Activity, color: 'bg-emerald-400' },
        { label: 'Inactive Buses', value: data?.inactiveBuses || 0, icon: ShieldCheck, color: 'bg-[#d84e55]' },
        { label: 'Total Routes', value: data?.totalRoutes || 0, icon: RouteIcon, color: 'bg-amber-500' },
        { label: 'Running Today', value: data?.runningBusesToday || 0, icon: Navigation, color: 'bg-blue-500' },
        { label: 'Bookings Today', value: data?.bookingsToday || 0, icon: CalendarCheck, color: 'bg-rose-500' },
        { label: 'Transport Revenue', value: `₹${(data?.revenue || 0).toLocaleString()}`, icon: Wallet, color: 'bg-purple-500' },
    ];

    if (loading && !data) {
        return (
            <div className="space-y-10">
                <div className="h-20 w-1/3 bg-gray-100 animate-pulse rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartSkeleton />
                    <ChartSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tight mb-2">Transport Dashboard</h1>
                <p className="text-gray-400 font-bold uppercase text-sm tracking-[0.2em]">Fleet Intelligence & Route Performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {transportStats.map((stat, i) => (
                    <StatCard key={i} {...stat} loading={loading} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bookings Graph */}
                <div className="bg-white rounded-[40px] p-8 border border-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest text-gray-400">7-Day Booking Growth</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Confirmed Bookings</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="bookings" stroke="#10b981" fillOpacity={1} fill="url(#colorBookings)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Graph */}
                <div className="bg-white rounded-[40px] p-8 border border-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest text-gray-400">Revenue Generation</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Earnings (₹)</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.chartData || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tables / Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Performing Routes */}
                <div className="bg-white rounded-[40px] p-8 border border-gray-50 shadow-sm overflow-hidden">
                    <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-8 text-gray-400">Top Performing Routes</h2>
                    <div className="space-y-4">
                        {data?.topRoutes?.map((route, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xs font-black text-gray-400">0{i+1}</div>
                                    <div>
                                        <p className="text-[10px] font-black text-deep-navy uppercase">{route.name}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{route.bookings} Bookings</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase">₹{route.revenue.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Operators */}
                <div className="bg-white rounded-[40px] p-8 border border-gray-50 shadow-sm overflow-hidden">
                    <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-8 text-gray-400">Top Bus Operators</h2>
                    <div className="space-y-4">
                        {data?.topOperators?.map((op, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xs font-black text-indigo-500">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-deep-navy uppercase">{op.name}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{op.bookings} Vol.</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-indigo-500 uppercase">₹{op.revenue.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-[40px] p-8 border border-gray-50 shadow-sm overflow-hidden">
                    <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-8 text-gray-400">Recent Bus Bookings</h2>
                    <div className="space-y-4">
                        {data?.recentBookings?.map((booking, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-[#d84e55]/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#d84e55]">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div className="max-w-[120px] truncate">
                                        <p className="text-[10px] font-black text-deep-navy uppercase truncate">{booking.passengerName || 'Guest'}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase truncate">{booking.bus?.busName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-deep-navy uppercase">₹{(booking.totalFare || 0).toLocaleString()}</p>
                                    <p className={`text-[8px] font-black uppercase ${booking.status === 'Confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {booking.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportDashboard;
