import React, { useState, useEffect, useMemo } from 'react';
import { BedDouble, Hotel, Trash2, Search, Edit, Layers } from 'lucide-react';
import { getMyRooms, deleteMyRoom } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }) => {
    const isAvail = status?.toLowerCase() === 'available';
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isAvail ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {status || 'Unknown'}
        </span>
    );
};

const ManageRooms = () => {
    const { hasPerm } = useHotelOperator();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    if (!hasPerm('ManageRooms')) {
        return <div className="p-8 text-center text-red-500 font-bold">Access Denied: You do not have permission to manage rooms.</div>;
    }

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await getMyRooms();
            setRooms(data.rooms || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRooms(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this room permanently?')) return;
        try {
            await deleteMyRoom(id);
            fetchRooms();
        } catch (err) { alert(err?.error || 'Delete failed'); }
    };

    const filtered = useMemo(() => {
        if (!search) return rooms;
        const lower = search.toLowerCase();
        return rooms.filter(r =>
            r.hotelId?.hotelName?.toLowerCase().includes(lower) ||
            r.roomType?.toLowerCase().includes(lower)
        );
    }, [rooms, search]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Manage Rooms</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">View and edit your room inventory</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasPerm('UpdateRoomPrices') && (
                        <Link to="/hotel-operator/rooms/prices" className="px-5 py-2.5 bg-fuchsia-100 text-fuchsia-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-fuchsia-200 transition-colors">
                            Bulk Pricing
                        </Link>
                    )}
                    {hasPerm('AddRooms') && (
                        <Link to="/hotel-operator/rooms/add" className="px-5 py-2.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-fuchsia-200">
                            Add Room
                        </Link>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden p-6 md:p-8">
                {/* Search */}
                <div className="relative w-full md:w-80 mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200"
                        placeholder="Search by hotel or room type..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Hotel', 'Room Type', 'Price/Night', 'Capacity', 'Qty', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div></td></tr>)
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-16 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No rooms found</td></tr>
                            ) : filtered.map(room => (
                                <tr key={room._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Hotel className="h-4 w-4 text-gray-300" />
                                            <span className="font-black text-gray-700 tracking-tight">{room.hotelId?.hotelName || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <BedDouble className="h-4 w-4 text-gray-300" />
                                            <span className="font-bold text-gray-600">{room.roomType}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-black text-fuchsia-600">₹{(room.price ?? room.pricePerNight ?? 0).toLocaleString()}</td>
                                    <td className="px-4 py-4 text-gray-500 font-medium">{room.capacity} Guests</td>
                                    <td className="px-4 py-4 text-gray-500 font-medium">{room.totalRooms} Rooms</td>
                                    <td className="px-4 py-4"><StatusBadge status={room.status} /></td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-2 text-xs">
                                            <Link to="/hotel-operator/rooms/inventory" className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px]">
                                                <Layers className="h-4 w-4" /> <span>Inventory</span>
                                            </Link>
                                            <button className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                                            <button onClick={() => handleDelete(room._id)} className="p-2 bg-red-50 text-[#d84e55] hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageRooms;
