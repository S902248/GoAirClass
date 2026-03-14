import React, { useState, useEffect } from 'react';
import { Eye, Edit, Ban, Hotel } from 'lucide-react';
import { getApprovedHotels, blockHotel } from '../../../api/hotelApi';


const ApprovedHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchHotels(); }, []);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const data = await getApprovedHotels();
            setHotels(data?.hotels || data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleBlock = async (id) => {
        if (!window.confirm('Block this hotel?')) return;
        await blockHotel(id);
        fetchHotels();
    };

    const filtered = hotels.filter(h =>
        h.hotelName?.toLowerCase().includes(search.toLowerCase()) ||
        h.city?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Approved Hotels</h1>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">{hotels.length} approved</p>
                </div>
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-white border-2 border-gray-100 rounded-2xl py-3 px-5 text-sm font-medium w-60 focus:border-[#d84e55] outline-none transition-all" />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-50">
                                {['Hotel', 'City', 'Rooms', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="py-14 text-center text-xs font-black text-gray-300 uppercase tracking-widest">No Approved Hotels</td></tr>
                            ) : filtered.map(h => (
                                <tr key={h._id} className="hover:bg-gray-50/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center overflow-hidden">
                                                {h.images?.[0]
                                                    ? <img src={h.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                                                    : <Hotel className="h-5 w-5 text-emerald-400" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-sm">{h.hotelName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{h._id?.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-600">{h.city}</td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-700">{h.totalRooms ?? '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Approved</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:scale-110 transition-all"><Eye className="h-3.5 w-3.5" /></button>
                                            <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:scale-110 transition-all"><Edit className="h-3.5 w-3.5" /></button>
                                            <button onClick={() => handleBlock(h._id)} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:scale-110 transition-all" title="Block">
                                                <Ban className="h-3.5 w-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApprovedHotels;
