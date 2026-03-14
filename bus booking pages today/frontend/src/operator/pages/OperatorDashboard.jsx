import React, { useState, useEffect } from 'react';
import { Bus, Calendar, Ticket, TrendingUp, Users, MapPin } from 'lucide-react';
import { getOperatorBuses } from '../../api/busApi';
import { getAllSchedules } from '../../api/scheduleApi';
import { getOperatorBookings } from '../../api/bookingApi';

const OperatorDashboard = () => {
    const [stats, setStats] = useState({
        buses: 0,
        schedules: 0,
        bookings: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [buses, schedules, bookings] = await Promise.all([
                getOperatorBuses(),
                getAllSchedules(),
                getOperatorBookings()
            ]);

            setStats({
                buses: buses.length,
                schedules: schedules.length,
                bookings: bookings.length,
                // Simple revenue calculation (placeholder logic)
                revenue: bookings.reduce((acc, b) => acc + (b.totalFare || b.totalAmount || 0), 0)
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Buses', value: stats.buses, icon: Bus, color: 'bg-blue-500' },
        { label: 'Active Schedules', value: stats.schedules, icon: Calendar, color: 'bg-green-500' },
        { label: 'Total Bookings', value: stats.bookings, icon: Ticket, color: 'bg-orange-500' },
        { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-purple-500' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d84e55]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Manage your fleet and bookings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:border-[#d84e55]/20 transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-deep-navy">{stat.value}</h3>
                                </div>
                                <div className={`${stat.color} p-4 rounded-2xl shadow-lg ring-4 ring-gray-50`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-deep-navy uppercase tracking-tight">Recent Activity</h3>
                        <button className="text-[10px] font-black text-[#d84e55] uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {/* Placeholder for recent activity list */}
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <Users className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-deep-navy">New booking for Route #{400 + i}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-deep-navy uppercase tracking-tight">Fleet Status</h3>
                        <button className="text-[10px] font-black text-[#d84e55] uppercase tracking-widest hover:underline">Manage Fleet</button>
                    </div>
                    <div className="space-y-6">
                        {/* Placeholder for fleet status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">On Route</p>
                                <p className="text-xl font-black text-blue-600">85%</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100">
                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Maintenance</p>
                                <p className="text-xl font-black text-orange-600">3 Buses</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500 p-4 bg-gray-50 rounded-2xl">
                            <MapPin className="h-4 w-4 text-[#d84e55]" />
                            Most Active: Delhi - Manali
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatorDashboard;
