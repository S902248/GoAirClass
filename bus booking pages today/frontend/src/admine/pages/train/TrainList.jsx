import React, { useState, useEffect } from 'react';
import { Train, Search, Filter, Loader2 } from 'lucide-react';
import Axios from '../../../api/Axios';

const TrainList = () => {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const response = await Axios.get('/admin/train/trains');
                if (response.data.success) {
                    setTrains(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching trains:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrains();
    }, []);

    const filteredTrains = trains.filter(t => 
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.source?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.destination?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-screen animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-indigo-200 transition-transform hover:scale-110 duration-300">
                        <Train size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Train List</h1>
                        <p className="text-gray-400 font-bold text-xs tracking-[0.2em] uppercase">{loading ? '...' : filteredTrains.length} OPERATIONAL TRAINS</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-50 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-[13px] font-black text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all uppercase tracking-wider"
                        placeholder="Search by name, number or route..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-gray-200 transition-all">
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                {['Train Name', 'Train Number', 'Route', 'Status'].map(h => (
                                    <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-black uppercase tracking-widest">
                                        <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
                                        Fetching Train Fleet...
                                    </td>
                                </tr>
                            ) : filteredTrains.map((t) => (
                                <tr key={t._id} className="hover:bg-gray-50/70 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{t.name}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-black text-gray-500 tracking-widest">{t.number}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {t.source?.name} - {t.destination?.name}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest
                                            ${t.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredTrains.length === 0 && (
                    <div className="py-20 text-center">
                        <Train className="h-12 w-12 text-gray-100 mx-auto mb-4" />
                        <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No trains found in fleet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainList;
