import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Bus, MapPin, Clock, Calendar, Users, IndianRupee,
    ArrowRight, CheckCircle2, Wifi, Wind, Zap, Navigation2, Info
} from 'lucide-react';
import { getSchedule } from '../../api/scheduleApi';

const TripView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getSchedule(id)
            .then(setSchedule)
            .catch(err => setError(err?.error || 'Failed to load trip'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4 animate-pulse">
            <div className="w-14 h-14 bg-gray-100 rounded-3xl flex items-center justify-center">
                <Clock className="h-7 w-7 text-gray-300" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Trip Details...</p>
        </div>
    );

    if (error || !schedule) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Info className="h-10 w-10 text-red-300" />
            <p className="text-sm font-bold text-gray-500">{error || 'Trip not found'}</p>
            <button onClick={() => navigate('/operator/schedules')} className="px-6 py-3 bg-[#d84e55] text-white rounded-2xl text-xs font-black uppercase tracking-widest">
                Back to Schedules
            </button>
        </div>
    );

    const totalSeats = schedule.bus?.totalSeats || 40;
    const takenSeats = totalSeats - (schedule.availableSeats ?? totalSeats);
    const loadPct = Math.round((takenSeats / totalSeats) * 100);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/operator/schedules')}
                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:shadow-md transition-all active:scale-90">
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#1d2d44] uppercase tracking-tight">Trip Details</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Full schedule profile</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/operator/schedules/passengers/${id}`)}
                    className="flex items-center gap-2 bg-[#1d2d44] text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#d84e55] transition-all shadow-lg active:scale-95"
                >
                    <Users className="h-4 w-4" />
                    View Passengers
                </button>
            </div>

            {/* Hero Route Banner */}
            <div className="bg-gradient-to-r from-[#1d2d44] to-[#2b4162] rounded-[2rem] p-8 text-white shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                            <Bus className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xl font-black uppercase tracking-tight">{schedule.route?.fromCity}</span>
                                <ArrowRight className="h-5 w-5 text-blue-300" />
                                <span className="text-xl font-black uppercase tracking-tight">{schedule.route?.toCity}</span>
                            </div>
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">
                                {schedule.bus?.busName} · {schedule.bus?.busNumber}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-black">{schedule.departureTime}</p>
                            <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mt-0.5">Departure</p>
                        </div>
                        <div className="h-px w-12 bg-white/20" />
                        <div className="text-center">
                            <p className="text-2xl font-black">{schedule.arrivalTime}</p>
                            <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mt-0.5">Arrival</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        { icon: <Calendar className="h-5 w-5 text-orange-500" />, label: 'Start Date', value: new Date(schedule.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                        { icon: <IndianRupee className="h-5 w-5 text-emerald-500" />, label: 'Ticket Price', value: `₹${schedule.ticketPrice}` },
                        { icon: <Users className="h-5 w-5 text-indigo-500" />, label: 'Seats Left', value: schedule.availableSeats ?? '—' },
                        { icon: <Navigation2 className="h-5 w-5 text-[#d84e55]" />, label: 'Distance', value: schedule.route?.distance ? `${schedule.route.distance} KM` : '—' },
                        { icon: <Clock className="h-5 w-5 text-blue-500" />, label: 'Travel Time', value: schedule.route?.travelTime || '—' },
                        { icon: <Bus className="h-5 w-5 text-purple-500" />, label: 'Bus Type', value: schedule.bus?.busType || '—' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-sm font-black text-[#1d2d44] mt-0.5">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load Factor */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Load Factor</h3>
                        <div className="relative flex items-center justify-center">
                            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                                <circle cx="60" cy="60" r="50" fill="none"
                                    stroke={loadPct > 80 ? '#d84e55' : loadPct > 50 ? '#f97316' : '#10b981'}
                                    strokeWidth="12"
                                    strokeDasharray={`${(loadPct / 100) * 314} 314`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute text-center">
                                <p className="text-2xl font-black text-[#1d2d44]">{loadPct}%</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase">Filled</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-xs font-black text-gray-500">{takenSeats} / {totalSeats} seats booked</p>
                        <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                            ${loadPct > 80 ? 'bg-red-50 text-red-600' : loadPct > 50 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            {loadPct > 80 ? 'Almost Full' : loadPct > 50 ? 'Filling Fast' : 'Available'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Boarding & Dropping Points */}
            {(schedule.boardingPoints?.length > 0 || schedule.droppingPoints?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {schedule.boardingPoints?.length > 0 && (
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#d84e55] rounded-full" /> Boarding Points
                            </h3>
                            <div className="space-y-3">
                                {schedule.boardingPoints.map((bp, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-3.5 w-3.5 text-[#d84e55] flex-shrink-0" />
                                            <span className="text-xs font-bold text-[#1d2d44]">{bp.location}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{bp.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {schedule.droppingPoints?.length > 0 && (
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#1d2d44] rounded-full" /> Dropping Points
                            </h3>
                            <div className="space-y-3">
                                {schedule.droppingPoints.map((dp, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-3.5 w-3.5 text-[#1d2d44] flex-shrink-0" />
                                            <span className="text-xs font-bold text-[#1d2d44]">{dp.location}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg">{dp.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Amenities */}
            {schedule.bus?.amenities?.length > 0 && (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Bus Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                        {schedule.bus.amenities.map((a, i) => (
                            <span key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-[#1d2d44] uppercase">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {a}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripView;
