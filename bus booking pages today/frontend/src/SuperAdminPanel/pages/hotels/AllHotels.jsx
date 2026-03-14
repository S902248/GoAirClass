import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHotels, approveHotelThunk, rejectHotelThunk, blockHotelThunk, unblockHotelThunk, deleteHotelThunk } from '../../slices/hotelSlice';
import { Hotel, Search, MapPin, Star, Eye, Edit3, Shield, ShieldOff, Trash2, CheckCircle, XCircle } from 'lucide-react';

const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const AllHotels = () => {
    const dispatch = useDispatch();
    const { hotels, loading } = useSelector((state) => state.hotels);
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;

    useEffect(() => { dispatch(fetchAllHotels()); }, [dispatch]);

    const cities = useMemo(() => [...new Set(hotels.map(h => h.city).filter(Boolean))], [hotels]);

    const filtered = useMemo(() => hotels.filter(h => {
        const matchSearch = !search || h.hotelName?.toLowerCase().includes(search.toLowerCase()) || h.city?.toLowerCase().includes(search.toLowerCase());
        const matchCity = !cityFilter || h.city === cityFilter;
        const matchStatus = !statusFilter || h.status === statusFilter;
        return matchSearch && matchCity && matchStatus;
    }), [hotels, search, cityFilter, statusFilter]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleAction = async (action, id, extra) => {
        if (action === 'approve') dispatch(approveHotelThunk(id));
        else if (action === 'reject') dispatch(rejectHotelThunk({ id, reason: extra || 'Rejected by admin' }));
        else if (action === 'block') dispatch(blockHotelThunk(id));
        else if (action === 'unblock') dispatch(unblockHotelThunk(id));
        else if (action === 'delete') { if (window.confirm('Delete this hotel?')) dispatch(deleteHotelThunk(id)); }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600">
                    <Hotel size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">All Hotels</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage all hotels across the platform</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Search hotel or city..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <select
                    className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={cityFilter}
                    onChange={e => { setCityFilter(e.target.value); setCurrentPage(1); }}
                >
                    <option value="">All Cities</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                    className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Hotel', 'City', 'Operator', 'Rooms', 'Stars', 'Status', 'Blocked', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></td></tr>
                            ))
                        ) : paged.length === 0 ? (
                            <tr><td colSpan={8} className="px-4 py-16 text-center text-slate-500 font-medium">No hotels found</td></tr>
                        ) : paged.map(hotel => (
                            <tr key={hotel._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 flex-shrink-0">
                                            <Hotel size={18} />
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white">{hotel.hotelName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                        <MapPin size={13} />
                                        <span>{hotel.city}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-medium">{hotel.operatorName || 'N/A'}</td>
                                <td className="px-4 py-4"><span className="font-bold text-slate-800 dark:text-white">{hotel.totalRooms}</span></td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-0.5 text-amber-500">
                                        {[...Array(hotel.starRating || 3)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[hotel.status]}`}>
                                        {hotel.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {hotel.isBlocked
                                        ? <span className="px-2 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700">BLOCKED</span>
                                        : <span className="px-2 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-500">Active</span>}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-1">
                                        {hotel.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleAction('approve', hotel._id)} className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors" title="Approve">
                                                    <CheckCircle size={15} />
                                                </button>
                                                <button onClick={() => handleAction('reject', hotel._id)} className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors" title="Reject">
                                                    <XCircle size={15} />
                                                </button>
                                            </>
                                        )}
                                        {hotel.isBlocked
                                            ? <button onClick={() => handleAction('unblock', hotel._id)} className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Unblock"><ShieldOff size={15} /></button>
                                            : <button onClick={() => handleAction('block', hotel._id)} className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors" title="Block"><Shield size={15} /></button>
                                        }
                                        <button onClick={() => handleAction('delete', hotel._id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors" title="Delete">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-sm text-slate-500 font-medium">{filtered.length} hotels</p>
                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllHotels;
