import React, { useState, useEffect } from 'react';
import { 
    Hotel, 
    Clock, 
    CheckCircle2, 
    CalendarCheck, 
    Wallet, 
    Plus, 
    Eye, 
    AlertCircle,
    TrendingUp,
    MapPin
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, AreaChart, Area
} from 'recharts';
import { getHotelDashboardStats } from '../../../api/adminApi';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, icon: Icon, color, loading }) => (
    <div className="bg-[#f5f5f5] p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-lg shadow-current/10`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</h3>
                {loading ? (
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
                ) : (
                    <p className="text-xl font-black text-[#1C1C1E]">{value}</p>
                )}
            </div>
        </div>
    </div>
);

const HotelDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            const res = await getHotelDashboardStats();
            if (res.success) {
                setData(res);
            }
        } catch (err) {
            console.error('Hotel Dashboard Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const stats = [
        { label: 'Total Hotels', value: data?.stats?.totalHotels || 0, icon: Hotel, color: 'bg-blue-500' },
        { label: 'Pending Approvals', value: data?.stats?.pendingApprovals || 0, icon: Clock, color: 'bg-amber-500' },
        { label: 'Approved Hotels', value: data?.stats?.approvedHotels || 0, icon: CheckCircle2, color: 'bg-emerald-500' },
        { label: 'Total Bookings', value: data?.stats?.totalBookings || 0, icon: CalendarCheck, color: 'bg-[#d84e55]' },
        { label: 'Total Revenue', value: `₹${(data?.stats?.totalRevenue || 0).toLocaleString()}`, icon: Wallet, color: 'bg-purple-500' },
    ];

    if (loading && !data) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="h-10 w-64 bg-gray-200 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-[24px]" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-80 bg-gray-200 rounded-[32px]" />
                    <div className="h-80 bg-gray-200 rounded-[32px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#1C1C1E] uppercase tracking-tight mb-1">Hotel Dashboard</h1>
                    <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.2em]">Management & Performance Analytics</p>
                </div>
                
                {/* Quick Actions Panel */}
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <button 
                        onClick={() => navigate('/admine/hotels/pending')}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-amber-100 transition-all active:scale-95"
                    >
                        <AlertCircle className="h-3.5 w-3.5" /> Pending Approvals
                    </button>
                    <button 
                        onClick={() => navigate('/admine/hotels')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-100 transition-all active:scale-95"
                    >
                        <Eye className="h-3.5 w-3.5" /> View All
                    </button>
                    <button 
                        onClick={() => navigate('/admine/hotels')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#d84e55] text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-[#b03d42] transition-all shadow-lg shadow-red-200 active:scale-95"
                    >
                        <Plus className="h-3.5 w-3.5" /> Add New Hotel
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} loading={loading} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bookings Chart */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-24 w-24 text-[#d84e55]" />
                    </div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h2 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Bookings Trend</h2>
                            <p className="text-sm font-bold text-[#1C1C1E]">Last 7 Days Activity</p>
                        </div>
                        <div className="flex items-center gap-2 bg-rose-50 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-[#d84e55] rounded-full animate-pulse"></span>
                            <span className="text-[9px] font-black uppercase text-[#d84e55]">Live Stats</span>
                        </div>
                    </div>
                    <div className="h-[280px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d84e55" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#d84e55" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="bookings" stroke="#d84e55" fillOpacity={1} fill="url(#colorBookings)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Wallet className="h-24 w-24 text-purple-500" />
                    </div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h2 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Revenue Stream</h2>
                            <p className="text-sm font-bold text-[#1C1C1E]">Daily Financial Growth</p>
                        </div>
                        <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                            <span className="text-[9px] font-black uppercase text-purple-600">Earnings (₹)</span>
                        </div>
                    </div>
                    <div className="h-[280px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.chartData || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-[14px] font-black text-[#1C1C1E] uppercase tracking-widest mb-1">Recent Activity</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Latest Property Additions</p>
                    </div>
                    <div className="text-[10px] font-black text-[#d84e55] uppercase tracking-widest cursor-pointer hover:underline" onClick={() => navigate('/admine/hotels')}>
                        View All Hotels
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#fcfcfc]">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Hotel Name</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Location</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operator</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date Added</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data?.recentHotels?.map((hotel, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors group cursor-default">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Hotel className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <span className="text-sm font-black text-[#1C1C1E] uppercase tracking-tight">{hotel.hotelName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                                            <MapPin className="h-3 w-3" /> {hotel.city}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-tight">
                                        {hotel.operatorName || 'N/A'}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                                            hotel.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                            hotel.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                            'bg-rose-50 text-[#d84e55]'
                                        }`}>
                                            {hotel.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-gray-400 font-bold text-[10px] uppercase">
                                        {new Date(hotel.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HotelDashboard;
