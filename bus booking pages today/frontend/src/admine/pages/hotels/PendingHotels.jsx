import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Hotel } from 'lucide-react';
import { getPendingHotels, approveHotel, rejectHotel } from '../../../api/hotelApi';


const PendingHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectId, setRejectId] = useState(null);
    const [reason, setReason] = useState('');

    useEffect(() => { fetchHotels(); }, []);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const data = await getPendingHotels();
            setHotels(data?.hotels || data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleApprove = async (id) => {
        await approveHotel(id);
        fetchHotels();
    };

    const handleReject = async () => {
        if (!reason.trim()) return alert('Please provide a rejection reason.');
        await rejectHotel(rejectId, reason);
        setRejectId(null);
        setReason('');
        fetchHotels();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Pending Approval</h1>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1">{hotels.length} hotel(s) awaiting review</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : hotels.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-gray-50 shadow-sm">
                    <CheckCircle className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
                    <p className="text-sm font-black text-gray-300 uppercase tracking-widest">All caught up! No pending hotels.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {hotels.map(h => (
                        <div key={h._id} className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col">
                            {/* Cover */}
                            <div className="h-40 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                                {h.images?.[0]
                                    ? <img src={h.images[0]} alt="" className="w-full h-full object-cover" />
                                    : <Hotel className="h-10 w-10 text-gray-200" />}
                                <div className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                    Pending
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col gap-3">
                                <div>
                                    <h3 className="font-black text-gray-800 text-base">{h.hotelName}</h3>
                                    <p className="text-xs font-bold text-gray-400">{h.city} · {h.address}</p>
                                </div>
                                {h.description && (
                                    <p className="text-xs text-gray-500 line-clamp-2">{h.description}</p>
                                )}

                                <div className="flex gap-2 mt-auto pt-3">
                                    <button onClick={() => handleApprove(h._id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-600 active:scale-95 transition-all">
                                        <CheckCircle className="h-3.5 w-3.5" />Approve
                                    </button>
                                    <button onClick={() => setRejectId(h._id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-[#d84e55] py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-100 active:scale-95 transition-all">
                                        <XCircle className="h-3.5 w-3.5" />Reject
                                    </button>
                                    <button className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:scale-110 transition-all" title="View">
                                        <Eye className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject reason modal */}
            {rejectId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setRejectId(null)} />
                    <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl space-y-4">
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Reject Hotel</h3>
                        <textarea
                            rows={4}
                            placeholder="Reason for rejection..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-red-100 resize-none"
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setRejectId(null)}
                                className="flex-1 py-3 rounded-xl bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-all">
                                Cancel
                            </button>
                            <button onClick={handleReject}
                                className="flex-1 py-3 rounded-xl bg-[#d84e55] text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all">
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingHotels;
