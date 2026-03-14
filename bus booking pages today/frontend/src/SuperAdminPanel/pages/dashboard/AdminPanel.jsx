import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardStats } from '../../slices/dashboardSlice';
import {
    DollarSign,
    BookOpen,
    Users,
    UserSquare2,
    TrendingUp,
    ArrowUpRight,
    MoreVertical
} from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import ChartCard from '../../components/common/ChartCard';
import DataTable from '../../components/common/DataTable';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { revenueData, serviceDistribution, recentBookings, COLORS } from '../../utils/mockData';

import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { stats } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    const columns = [
        { key: 'id', label: 'Booking ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'service', label: 'Service' },
        { key: 'amount', label: 'Amount (₹)' },
        { key: 'status', label: 'Status' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Enterprise Overview</h1>
                    <p className="text-slate-500 mt-1 font-medium">Real-time analytics and management for your travel platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        <MoreVertical size={20} />
                    </button>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary-500/25 transition-all active:scale-95">
                        <TrendingUp size={18} />
                        <span>Generate Report</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${(stats?.revenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    trend={12.5}
                    color="success"
                />
                <StatsCard
                    title="Total Bookings"
                    value={(stats?.bookings || 0).toLocaleString()}
                    icon={BookOpen}
                    trend={8.2}
                    color="primary"
                />
                <StatsCard
                    title="Active Users"
                    value={(stats?.users || 0).toLocaleString()}
                    icon={Users}
                    trend={15.4}
                    color="warning"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ChartCard title="Revenue Trend" subtitle="Monthly performance compared to last year">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ fontWeight: 600 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#d97706"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
                <div>
                    <ChartCard title="Service Mix" subtitle="Distribution of bookings by category">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceDistribution}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {serviceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-slate-600 dark:text-slate-400 font-bold text-xs">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
                    <div>
                        <h3 className="text-xl font-bold">Recent Bookings</h3>
                        <p className="text-sm text-slate-500 font-medium.">Latest activity across all modules.</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/reports/bookings')}
                        className="text-primary-600 dark:text-primary-400 text-sm font-bold hover:underline flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl transition-all"
                    >
                        Manage All <ArrowUpRight size={14} />
                    </button>
                </div>
                <DataTable columns={columns} data={recentBookings} />
            </div>
        </div>
    );
};

export default AdminPanel;
