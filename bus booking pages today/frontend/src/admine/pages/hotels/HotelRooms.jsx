import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Ban, Hotel } from 'lucide-react';
import { getAllRooms, deleteRoom, createRoom } from '../../../api/hotelApi';


const HotelRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ hotelId: '', roomType: '', pricePerNight: '', capacity: '', totalRooms: '', status: 'Available' });

    useEffect(() => { fetchRooms(); }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await getAllRooms();
            setRooms(data?.rooms || data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createRoom(form);
            setShowAdd(false);
            setForm({ hotelId: '', roomType: '', pricePerNight: '', capacity: '', totalRooms: '', status: 'Available' });
            fetchRooms();
        } catch (err) { alert(err?.error || 'Failed to add room'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this room?')) return;
        await deleteRoom(id);
        fetchRooms();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Hotel Rooms</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage room inventory</p>
                </div>
                <button onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-[#d84e55] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-lg">
                    <Plus className="h-4 w-4" /> Add Room
                </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/60 border-b border-gray-50">
                            {['Hotel', 'Room Type', 'Price/Night', 'Capacity', 'Total Rooms', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="py-14 text-center">
                                <div className="w-8 h-8 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin mx-auto" />
                            </td></tr>
                        ) : rooms.length === 0 ? (
                            <tr><td colSpan="7" className="py-14 text-center text-xs font-black text-gray-300 uppercase tracking-widest">No Rooms Found</td></tr>
                        ) : rooms.map(r => (
                            <tr key={r._id} className="hover:bg-gray-50/40 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-fuchsia-50 flex items-center justify-center">
                                            <Hotel className="h-4 w-4 text-fuchsia-400" />
                                        </div>
                                        <span className="text-sm font-black text-gray-800">{r.hotelId?.hotelName || r.hotelId || '—'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-600">{r.roomType}</td>
                                <td className="px-6 py-4 text-sm font-black text-[#d84e55]">₹{(r.pricePerNight || 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-600">{r.capacity}</td>
                                <td className="px-6 py-4 text-sm font-black text-gray-700">{r.totalRooms}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${r.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:scale-110 transition-all"><Edit className="h-3.5 w-3.5" /></button>
                                        <button className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:scale-110 transition-all"><Ban className="h-3.5 w-3.5" /></button>
                                        <button onClick={() => handleDelete(r._id)} className="p-2 bg-red-50 text-[#d84e55] rounded-xl hover:scale-110 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Room Modal */}
            {showAdd && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
                    <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl space-y-6">
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Add Hotel Room</h3>
                        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                            {[
                                { key: 'hotelId', label: 'Hotel ID', placeholder: 'Hotel ObjectId' },
                                { key: 'roomType', label: 'Room Type', placeholder: 'Deluxe / Suite' },
                                { key: 'pricePerNight', label: 'Price/Night (₹)', placeholder: '2500', type: 'number' },
                                { key: 'capacity', label: 'Capacity', placeholder: '2', type: 'number' },
                                { key: 'totalRooms', label: 'Total Rooms', placeholder: '10', type: 'number' },
                            ].map(({ key, label, placeholder, type = 'text' }) => (
                                <div key={key} className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
                                    <input type={type} placeholder={placeholder} value={form[key]}
                                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        className="w-full bg-gray-50 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-red-100 transition-all" />
                                </div>
                            ))}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full bg-gray-50 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-red-100">
                                    <option>Available</option><option>Unavailable</option>
                                </select>
                            </div>
                            <div className="col-span-2 flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowAdd(false)}
                                    className="flex-1 py-3 rounded-xl bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-all">Cancel</button>
                                <button type="submit"
                                    className="flex-1 py-3 rounded-xl bg-[#d84e55] text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all">Add Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelRooms;
