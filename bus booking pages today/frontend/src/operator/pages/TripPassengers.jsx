import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Users, ArrowRight, Phone, Mail, CreditCard,
    Info, Bus, Calendar, Clock, CheckCircle2, XCircle, User
} from 'lucide-react';
import { getSchedulePassengers } from '../../api/scheduleApi';

const statusStyle = {
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-orange-50 text-orange-700 border-orange-200',
    Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const TripPassengers = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        getSchedulePassengers(id)
            .then(setData)
            .catch(err => setError(err?.error || 'Failed to load passengers'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4 animate-pulse">
            <div className="w-14 h-14 bg-gray-100 rounded-3xl flex items-center justify-center">
                <Users className="h-7 w-7 text-gray-300" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Passenger Manifest...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Info className="h-10 w-10 text-red-300" />
            <p className="text-sm font-bold text-gray-500">{error}</p>
            <button onClick={() => navigate('/operator/schedules')} className="px-6 py-3 bg-[#d84e55] text-white rounded-2xl text-xs font-black uppercase tracking-widest">
                Back
            </button>
        </div>
    );

    const schedule = data?.schedule;
    const bookings = data?.bookings || [];

    // Expand all passengers across bookings for the flat passenger list
    const allPassengers = bookings.flatMap(b =>
        (b.passengers?.length > 0 ? b.passengers : [{ name: b.passengerName || 'Guest', age: '—', gender: '—', seatNumber: b.seatNumber || b.seatNumbers?.[0] || '—' }])
            .map(p => ({ ...p, booking: b }))
    );

    const filtered = allPassengers.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.booking?.passengerEmail?.toLowerCase().includes(search.toLowerCase()) ||
        p.seatNumber?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(`/operator/schedules/view/${id}`)}
                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:shadow-md transition-all active:scale-90">
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#1d2d44] uppercase tracking-tight">Passenger Manifest</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {schedule?.route?.fromCity} → {schedule?.route?.toCity} · {new Date(schedule?.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Trip Summary Bar */}
            <div className="bg-gradient-to-r from-[#1d2d44] to-[#2b4162] rounded-2xl px-8 py-5 text-white flex flex-wrap items-center gap-8 shadow-xl">
                <div className="flex items-center gap-3">
                    <Bus className="h-5 w-5 text-blue-300" />
                    <div>
                        <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Bus</p>
                        <p className="text-sm font-black">{schedule?.bus?.busName || '—'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-300" />
                    <div>
                        <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Departure</p>
                        <p className="text-sm font-black">{schedule?.departureTime}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-emerald-300" />
                    <div>
                        <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Total Passengers</p>
                        <p className="text-sm font-black">{allPassengers.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-purple-300" />
                    <div>
                        <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Total Bookings</p>
                        <p className="text-sm font-black">{bookings.length}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
                <User className="h-4 w-4 text-gray-300 flex-shrink-0" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email or seat number..."
                    className="flex-1 text-sm font-bold text-[#1d2d44] placeholder:text-gray-300 outline-none bg-transparent"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500">×</button>
                )}
            </div>

            {/* Passenger Table */}
            {allPassengers.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-20 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-200" />
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No bookings yet for this trip</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">#</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Passenger</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Seat</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Boarding</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Fare</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((p, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-500">
                                                {i + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-[#1d2d44] rounded-xl flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">
                                                    {p.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#1d2d44]">{p.name || 'Guest'}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">{p.age !== '—' ? `Age: ${p.age}` : ''} {p.gender !== '—' ? `· ${p.gender}` : ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                {p.seatNumber || p.booking?.seatNumbers?.join(', ') || '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                {(p.booking?.passengerEmail || p.booking?.contactDetails?.email) && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                                                        <Mail className="h-3 w-3" />
                                                        {p.booking?.passengerEmail || p.booking?.contactDetails?.email}
                                                    </div>
                                                )}
                                                {(p.booking?.passengerMobile || p.booking?.contactDetails?.phone) && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                                                        <Phone className="h-3 w-3" />
                                                        {p.booking?.passengerMobile || p.booking?.contactDetails?.phone}
                                                    </div>
                                                )}
                                                {!p.booking?.passengerEmail && !p.booking?.contactDetails?.email && !p.booking?.passengerMobile && !p.booking?.contactDetails?.phone && (
                                                    <span className="text-[10px] font-bold text-gray-300 italic">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-bold text-gray-600">{p.booking?.boardingPoint || '—'}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle[p.booking?.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                {p.booking?.status || '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <p className="text-sm font-black text-[#d84e55]">₹{p.booking?.totalFare || '—'}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Showing {filtered.length} of {allPassengers.length} passengers
                        </p>
                        <p className="text-[10px] font-black text-[#1d2d44] uppercase tracking-widest">
                            Total Revenue: ₹{bookings.reduce((s, b) => s + (b.totalFare || 0), 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripPassengers;
