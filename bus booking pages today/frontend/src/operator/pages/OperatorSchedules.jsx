import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Calendar, Plus, Trash2, Search, Filter, ArrowRight, Eye, MoreHorizontal, User, Bus } from 'lucide-react';
import { getAllSchedules, deleteSchedule } from '../../api/scheduleApi';
import { getOperatorBuses } from '../../api/busApi';

const OperatorSchedules = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busFilter, setBusFilter] = useState('All Buses');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [schedData, busData] = await Promise.all([
                getAllSchedules(),
                getOperatorBuses()
            ]);
            setSchedules(schedData);
            setBuses(busData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Cancel this trip schedule?')) {
            try {
                await deleteSchedule(id);
                loadData();
            } catch (err) {
                alert('Failed to delete schedule');
            }
        }
    };

    const filteredSchedules = schedules.filter(s => {
        const matchesBus = busFilter === 'All Buses' || s.bus?._id === busFilter || s.bus?.busName === busFilter;
        const matchesDate = !dateFilter || s.startDate?.startsWith(dateFilter);
        return matchesBus && matchesDate;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center animate-bounce">
                    <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compiling Trip Manifests...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight">Trip Schedules</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Timeline for active fleet operations and routing</p>
                </div>
                <button
                    onClick={() => navigate('/operator/schedules/create')}
                    className="flex items-center gap-3 bg-[#d84e55] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-red-500/10 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Confirm New Trip
                </button>
            </div>

            {/* Smart Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="relative group flex-1">
                    <Bus className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-orange-500" />
                    <select
                        value={busFilter}
                        onChange={(e) => setBusFilter(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-[0.1em] focus:ring-2 focus:ring-orange-100 appearance-none outline-none cursor-pointer"
                    >
                        <option>All Buses</option>
                        {buses.map(bus => (
                            <option key={bus._id} value={bus._id}>{bus.busName}</option>
                        ))}
                    </select>
                </div>
                <div className="relative group flex-1">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-blue-500" />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl py-4 pl-14 pr-6 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setBusFilter('All Buses'); setDateFilter(''); }}
                        className="flex-1 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-xl hover:bg-deep-navy hover:text-white transition-all"
                    >
                        Reset Filters
                    </button>
                    <button className="aspect-square bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Schedules Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Route & Times</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignee</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Economics</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Load Factor</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSchedules.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-2">
                                                <Calendar className="h-10 w-10 text-gray-200" />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No active schedules found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSchedules.map((schedule) => (
                                    <tr key={schedule._id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-8">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center shadow-md border border-gray-100 group-hover:border-orange-200 transition-colors">
                                                    <span className="text-[8px] font-black text-orange-500 uppercase">{new Date(schedule.startDate).toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="text-sm font-black text-deep-navy">{new Date(schedule.startDate).getDate()}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-deep-navy uppercase tracking-tight">{schedule.route?.fromCity}</span>
                                                        <ArrowRight className="h-3 w-3 text-gray-300" />
                                                        <span className="text-xs font-black text-deep-navy uppercase tracking-tight">{schedule.route?.toCity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">{schedule.departureTime}</span>
                                                        <span className="text-gray-300">➔</span>
                                                        <span className="text-[10px] font-bold text-gray-400">{schedule.arrivalTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-indigo-50 rounded-xl">
                                                    <Bus className="h-4 w-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-deep-navy uppercase text-[11px] tracking-tight">{schedule.bus?.busName || '---'}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{schedule.bus?.busNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <p className="text-sm font-black text-deep-navy">₹{schedule.ticketPrice}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Per Ticket</p>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50 shadow-inner">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${(schedule.availableSeats / (schedule.bus?.totalSeats || 40)) < 0.2 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-[#d84e55]'
                                                            }`}
                                                        style={{ width: `${(schedule.availableSeats / (schedule.bus?.totalSeats || 40)) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] font-black text-deep-navy uppercase tracking-widest">
                                                    {schedule.availableSeats} Seats Left
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right underline-offset-4">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-white hover:text-deep-navy hover:shadow-xl hover:shadow-gray-900/5 transition-all active:scale-95 border border-transparent hover:border-gray-100" title="View Bookings">
                                                    <User className="h-4 w-4" />
                                                </button>
                                                <button
                                                    className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-white hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-900/5 transition-all active:scale-95 border border-transparent hover:border-gray-100"
                                                    title="Edit Trip"
                                                    onClick={() => navigate(`/operator/schedules/edit/${schedule._id}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(schedule._id)}
                                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-[#d84e55] hover:text-white hover:shadow-xl hover:shadow-red-900/5 transition-all active:scale-95"
                                                    title="Cancel Trip"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default OperatorSchedules;
