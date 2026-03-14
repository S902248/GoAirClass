import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Ban, Trash2, CheckCircle, ChevronLeft, ChevronRight, Hotel } from 'lucide-react';
import { getAllHotels, deleteHotel, blockHotel, unblockHotel } from '../../../api/hotelApi';


const StatusBadge = ({ status }) => {
    const map = {
        pending: 'bg-amber-50 text-amber-600',
        approved: 'bg-emerald-50 text-emerald-600',
        rejected: 'bg-red-50 text-[#d84e55]',
        blocked: 'bg-gray-100 text-gray-500',
    };
    return (
        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${map[status] || 'bg-gray-50 text-gray-400'}`}>
            {status}
        </span>
    );
};

const AllHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const PER_PAGE = 8;

    useEffect(() => { fetchHotels(); }, []);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const data = await getAllHotels();
            setHotels(data?.hotels || data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const cities = ['All', ...new Set(hotels.map(h => h.city).filter(Boolean))];

    const filtered = hotels.filter(h => {
        const matchSearch = h.hotelName?.toLowerCase().includes(search.toLowerCase()) ||
            h.city?.toLowerCase().includes(search.toLowerCase());
        const matchCity = cityFilter === 'All' || h.city === cityFilter;
        const matchStatus = statusFilter === 'All' || h.status === statusFilter;
        return matchSearch && matchCity && matchStatus;
    });

    const total = Math.ceil(filtered.length / PER_PAGE);
    const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this hotel?')) return;
        await deleteHotel(id);
        fetchHotels();
    };

    const handleToggleBlock = async (hotel) => {
        if (hotel.status === 'blocked') await unblockHotel(hotel._id);
        else await blockHotel(hotel._id);
        fetchHotels();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">All Hotels</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage all hotel listings</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search hotels..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3 pl-11 pr-5 text-sm font-medium focus:border-[#d84e55] focus:ring-4 focus:ring-red-50 outline-none transition-all"
                    />
                </div>
                <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); setPage(1); }}
                    className="bg-white border-2 border-gray-100 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-gray-200 transition-all">
                    {cities.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="bg-white border-2 border-gray-100 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-gray-200 transition-all">
                    {['All', 'pending', 'approved', 'rejected', 'blocked'].map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-50">
                                {['Image', 'Hotel Name', 'City', 'Operator', 'Rooms', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="7" className="py-16 text-center">
                                    <div className="w-8 h-8 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin mx-auto" />
                                </td></tr>
                            ) : current.length === 0 ? (
                                <tr><td colSpan="7" className="py-16 text-center text-xs font-black text-gray-300 uppercase tracking-widest">No Hotels Found</td></tr>
                            ) : current.map(h => (
                                <tr key={h._id} className="hover:bg-gray-50/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="w-14 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {h.images?.[0]
                                                ? <img src={h.images[0]} alt="" className="w-full h-full object-cover" />
                                                : <Hotel className="h-5 w-5 text-gray-300" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-black text-gray-800 text-sm">{h.hotelName}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">{h._id?.slice(-6).toUpperCase()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-600">{h.city}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-500">{h.operatorId?.name || '—'}</td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-700">{h.totalRooms ?? '—'}</td>
                                    <td className="px-6 py-4"><StatusBadge status={h.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:scale-110 transition-all" title="View">
                                                <Eye className="h-3.5 w-3.5" /></button>
                                            <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:scale-110 transition-all" title="Edit">
                                                <Edit className="h-3.5 w-3.5" /></button>
                                            <button onClick={() => handleToggleBlock(h)}
                                                className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:scale-110 transition-all"
                                                title={h.status === 'blocked' ? 'Unblock' : 'Block'}>
                                                <Ban className="h-3.5 w-3.5" /></button>
                                            <button onClick={() => handleDelete(h._id)}
                                                className="p-2 bg-red-50 text-[#d84e55] rounded-xl hover:scale-110 transition-all" title="Delete">
                                                <Trash2 className="h-3.5 w-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {filtered.length} hotels
                    </p>
                    <div className="flex gap-2">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                            className="p-2 bg-gray-50 rounded-xl disabled:opacity-30 hover:bg-red-50 hover:text-[#d84e55] transition-all">
                            <ChevronLeft className="h-4 w-4" /></button>
                        {[...Array(total)].map((_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${page === i + 1 ? 'bg-[#d84e55] text-white' : 'bg-gray-50 text-gray-400 hover:bg-red-50'}`}>
                                {i + 1}</button>
                        ))}
                        <button disabled={page === total} onClick={() => setPage(p => p + 1)}
                            className="p-2 bg-gray-50 rounded-xl disabled:opacity-30 hover:bg-red-50 hover:text-[#d84e55] transition-all">
                            <ChevronRight className="h-4 w-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllHotels;
