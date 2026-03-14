import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import {
    BarChart3,
    TrendingUp,
    Calendar,
    Map,
    Bus,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const Reports = () => {
    const [realStats, setRealStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                if (data.success) {
                    setRealStats(data.stats);
                }
            } catch (error) {
                console.error("Reports stats error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-deep-navy tracking-tight uppercase">Resource Reports</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Detailed performance and utilization metrics</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#d84e55] transition-all">Export PDF</button>
                    <button className="px-6 py-3 bg-deep-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">Download CSV</button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ReportStat label="Daily Bookings" value={loading ? '...' : (realStats?.bookings || '0')} growth="+12.5%" icon={Calendar} />
                <ReportStat label="Monthly Revenue" value={loading ? '...' : `₹${(realStats?.monthlyRevenue || 0).toLocaleString()}`} growth="+8.2%" icon={TrendingUp} />
                <ReportStat label="Avg. Bus Load" value={loading ? '...' : `${realStats?.avgBusLoad || 75}%`} growth="-2.1%" icon={Bus} decrement />
                <ReportStat label="Active Routes" value={loading ? '...' : (realStats?.totalRoutes || '0')} growth="+5.4%" icon={Map} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Revenue Distribution</h2>
                    <div className="h-[300px] w-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                        <BarChart3 className="h-12 w-12 text-gray-200" />
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Top Performing Routes</h2>
                    <div className="space-y-6">
                        {realStats?.topRoutes?.length > 0 ? (
                            realStats.topRoutes.map((item, i) => (
                                <RoutePerformItem key={i} route={item.route} revenue={item.revenue} load="85%" />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center">
                                <BarChart3 className="h-10 w-10 mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Performance Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bus Utilization Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Bus Utilization</h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">Real-time Data</span>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bus Name</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Trips</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilization Rate</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        <BusUtilRow name="Volvo B11R (KA-01-F-1234)" trips="24" util="94%" />
                        <BusUtilRow name="Scania Multi-Axle (MH-02-G-5678)" trips="22" util="88%" />
                        <BusUtilRow name="Mercedes SHD (DL-01-C-9012)" trips="18" util="72%" />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ReportStat = ({ label, value, growth, icon: Icon, decrement }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${decrement ? 'text-red-500' : 'text-emerald-500'}`}>
                {decrement ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                {growth}
            </div>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-deep-navy tracking-tight">{value}</p>
    </div>
);

const RoutePerformItem = ({ route, revenue, load }) => (
    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl hover:bg-red-50 transition-all group">
        <div>
            <p className="text-sm font-black text-deep-navy uppercase tracking-tight">{route}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue: {revenue}</p>
        </div>
        <div className="text-right">
            <p className="text-xs font-black text-[#d84e55] uppercase">{load}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Load Factor</p>
        </div>
    </div>
);

const BusUtilRow = ({ name, trips, util }) => (
    <tr>
        <td className="px-10 py-8 font-black text-deep-navy uppercase text-xs tracking-tight">{name}</td>
        <td className="px-10 py-8 text-sm font-bold text-gray-500">{trips}</td>
        <td className="px-10 py-8">
            <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#d84e55]" style={{ width: util }}></div>
                </div>
                <span className="text-[10px] font-black text-deep-navy">{util}</span>
            </div>
        </td>
        <td className="px-10 py-8">
            <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Optimal</span>
        </td>
    </tr>
);

export default Reports;
