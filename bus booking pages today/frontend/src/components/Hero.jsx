import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRightLeft, Users, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchCities } from '../api/cityApi';
import WomenBookingToggle from './WomenBookingToggle';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdCarousel from './ads/AdCarousel';

const Hero = ({ setSearchParams }) => {
    const navigate = useNavigate();
    const [fromCity, setFromCity] = useState('Pune');
    const [toCity, setToCity] = useState('Mumbai');
    const [date, setDate] = useState(dayjs().format('DD-MM-YYYY'));
    const [womenBooking, setWomenBooking] = useState(false);

    // Autocomplete States
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce timer
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.relative')) {
                setShowFromSuggestions(false);
                setShowToSuggestions(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchCities = async (query, setSuggestions, setShow) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            setShow(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await searchCities(query);
            setSuggestions(data);
            setShow(data.length > 0);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFromChange = (e) => {
        const val = e.target.value;
        setFromCity(val);

        if (debounceTimer) clearTimeout(debounceTimer);
        const timer = setTimeout(() => {
            fetchCities(val, setFromSuggestions, setShowFromSuggestions);
        }, 300);
        setDebounceTimer(timer);
    };

    const handleToChange = (e) => {
        const val = e.target.value;
        setToCity(val);

        if (debounceTimer) clearTimeout(debounceTimer);
        const timer = setTimeout(() => {
            fetchCities(val, setToSuggestions, setShowToSuggestions);
        }, 300);
        setDebounceTimer(timer);
    };

    const selectCity = (city, type) => {
        if (type === 'from') {
            setFromCity(city.name);
            setShowFromSuggestions(false);
        } else {
            setToCity(city.name);
            setShowToSuggestions(false);
        }
    };

    const handleSearch = () => {
        if (!fromCity || !toCity) {
            toast.error("Add first from to", { position: "top-right", theme: "colored" });
            return;
        }

        const searchParams = {
            fromCity,
            toCity,
            date,
            womenBooking
        };

        if (setSearchParams) {
            setSearchParams(searchParams);
        }
        navigate('/bus-results', { state: searchParams });
    };

    const swapCities = () => {
        const temp = fromCity;
        setFromCity(toCity);
        setToCity(temp);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#f26a36',
                    borderRadius: 12,
                },
            }}
        >
            <section className="relative min-h-[60vh] w-full flex flex-col items-center justify-start pt-28 pb-12 bg-[#0a0f1a]">
                {/* Cinematic Background Layer */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="/images/bus-hero-bg.png"
                        alt="Cinematic Bus"
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
                            PREMIUM BUS TRAVEL
                        </div>
                        <h1 className="text-5xl md:text-[64px] font-black text-white leading-[1.1] tracking-tight text-shadow-lg animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
                            Travel in Comfort, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">
                                Arrive with Style.
                            </span>
                        </h1>
                    </div>

                    {/* Ad Carousel Placement */}
                    <div className="w-full animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:500ms]">
                        <AdCarousel position="HomepageTop" />
                    </div>

                    {/* Main Search Widget */}
                    <div className="w-full flex-col animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:600ms]">
                        {/* Form Fields Row */}
                        <div className="flex flex-col lg:flex-row w-full bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0_0_0_/_0.3)] rounded-2xl border border-white/20">

                            {/* From & To (Combined block with divider/swap) */}
                            <div className="flex lg:w-[45%] relative bg-transparent">
                                {/* From */}
                                <div className="flex-1 flex items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group">
                                    <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-[#f26a36]/10 transition-colors">
                                        <MapPin className="h-5 w-5 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                                    </div>
                                    <div className="flex flex-col flex-1 relative">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">From City</span>
                                        <input
                                            type="text"
                                            value={fromCity}
                                            onChange={handleFromChange}
                                            onFocus={() => fromCity.length >= 2 && setShowFromSuggestions(true)}
                                            className="bg-transparent border-none outline-none text-base font-bold text-slate-800 w-full placeholder:text-slate-300"
                                            placeholder="Departure City"
                                        />

                                        {/* From Suggestions Dropdown */}
                                        {showFromSuggestions && (
                                            <div className="absolute top-[calc(100%+15px)] left-[-60px] w-[300px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0_0_0_/_0.15)] border border-slate-100 z-[100] max-h-[300px] overflow-y-auto overflow-x-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {fromSuggestions.map((city) => (
                                                    <div
                                                        key={city._id}
                                                        onClick={() => selectCity(city, 'from')}
                                                        className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0 group"
                                                    >
                                                        <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-[#f26a36]/10 transition-colors">
                                                            <MapPin className="h-4 w-4 text-slate-400 group-hover:text-[#f26a36]" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[15px] font-bold text-slate-800">{city.name}</span>
                                                            <span className="text-[11px] font-medium text-slate-400">{city.state}, {city.country}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Swap Button */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <button onClick={swapCities} className="bg-white border border-slate-200 rounded-full p-2.5 cursor-pointer hover:border-[#f26a36] hover:text-[#f26a36] transition-all shadow-lg hover:shadow-[#f26a36]/20 active:scale-95 text-slate-400">
                                        <ArrowRightLeft className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="w-px bg-slate-200 h-12 my-auto"></div>

                                {/* To */}
                                <div className="flex-1 flex items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group pl-8">
                                    <div className="bg-slate-100 p-2.5 rounded-xl mr-4 group-hover:bg-[#f26a36]/10 transition-colors">
                                        <MapPin className="h-5 w-5 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                                    </div>
                                    <div className="flex flex-col flex-1 relative">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">To City</span>
                                        <input
                                            type="text"
                                            value={toCity}
                                            onChange={handleToChange}
                                            onFocus={() => toCity.length >= 2 && setShowToSuggestions(true)}
                                            className="bg-transparent border-none outline-none text-base font-bold text-slate-800 w-full placeholder:text-slate-300"
                                            placeholder="Arrival City"
                                        />

                                        {/* To Suggestions Dropdown */}
                                        {showToSuggestions && (
                                            <div className="absolute top-[calc(100%+15px)] left-[-40px] w-[300px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0_0_0_/_0.15)] border border-slate-100 z-[100] max-h-[300px] overflow-y-auto overflow-x-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {toSuggestions.map((city) => (
                                                    <div
                                                        key={city._id}
                                                        onClick={() => selectCity(city, 'to')}
                                                        className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0 group"
                                                    >
                                                        <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-[#f26a36]/10 transition-colors">
                                                            <MapPin className="h-4 w-4 text-slate-400 group-hover:text-[#f26a36]" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[15px] font-bold text-slate-800">{city.name}</span>
                                                            <span className="text-[11px] font-medium text-slate-400">{city.state}, {city.country}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="w-px bg-slate-200 h-12 my-auto hidden lg:block"></div>

                            {/* Date of Journey */}
                            <div className="flex lg:w-1/4 bg-transparent border-t lg:border-t-0 border-slate-100 relative">
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

                            {/* Women Booking Toggle */}
                            <WomenBookingToggle
                                womenBooking={womenBooking}
                                setWomenBooking={setWomenBooking}
                            />

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="bg-gradient-to-r from-[#f26a36] to-[#ff8c5a] hover:to-[#f26a36] text-white px-10 py-6 lg:py-0 font-black text-sm tracking-widest transition-all hover:shadow-[0_0_30px_rgba(242_106_54_/_0.4)] active:scale-[0.98] flex items-center justify-center min-w-[160px]"
                            >
                                SEARCH
                            </button>
                        </div>

                        {/* Quick Labels Row */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-center mt-8 gap-x-10 gap-y-4 text-white">
                            <div className="flex items-center gap-6 flex-wrap">
                                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">Available Perks:</span>

                                {[
                                    { label: 'Air Conditioned' },
                                    { label: 'Luxury Seating' },
                                    { label: 'GPS Tracking' },
                                ].map((perk, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[13px] text-slate-300 font-medium">
                                        <div className="w-1 h-1 bg-[#f26a36] rounded-full" />
                                        {perk.label}
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

export default Hero;
