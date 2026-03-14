import React from 'react';
import {
    Users,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    CalendarCheck,
    Wallet,
    ShieldAlert
} from 'lucide-react';
import { getDashboardStats } from '../../api/adminApi';

const StatCard = ({ label, value, trend, icon: Icon, color, loading }) => (
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
        {loading ? (
            <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg"></div>
        ) : (
            <p className="text-3xl font-black text-deep-navy tracking-tight">{value}</p>
        )}
    </div>
);

const Dashboard = () => {
    const [realStats, setRealStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                if (data.success) {
                    setRealStats(data.stats);
                }
            } catch (error) {
                console.error("Dashboard stats error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Bus Operators', value: realStats?.totalOperators ?? '0', trend: 5.2, icon: Users, color: 'bg-indigo-500', loading },
        { label: 'Total Buses', value: realStats?.totalBuses ?? '0', trend: 12.5, icon: CalendarCheck, color: 'bg-emerald-500', loading },
        { label: 'Total Routes', value: realStats?.totalRoutes ?? '0', trend: 8.2, icon: Wallet, color: 'bg-amber-500', loading },
        // 'bookings' = today's booking count as returned by /admin/stats
        { label: 'Bookings Today', value: realStats?.bookings ?? '0', trend: 15.4, icon: CalendarCheck, color: 'bg-[#d84e55]', loading },
        // 'revenue' = total revenue as returned by /admin/stats
        { label: 'Total Revenue', value: `₹${(realStats?.revenue || 0).toLocaleString()}`, trend: 22.1, icon: TrendingUp, color: 'bg-purple-500', loading },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tight mb-2">Admin Dashboard</h1>
                <p className="text-gray-400 font-bold uppercase text-sm tracking-[0.2em]">Live Fleet & Booking Analytics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Charts Area Placeholder */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm min-h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Booking Analytics</h2>
                            <select className="bg-gray-50 border-none rounded-xl py-2 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <TrendingUp className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Chart Visualization Will Render Here</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm min-h-[300px] flex flex-col">
                            <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-6 text-gray-400">Revenue Chart</h2>
                            <div className="flex-1 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                                <TrendingUp className="h-8 w-8 text-gray-200" />
                            </div>
                        </div>
                        <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm min-h-[300px] flex flex-col">
                            <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-6 text-gray-400">Top Routes By Performance</h2>
                            <div className="space-y-4">
                                {realStats?.topRoutes?.length > 0 ? (
                                    realStats.topRoutes.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors group">
                                            <div>
                                                <p className="text-xs font-black text-deep-navy uppercase">{item.route}</p>
                                                <p className="text-[10px] font-bold text-gray-400">{item.count}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-emerald-500 uppercase">{item.growth || '+5%'}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">{item.revenue}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-40">
                                        <TrendingUp className="h-8 w-8 mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Booking Data Yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Recent Bookings */}
                <div className="space-y-8">
                    <div className="bg-[#d84e55] rounded-[40px] p-10 text-white shadow-2xl shadow-red-200">
                        <h2 className="text-xl font-black uppercase tracking-tight mb-8">Quick Actions</h2>
                        <div className="space-y-4">
                            <button className="w-full bg-white/10 hover:bg-white/20 p-6 rounded-3xl text-left transition-all group">
                                <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">System</p>
                                <p className="text-sm font-black uppercase tracking-tight">Generate Daily Report</p>
                            </button>
                            <button className="w-full bg-white/10 hover:bg-white/20 p-6 rounded-3xl text-left transition-all group">
                                <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">Fleet</p>
                                <p className="text-sm font-black uppercase tracking-tight">Add New Bus</p>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm">
                        <h2 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-8 text-gray-400">Live Status</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <p className="text-[10px] font-black text-deep-navy uppercase tracking-widest">Database Online</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <p className="text-[10px] font-black text-deep-navy uppercase tracking-widest">Fleet API Active</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                <p className="text-[10px] font-black text-deep-navy uppercase tracking-widest">Payment Gateway Warning</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
