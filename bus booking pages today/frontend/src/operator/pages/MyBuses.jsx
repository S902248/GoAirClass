import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Bus as BusIcon, Edit, Trash2, Search, Filter, MoreVertical, Eye, Settings2 } from 'lucide-react';
import { getOperatorBuses, deleteBus } from '../../api/busApi';

const MyBuses = () => {
    const navigate = useNavigate();
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All Types');

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const data = await getOperatorBuses();
            setBuses(data);
        } catch (err) {
            console.error('Error fetching buses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this bus?')) {
            try {
                await deleteBus(id);
                fetchBuses();
            } catch (err) {
                alert('Failed to delete bus');
            }
        }
    };

    const filteredBuses = buses.filter(bus => {
        const matchesSearch = bus.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All Types' || bus.busType === typeFilter;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <BusIcon className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Fleet Database...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight">My Fleet</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Manage and monitor your active bus units</p>
                </div>
                <button
                    onClick={() => navigate('/operator/buses/add')}
                    className="flex items-center gap-3 bg-[#d84e55] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-red-500/10 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Add New Bus
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-[#d84e55]" />
                    <input
                        type="text"
                        placeholder="Search by name or plate number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl py-4 pl-14 pr-6 text-xs font-bold focus:ring-2 focus:ring-red-100 transition-all outline-none"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-gray-50 border-none rounded-xl py-4 px-6 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-red-100 appearance-none outline-none cursor-pointer"
                    >
                        <option>All Types</option>
                        <option>Seater</option>
                        <option>Sleeper</option>
                        <option>Sleeper + Seater</option>
                    </select>
                    <button className="bg-gray-50 p-4 rounded-xl text-gray-400 hover:text-[#d84e55] transition-colors border-none outline-none">
                        <Settings2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bus Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Capacity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amenities</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBuses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-2">
                                                <BusIcon className="h-8 w-8 text-gray-200" />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No buses found in fleet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBuses.map((bus) => (
                                    <tr key={bus._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors shadow-sm">
                                                    <BusIcon className="h-6 w-6 text-[#d84e55]" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-deep-navy uppercase text-sm tracking-tight">{bus.busName}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{bus.busNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {bus.busType}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-deep-navy">{bus.totalSeats}</span>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Seats</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex -space-x-2">
                                                {bus.amenities.map((a, i) => (
                                                    <div key={i} className="w-7 h-7 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-[8px] font-black text-deep-navy shadow-sm uppercase tooltip" title={a}>
                                                        {a.charAt(0)}
                                                    </div>
                                                ))}
                                                {bus.amenities.length === 0 && <span className="text-[10px] font-bold text-gray-300 italic">None</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center">
                                                <span className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                    Active
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="w-9 h-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-white hover:text-deep-navy hover:shadow-lg transition-all active:scale-90 border border-transparent hover:border-gray-100">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="w-9 h-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-white hover:text-blue-500 hover:shadow-lg transition-all active:scale-90 border border-transparent hover:border-gray-100">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bus._id)}
                                                    className="w-9 h-9 bg-red-50 text-[#d84e55] rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white hover:shadow-lg transition-all active:scale-90"
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
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredBuses.length} of {buses.length} units</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white rounded-lg text-[10px] font-black text-gray-300 border border-gray-100 cursor-not-allowed">PREV</button>
                        <button className="px-4 py-2 bg-white rounded-lg text-[10px] font-black text-gray-300 border border-gray-100 cursor-not-allowed">NEXT</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyBuses;
