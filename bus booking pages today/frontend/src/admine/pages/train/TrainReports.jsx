import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Download } from 'lucide-react';

const TrainReports = () => {
    const popularRoutes = [
        { route: 'MMCT - NDLS', bookings: '1,420', revenue: '₹35.5L', growth: '+12%' },
        { route: 'NDLS - HBJ', bookings: '850', revenue: '₹12.2L', growth: '+4.5%' },
        { route: 'BDTS - ASR', bookings: '640', revenue: '₹8.4L', growth: '-2.1%' },
    ];

    return (
        <div className="p-8 space-y-10 bg-gray-50 min-h-screen animate-in fade-in duration-700">
            <div className="flex items-center justify-between pb-8 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-600 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-purple-100">
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Train Reports</h1>
                        <p className="text-gray-400 font-bold text-xs tracking-[0.25em] uppercase leading-none mt-1">Advanced Fleet Analytics</p>
                    </div>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-gray-600 border border-gray-100 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:shadow-lg transition-all active:scale-95">
                    <Download size={16} /> Export Reports
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Overview Chart Placeholder */}
                <div className="bg-white rounded-[45px] p-12 shadow-sm border border-gray-50 flex flex-col min-h-[450px]">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Revenue Overview</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Monthly earnings analysis</p>
                        </div>
                        <TrendingUp className="text-emerald-500" size={24} />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-[35px] border-2 border-dashed border-gray-200 flex items-center justify-center">
                        <Activity className="h-10 w-10 text-gray-200 animate-pulse" />
                    </div>
                </div>

                {/* Quota Distribution Chart Placeholder */}
                <div className="bg-white rounded-[45px] p-12 shadow-sm border border-gray-50 flex flex-col min-h-[450px]">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Quota Utilization</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Distribution by travel class</p>
                        </div>
                        <PieChart className="text-indigo-500" size={24} />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-[35px] border-2 border-dashed border-gray-200 flex items-center justify-center">
                        <Activity className="h-10 w-10 text-gray-200 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Popular Routes */}
            <div className="bg-white rounded-[45px] p-12 shadow-sm border border-gray-50">
                <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight mb-10">Popular Routes By Bookings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {popularRoutes.map((route, idx) => (
                        <div key={idx} className="bg-gray-50/50 p-8 rounded-[35px] border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group">
                            <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm font-black text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                0{idx + 1}
                            </div>
                            <h3 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-4">{route.route}</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bookings</p>
                                    <p className="text-xs font-black text-gray-900">{route.bookings}</p>
                                </div>
                                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Revenue</p>
                                    <p className="text-xs font-black text-indigo-600">{route.revenue}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">YoY Growth</p>
                                    <p className={`text-xs font-black ${route.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{route.growth}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-10 bg-[#1e293b] rounded-[45px] text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-10">
                    <TrendingUp size={140} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-3">AI Demand Forecasting Coming Soon</h3>
                    <p className="text-gray-400 font-bold max-w-xl mx-auto uppercase text-[10px] tracking-widest leading-relaxed">
                        We are developing machine learning models to predict upcoming season demand based on historical booking patterns and holiday trends.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrainReports;
