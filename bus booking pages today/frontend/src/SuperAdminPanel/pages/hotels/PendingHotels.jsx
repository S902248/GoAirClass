import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHotels, approveHotelThunk, rejectHotelThunk } from '../../slices/hotelSlice';
import { Clock, CheckCircle, XCircle, MapPin, Hotel, Eye } from 'lucide-react';

const PendingHotels = () => {
    const dispatch = useDispatch();
    const { hotels, loading } = useSelector((state) => state.hotels);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingId, setRejectingId] = useState(null);

    useEffect(() => { dispatch(fetchAllHotels()); }, [dispatch]);

    const pending = useMemo(() => hotels.filter(h => h.status === 'pending'), [hotels]);

    const handleApprove = (id) => dispatch(approveHotelThunk(id));
    const handleReject = (id) => {
        dispatch(rejectHotelThunk({ id, reason: rejectReason || 'Rejected by admin' }));
        setRejectingId(null);
        setRejectReason('');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
                    <Clock size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Pending Approval</h1>
                    <p className="text-slate-500 text-sm font-medium">{pending.length} hotel{pending.length !== 1 ? 's' : ''} awaiting review</p>
                </div>
            </div>

            {loading ? (
                <div className="card p-12 text-center text-slate-400 font-medium">Loading...</div>
            ) : pending.length === 0 ? (
                <div className="card p-16 text-center">
                    <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">All caught up!</h3>
                    <p className="text-slate-500 text-sm mt-1">No hotels are pending approval right now.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pending.map(hotel => (
                        <div key={hotel._id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
                                    <Hotel size={26} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-900 dark:text-white">{hotel.hotelName}</h3>
                                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
                                        <MapPin size={13} /> <span>{hotel.city}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Operator: {hotel.operatorName || 'N/A'} · {hotel.totalRooms} rooms · ★{hotel.starRating}</p>
                                    {hotel.description && <p className="text-xs text-slate-500 mt-2 max-w-md line-clamp-2">{hotel.description}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleApprove(hotel._id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all"
                                >
                                    <CheckCircle size={16} /> Approve
                                </button>
                                {rejectingId === hotel._id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            placeholder="Rejection reason..."
                                            value={rejectReason}
                                            onChange={e => setRejectReason(e.target.value)}
                                            autoFocus
                                        />
                                        <button onClick={() => handleReject(hotel._id)} className="px-3 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors">Confirm</button>
                                        <button onClick={() => setRejectingId(null)} className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors">Cancel</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setRejectingId(hotel._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-500/25 transition-all"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingHotels;
