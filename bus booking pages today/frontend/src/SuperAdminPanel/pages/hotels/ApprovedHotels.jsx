import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHotels, blockHotelThunk, unblockHotelThunk } from '../../slices/hotelSlice';
import { CheckCircle2, MapPin, Hotel, Star, Shield, ShieldOff, Search } from 'lucide-react';

const ApprovedHotels = () => {
    const dispatch = useDispatch();
    const { hotels, loading } = useSelector((state) => state.hotels);
    const [search, setSearch] = useState('');

    useEffect(() => { dispatch(fetchAllHotels()); }, [dispatch]);

    const approved = useMemo(() =>
        hotels.filter(h => h.status === 'approved' && (!search || h.hotelName?.toLowerCase().includes(search.toLowerCase()) || h.city?.toLowerCase().includes(search.toLowerCase()))),
        [hotels, search]
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Approved Hotels</h1>
                        <p className="text-slate-500 text-sm font-medium">{approved.length} hotels live on the platform</p>
                    </div>
                </div>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                        placeholder="Search hotels..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Hotel', 'City', 'Operator', 'Rooms', 'Rating', 'Price/Night', 'Blocked', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}><td colSpan={8}><div className="h-12 px-4 py-2"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></div></td></tr>
                            ))
                        ) : approved.length === 0 ? (
                            <tr><td colSpan={8} className="px-4 py-16 text-center text-slate-500 font-medium">No approved hotels found</td></tr>
                        ) : approved.map(hotel => (
                            <tr key={hotel._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><Hotel size={16} /></div>
                                        <span className="font-bold text-slate-900 dark:text-white">{hotel.hotelName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400"><MapPin size={13} />{hotel.city}</div>
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{hotel.operatorName || 'N/A'}</td>
                                <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">{hotel.totalRooms}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-0.5 text-amber-500">
                                        {[...Array(hotel.starRating || 3)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">
                                    {hotel.pricePerNight ? `₹${hotel.pricePerNight.toLocaleString()}` : '—'}
                                </td>
                                <td className="px-4 py-3">
                                    {hotel.isBlocked
                                        ? <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700">BLOCKED</span>
                                        : <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500">Active</span>}
                                </td>
                                <td className="px-4 py-3">
                                    {hotel.isBlocked
                                        ? <button onClick={() => dispatch(unblockHotelThunk(hotel._id))} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors">
                                            <ShieldOff size={13} /> Unblock
                                        </button>
                                        : <button onClick={() => dispatch(blockHotelThunk(hotel._id))} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors">
                                            <Shield size={13} /> Block
                                        </button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovedHotels;
