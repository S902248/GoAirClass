import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, ChevronDown, Check } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HotelHero = ({ setView }) => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('Goa, India');
    const [tagFilters, setTagFilters] = useState({
        freeCancel: false,
        payAtHotel: false,
        ixigoAssured: false
    });

    const toggleFilter = (key) => setTagFilters(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSearch = () => {
        if (!destination) {
            toast.error("Add first destination", { position: "top-right", theme: "colored" });
            return;
        }
        navigate('/hotel-results', { state: { city: destination } });
    };

    return (
        <section className="relative min-h-[60vh] w-full flex flex-col items-center justify-start pt-28 pb-12 overflow-hidden bg-[#0a0f1a]">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src="/images/hotel-hero-bg.png"
                    alt="Cinematic Hotel"
                    className="absolute inset-0 w-full h-full object-cover transform scale-105 animate-subtle-zoom"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a]/90 via-[#0a0f1a]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent opacity-60" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-start space-y-12 mt-12">
                {/* Premium Typography Tagline */}
                <div className="w-full text-left space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f26a36]/10 backdrop-blur-md border border-[#f26a36]/20 rounded-full text-[#f26a36] text-xs font-bold tracking-widest uppercase mb-2 animate-fade-in-up opacity-0 [animation-fill-mode:forwards]">
                        <Check className="h-3 w-3" />
                        PREMIUM STAYS & RESORTS
                    </div>
                    <h1 className="text-5xl md:text-[64px] font-black text-white leading-[1.1] tracking-tight text-shadow-lg animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
                        Find Your Perfect <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">
                            Luxury Escape.
                        </span>
                    </h1>
                    <p className="text-lg text-slate-300 font-medium max-w-lg leading-relaxed animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:400ms]">
                        Handpicked hotels for the discerning traveler. Professional service, guaranteed comfort.
                    </p>
                </div>

                {/* Main Search Widget */}
                <div className="w-full flex-col animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:600ms]">
                    {/* Form Fields Row */}
                    <div className="flex flex-col lg:flex-row w-full bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden border border-white/20">

                        {/* Destination */}
                        <div className="flex lg:w-[35%] relative bg-transparent">
                            <div className="flex-1 flex items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group">
                                <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-[#f26a36]/10 transition-colors">
                                    <MapPin className="h-5 w-5 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Destination / Property</span>
                                    <input
                                        type="text"
                                        className="bg-transparent border-none outline-none text-base font-bold text-slate-800 w-full placeholder:text-slate-300"
                                        placeholder="Where are you going?"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-px bg-slate-200 h-12 my-auto hidden lg:block"></div>

                        {/* Check-in & Check-out */}
                        <div className="flex lg:w-[30%] bg-transparent border-t lg:border-t-0 border-slate-100">
                            <div className="flex-1 flex items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group border-r border-slate-100">
                                <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-[#f26a36]/10 transition-colors">
                                    <Calendar className="h-5 w-5 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                                </div>
                                <div className="flex flex-col whitespace-nowrap">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Check-in</span>
                                    <span className="text-base font-bold text-slate-800">25-02-2026</span>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group pl-6">
                                <div className="flex flex-col whitespace-nowrap">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Check-out</span>
                                    <span className="text-base font-bold text-slate-800">27-02-2026</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-px bg-slate-200 h-12 my-auto hidden lg:block"></div>

                        {/* Rooms & Guests */}
                        <div className="flex lg:w-[20%] bg-transparent border-t lg:border-t-0 border-slate-100 items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group">
                            <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-[#f26a36]/10 transition-colors">
                                <Users className="h-5 w-5 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                            </div>
                            <div className="flex flex-col flex-1 max-w-full overflow-hidden">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Guests & Rooms</span>
                                <span className="text-base font-bold text-slate-800 truncate">2 Guests, 1 Room</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400 ml-2" />
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-[#f26a36] to-[#ff8c5a] hover:to-[#f26a36] text-white px-10 py-6 lg:py-0 font-black text-sm tracking-widest transition-all hover:shadow-[0_0_30px_rgba(242,106,54,0.4)] active:scale-[0.98] flex items-center justify-center min-w-[160px]"
                        >
                            SEARCH
                        </button>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-center mt-8 gap-x-10 gap-y-4 text-white">
                        <div className="flex items-center gap-6 flex-wrap">
                            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">Quick Filters:</span>

                            {[
                                { id: 'freeCancel', label: 'Free Cancellation' },
                                { id: 'payAtHotel', label: 'Pay At Hotel' },
                                { id: 'ixigoAssured', label: 'GOAIRCLASS Assured' }
                            ].map((fare) => (
                                <div
                                    key={fare.id}
                                    onClick={() => toggleFilter(fare.id)}
                                    className="flex items-center cursor-pointer group transition-all"
                                >
                                    <div className={`w-5 h-5 rounded-lg mr-3 flex items-center justify-center transition-all border-2 ${tagFilters[fare.id]
                                        ? 'bg-[#f26a36] border-[#f26a36] shadow-[0_0_10px_rgba(242,106,54,0.3)]'
                                        : 'bg-white/10 border-white/20 group-hover:border-white/40'
                                        }`}>
                                        {tagFilters[fare.id] && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
                                    </div>
                                    <span className={`text-[13px] tracking-wide transition-colors ${tagFilters[fare.id] ? 'text-white font-bold' : 'text-slate-300 group-hover:text-white'}`}>
                                        {fare.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Overlays */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-0 lg:hidden" />
            <ToastContainer />
        </section>
    );
};

export default HotelHero;
