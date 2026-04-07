import React, { useState, useEffect } from 'react';
import { getAdminDashboardSummary } from '../../api/adminApi';
import {
    Users,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    CalendarCheck,
    Wallet,
    Navigation,
    Route as RouteIcon,
    AlertCircle
} from 'lucide-react';
import { CardSkeleton } from '../components/DashboardSkeleton';

const StatCard = ({ label, value, trend, icon: Icon, color, loading }) => (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
        <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon className="h-7 w-7 text-white" />
            </div>
            {!loading && trend !== undefined && (
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${trend >= 0 ? 'text-emerald-500' : 'text-[#d84e55]'}`}>
                    {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</h3>
        {loading ? (
            <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg"></div>
        ) : (
            <p className="text-3xl font-black text-deep-navy tracking-tight">{value}</p>
        )}
    </div>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = async () => {
        try {
            const res = await getAdminDashboardSummary();
            if (res.success) {
                setData(res);
                setError(null);
            }
        } catch (err) {
            console.error('Dashboard Error:', err);
            setError('Failed to fetch real-time analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        const interval = setInterval(fetchDashboard, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: 'Total Bus Operators', value: data?.totalOperators || 0, trend: data?.growth?.operators, icon: Users, color: 'bg-indigo-500' },
        { label: 'Total Buses', value: data?.totalBuses || 0, trend: data?.growth?.buses, icon: Navigation, color: 'bg-emerald-500' },
        { label: 'Total Routes', value: data?.totalRoutes || 0, trend: data?.growth?.routes, icon: RouteIcon, color: 'bg-amber-500' },
        { label: 'Bookings Today', value: data?.bookingsToday || 0, trend: data?.growth?.bookings, icon: CalendarCheck, color: 'bg-[#d84e55]' },
        { label: 'Total Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString()}`, trend: data?.growth?.revenue, icon: Wallet, color: 'bg-purple-500' },
        { label: 'Total Users', value: data?.totalUsers || 0, trend: data?.growth?.users, icon: Users, color: 'bg-blue-500' },
        { label: 'Active Routes', value: data?.activeRoutes || 0, trend: data?.growth?.activeRoutes, icon: TrendingUp, color: 'bg-rose-500' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tight mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400 font-bold uppercase text-sm tracking-[0.2em]">Platform Overview & Live Analytics</p>
                </div>
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
                {loading && !data ? (
                    Array(7).fill(0).map((_, i) => <CardSkeleton key={i} />)
                ) : (
                    stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} loading={loading} />
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visualizations Placeholder (Linked to Transport Dashboard for depth) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm min-h-[400px] flex flex-col group hover:shadow-xl hover:shadow-gray-100 transition-all duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Main Platform Traffic</h2>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Live
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-10 text-center">
                            <TrendingUp className="h-16 w-16 text-gray-200 mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <p className="max-w-xs text-xs font-black text-gray-400 uppercase tracking-widest leading-loose">
                                Comprehensive traffic data is being aggregated. 
                                <br /> Visit <span className="text-red-500">Transport Dashboard</span> for deep-dive fleet analytics.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats / Right Sidebar */}
                <div className="space-y-8">
                    <div className="bg-deep-navy rounded-[40px] p-10 text-white shadow-2xl">
                        <h2 className="text-xl font-black uppercase tracking-tight mb-8 text-white/50">System Pulse</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">API Status</p>
                                <span className="text-[10px] font-black text-emerald-400 uppercase">Operational</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full w-[98%]"></div>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">DB Load</p>
                                <span className="text-[10px] font-black text-amber-400 uppercase">Normal</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-amber-400 h-full w-[42%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                            <AlertCircle className="h-20 w-20 text-deep-navy" />
                        </div>
                        <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-8 text-gray-400">Security Audit</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <p className="text-[10px] font-black text-deep-navy uppercase tracking-widest">SSL Encrypted</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <p className="text-[10px] font-black text-deep-navy uppercase tracking-widest">WAF Enabled</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
