import React, { useState, useEffect } from 'react';
import { getHotelOperatorRoomsInventory } from '../../api/operatorApi';
import { Home, Hotel, Bed, CheckCircle2, XCircle, Tag, Layers, Search, Calendar, User, Phone, Hash } from 'lucide-react';

const ManageInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await getHotelOperatorRoomsInventory();
                if (res.success) {
                    setInventory(res.inventory);
                }
            } catch (err) {
                console.error("Error fetching inventory", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const filteredInventory = inventory.filter(item => {
        const hName = item.hotelId?.hotelName || '';
        const rType = item.roomTypeId?.roomType || '';
        const rNum = item.roomNumber || '';

        const matchesSearch = rNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             hName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             rType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-8 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-[#006ce4] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Room Inventory</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage individual room allocations and availability</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                        <button 
                            onClick={() => setFilterStatus('all')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === 'all' ? 'bg-[#006ce4] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilterStatus('available')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === 'available' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Available
                        </button>
                        <button 
                            onClick={() => setFilterStatus('booked')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === 'booked' ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Booked
                        </button>
                    </div>
                </div>

                {/* Filters & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input 
                            type="text" 
                            placeholder="Search by room number, hotel or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-[#006ce4] outline-none transition-all font-medium"
                        />
                    </div>
                    <div className="bg-[#006ce4] p-4 rounded-3xl shadow-lg shadow-blue-100 flex items-center justify-between">
                        <div className="text-white">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Slots</p>
                            <h3 className="text-2xl font-black tracking-tight">{inventory.length}</h3>
                        </div>
                        <Layers className="h-10 w-10 text-white/20" />
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Number</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hotel</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredInventory.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${item.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    <Bed className="h-5 w-5" />
                                                </div>
                                                <span className="font-black text-gray-900 tracking-tight">{item.roomNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-gray-700">{item.hotelId?.hotelName}</td>
                                        <td className="px-8 py-6">
                                            <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {item.roomTypeId?.roomType}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {item.status === 'available' ? (
                                                <span className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                                                    <CheckCircle2 className="h-4 w-4" /> Available
                                                </span>
                                            ) : (
                                                <div className="space-y-1">
                                                    <span className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest">
                                                        <XCircle className="h-4 w-4" /> Booked
                                                    </span>
                                                    {item.currentBooking && (
                                                        <div className="flex flex-col text-[10px] text-gray-400 font-bold uppercase tracking-tight gap-1 mt-1">
                                                            <div className="flex items-center gap-1.5 text-gray-700">
                                                                <User className="h-3 w-3 text-blue-500" /> <span>{item.currentBooking.guestName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Phone className="h-3 w-3 text-green-500" /> <span>{item.currentBooking.guestPhone}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Hash className="h-3 w-3 text-purple-500" /> <span>{item.currentBooking.bookingId}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
                                                                <Calendar className="h-3 w-3 text-amber-500" />
                                                                <span>{new Date(item.currentBooking.checkInDate).toLocaleDateString()} - {new Date(item.currentBooking.checkOutDate).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-400 font-medium">
                                            {new Date(item.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                                {filteredInventory.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Search className="h-12 w-12 text-gray-200" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No matching rooms found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageInventory;
