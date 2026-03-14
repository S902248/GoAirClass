import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHotels, deleteHotelThunk } from '../../slices/hotelSlice';
import { XOctagon, MapPin, Hotel, Trash2 } from 'lucide-react';

const RejectedHotels = () => {
    const dispatch = useDispatch();
    const { hotels, loading } = useSelector((state) => state.hotels);

    useEffect(() => { dispatch(fetchAllHotels()); }, [dispatch]);

    const rejected = useMemo(() => hotels.filter(h => h.status === 'rejected'), [hotels]);

    const handleDelete = (id) => {
        if (window.confirm('Permanently delete this hotel?')) dispatch(deleteHotelThunk(id));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600">
                    <XOctagon size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Rejected Hotels</h1>
                    <p className="text-slate-500 text-sm font-medium">{rejected.length} hotel{rejected.length !== 1 ? 's' : ''} rejected</p>
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Hotel', 'City', 'Operator', 'Rejection Reason', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <tr key={i}><td colSpan={5}><div className="h-12 px-4 py-2"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></div></td></tr>
                            ))
                        ) : rejected.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-16 text-center text-slate-500 font-medium">No rejected hotels</td></tr>
                        ) : rejected.map(hotel => (
                            <tr key={hotel._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600"><Hotel size={16} /></div>
                                        <span className="font-bold text-slate-900 dark:text-white">{hotel.hotelName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-1 text-slate-500"><MapPin size={13} />{hotel.city}</div>
                                </td>
                                <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{hotel.operatorName || 'N/A'}</td>
                                <td className="px-4 py-4">
                                    <span className="text-rose-600 dark:text-rose-400 text-xs italic font-medium">
                                        {hotel.rejectionReason || 'No reason provided'}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <button
                                        onClick={() => handleDelete(hotel._id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors"
                                    >
                                        <Trash2 size={13} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RejectedHotels;
