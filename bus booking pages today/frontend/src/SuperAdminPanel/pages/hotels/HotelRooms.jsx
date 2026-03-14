import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHotels } from '../../slices/hotelSlice';
import { getAllRooms, deleteRoom, createRoom } from '../../../api/hotelApi';
import { BedDouble, Search, Trash2, Plus, X, Hotel, ChevronRight } from 'lucide-react';

const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Family', 'Single', 'Double'];

const HotelRooms = () => {
    const dispatch = useDispatch();
    const { hotels } = useSelector((state) => state.hotels);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ hotelId: '', roomType: 'Standard', price: '', capacity: 2, totalRooms: 1, status: 'available' });
    const [submitting, setSubmitting] = useState(false);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const data = await getAllRooms();
            setRooms(data.rooms || []);
        } catch (_) { }
        setLoading(false);
    };

    useEffect(() => {
        fetchRooms();
        dispatch(fetchAllHotels());
    }, [dispatch]);

    const filtered = useMemo(() =>
        rooms.filter(r => !search || r.hotelId?.hotelName?.toLowerCase().includes(search.toLowerCase()) || r.roomType?.toLowerCase().includes(search.toLowerCase())),
        [rooms, search]
    );

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this room?')) return;
        await deleteRoom(id);
        fetchRooms();
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try { await createRoom(form); setShowForm(false); fetchRooms(); } catch (_) { }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                        <BedDouble size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hotel Rooms</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage all room types across hotels</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all">
                    <Plus size={16} /> Add Room
                </button>
            </div>

            {/* Add Room Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Room</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Hotel *</label>
                                <select required onChange={e => setForm(f => ({ ...f, hotelId: e.target.value }))} value={form.hotelId}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select hotel...</option>
                                    {hotels.map(h => <option key={h._id} value={h._id}>{h.hotelName} – {h.city}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Room Type</label>
                                    <select onChange={e => setForm(f => ({ ...f, roomType: e.target.value }))} value={form.roomType}
                                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Price/Night (₹) *</label>
                                    <input required type="number" min="0" value={form.price}
                                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. 2500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Capacity</label>
                                    <input type="number" min="1" value={form.capacity}
                                        onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Total Rooms</label>
                                    <input type="number" min="1" value={form.totalRooms}
                                        onChange={e => setForm(f => ({ ...f, totalRooms: e.target.value }))}
                                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                            <button type="submit" disabled={submitting}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                                {submitting ? 'Creating...' : 'Create Room'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Search by hotel or type..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Hotel', 'Room Type', 'Price/Night', 'Capacity', 'Total Rooms', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(5)].map((_, i) => <tr key={i}><td colSpan={7}><div className="h-12 px-4 py-2"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></div></td></tr>)
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-16 text-center text-slate-500 font-medium">No rooms found</td></tr>
                        ) : filtered.map(room => (
                            <tr key={room._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Hotel size={14} className="text-slate-400" />
                                        <span className="font-semibold text-slate-800 dark:text-white">{room.hotelId?.hotelName || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                        {room.roomType}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">₹{room.price?.toLocaleString()}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{room.capacity} guests</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{room.totalRooms}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${room.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {room.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleDelete(room._id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors">
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

export default HotelRooms;
