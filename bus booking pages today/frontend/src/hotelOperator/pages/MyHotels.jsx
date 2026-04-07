import React, { useState, useEffect, useMemo } from 'react';
import { Hotel, MapPin, Star, Trash2, Edit, Search } from 'lucide-react';
import { getMyHotels, deleteMyHotel } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }) => {
    const map = {
        approved: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-600',
        rejected: 'bg-rose-100 text-rose-600',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${map[status] || 'bg-gray-100 text-gray-400'}`}>
            {status || 'Unknown'}
        </span>
    );
};

const MyHotels = () => {
    const { hasPerm } = useHotelOperator();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    if (!hasPerm('ManageHotels')) {
        return <div className="p-8 text-center text-red-500 font-bold">Access Denied: You do not have permission to manage hotels.</div>;
    }

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const data = await getMyHotels();
            setHotels(data.hotels || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchHotels(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this hotel permanently? Rooms and bookings may also be affected.')) return;
        try {
            await deleteMyHotel(id);
            fetchHotels();
        } catch (err) { alert(err?.error || 'Delete failed'); }
    };

    const filtered = useMemo(() => {
        if (!search) return hotels;
        const lower = search.toLowerCase();
        return hotels.filter(h =>
            h.hotelName?.toLowerCase().includes(lower) ||
            h.city?.toLowerCase().includes(lower)
        );
    }, [hotels, search]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">My Hotels</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your properties</p>
                </div>
                {hasPerm('AddHotel') && (
                    <Link to="/hotel-operator/hotels/add"
                        className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-fuchsia-200">
                        Add New Hotel
                    </Link>
                )}
            </div>

            {/* Table card */}
            <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden p-6 md:p-8">
                {/* Search */}
                <div className="relative w-full md:w-80 mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200"
                        placeholder="Search by hotel or city..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Hotel', 'City', 'Rating', 'Total Rooms', 'Status', 'Created On', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={7} className="px-4 py-4">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-16 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        No hotels found
                                    </td>
                                </tr>
                            ) : filtered.map(h => (
                                <tr key={h._id} className="hover:bg-gray-50/50 transition-colors">
                                    {/* Hotel name */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            {h.images?.[0] ? (
                                                <img src={h.images[0]} alt={h.hotelName}
                                                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <Hotel className="h-5 w-5 text-gray-300" />
                                                </div>
                                            )}
                                            <span className="font-black text-gray-700 tracking-tight">{h.hotelName}</span>
                                        </div>
                                    </td>

                                    {/* City */}
                                    <td className="px-4 py-4">
                                        <span className="flex items-center gap-1 text-gray-500 font-medium">
                                            <MapPin className="h-3.5 w-3.5 text-gray-300" />{h.city}
                                        </span>
                                    </td>

                                    {/* Rating */}
                                    <td className="px-4 py-4">
                                        <span className="flex items-center gap-1 text-amber-500 font-black">
                                            <Star className="h-3.5 w-3.5 fill-amber-400" />{h.starRating}
                                        </span>
                                    </td>

                                    {/* Total rooms */}
                                    <td className="px-4 py-4 text-gray-500 font-medium">{h.totalRooms || 0} Rooms</td>

                                    {/* Status */}
                                    <td className="px-4 py-4"><StatusBadge status={h.status} /></td>

                                    {/* Created On */}
                                    <td className="px-4 py-4 text-gray-400 font-medium text-xs">
                                        {new Date(h.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-4">
                                        <div className="flex gap-2 text-[#d84e55]">
                                            <Link to={`/hotel-operator/hotels/edit/${h._id}`}
                                                className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(h._id)}
                                                className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
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

export default MyHotels;
