import React, { useState, useMemo, useEffect } from 'react';
import {
    Search, Filter, MapPin, Clock, Calendar,
    ArrowRightLeft, Star, ChevronDown, Train,
    Info, CreditCard, ShieldCheck, Zap, Check, ChevronRight, RotateCcw
} from 'lucide-react';

const mockTrains = [
    {
        id: "12951",
        name: "Mumbai Rajdhani",
        number: "12951",
        departure: { station: "NDLS", time: "16:30", city: "New Delhi" },
        arrival: { station: "MMCT", time: "08:35", city: "Mumbai" },
        duration: "16h 05m",
        runsOn: ["M", "T", "W", "T", "F", "S", "S"],
        classes: [
            { type: "1A", fare: 4750, availability: "WL 2" },
            { type: "2A", fare: 2850, availability: "AVBL 12" },
            { type: "3A", fare: 2050, availability: "AVBL 45" }
        ],
        rating: 4.8
    },
    {
        id: "12248",
        name: "NZM BDTS YUVA",
        number: "12248",
        departure: { station: "NZM", time: "16:30", city: "Hazrat Nizamuddin" },
        arrival: { station: "BDTS", time: "09:15", city: "Bandra Terminus" },
        duration: "16h 45m",
        runsOn: ["S"],
        classes: [
            { type: "CC", fare: 1250, availability: "AVBL 150" },
            { type: "3A", fare: 1850, availability: "WL 10" }
        ],
        rating: 4.2
    },
    {
        id: "12904",
        name: "Golden Temple ML",
        number: "12904",
        departure: { station: "NZM", time: "07:20", city: "Hazrat Nizamuddin" },
        arrival: { station: "MMCT", time: "05:05", city: "Mumbai Central" },
        duration: "21h 45m",
        runsOn: ["M", "T", "W", "T", "F", "S", "S"],
        classes: [
            { type: "2A", fare: 2650, availability: "AVBL 5" },
            { type: "3A", fare: 1850, availability: "AVBL 22" },
            { type: "SL", fare: 710, availability: "WL 25" }
        ],
        rating: 4.5
    }
];

const TrainResults = ({ setView }) => {
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [sortBy, setSortBy] = useState('Early Departure');

    const toggleFilter = (state, setState, value) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    const isTimeInRange = (timeStr, rangeLabel) => {
        const hour = parseInt(timeStr.split(':')[0]);
        switch (rangeLabel) {
            case "Before 6AM": return hour < 6;
            case "6AM - 12PM": return hour >= 6 && hour < 12;
            case "12PM - 6PM": return hour >= 12 && hour < 18;
            case "After 6PM": return hour >= 18;
            default: return true;
        }
    };

    const filteredTrains = useMemo(() => {
        let result = [...mockTrains];

        // Filter by Class
        if (selectedClasses.length > 0) {
            result = result.filter(t => t.classes.some(c => selectedClasses.includes(c.type)));
        }

        // Filter by Time
        if (selectedTimes.length > 0) {
            result = result.filter(t => selectedTimes.some(range => isTimeInRange(t.departure.time, range)));
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'Early Departure') return a.departure.time.localeCompare(b.departure.time);
            if (sortBy === 'Duration') {
                const getMins = (d) => {
                    const parts = d.split('h ');
                    return (parts.length > 1) ? (parseInt(parts[0]) * 60) + parseInt(parts[1]) : parseInt(parts[0]) * 60;
                };
                return getMins(a.duration) - getMins(b.duration);
            }
            if (sortBy === 'Price') {
                const getMinFare = (t) => Math.min(...t.classes.map(c => c.fare));
                return getMinFare(a) - getMinFare(b);
            }
            return 0;
        });

        return result;
    }, [selectedClasses, selectedTimes, sortBy]);

    return (
        <div className="min-h-screen pb-24 overflow-x-hidden relative studio-bg-wrapper" style={{ fontFamily: '"Inter", sans-serif' }}>
            {/* Studio Theme Local Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
                
                .font-outfit { font-family: 'Outfit', sans-serif !important; }
                .font-inter { font-family: 'Inter', sans-serif !important; }
                
                .studio-bg-wrapper {
                    background: radial-gradient(circle at 0% 0%, #fcfcfc 0%, #f5f5f5 50%, #ebebeb 100%);
                    background-attachment: fixed;
                }
                
                .studio-grid {
                    background-image: radial-gradient(#d4d4d4 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                
                .glass-card-studio {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
                }
                
                .premium-shadow-studio {
                    box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02);
                }
                
                .premium-card-hover:hover {
                    box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.08);
                    border-color: rgba(242, 106, 54, 0.2);
                    transform: translateY(-2px);
                }
                
                .btn-studio-primary {
                    background: #0f172a;
                    box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.2);
                    border: none;
                    cursor: pointer;
                }
                
                .btn-studio-primary:hover {
                    background: #1e293b;
                    box-shadow: 0 15px 25px -5px rgba(15, 23, 42, 0.3);
                }

                .sorting-pill-active {
                    background: #0f172a;
                    color: white;
                    box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
                }

                .sorting-pill-inactive {
                    color: #64748b;
                    background: transparent;
                }

                .sorting-pill-inactive:hover {
                    background: rgba(255, 255, 255, 0.5);
                    color: #0f172a;
                }

                @keyframes glide-route {
                    0% { left: -10%; }
                    100% { left: 110%; }
                }
                
                .route-glide {
                    position: absolute;
                    height: 100%;
                    width: 20%;
                    background: linear-gradient(90deg, transparent, rgba(242, 106, 54, 0.2), transparent);
                    animation: glide-route 3s infinite linear;
                }

                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
            `}} />

            {/* Background Grid */}
            <div className="absolute inset-0 studio-grid pointer-events-none opacity-40 z-0"></div>

            {/* Premium Header - Floating Glass */}
            <div className="sticky top-16 z-30 px-6 pt-4 pointer-events-none">
                <div className="max-w-7xl mx-auto glass-card-studio premium-shadow-studio rounded-2xl px-8 py-5 flex items-center justify-between pointer-events-auto transition-all duration-300">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-5">
                            <div className="bg-[#f26a36] p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-[#f26a36]/20">
                                <Train className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="font-outfit font-extrabold text-slate-900 text-2xl tracking-tight">NDLS</span>
                                    <div className="p-1 bg-slate-100 rounded-full">
                                        <ArrowRightLeft className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <span className="font-outfit font-extrabold text-slate-900 text-2xl tracking-tight">MMCT</span>
                                </div>
                                <div className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    20 Feb 2026 • Friday
                                </div>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-slate-200/50 hidden md:block"></div>
                        <div className="hidden md:block">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900">{filteredTrains.length} Trains Found</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live Availability</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setView('train')}
                        className="btn-studio-primary text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3"
                    >
                        <Search className="h-4 w-4" />
                        Modify Search
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-10 relative z-10">
                {/* Modern Studio Sidebar */}
                <aside className="lg:w-80 flex-shrink-0">
                    <div className="glass-card-studio rounded-[32px] p-8 premium-shadow-studio sticky top-48 border border-white/60">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-outfit font-extrabold text-slate-800 text-[13px] flex items-center gap-3">
                                <div className="bg-slate-100/80 p-2 rounded-xl border border-white/50 shadow-sm">
                                    <Filter className="h-4 w-4 text-slate-500" />
                                </div>
                                Selection Filters
                            </h3>
                        </div>

                        <div className="space-y-12">
                            {/* Class Selection */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Journey Class</label>
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    {["1A", "2A", "3A", "SL", "CC", "2S"].map(cls => (
                                        <button
                                            key={cls}
                                            onClick={() => toggleFilter(selectedClasses, setSelectedClasses, cls)}
                                            className={`py-3.5 rounded-2xl border text-[11px] font-bold transition-all duration-300 flex items-center justify-center gap-2 ${selectedClasses.includes(cls)
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                : 'bg-white/40 text-slate-500 border-slate-200/60 hover:border-slate-300 hover:bg-white/80'
                                                }`}
                                        >
                                            {cls}
                                            {selectedClasses.includes(cls) && <Check className="h-3 w-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Departure Time */}
                            <div className="pt-10 border-t border-slate-200/50">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Departure Time</label>
                                <div className="space-y-3">
                                    {["Before 6AM", "6AM - 12PM", "12PM - 6PM", "After 6PM"].map(time => (
                                        <button
                                            key={time}
                                            onClick={() => toggleFilter(selectedTimes, setSelectedTimes, time)}
                                            className={`w-full py-3.5 px-5 rounded-2xl border text-[11px] font-bold transition-all duration-300 flex items-center justify-between group ${selectedTimes.includes(time)
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                : 'bg-white/40 text-slate-500 border-slate-200/60 hover:border-slate-300 hover:bg-white/80'
                                                }`}
                                        >
                                            {time}
                                            {selectedTimes.includes(time) ? (
                                                <div className="bg-white/20 p-1.5 rounded-lg">
                                                    <Check className="h-3.5 w-3.5" />
                                                </div>
                                            ) : (
                                                <div className="p-1.5 bg-slate-100/50 rounded-lg group-hover:bg-slate-100 transition-colors">
                                                    <Clock className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Integrated Reset */}
                            <button
                                onClick={() => { setSelectedClasses([]); setSelectedTimes([]); }}
                                disabled={selectedClasses.length === 0 && selectedTimes.length === 0}
                                className={`w-full py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-400 ${selectedClasses.length > 0 || selectedTimes.length > 0
                                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 border border-slate-900'
                                    : 'bg-slate-100/50 text-slate-300 border border-slate-200/50 cursor-not-allowed'
                                    }`}
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset Selection
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 space-y-8">
                    {/* Sorting Bar - Sleek Glass */}
                    <div className="glass-card-studio rounded-3xl p-1.5 premium-shadow-studio flex gap-2 border-white/60">
                        {['Early Departure', 'Duration', 'Price'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSortBy(tab)}
                                className={`flex-1 py-3 px-6 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest transition-all duration-400 font-inter ${sortBy === tab
                                    ? 'sorting-pill-active'
                                    : 'sorting-pill-inactive'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Listings */}
                    <div className="space-y-6">
                        {filteredTrains.length > 0 ? (
                            filteredTrains.map((train, index) => (
                                <div
                                    key={train.id}
                                    className="glass-card-studio rounded-[40px] border border-white/60 premium-shadow-studio transition-all duration-500 group premium-card-hover overflow-hidden animate-fade-in-up"
                                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                                >
                                    <div className="p-4 md:p-6 lg:p-7">
                                        {/* Card Top Row */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-[#f26a36]/10 group-hover:text-[#f26a36] group-hover:rotate-6 transition-all duration-500 shadow-sm border border-slate-100">
                                                    <Train className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-outfit font-extrabold text-slate-900 flex items-center gap-2.5 tracking-tight">
                                                        {train.name}
                                                        <span className="text-[8px] font-black text-white bg-[#f26a36] px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md shadow-[#f26a36]/20">Express</span>
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md font-mono">#{train.number}</span>
                                                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50/80 rounded-md border border-amber-100/50">
                                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                            <span className="text-[10px] font-black text-amber-700">{train.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white/50 p-1 rounded-xl border border-slate-100">
                                                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                                                    const isRunning = train.runsOn.includes(day);
                                                    return (
                                                        <span key={i} className={`text-[8px] font-black w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300 ${isRunning ? 'text-emerald-700 bg-white shadow-sm ring-1 ring-slate-100 font-inter' : 'text-slate-200'}`}>
                                                            {day}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Journey Detail Visualization */}
                                        <div className="flex flex-col md:flex-row items-center justify-between mb-6 px-1 md:px-4">
                                            <div className="text-center md:text-left min-w-[90px]">
                                                <div className="text-2xl font-outfit font-black text-slate-900 tracking-tighter">{train.departure.time}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-inter">{train.departure.city}</div>
                                            </div>

                                            <div className="flex-1 flex flex-col items-center px-8 relative py-1 lg:py-0">
                                                <div className="text-[8px] font-black text-slate-300 mb-2 bg-white/50 px-2.5 py-0.5 rounded-full border border-slate-100 tracking-[0.2em] font-inter">{train.duration}</div>
                                                <div className="w-full h-[1.5px] bg-slate-100 relative rounded-full group-hover:h-[2px] transition-all">
                                                    <div className="route-glide"></div>
                                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-white border-2 border-slate-200 group-hover:border-[#f26a36] transition-all" />
                                                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-white border-2 border-slate-200 group-hover:border-[#f26a36] transition-all" />
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 ring-1 ring-slate-100 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                                        <Zap className="h-3.5 w-3.5 text-[#f26a36] fill-[#f26a36]" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center md:text-right min-w-[90px]">
                                                <div className="text-2xl font-outfit font-black text-slate-900 tracking-tighter">{train.arrival.time}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-inter">{train.arrival.city}</div>
                                            </div>
                                        </div>

                                        {/* Fares & Availability Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {train.classes.map((cls) => (
                                                <div
                                                    key={cls.type}
                                                    onClick={() => setView('train-review')}
                                                    className="relative bg-white/40 border border-slate-100 rounded-2xl p-4 px-5 hover:border-[#f26a36]/50 hover:bg-white cursor-pointer transition-all duration-500 group/card shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-95"
                                                >
                                                    <div className="absolute top-0 right-0 p-3 translate-x-3 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-500">
                                                        <ChevronRight className="h-3.5 w-3.5 text-[#f26a36]" />
                                                    </div>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <div>
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 block font-inter">Class</span>
                                                            <span className="text-base font-outfit font-extrabold text-slate-900">{cls.type}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-lg font-outfit font-black text-slate-900 group-hover/card:text-[#f26a36] transition-colors tracking-tight font-outfit">₹{cls.fare}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`text-[8px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 font-inter ${cls.availability.startsWith('AVBL')
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                                                        : 'bg-amber-50 text-amber-600 border border-amber-100/50'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${cls.availability.startsWith('AVBL') ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                                        {cls.availability}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card-studio rounded-[64px] p-24 text-center shadow-lg border border-white relative overflow-hidden premium-shadow-studio animate-fade-in-up">
                                <div className="absolute top-0 left-0 w-full h-3 bg-[#f26a36]/5" />
                                <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-inner ring-[16px] ring-slate-50/30">
                                    <Search className="h-14 w-14 text-slate-200" />
                                </div>
                                <h3 className="text-4xl font-outfit font-black text-slate-900 mb-5 tracking-tight">No Results Found</h3>
                                <p className="text-slate-400 font-bold mb-12 max-w-sm mx-auto leading-relaxed font-inter">No trains match your current filters. Please adjust your criteria to see more options.</p>
                                <button
                                    onClick={() => { setSelectedClasses([]); setSelectedTimes([]); }}
                                    className="btn-studio-primary text-white px-12 py-5 rounded-[28px] font-black text-[11px] uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-2xl font-inter"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TrainResults;
