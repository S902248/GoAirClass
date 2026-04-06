import React, { useState, useEffect } from 'react';
import { 
    TrendingUp, 
    Users, 
    Gift, 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight, 
    Activity,
    Calendar,
    MousePointer2,
    CheckCircle2
} from 'lucide-react';
import { listAdminCoupons } from '../../../api/couponApi';

const CouponDashboard = () => {
    const [stats, setStats] = useState({
        totalCoupons: 0,
        activeCoupons: 0,
        totalUsage: 0,
        totalDiscount: 0,
        totalRevenue: 0
    });
    const [topCoupons, setTopCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const coupons = await listAdminCoupons();
                const active = coupons.filter(c => c.status === 'Active');
                const usage = coupons.reduce((acc, c) => acc + (c.analytics?.totalTimesUsed || 0), 0);
                const discount = coupons.reduce((acc, c) => acc + (c.analytics?.totalDiscountGiven || 0), 0);
                const revenue = coupons.reduce((acc, c) => acc + (c.analytics?.revenueGenerated || 0), 0);

                setStats({
                    totalCoupons: coupons.length,
                    activeCoupons: active.length,
                    totalUsage: usage,
                    totalDiscount: discount,
                    totalRevenue: revenue
                });

                // Top 5 coupons by usage
                const sorted = [...coupons].sort((a, b) => (b.analytics?.totalTimesUsed || 0) - (a.analytics?.totalTimesUsed || 0));
                setTopCoupons(sorted.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error("Dashboard Stats Error:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Active Coupons', value: stats.activeCoupons, total: stats.totalCoupons, icon: Gift, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%' },
        { label: 'Total Redemptions', value: stats.totalUsage, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+24%' },
        { label: 'Total Discount Given', value: `₹${stats.totalDiscount.toLocaleString()}`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+18%' },
        { label: 'Revenue Impact', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+15%' },
    ];

    if (loading) return <div className="p-8 animate-pulse text-gray-400">Loading Intelligence...</div>;

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Marketing Intelligence</h1>
                    <p className="text-gray-500 font-medium">Coupon performance and conversion analytics</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        <Calendar className="h-4 w-4" />
                        Last 30 Days
                    </button>
                    <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[13px] font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                        Export Multi-Report
                    </button>
                </div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${card.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                <card.icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                {card.trend} <ArrowUpRight className="h-3 w-3" />
                            </span>
                        </div>
                        <h3 className="text-gray-400 text-[13px] font-bold uppercase tracking-wider mb-1">{card.label}</h3>
                        <p className="text-2xl font-black text-gray-900">{card.value}</p>
                        {card.total && (
                            <div className="mt-3 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 rounded-full" 
                                    style={{ width: `${(card.value / card.total) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Coupons Table */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-[#2D2D2D]">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-black text-[16px] tracking-tight">Top Performing Coupons</h3>
                        <Activity className="h-4 w-4 text-gray-300" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-6 py-4">Coupon Code</th>
                                    <th className="px-6 py-4 text-center">Uses</th>
                                    <th className="px-6 py-4 text-center">Discounted</th>
                                    <th className="px-6 py-4 text-center">ROI</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {topCoupons.map((coupon, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black text-[14px]">
                                                    {coupon.code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-700">{coupon.analytics?.totalTimesUsed || 0}</td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-700">₹{(coupon.analytics?.totalDiscountGiven || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg font-bold text-[12px]">
                                                {((coupon.analytics?.revenueGenerated / (coupon.analytics?.totalDiscountGiven || 1)) * 100).toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                High Imp.
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
                    <h3 className="font-black text-[16px] tracking-tight">Voucher Conversion</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-[13px] font-bold text-gray-500 mb-2">
                                <span>Impressions</span>
                                <span className="text-gray-900">4,281</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[13px] font-bold text-gray-500 mb-2">
                                <span>Clicks / View Tnc</span>
                                <span className="text-gray-900">1,842</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-400" style={{ width: '43%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[13px] font-bold text-gray-500 mb-2">
                                <span>Successfully Applied</span>
                                <span className="text-gray-900">924</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-300" style={{ width: '21%' }} />
                            </div>
                        </div>
                        <div className="pt-6 border-t border-gray-50 text-center">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Coupon Health Score</p>
                            <p className="text-3xl font-black text-[#D84E55]">8.4 / 10</p>
                            <div className="flex justify-center gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <div key={star} className={`h-1.5 w-6 rounded-full ${star <= 4 ? 'bg-orange-400' : 'bg-gray-100'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponDashboard;
