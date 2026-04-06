import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import trainApi from '../api/trainApi';
import TrainRouteModal from './TrainRouteModal';
import {
    Search, Filter, MapPin, Clock, Calendar,
    ArrowRightLeft, Star, ChevronDown, Train,
    Info, CreditCard, ShieldCheck, Zap, Check, ChevronRight, RotateCcw,
    Sunrise, Sunset, Moon, Sun, Ticket
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
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchMessage, setSearchMessage] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedArrivalTimes, setSelectedArrivalTimes] = useState([]);
    const [isClassOpen, setIsClassOpen] = useState(true);
    const [isDepOpen, setIsDepOpen] = useState(true);
    const [isArrOpen, setIsArrOpen] = useState(true);
    const [selectedQuota, setSelectedQuota] = useState('General + Tatkal');
    const [isQuotaOpen, setIsQuotaOpen] = useState(true);
    const [sortBy, setSortBy] = useState('Early Departure');

    // Route Modal State
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [selectedTrain, setSelectedTrain] = useState(null);

    const from = searchParams.get('from') || 'NDLS';
    const to = searchParams.get('to') || 'MMCT';
    const date = searchParams.get('date') || '18-03-2026';

    useEffect(() => {
        const fetchTrains = async () => {
            setLoading(true);
            try {
                const res = await trainApi.searchTrains({ from, to, date });
                if (res.success) {
                    setTrains(res.trains);
                    setSearchMessage(res.message || '');
                    if (res.trains.length === 0) {
                        toast.info(res.message || "No trains found for this route/date", { position: "top-right" });
                    }
                } else {
                    setSearchMessage(res.message || 'Search failed');
                    toast.error(res.message || "Search failed", { position: "top-right" });
                }
            } catch (error) {
                console.error('Search failed:', error);
                toast.error("Network error. Please try again.", { position: "top-right" });
            } finally {
                setLoading(false);
            }
        };
        fetchTrains();
    }, [from, to, date]);

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
            case "12AM - 6AM":
            case "Before 6AM": return hour < 6;
            case "6AM - 12PM": return hour >= 6 && hour < 12;
            case "12PM - 6PM": return hour >= 12 && hour < 18;
            case "6PM - 12AM":
            case "After 6PM": return hour >= 18;
            default: return true;
        }
    };

    const filteredTrains = useMemo(() => {
        let result = [...trains];

        // Filter by Class
        if (selectedClasses.length > 0) {
            result = result.filter(t => t.classes.some(c => selectedClasses.includes(c.type)));
        }

        // Filter by Time (Departure)
        if (selectedTimes.length > 0) {
            result = result.filter(t => selectedTimes.some(range => isTimeInRange(t.departureTime, range)));
        }

        // Filter by Time (Arrival)
        if (selectedArrivalTimes.length > 0) {
            result = result.filter(t => selectedArrivalTimes.some(range => isTimeInRange(t.arrivalTime, range)));
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'Early Departure') return a.departureTime.localeCompare(b.departureTime);
            if (sortBy === 'Duration') {
                const getMins = (d) => {
                    const parts = d.split('h ');
                    return (parts.length > 1) ? (parseInt(parts[0]) * 60) + parseInt(parts[1]) : parseInt(parts[0]) * 60;
                };
                return getMins(a.duration) - getMins(b.duration);
            }
            if (sortBy === 'Price') {
                const getMinFare = (t) => Math.min(...t.classes.map(c => c.price));
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
            <div className="sticky top-4 z-30 px-6 pt-2 pointer-events-none">
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
                                <span className="text-sm font-black text-slate-900">{loading ? 'Searching...' : `${filteredTrains.length} Trains Found`}</span>
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

            <div className="max-w-7xl mx-auto px-6 mt-6 flex flex-col lg:flex-row gap-10 relative z-10">
                {/* Modern Studio Sidebar */}
                <aside className="lg:w-80 flex-shrink-0">
                    <div className="glass-card-studio rounded-[32px] p-8 premium-shadow-studio sticky top-40 border border-white/60">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-outfit font-extrabold text-slate-800 text-[13px] flex items-center gap-3">
                                <div className="bg-slate-100/80 p-2 rounded-xl border border-white/50 shadow-sm">
                                    <Filter className="h-4 w-4 text-slate-500" />
                                </div>
                                Selection Filters
                            </h3>
                        </div>
                        <div className="space-y-0">
                            {/* Class Selection */}
                            <div className="py-5 border-t border-slate-200/50">
                                <button
                                    onClick={() => setIsClassOpen(!isClassOpen)}
                                    className="w-full flex items-center justify-between group cursor-pointer"
                                >
                                    <span className="text-sm font-bold text-slate-700 cursor-pointer transition-colors">Journey class</span>
                                    <ChevronDown size={16} className={`text-slate-500 transition-all duration-300 ${isClassOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`grid transition-all duration-350 ease-in-out ${isClassOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                                    <div className="overflow-hidden">
                                        <div className="grid grid-cols-2 gap-3 pt-6 pb-2">
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
                                </div>
                            </div>
                            {/* Departure Time */}
                            <div className="py-5 border-t border-slate-200/50">
                                <button
                                    onClick={() => setIsDepOpen(!isDepOpen)}
                                    className="w-full flex items-center justify-between group cursor-pointer"
                                >
                                    <span className="text-sm font-bold text-slate-700 cursor-pointer transition-colors">Departure time range</span>
                                    <ChevronDown size={16} className={`text-slate-500 transition-all duration-300 ${isDepOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`grid transition-all duration-350 ease-in-out ${isDepOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                                    <div className="overflow-hidden">
                                        <div className="space-y-3 pt-6">
                                            {[
                                                { label: "6AM - 12PM", desc: "Morning", icon: <Sunrise size={18} /> },
                                                { label: "12PM - 6PM", desc: "Afternoon", icon: <Sun size={18} /> },
                                                { label: "6PM - 12AM", desc: "Evening", icon: <Sunset size={18} /> },
                                                { label: "12AM - 6AM", desc: "Night", icon: <Moon size={18} /> }
                                            ].map(item => (
                                                <button
                                                    key={item.label}
                                                    onClick={() => toggleFilter(selectedTimes, setSelectedTimes, item.label)}
                                                    className={`w-full py-3.5 px-5 rounded-2xl border text-[11px] font-bold transition-all duration-300 flex items-center justify-between group ${selectedTimes.includes(item.label)
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                        : 'bg-white/40 text-slate-500 border-slate-200/60 hover:border-slate-300 hover:bg-white/80'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`${selectedTimes.includes(item.label) ? 'text-white' : 'text-slate-400'} group-hover:text-train-primary transition-colors`}>
                                                            {item.icon}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="leading-none">{item.label}</p>
                                                            <p className={`text-[9px] font-medium mt-1 ${selectedTimes.includes(item.label) ? 'text-slate-400' : 'text-slate-400'}`}>{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    {selectedTimes.includes(item.label) ? (
                                                        <div className="bg-white/20 p-1.5 rounded-lg">
                                                            <Check className="h-3.5 w-3.5" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-md border border-slate-200 bg-white/50 group-hover:border-slate-300 transition-colors" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Arrival Time */}
                            <div className="py-5 border-y border-slate-200/50">
                                <button
                                    onClick={() => setIsArrOpen(!isArrOpen)}
                                    className="w-full flex items-center justify-between group cursor-pointer"
                                >
                                    <span className="text-sm font-bold text-slate-700 cursor-pointer transition-colors">Arrival time range</span>
                                    <ChevronDown size={16} className={`text-slate-500 transition-all duration-300 ${isArrOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`grid transition-all duration-350 ease-in-out ${isArrOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                                    <div className="overflow-hidden">
                                        <div className="space-y-3 pt-6">
                                            {[
                                                { label: "6AM - 12PM", desc: "Morning", icon: <Sunrise size={18} /> },
                                                { label: "12PM - 6PM", desc: "Afternoon", icon: <Sun size={18} /> },
                                                { label: "6PM - 12AM", desc: "Evening", icon: <Sunset size={18} /> },
                                                { label: "12AM - 6AM", desc: "Night", icon: <Moon size={18} /> }
                                            ].map(item => (
                                                <button
                                                    key={item.label}
                                                    onClick={() => toggleFilter(selectedArrivalTimes, setSelectedArrivalTimes, item.label)}
                                                    className={`w-full py-3.5 px-5 rounded-2xl border text-[11px] font-bold transition-all duration-300 flex items-center justify-between group ${selectedArrivalTimes.includes(item.label)
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                        : 'bg-white/40 text-slate-500 border-slate-200/60 hover:border-slate-300 hover:bg-white/80'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`${selectedArrivalTimes.includes(item.label) ? 'text-white' : 'text-slate-400'} group-hover:text-train-primary transition-colors`}>
                                                            {item.icon}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="leading-none">{item.label}</p>
                                                            <p className={`text-[9px] font-medium mt-1 ${selectedArrivalTimes.includes(item.label) ? 'text-slate-400' : 'text-slate-400'}`}>{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    {selectedArrivalTimes.includes(item.label) ? (
                                                        <div className="bg-white/20 p-1.5 rounded-lg">
                                                            <Check className="h-3.5 w-3.5" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-md border border-slate-200 bg-white/50 group-hover:border-slate-300 transition-colors" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quota Filter */}
                            <div className="py-5 border-t border-slate-200/50">
                                <button
                                    onClick={() => setIsQuotaOpen(!isQuotaOpen)}
                                    className="w-full flex items-center justify-between group cursor-pointer"
                                >
                                    <span className="text-sm font-bold text-slate-700 cursor-pointer transition-colors">Quota</span>
                                    <ChevronDown size={16} className={`text-slate-500 transition-all duration-300 ${isQuotaOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`grid transition-all duration-350 ease-in-out ${isQuotaOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                                    <div className="overflow-hidden">
                                        <div className="space-y-2.5 pt-6">
                                            {[
                                                { value: "General + Tatkal", label: "General + Tatkal" },
                                                { value: "SS", label: "Senior citizen (SS)" },
                                                { value: "LD", label: "Ladies quota (LD)" }
                                            ].map(item => (
                                                <button
                                                    key={item.value}
                                                    onClick={() => setSelectedQuota(item.value)}
                                                    className={`w-full py-3.5 px-5 rounded-2xl border text-[12px] font-semibold transition-all duration-300 flex items-center justify-between group ${selectedQuota === item.value
                                                            ? 'bg-white border-[#f26a36]/30 shadow-sm'
                                                            : 'bg-white/40 text-slate-500 border-slate-200/60 hover:border-slate-300 hover:bg-white/80'
                                                        }`}
                                                >
                                                    <span className={`${selectedQuota === item.value ? 'text-slate-800' : 'text-slate-500'}`}>{item.label}</span>
                                                    <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedQuota === item.value
                                                            ? 'border-[#f26a36]'
                                                            : 'border-slate-300 group-hover:border-slate-400'
                                                        }`}>
                                                        {selectedQuota === item.value && (
                                                            <div className="w-[10px] h-[10px] rounded-full bg-[#f26a36]" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Integrated Reset */}
                            <button
                                onClick={() => { setSelectedClasses([]); setSelectedTimes([]); setSelectedArrivalTimes([]); setSelectedQuota('General + Tatkal'); }}
                                disabled={selectedClasses.length === 0 && selectedTimes.length === 0 && selectedArrivalTimes.length === 0 && selectedQuota === 'General + Tatkal'}
                                className={`w-full py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-400 ${selectedClasses.length > 0 || selectedTimes.length > 0 || selectedArrivalTimes.length > 0 || selectedQuota !== 'General + Tatkal'
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
                        {loading ? (
                            // Loading Skeleton
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="glass-card-studio rounded-[40px] h-64 animate-pulse bg-slate-100/50" />
                                ))}
                            </div>
                        ) : filteredTrains.length > 0 ? (
                            filteredTrains.map((train, index) => (
                                <div
                                    key={train.trainId || train.id || index}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4 shadow-sm p-4 w-full transition-all hover:shadow-md"
                                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                                >
                                    {/* Header Row */}
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 px-2">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[#3b82f6] font-semibold underline underline-offset-4 decoration-blue-200 cursor-pointer">{train.trainNumber}</span>
                                            <span className="text-slate-700 font-medium text-base">{train.trainName}</span>
                                        </div>
                                        <div className="flex gap-1.5 text-xs font-bold hidden sm:flex">
                                            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                                                const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                                                const isRunning = train.runsOn ? (train.runsOn.includes(dayNames[i]) || train.runsOn.includes('Daily')) : true;
                                                return (
                                                    <span
                                                        key={i}
                                                        className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] transition-all ${isRunning
                                                                ? "bg-[#eef2ff] text-[#4f46e5] border border-[#e0e7ff]"
                                                                : "text-slate-300 opacity-40 bg-slate-50/50"
                                                            }`}
                                                    >
                                                        {day}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Timing & Route */}
                                    <div className="flex justify-between items-start mb-6 px-2">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-bold text-slate-900">
                                                {train.departureTime ? (() => {
                                                    const [h, m] = train.departureTime.split(':');
                                                    let hrs = parseInt(h);
                                                    const ampm = hrs >= 12 ? 'PM' : 'AM';
                                                    hrs = hrs % 12 || 12;
                                                    return `${hrs.toString().padStart(2, '0')}:${m || '00'} ${ampm}`;
                                                })() : "N/A"}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-0.5">{train.sourceCity || from}</span>
                                        </div>

                                        <div className="flex-1 flex flex-col items-center justify-center px-4 relative top-2">
                                            <div className="flex items-center w-full justify-center max-w-[200px]">
                                                <div className="h-[1px] bg-slate-200 w-12 hidden sm:block"></div>
                                                <span className="text-[11px] text-slate-400 mx-3 whitespace-nowrap">{train.duration ? train.duration.replace('h', ' h ').replace('m', ' min') : "-"}</span>
                                                <div className="h-[1px] bg-slate-200 w-12 hidden sm:block"></div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col text-center items-center">
                                            <span className="text-lg text-slate-700 font-medium">
                                                {train.arrivalTime ? (() => {
                                                    const [h, m] = train.arrivalTime.split(':');
                                                    let hrs = parseInt(h);
                                                    const ampm = hrs >= 12 ? 'PM' : 'AM';
                                                    hrs = hrs % 12 || 12;
                                                    return `${hrs.toString().padStart(2, '0')}:${m || '00'} ${ampm}`;
                                                })() : "N/A"}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-0.5">{train.destCity || to}</span>
                                        </div>

                                        <div className="ml-8 mt-1 hidden md:block">
                                            <button
                                                onClick={() => {
                                                    setSelectedTrain(train);
                                                    setIsRouteModalOpen(true);
                                                }}
                                                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#fce8e6] text-slate-800 rounded-full text-sm font-semibold hover:bg-rose-100 transition-colors border border-[#fce8e6]"
                                            >
                                                <MapPin size={16} className="text-slate-700" />
                                                View Route
                                            </button>
                                        </div>
                                    </div>

                                    {/* Classes Grid */}
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2">
                                        {train.classes && train.classes.map((cls, i) => (
                                            <div
                                                key={i}
                                                className="flex flex-col flex-shrink-0 w-[105px]"
                                                onClick={() => navigate('/booking', {
                                                    state: {
                                                        trainId: train.trainId || train.id,
                                                        trainName: train.trainName,
                                                        trainNumber: train.trainNumber,
                                                        coachType: cls.type,
                                                        price: cls.price || cls.fare,
                                                        availableSeats: cls.available,
                                                        boarding: train.sourceCity || from,
                                                        destination: train.destCity || to,
                                                        sourceCity: train.sourceCity || from,
                                                        destCity: train.destCity || to,
                                                        departureTime: train.departureTime,
                                                        arrivalTime: train.arrivalTime,
                                                        duration: train.duration,
                                                        journeyDate: date,
                                                        sourceId: train.sourceId,
                                                        destinationId: train.destinationId
                                                    }
                                                })}
                                            >
                                                <div className={`relative rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all border border-transparent`}>
                                                    <div className="bg-[#bbf7d0] px-2 py-1.5 flex justify-between items-center text-[11px] font-bold text-slate-900 border-b border-green-200/50">
                                                        <span>{cls.type}</span>
                                                        <span className="font-semibold text-slate-700">₹{cls.price || cls.fare || 0}</span>
                                                    </div>
                                                    <div className="bg-[#eefcf4] px-2 py-3 flex flex-col items-center justify-center min-h-[55px]">
                                                        {cls.available >= 0 || (cls.availability && cls.availability.startsWith('AVBL')) ? (
                                                            <span className="text-[#047857] font-bold text-[11px]">Available {cls.available !== undefined ? cls.available : (cls.availability && cls.availability.split(' ')[1])}</span>
                                                        ) : (
                                                            <span className="text-rose-600 font-bold text-[11px]">WL {Math.abs(cls.available) || (cls.availability && cls.availability.split(' ')[1])}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-center mt-1.5 text-[9px] text-slate-400 font-medium">
                                                    Live update
                                                </div>
                                            </div>
                                        ))}
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
                                <p className="text-slate-500 font-bold mb-2">Searching for: <span className="text-[#f26a36]">{from}</span> to <span className="text-[#f26a36]">{to}</span> on <span className="text-[#f26a36]">{date}</span></p>
                                <p className="text-slate-400 font-bold mb-12 max-w-sm mx-auto leading-relaxed font-inter">{searchMessage || "No trains match your current filters. Please adjust your criteria to see more options."}</p>
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
            <TrainRouteModal
                isOpen={isRouteModalOpen}
                onClose={() => setIsRouteModalOpen(false)}
                trainId={selectedTrain?.trainId || selectedTrain?.id}
                trainName={selectedTrain?.trainName || selectedTrain?.name}
                trainNumber={selectedTrain?.trainNumber || selectedTrain?.number}
            />
        </div>
    );
};

export default TrainResults;
