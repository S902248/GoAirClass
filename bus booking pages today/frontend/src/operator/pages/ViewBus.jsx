import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Bus, ArrowLeft, Edit, Wifi, Wind, Zap, Coffee, Tv,
    Users, Hash, Tag, CheckCircle2, Info
} from 'lucide-react';
import { getOperatorBus } from '../../api/busApi';

// Map amenity names to icons
const amenityIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (n.includes('ac') || n.includes('air')) return <Wind className="h-4 w-4" />;
    if (n.includes('charg') || n.includes('power')) return <Zap className="h-4 w-4" />;
    if (n.includes('water') || n.includes('blanket') || n.includes('pillow')) return <Coffee className="h-4 w-4" />;
    if (n.includes('tv') || n.includes('entertain')) return <Tv className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
};

const typeColor = {
    'Sleeper': 'bg-purple-50 text-purple-700 border-purple-200',
    'Seater': 'bg-blue-50 text-blue-700 border-blue-200',
    'Sleeper + Seater': 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const ViewBus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bus, setBus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBus = async () => {
            try {
                setLoading(true);
                const data = await getOperatorBus(id);
                setBus(data);
            } catch (err) {
                setError(err?.error || err?.message || 'Failed to fetch bus details');
            } finally {
                setLoading(false);
            }
        };
        fetchBus();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4 animate-pulse">
                <div className="w-14 h-14 bg-gray-100 rounded-3xl flex items-center justify-center">
                    <Bus className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fetching Bus Profile...</p>
            </div>
        );
    }

    if (error || !bus) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="w-14 h-14 bg-red-50 rounded-3xl flex items-center justify-center">
                    <Info className="h-7 w-7 text-red-400" />
                </div>
                <p className="text-sm font-bold text-gray-500">{error || 'Bus not found'}</p>
                <button
                    onClick={() => navigate('/operator/buses')}
                    className="px-6 py-3 bg-[#d84e55] text-white rounded-2xl text-xs font-black uppercase tracking-widest"
                >
                    Back to Fleet
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/operator/buses')}
                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all active:scale-90"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#1d2d44] uppercase tracking-tight">Bus Profile</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Full details for this bus unit</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/operator/buses/edit/${id}`)}
                    className="flex items-center gap-2 bg-[#d84e55] text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-lg active:scale-95"
                >
                    <Edit className="h-4 w-4" />
                    Edit Bus
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Main Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Identity Card */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center shadow-inner">
                                <Bus className="h-8 w-8 text-[#d84e55]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#1d2d44] uppercase tracking-tight">{bus.busName}</h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{bus.busNumber}</span>
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${typeColor[bus.busType] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                        {bus.busType}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Hash className="h-3 w-3" /> Bus Number
                                </p>
                                <p className="text-sm font-black text-[#1d2d44] uppercase">{bus.busNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Users className="h-3 w-3" /> Total Capacity
                                </p>
                                <p className="text-sm font-black text-[#1d2d44]">{bus.totalSeats} <span className="text-gray-400 text-[10px]">seats</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Tag className="h-3 w-3" /> Bus Type
                                </p>
                                <p className="text-sm font-black text-[#1d2d44]">{bus.busType}</p>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            Amenities ({bus.amenities?.length || 0})
                        </h3>
                        {bus.amenities?.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {bus.amenities.map((amenity, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#d84e55]/30 hover:bg-red-50/30 transition-all">
                                        <div className="w-9 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-[#d84e55]">
                                            {amenityIcon(amenity)}
                                        </div>
                                        <span className="text-xs font-black text-[#1d2d44] uppercase tracking-tight">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs font-bold text-gray-300 italic">No amenities listed for this bus.</p>
                        )}
                    </div>

                    {/* Seat Layout */}
                    {bus.seatLayout?.length > 0 && (
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">
                                Seat Layout ({bus.seatLayout.length} seats defined)
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {bus.seatLayout.map((seat, i) => (
                                    <div
                                        key={i}
                                        className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border
                                        ${seat.type === 'ladies' || seat.type === 'ladies-sleeper'
                                                ? 'bg-pink-50 border-pink-200 text-pink-700'
                                                : seat.type === 'sleeper'
                                                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                                                    : 'bg-blue-50 border-blue-200 text-blue-700'
                                            }`}
                                        title={`${seat.seatNo} • ${seat.type} • ${seat.deck} deck • ₹${seat.price}`}
                                    >
                                        {seat.seatNo}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Status + Images */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Status</h3>
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="mt-4 space-y-2 text-[10px] font-bold text-gray-400">
                            <p>Added: {new Date(bus.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            <p>Updated: {new Date(bus.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Bus Images */}
                    {bus.images?.length > 0 && (
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Photos</h3>
                            <div className="grid gap-3">
                                {bus.images.map((img, i) => (
                                    <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-gray-50">
                                        <img
                                            src={img}
                                            alt={`Bus photo ${i + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Operator card */}
                    <div className="bg-gradient-to-br from-[#1d2d44] to-[#2b4162] rounded-[2rem] p-6 text-white shadow-xl">
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-300 mb-2">Operated By</p>
                        <p className="text-sm font-black tracking-tight">{bus.operator?.name || bus.operator?.companyName || 'Your Company'}</p>
                        {bus.operator?.phone && (
                            <p className="text-[10px] font-bold text-blue-200 mt-1">{bus.operator.phone}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewBus;
