import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, ArrowRightLeft, Users, ChevronDown, Check } from 'lucide-react';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TrainHero = ({ setView }) => {
    const navigate = useNavigate();
    const [date, setDate] = useState(dayjs().format('DD-MM-YYYY'));
    const [fromStation, setFromStation] = useState('New Delhi (NDLS)');
    const [toStation, setToStation] = useState('Mumbai Central (MMCT)');
    const [tagFilters, setTagFilters] = useState({
        irctcPartner: false,
        acClasses: false
    });

    const handleSearch = () => {
        if (!fromStation || !toStation) {
            toast.error("Add first from to", { position: "top-right", theme: "colored" });
            return;
        }

        // Extract codes like NDLS from "New Delhi (NDLS)"
        const fromCode = fromStation.match(/\((.*?)\)/)?.[1] || fromStation;
        const toCode = toStation.match(/\((.*?)\)/)?.[1] || toStation;
        
        navigate(`/train-results?from=${fromCode}&to=${toCode}&date=${date}`);
    };

    const toggleFilter = (key) => setTagFilters(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#f26a36',
                    borderRadius: 12,
                },
            }}
        >
            <section className="relative min-h-[60vh] w-full flex flex-col items-center justify-start pt-28 pb-12 overflow-hidden bg-[#0a0f1a]">
                {/* Cinematic Background Layer */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="/images/train-hero-bg.png"
                        alt="Cinematic Train"
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
                            IRCTC AUTHORIZED PARTNER
                        </div>
                        <h1 className="text-5xl md:text-[64px] font-black text-white leading-[1.1] tracking-tight text-shadow-lg animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
                            Premium Train <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">
                                Travel Experience.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 font-medium max-w-lg leading-relaxed animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:400ms]">
                            Fast, reliable, and comfortable journeys across the nation. Book your seats with GOAIRCLASS today.
                        </p>
                    </div>

                    {/* Main Search Widget */}
                    <div className="w-full flex-col animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:600ms]">
                        {/* Form Fields Row */}
                        <div className="flex flex-col lg:flex-row w-full bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0_0_0_/_0.3)] rounded-2xl overflow-hidden border border-white/20">

                            {/* From & To (Combined block with divider/swap) */}
                            <div className="flex lg:w-[45%] relative bg-transparent">
                                {/* From */}
                                <div className="flex-1 flex items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group">
                                    <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-[#f26a36]/10 transition-colors">
                                        <MapPin className="h-5 w-5 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">From Station</span>
                                        <input
                                            type="text"
                                            className="bg-transparent border-none outline-none text-base font-bold text-slate-800 w-full placeholder:text-slate-300"
                                            placeholder="Departure Station"
                                            value={fromStation}
                                            onChange={(e) => setFromStation(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Swap Button */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <button
                                        onClick={() => {
                                            const temp = fromStation;
                                            setFromStation(toStation);
                                            setToStation(temp);
                                        }}
                                        className="bg-white border border-slate-200 rounded-full p-2.5 cursor-pointer hover:border-[#f26a36] hover:text-[#f26a36] transition-all shadow-lg hover:shadow-[#f26a36]/20 active:scale-95 text-slate-400"
                                    >
                                        <ArrowRightLeft className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="w-px bg-slate-200 h-12 my-auto"></div>

                                {/* To */}
                                <div className="flex-1 flex items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group pl-8">
                                    <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-[#f26a36]/10 transition-colors">
                                        <MapPin className="h-5 w-5 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">To Station</span>
                                        <input
                                            type="text"
                                            className="bg-transparent border-none outline-none text-base font-bold text-slate-800 w-full placeholder:text-slate-300"
                                            placeholder="Arrival Station"
                                            value={toStation}
                                            onChange={(e) => setToStation(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-px bg-slate-200 h-12 my-auto hidden lg:block"></div>

                            {/* Date of Journey */}
                            <div className="flex lg:w-1/4 bg-transparent border-t lg:border-t-0 border-slate-100">
                                <div className="flex items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group flex-1">
                                    <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-[#f26a36]/10 transition-colors">
                                        <Calendar className="h-5 w-5 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date of Journey</span>
                                        <DatePicker
                                            value={date ? dayjs(date, 'DD-MM-YYYY') : null}
                                            onChange={(val) => setDate(val ? val.format('DD-MM-YYYY') : '')}
                                            format="DD-MM-YYYY"
                                            variant="borderless"
                                            className="p-0 font-bold text-slate-800 text-base h-6"
                                            placeholder="Select Date"
                                            inputReadOnly
                                            allowClear={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-px bg-slate-200 h-12 my-auto hidden lg:block"></div>

                            {/* Classes */}
                            <div className="flex lg:w-1/4 bg-transparent border-t lg:border-t-0 border-slate-100 items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group">
                                <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-[#f26a36]/10 transition-colors">
                                    <Users className="h-5 w-5 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                                </div>
                                <div className="flex flex-col flex-1 max-w-full overflow-hidden">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Travel Class</span>
                                    <span className="text-base font-bold text-slate-800 truncate">All Classes</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-400 ml-2" />
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="bg-gradient-to-r from-[#f26a36] to-[#ff8c5a] hover:to-[#f26a36] text-white px-10 py-6 lg:py-0 font-black text-sm tracking-widest transition-all hover:shadow-[0_0_30px_rgba(242_106_54_/_0.4)] active:scale-[0.98] flex items-center justify-center min-w-[160px]"
                            >
                                SEARCH
                            </button>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-center mt-8 gap-x-10 gap-y-4 text-white">
                            <div className="flex items-center gap-6 flex-wrap">
                                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">Quick Filters:</span>

                                {[
                                    { id: 'irctcPartner', label: 'IRCTC Authorized' },
                                    { id: 'acClasses', label: 'AC Classes Only' },
                                ].map((fare) => (
                                    <div
                                        key={fare.id}
                                        onClick={() => toggleFilter(fare.id)}
                                        className="flex items-center cursor-pointer group transition-all"
                                    >
                                        <div className={`w-5 h-5 rounded-lg mr-3 flex items-center justify-center transition-all border-2 ${tagFilters[fare.id]
                                            ? 'bg-[#f26a36] border-[#f26a36] shadow-[0_0_10px_rgba(242_106_54_/_0.3)]'
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
        </ConfigProvider>
    );
};
export default TrainHero;
