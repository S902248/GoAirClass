import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Hotel } from 'lucide-react';
import { getRejectedHotels, deleteHotel } from '../../../api/hotelApi';


const RejectedHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchHotels(); }, []);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const data = await getRejectedHotels();
            setHotels(data?.hotels || data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this hotel?')) return;
        await deleteHotel(id);
        fetchHotels();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Rejected Hotels</h1>
                <p className="text-xs font-bold text-[#d84e55] uppercase tracking-widest mt-1">{hotels.length} rejected</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : hotels.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-gray-50 shadow-sm">
                    <Hotel className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No rejected hotels.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-50">
                                {['Hotel', 'City', 'Rejection Reason', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {hotels.map(h => (
                                <tr key={h._id} className="hover:bg-gray-50/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center overflow-hidden">
                                                {h.images?.[0]
                                                    ? <img src={h.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                                                    : <Hotel className="h-4 w-4 text-[#d84e55]" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-sm">{h.hotelName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{h._id?.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-600">{h.city}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs">{h.rejectionReason || '—'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:scale-110 transition-all"><Eye className="h-3.5 w-3.5" /></button>
                                            <button onClick={() => handleDelete(h._id)} className="p-2 bg-red-50 text-[#d84e55] rounded-xl hover:scale-110 transition-all">
                                                <Trash2 className="h-3.5 w-3.5" /></button>
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

export default RejectedHotels;
