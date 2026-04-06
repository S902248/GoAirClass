import { BarChart3, PieChart as PieChartIcon, TrendingUp, Download } from 'lucide-react';
import ChartCard from '../../components/common/ChartCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const TrainReports = () => {
    const revenueData = [
        { name: 'Jan', revenue: 450000, bookings: 1200 },
        { name: 'Feb', revenue: 380000, bookings: 980 },
        { name: 'Mar', revenue: 520000, bookings: 1450 },
        { name: 'Apr', revenue: 610000, bookings: 1600 },
        { name: 'May', revenue: 580000, bookings: 1550 },
    ];

    const distributionData = [
        { name: 'General', value: 65, color: '#ea580c' },
        { name: 'Tatkal', value: 25, color: '#f59e0b' },
        { name: 'Premium', value: 10, color: '#0f172a' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Train Reports</h1>
                    <p className="text-slate-500 mt-1 font-medium">Deep dive into booking trends and revenue analytics.</p>
                </div>
                <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                    <Download size={18} />
                    <span>Export Analytics</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Revenue vs Bookings" subtitle="Monthly performance correlation">
                    <ResponsiveContainer width="100%" height="300">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                            <Legend verticalAlign="top" align="right" iconType="circle" />
                            <Bar dataKey="revenue" fill="#ea580c" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                            <Bar dataKey="bookings" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Bookings" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Quota Distribution" subtitle="Percentage of seats booked per quota">
                    <ResponsiveContainer width="100%" height="300">
                        <PieChart>
                            <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {distributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="card p-8 bg-slate-50 dark:bg-slate-800/50 border-dashed border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl shadow-sm flex items-center justify-center text-train-primary mb-4">
                    <TrendingUp size={32} />
                </div>
                <h3 className="text-xl font-bold">Predictive Analytics Coming Soon</h3>
                <p className="text-slate-500 max-w-md mt-2">We are working on AI-powered booking predictions to help you optimize train schedules and pricing.</p>
            </div>
        </div>
    );
};

export default TrainReports;
