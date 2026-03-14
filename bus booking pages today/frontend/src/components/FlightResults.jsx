import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, ArrowRightLeft, Calendar, Users } from 'lucide-react';
import flightApi from '../api/flightApi';
import FlightDetails from './FlightDetails';

const FlightResults = ({ setView }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [selectedStops, setSelectedStops] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedArrivalTimes, setSelectedArrivalTimes] = useState([]);
    const [priceRange, setPriceRange] = useState(50000);
    const [durationRange, setDurationRange] = useState(1440); // 24 hours in mins
    const [isRefundable, setIsRefundable] = useState(false);
    const [sortBy, setSortBy] = useState('Best');
    const [selectedFlightForDetails, setSelectedFlightForDetails] = useState(null);
    const [selectedFlightForSummary, setSelectedFlightForSummary] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const searchFrom = queryParams.get('from') || 'DEL';
    const searchTo = queryParams.get('to') || 'BOM';
    const searchDate = queryParams.get('date') || '2026-03-19';
    const adults = parseInt(queryParams.get('adults') || '1');
    const children = parseInt(queryParams.get('children') || '0');
    const infants = parseInt(queryParams.get('infants') || '0');
    const travelClass = queryParams.get('travelClass') || 'Economy';
    const totalTravelers = adults + children + infants;

    const dates = [
        { date: "Mar 18", price: "₹4520" },
        { date: "Mar 19", price: "₹4461", active: true },
        { date: "Mar 20", price: "₹4428" },
        { date: "Mar 21", price: "₹4550" },
        { date: "Mar 22", price: "₹4600" }
    ];

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                setLoading(true);
                const data = await flightApi.searchFlights({ 
                    from: searchFrom, 
                    to: searchTo, 
                    date: searchDate,
                    adults,
                    children,
                    infants,
                    travelClass
                });
                setFlights(Array.isArray(data) ? data : (data.flights || []));
            } catch (error) {
                console.error("Failed to fetch flights. Using mock data.", error);
                setFlights([
                    {
                        _id: "65f1a2b3c4d5e6f7a8b9c0d1",
                        flightNumber: "AI202", airline: "Air India", from: "DEL", to: "BOM",
                        departureTime: "06:30 AM", arrivalTime: "08:40 AM", duration: "130",
                        stops: "Non-Stop", price: 4461,
                        logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Air_India_logo.svg",
                        availableSeats: 3
                    },
                    {
                        _id: "65f1a2b3c4d5e6f7a8b9c0d2",
                        flightNumber: "6E-2034", airline: "IndiGo", from: "DEL", to: "BOM",
                        departureTime: "08:00 AM", arrivalTime: "10:15 AM", duration: "135",
                        stops: "Non-Stop", price: 4200,
                        logo: "https://upload.wikimedia.org/wikipedia/en/a/af/IndiGo_Airlines_logo.svg",
                        availableSeats: 12
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, [searchFrom, searchTo, searchDate]);

    const formatDateObj = (dateString) => {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return '';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const formatDuration = (dur) => {
        const mins = parseInt(dur);
        if (!isNaN(mins) && mins > 0) {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}m` : `${m}m`;
        }
        return dur || '—';
    };

    const toggleFilter = (state, setState, value) => {
        setState(state.includes(value) ? state.filter(i => i !== value) : [...state, value]);
    };

    const isTimeInRange = (timeStr, rangeLabel) => {
        if (!timeStr) return true;
        const [time, ampm] = timeStr.split(' ');
        let hour = parseInt((time || '').split(':')[0]);
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        switch (rangeLabel) {
            case "Early Morning": return hour >= 0 && hour < 6;
            case "Morning": return hour >= 6 && hour < 12;
            case "Afternoon": return hour >= 12 && hour < 18;
            case "Evening": return hour >= 18 && hour < 24;
            default: return true;
        }
    };

    const filteredFlights = useMemo(() => {
        let result = [...flights];
        // Airline Filter
        if (selectedAirlines.length > 0) result = result.filter(f => selectedAirlines.includes(f.airline));
        
        // Stops Filter
        if (selectedStops.length > 0) result = result.filter(f => selectedStops.includes(f.stops));
        
        // Departure Time Filter
        if (selectedTimes.length > 0) result = result.filter(f => selectedTimes.some(t => isTimeInRange(f.departureTime, t)));
        
        // Arrival Time Filter
        if (selectedArrivalTimes.length > 0) result = result.filter(f => selectedArrivalTimes.some(t => isTimeInRange(f.arrivalTime, t)));
        
        // Price Filter
        result = result.filter(f => f.price <= priceRange);
        
        // Duration Filter
        result = result.filter(f => parseInt(f.duration || 0) <= durationRange);
        
        // Refundable Filter
        if (isRefundable) result = result.filter(f => f.isRefundable);

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'Cheapest') return a.price - b.price;
            if (sortBy === 'Fastest') return parseInt(a.duration || 0) - parseInt(b.duration || 0);
            if (sortBy === 'Best') {
                // Heuristic for "Best": Balance price and duration
                const scoreA = (a.price / 1000) + (parseInt(a.duration) / 60);
                const scoreB = (b.price / 1000) + (parseInt(b.duration) / 60);
                return scoreA - scoreB;
            }
            if (sortBy === 'Early Departure') {
                const getMins = (timeStr) => {
                    const [time, ampm] = timeStr.split(' ');
                    let [h, m] = time.split(':').map(Number);
                    if (ampm === 'PM' && h !== 12) h += 12;
                    if (ampm === 'AM' && h === 12) h = 0;
                    return h * 60 + m;
                };
                return getMins(a.departureTime) - getMins(b.departureTime);
            }
            if (sortBy === 'Late Departure') {
                const getMins = (timeStr) => {
                    const [time, ampm] = timeStr.split(' ');
                    let [h, m] = time.split(':').map(Number);
                    if (ampm === 'PM' && h !== 12) h += 12;
                    if (ampm === 'AM' && h === 12) h = 0;
                    return h * 60 + m;
                };
                return getMins(b.departureTime) - getMins(a.departureTime);
            }
            return 0;
        });
        return result;
    }, [flights, selectedAirlines, selectedStops, selectedTimes, selectedArrivalTimes, priceRange, durationRange, isRefundable, sortBy]);

    return (
        <div className="min-h-screen bg-[#F0F2F5] pb-12">

            {/* SEARCH SUMMARY BAR */}
            <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Plane className="h-5 w-5 text-[#003580] rotate-45" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-bold text-gray-900">{searchFrom}</span>
                                        <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                                        <span className="text-base font-bold text-gray-900">{searchTo}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
                                        <span>{formatDateObj(searchDate)}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{totalTravelers} Traveler{totalTravelers > 1 ? 's' : ''}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{travelClass}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate('/')}
                                className="px-4 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-full text-xs font-bold text-gray-700 transition-all shadow-sm"
                            >
                                Modify
                            </button>
                            <div className="h-8 w-px bg-gray-100 mx-1"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Prices from</span>
                                <span className="text-sm font-black text-[#f26a36]">₹4,428</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date Slider */}
                <div className="bg-gray-50/50 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="flex overflow-x-auto no-scrollbar py-2 gap-2">
                            {dates.map((d, i) => (
                                <div 
                                    key={i} 
                                    className={`min-w-[120px] p-2 rounded-xl cursor-pointer border-2 transition-all flex flex-col items-center justify-center ${
                                        d.active 
                                        ? 'bg-white border-[#f26a36] shadow-md' 
                                        : 'bg-transparent border-transparent hover:border-gray-200'
                                    }`}
                                >
                                    <span className={`text-[10px] font-bold uppercase ${d.active ? 'text-gray-400' : 'text-gray-400'}`}>{d.date}</span>
                                    <span className={`text-sm font-black mt-0.5 ${d.active ? 'text-gray-900' : 'text-gray-700'}`}>{d.price}</span>
                                    {d.price === "₹4,428" && <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 rounded-full mt-1">CHEAPEST</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* FILTERS SIDEBAR */}
                    <div className="w-full xl:w-1/5 flex-shrink-0 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="text-base font-black text-gray-900">Filters</h3>
                                <button 
                                    onClick={() => { 
                                        setSelectedAirlines([]); setSelectedStops([]); setSelectedTimes([]); 
                                        setSelectedArrivalTimes([]); setPriceRange(50000); setDurationRange(1440);
                                        setIsRefundable(false);
                                    }} 
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm transition-all"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="p-5 border-b border-gray-100">
                                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em] mb-4">Stops</h4>
                                <div className="space-y-3">
                                    {['Non-Stop', '1 Stop', '2+ Stops'].map(stop => (
                                        <label key={stop} className="flex items-center gap-3 cursor-pointer group">
                                            <div onClick={() => toggleFilter(selectedStops, setSelectedStops, stop)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedStops.includes(stop) ? 'bg-[#003580] border-[#003580]' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}>
                                                {selectedStops.includes(stop) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <span className={`text-[13px] font-bold transition-colors ${selectedStops.includes(stop) ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{stop}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 border-b border-gray-100">
                                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em] mb-4">Departure Time</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[{ id: "Early Morning", icon: "🌅" }, { id: "Morning", icon: "☀️" }, { id: "Afternoon", icon: "🌤️" }, { id: "Evening", icon: "🌙" }].map(time => (
                                        <button 
                                            key={time.id} 
                                            onClick={() => toggleFilter(selectedTimes, setSelectedTimes, time.id)}
                                            className={`p-2 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${selectedTimes.includes(time.id) ? 'bg-blue-50 border-[#003580] scale-[0.98]' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <span className="text-lg">{time.icon}</span>
                                            <span className="text-[10px] font-bold text-gray-700">{time.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 border-b border-gray-100">
                                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em] mb-4">Arrival Time</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[{ id: "Early Morning", icon: "🌅" }, { id: "Morning", icon: "☀️" }, { id: "Afternoon", icon: "🌤️" }, { id: "Evening", icon: "🌙" }].map(time => (
                                        <button 
                                            key={time.id} 
                                            onClick={() => toggleFilter(selectedArrivalTimes, setSelectedArrivalTimes, time.id)}
                                            className={`p-2 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${selectedArrivalTimes.includes(time.id) ? 'bg-indigo-50 border-indigo-600 scale-[0.98]' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <span className="text-lg">{time.icon}</span>
                                            <span className="text-[10px] font-bold text-gray-700">{time.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 border-b border-gray-100">
                                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em] mb-4 flex items-center justify-between">
                                    <span>Price Budget</span>
                                    <span className="text-sm font-black text-[#003580]">₹{priceRange.toLocaleString('en-IN')}</span>
                                </h4>
                                <input type="range" min="3000" max="50000" step="500" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#003580]" />
                                <div className="flex justify-between text-[10px] font-black text-gray-400 mt-2 italic px-1">
                                    <span>₹3,000</span><span>₹50,000</span>
                                </div>
                            </div>

                            <div className="p-5 border-b border-gray-100">
                                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em] mb-4">Refundable</h4>
                                <div 
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => setIsRefundable(!isRefundable)}
                                >
                                    <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${isRefundable ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isRefundable ? 'left-6' : 'left-1'}`} />
                                    </div>
                                    <span className={`text-[13px] font-bold ${isRefundable ? 'text-green-600' : 'text-gray-600'}`}>Only Refundable Flights</span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em] mb-4">Airlines</h4>
                                <div className="space-y-3">
                                    {['Air India', 'IndiGo', 'Akasa Air', 'SpiceJet', 'Vistara'].map(airline => (
                                        <label key={airline} className="flex items-center gap-3 cursor-pointer group">
                                            <div onClick={() => toggleFilter(selectedAirlines, setSelectedAirlines, airline)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedAirlines.includes(airline) ? 'bg-[#003580] border-[#003580]' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}>
                                                {selectedAirlines.includes(airline) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <span className="text-[13px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{airline}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FLIGHTS LIST SECTION */}
                    <div className="flex-1 space-y-6">

                        {/* Sorting Tabs Redesign */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex border-b border-gray-100">
                                {[
                                    { id: 'Best', label: 'Best', sub: 'Price vs Duration' },
                                    { id: 'Cheapest', label: 'Cheapest', sub: 'Low to High' },
                                    { id: 'Fastest', label: 'Fastest', sub: 'Non-Stop first' },
                                ].map((tab) => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setSortBy(tab.id)}
                                        className={`flex-1 py-4 px-6 border-b-4 transition-all ${sortBy === tab.id ? 'border-[#003580] bg-blue-50/30' : 'border-transparent hover:bg-gray-50'}`}
                                    >
                                        <div className={`text-base font-black ${sortBy === tab.id ? 'text-[#003580]' : 'text-gray-700'}`}>{tab.label}</div>
                                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">{tab.sub}</div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50/50 overflow-x-auto no-scrollbar">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Extra:</span>
                                {['Early Departure', 'Late Departure'].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setSortBy(tab)}
                                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-black transition-all ${sortBy === tab ? 'bg-[#003580] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                                <div className="ml-auto flex items-center gap-1.5 text-[11px] font-bold text-gray-500 pr-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    {filteredFlights.length} Flights Found
                                </div>
                            </div>
                        </div>

                        {/* Cards */}
                        {/* Cards */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#003580] rounded-full animate-spin"></div>
                                <p className="mt-6 text-base font-black text-gray-400 uppercase tracking-widest">Searching Best Deals...</p>
                            </div>
                        ) : filteredFlights.length > 0 ? (
                            filteredFlights.map((flight, idx) => {
                                const isSelected = selectedFlightForSummary?._id === flight._id;
                                // Mock data for live view
                                const viewCount = Math.floor(Math.random() * 15) + 5;
                                
                                return (
                                    <div 
                                        key={idx} 
                                        className={`group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
                                            isSelected ? 'border-[#003580] shadow-xl ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-200 shadow-sm'
                                        }`}
                                        onClick={() => setSelectedFlightForSummary(flight)}
                                    >
                                        {/* Urgency/Offer Banner */}
                                        <div className="bg-gray-50 px-4 py-1.5 flex items-center justify-between border-b border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-[#003580] uppercase tracking-wider flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                                    {viewCount} people viewing
                                                </span>
                                                {flight.isRefundable && (
                                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full">
                                                        Refundable
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Part of Luxury Collection
                                            </span>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row items-center gap-8">
                                                {/* Airline Info */}
                                                <div className="w-full md:w-1/4 flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                                                        {flight.logo
                                                            ? <img src={flight.logo} alt={flight.airline} className="w-full h-full object-contain" />
                                                            : <Plane className="h-8 w-8 text-gray-300" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-gray-900 leading-tight">{flight.airline}</h4>
                                                        <p className="text-xs font-bold text-gray-400 mt-0.5">{flight.flightNumber}</p>
                                                        <p className="text-[10px] font-black text-blue-600 uppercase mt-1 tracking-wider">{flight.aircraftType || 'Boeing 737'}</p>
                                                    </div>
                                                </div>

                                                {/* Route Info */}
                                                <div className="flex-1 flex items-center justify-between gap-4 w-full">
                                                    <div className="text-center md:text-left transition-transform group-hover:translate-x-1">
                                                        <p className="text-2xl font-black text-gray-900">{flight.departureTime}</p>
                                                        <p className="text-[13px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{flight.from}</p>
                                                    </div>

                                                    <div className="flex-1 flex flex-col items-center px-4 max-w-[200px]">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{formatDuration(flight.duration)}</span>
                                                        <div className="w-full h-[3px] bg-gray-100 rounded-full relative flex items-center justify-center">
                                                            <div className="absolute inset-0 bg-blue-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                                                            <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-blue-500 z-10 shadow-sm" />
                                                        </div>
                                                        <span className="text-[11px] font-black text-[#003580] mt-2 uppercase tracking-widest">{flight.stops}</span>
                                                    </div>

                                                    <div className="text-center md:text-right transition-transform group-hover:-translate-x-1">
                                                        <p className="text-2xl font-black text-gray-900">{flight.arrivalTime}</p>
                                                        <p className="text-[13px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{flight.to}</p>
                                                    </div>
                                                </div>

                                                {/* Price & Action */}
                                                <div className="w-full md:w-1/4 md:pl-8 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 flex flex-col items-end">
                                                    <div className="flex flex-col items-end mb-4">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Best Fare</p>
                                                        <p className="text-3xl font-black text-gray-900">₹{flight.price.toLocaleString('en-IN')}</p>
                                                    </div>
                                                    
                                                    <div className="flex flex-col w-full gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                sessionStorage.setItem('selectedFlight', JSON.stringify({ ...flight, searchFrom, searchTo, searchDate }));
                                                                navigate('/flight-booking');
                                                            }}
                                                            className="w-full py-3 bg-[#f26a36] hover:bg-[#e05d2e] text-white rounded-xl font-black text-[12px] uppercase tracking-[0.1em] transition-all shadow-lg shadow-orange-100 active:scale-95"
                                                        >
                                                            Select Flight
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedFlightForDetails(flight);
                                                            }}
                                                            className="text-[11px] font-black text-[#003580] hover:text-blue-800 uppercase tracking-widest text-center mt-1 transition-colors"
                                                        >
                                                            View Full Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Info Row */}
                                            <div className="mt-6 pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                                                        <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12h12L19 8" /></svg>
                                                        <span>Check-in: <span className="text-gray-900 font-black">15kg</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                                                        <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                                        <span className="text-green-600 font-black">Meal Available</span>
                                                    </div>
                                                </div>
                                                
                                                {flight.availableSeats < 10 && (
                                                    <div className="animate-bounce-slow flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[10px] font-black text-red-600 uppercase tracking-wider">
                                                        Only {flight.availableSeats} seats left at this price!
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                                <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Plane className="h-10 w-10 text-gray-300 -rotate-45" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">No Flights Found</h3>
                                <p className="text-gray-500 font-bold">Try adjusting your filters or search for another date.</p>
                                <button 
                                    onClick={() => {
                                        setSelectedAirlines([]); setSelectedStops([]); setSelectedTimes([]);
                                        setPriceRange(50000);
                                    }}
                                    className="mt-6 px-6 py-2 bg-[#003580] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Flight Details Modal */}
            {selectedFlightForDetails && (
                <FlightDetails
                    flight={selectedFlightForDetails}
                    onClose={() => setSelectedFlightForDetails(null)}
                    onBook={(flight) => {
                        sessionStorage.setItem('selectedFlight', JSON.stringify({ ...flight, searchFrom, searchTo, searchDate }));
                        navigate('/flight-booking');
                    }}
                />
            )}
        </div>
    );
};

export default FlightResults;
