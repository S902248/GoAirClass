import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users, ArrowRightLeft, ChevronDown, Check, X, MapPin } from 'lucide-react';
import flightApi from '../api/flightApi';

const backgrounds = [
    "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=2000"
];

const FlightHero = ({ setView }) => {
    const navigate = useNavigate();
    const [tripType, setTripType] = useState('one-way');
    const [fareType, setFareType] = useState('regular');
    const [preferredAirline, setPreferredAirline] = useState('');
    const [directFlight, setDirectFlight] = useState(false);

    // Passenger & Class State
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });
    const [travelClass, setTravelClass] = useState('Economy');

    // API Data
    const [airports, setAirports] = useState([]);

    // Selected Airports
    const [fromAirport, setFromAirport] = useState(null);
    const [toAirport, setToAirport] = useState(null);

    // Dropdown States
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
    const [showAirlineDropdown, setShowAirlineDropdown] = useState(false);

    // Search Inputs
    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

    // Date Inputs
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // Today's Date limit
    const today = new Date().toISOString().split('T')[0];

    const fromRef = useRef(null);
    const toRef = useRef(null);
    const passengerRef = useRef(null);
    const airlineRef = useRef(null);

    useEffect(() => {
        flightApi.getAirports()
            .then(data => setAirports(data.airports || []))
            .catch(err => console.error("Failed to fetch airports:", err));
    }, []);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fromRef.current && !fromRef.current.contains(event.target)) setShowFromDropdown(false);
            if (toRef.current && !toRef.current.contains(event.target)) setShowToDropdown(false);
            if (passengerRef.current && !passengerRef.current.contains(event.target)) setShowPassengerDropdown(false);
            if (airlineRef.current && !airlineRef.current.contains(event.target)) setShowAirlineDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwap = () => {
        const temp = fromAirport;
        setFromAirport(toAirport);
        setToAirport(temp);
    };

    const fromFiltered = airports.filter(a =>
        a.city.toLowerCase().includes(fromSearch.toLowerCase()) ||
        a.airportCode.toLowerCase().includes(fromSearch.toLowerCase()) ||
        a.airportName.toLowerCase().includes(fromSearch.toLowerCase())
    );

    const toFiltered = airports.filter(a =>
        a.city.toLowerCase().includes(toSearch.toLowerCase()) ||
        a.airportCode.toLowerCase().includes(toSearch.toLowerCase()) ||
        a.airportName.toLowerCase().includes(toSearch.toLowerCase())
    );

    return (
        <section className="relative min-h-[60vh] w-full flex flex-col items-center justify-start pt-28 pb-12 bg-[#0a0f1a]">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={backgrounds[0]}
                    alt="Flight Destination"
                    className="absolute inset-0 w-full h-full object-cover transform scale-105 animate-subtle-zoom opacity-80"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a]/90 via-[#0a0f1a]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent opacity-60" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-start space-y-8 mt-12">
                {/* Premium Typography Tagline */}
                <div className="w-full text-left space-y-4 max-w-2xl">
                    <h1 className="text-5xl md:text-[64px] font-black text-white leading-[1.1] tracking-tight text-shadow-lg">
                        Book flights and <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">
                            explore the world.
                        </span>
                    </h1>
                </div>

                {/* Main Search Widget */}
                <div className="w-full flex-col">
                    {/* Tabs */}
                    <div className="flex mb-4 gap-2 w-max">
                        {[
                            { id: 'one-way', label: 'ONE WAY' },
                            { id: 'round-trip', label: 'ROUND TRIP' },
                            { id: 'multi-city', label: 'MULTI CITY' }
                        ].map((type, idx) => {
                            const isActive = tripType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setTripType(type.id)}
                                    className={`px-6 py-2.5 text-[11px] font-bold tracking-widest transition-all rounded-full ${isActive
                                        ? 'bg-[#f26a36] text-white shadow-lg'
                                        : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur-md border border-white/10'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Form Fields Row */}
                    <div className="flex flex-col lg:flex-row w-full bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl border border-white/20">

                        {/* From & To (Combined block with divider/swap) */}
                        <div className="flex lg:w-2/5 relative bg-white border-r border-[#e5e7eb] rounded-bl-md lg:rounded-bl-none">
                            {/* From */}
                            <div ref={fromRef} className="flex-1 flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 relative" onClick={() => setShowFromDropdown(true)}>
                                <Plane className="h-5 w-5 text-gray-400 rotate-45 mr-3 shrink-0" />
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-semibold text-gray-500">Where From ?</span>
                                    {showFromDropdown ? (
                                        <input
                                            type="text"
                                            autoFocus
                                            className="bg-transparent border-none outline-none text-[13px] font-semibold text-gray-700 w-full p-0"
                                            placeholder="Search city or airport..."
                                            value={fromSearch}
                                            onChange={(e) => setFromSearch(e.target.value)}
                                        />
                                    ) : (
                                        <span className="text-[13px] font-semibold text-gray-700 truncate w-full">
                                            {fromAirport ? `${fromAirport.airportCode}, ${fromAirport.city}` : "Departure City"}
                                        </span>
                                    )}
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />

                                {showFromDropdown && (
                                    <div className="absolute top-[110%] left-0 w-[280px] bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                                        {fromFiltered.map(airport => (
                                            <div
                                                key={airport._id}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFromAirport(airport);
                                                    setShowFromDropdown(false);
                                                    setFromSearch('');
                                                }}
                                            >
                                                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                                                <div className="flex flex-col flex-1 overflow-hidden">
                                                    <span className="text-sm font-bold text-gray-700 truncate">{airport.city} ({airport.airportCode})</span>
                                                    <span className="text-[11px] text-gray-500 truncate">{airport.airportName}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Swap Button */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" onClick={handleSwap}>
                                <div className="bg-black rounded-full p-2 cursor-pointer hover:bg-gray-800 transition-colors shadow-md">
                                    <ArrowRightLeft className="h-3 w-3 text-white" />
                                </div>
                            </div>

                            <div className="w-px bg-gray-300 h-10 my-auto"></div>

                            {/* To */}
                            <div ref={toRef} className="flex-1 flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 pl-6 relative" onClick={() => setShowToDropdown(true)}>
                                <Plane className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-semibold text-gray-500">Where To ?</span>
                                    {showToDropdown ? (
                                        <input
                                            type="text"
                                            autoFocus
                                            className="bg-transparent border-none outline-none text-[13px] font-semibold text-gray-700 w-full p-0"
                                            placeholder="Search city or airport..."
                                            value={toSearch}
                                            onChange={(e) => setToSearch(e.target.value)}
                                        />
                                    ) : (
                                        <span className="text-[13px] font-semibold text-gray-700 truncate w-full">
                                            {toAirport ? `${toAirport.airportCode}, ${toAirport.city}` : "Arrival City"}
                                        </span>
                                    )}
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />

                                {showToDropdown && (
                                    <div className="absolute top-[110%] left-0 w-[280px] bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                                        {toFiltered.map(airport => (
                                            <div
                                                key={airport._id}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setToAirport(airport);
                                                    setShowToDropdown(false);
                                                    setToSearch('');
                                                }}
                                            >
                                                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                                                <div className="flex flex-col flex-1 overflow-hidden">
                                                    <span className="text-sm font-bold text-gray-700 truncate">{airport.city} ({airport.airportCode})</span>
                                                    <span className="text-[11px] text-gray-500 truncate">{airport.airportName}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="flex lg:w-1/4 border-r border-[#e5e7eb] bg-white">
                            {/* Departure */}
                            <div className="flex-1 flex flex-col px-4 py-3 cursor-pointer hover:bg-gray-50 border-r border-gray-100 relative group">
                                <span className="text-[10px] text-gray-500 mb-0.5 uppercase font-bold tracking-wider">Departure</span>
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-gray-400 mr-2 shrink-0 group-hover:text-[#f26a36]" />
                                    <input
                                        type="date"
                                        className="bg-transparent border-none outline-none text-[13px] font-bold text-gray-700 w-full cursor-pointer uppercase [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                        value={departureDate}
                                        onChange={(e) => setDepartureDate(e.target.value)}
                                        min={today}
                                    />
                                </div>
                            </div>

                            {/* Return */}
                            <div 
                                className={`flex-1 flex flex-col px-4 py-3 transition-colors relative group ${tripType === 'one-way' ? 'bg-[#fcfcfc] opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 bg-white'}`}
                                onClick={() => { if (tripType === 'one-way') setTripType('round-trip'); }}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] text-gray-500 mb-0.5 uppercase font-bold tracking-wider">Return</span>
                                    {tripType !== 'one-way' && returnDate && (
                                        <X
                                            className="h-3 w-3 text-gray-400 cursor-pointer hover:text-red-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setReturnDate('');
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <Calendar className={`h-4 w-4 mr-2 shrink-0 ${tripType === 'one-way' ? 'text-gray-300' : 'text-gray-400 group-hover:text-[#f26a36]'}`} />
                                    {tripType === 'one-way' ? (
                                        <span className="text-[11px] font-bold text-gray-400 italic">Add Return</span>
                                    ) : (
                                        <input
                                            type="date"
                                            className={`bg-transparent border-none outline-none text-[13px] font-bold text-gray-700 w-full uppercase [&::-webkit-calendar-picker-indicator]:cursor-pointer ${tripType === 'one-way' ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            min={departureDate || today}
                                            disabled={tripType === 'one-way'}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Passenger & Class */}
                        <div ref={passengerRef} className="flex lg:w-1/4 bg-white items-center px-4 py-3 cursor-pointer hover:bg-gray-50 relative" onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}>
                            <Users className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                            <div className="flex flex-col flex-1 max-w-full overflow-hidden">
                                <span className="text-[10px] text-gray-500 mb-0.5 whitespace-nowrap">Passenger and Class</span>
                                <span className="text-[13px] font-bold text-gray-700 truncate">
                                    {passengers.adults + passengers.children + passengers.infants} Traveler{passengers.adults + passengers.children + passengers.infants > 1 ? 's' : ''}, {travelClass}
                                </span>
                            </div>

                            {showPassengerDropdown && (
                                <div className="absolute top-[110%] right-0 w-[400px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 z-[100] p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex flex-col space-y-4">
                                        <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-50 pb-2">Travellers</h3>
                                        
                                        {[
                                            { id: 'adults', label: 'Adults', sub: '12 yrs+', min: 1, max: 9 },
                                            { id: 'children', label: 'Children', sub: '2-12 yrs', min: 0, max: 8 },
                                            { id: 'infants', label: 'Infants', sub: '0-2 yrs', min: 0, max: 4 }
                                        ].map((p) => (
                                            <div key={p.id} className="flex flex-col space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-800 text-sm">{p.label}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">{p.sub}</span>
                                                </div>
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    {Array.from({ length: p.max + 1 }).map((_, i) => {
                                                        const val = i;
                                                        if (val < p.min) return null;
                                                        const isSelected = passengers[p.id] === val;
                                                        const isLimitReached = (passengers.adults + passengers.children + passengers.infants) >= 9 && !isSelected && val > passengers[p.id];

                                                        return (
                                                            <button
                                                                key={val}
                                                                type="button"
                                                                disabled={isLimitReached}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setPassengers(prev => ({ ...prev, [p.id]: val }));
                                                                }}
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                                                                    isSelected 
                                                                    ? 'bg-[#0070E0] text-white shadow-lg' 
                                                                    : isLimitReached ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                {val}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="bg-[#f0f5ff] rounded-xl p-3 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                            <Users className="w-3.5 h-3.5 text-[#0070E0]" />
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-800 leading-tight">Group booking for 9+ travelers?</span>
                                                <button type="button" className="text-[10px] font-black text-[#f26a36] hover:underline uppercase text-left mt-0.5" onClick={(e) => e.stopPropagation()}>Contact Us</button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2 border-t border-gray-100">
                                            <h4 className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Travel Class</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {['Economy', 'Premium Economy', 'Business'].map((cls) => {
                                                    const isSelected = travelClass === cls;
                                                    return (
                                                        <button
                                                            key={cls}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setTravelClass(cls);
                                                            }}
                                                            className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                                                                isSelected 
                                                                ? 'bg-[#0070E0] text-white border-[#0070E0] shadow-sm' 
                                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        >
                                                            {cls}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <button 
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowPassengerDropdown(false);
                                                }}
                                                className="w-full py-1.5 bg-[#f26a36] hover:bg-[#e05d2e] text-white rounded-lg font-bold text-[11px] shadow-md transition-all uppercase tracking-widest"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={() => {
                                if (!fromAirport || !toAirport) return alert("Please select both origin and destination.");
                                if (fromAirport.airportCode === toAirport.airportCode) return alert("Origin and destination cannot be the same.");
                                if (!departureDate) return alert("Please select a departure date.");

                                const params = new URLSearchParams();
                                params.append('from', fromAirport.airportCode);
                                params.append('to', toAirport.airportCode);
                                params.append('date', departureDate);
                                if (returnDate) params.append('returnDate', returnDate);
                                params.append('adults', passengers.adults);
                                params.append('children', passengers.children);
                                params.append('infants', passengers.infants);
                                params.append('travelClass', travelClass);
                                params.append('tripType', tripType);
                                params.append('fareType', fareType);
                                if (preferredAirline) params.append('airline', preferredAirline);
                                if (directFlight) params.append('direct', 'true');
                                
                                navigate(`/flight-results?${params.toString()}`);
                            }}
                            className="bg-gradient-to-r from-[#f26a36] to-[#ff8c5a] hover:to-[#f26a36] text-white px-10 py-6 lg:py-0 font-black text-sm tracking-widest transition-all hover:shadow-[0_0_30px_rgba(242,106,54,0.4)] active:scale-[0.98] flex items-center justify-center min-w-[160px] rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl"
                        >
                            SEARCH
                        </button>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-center mt-6 gap-x-6 gap-y-3 text-white text-[12px]">
                        <div className="relative" ref={airlineRef}>
                            <div 
                                className="flex items-center cursor-pointer opacity-80 hover:opacity-100 bg-white/10 px-3 py-1.5 rounded-md transition-colors"
                                onClick={() => setShowAirlineDropdown(!showAirlineDropdown)}
                            >
                                <span className="mr-1">{preferredAirline || 'Select Preferred Airline'}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${showAirlineDropdown ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {showAirlineDropdown && (
                                <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-lg shadow-xl py-2 z-[100] text-gray-800 border border-gray-100">
                                    {['All Airlines', 'Air India', 'IndiGo', 'Akasa Air', 'SpiceJet', 'Vistara'].map(airline => (
                                        <div 
                                            key={airline}
                                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[13px] font-semibold flex items-center justify-between"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreferredAirline(airline === 'All Airlines' ? '' : airline);
                                                setShowAirlineDropdown(false);
                                            }}
                                        >
                                            {airline}
                                            {(preferredAirline === airline || (airline === 'All Airlines' && !preferredAirline)) && <Check className="h-3.5 w-3.5 text-[#f26a36]" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div 
                            className="flex items-center cursor-pointer group select-none py-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDirectFlight(!directFlight);
                            }}
                        >
                            <div className={`w-[18px] h-[18px] rounded-sm mr-2 flex items-center justify-center transition-all border ${directFlight ? 'bg-[#f26a36] border-[#f26a36]' : 'bg-white/20 border-white/40 group-hover:bg-white/30'}`}>
                                {directFlight && <Check className="h-3.5 w-3.5 text-white" strokeWidth={4} />}
                            </div>
                            <span className={`transition-opacity font-bold whitespace-nowrap ${directFlight ? 'opacity-100 text-[#f26a36]' : 'opacity-80 group-hover:opacity-100'}`}>Direct Flight</span>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-gray-300">Select Fare Type:</span>

                            {[
                                { id: 'regular', label: 'Regular Fares' },
                                { id: 'student', label: 'Student Fares' },
                                { id: 'senior', label: 'Senior Citizen Fares' },
                                { id: 'soto', label: 'SOTO' },
                                { id: 'ndc', label: 'NDC' }
                            ].map((fare) => (
                                <div
                                    key={fare.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFareType(fare.id);
                                    }}
                                    className="flex items-center cursor-pointer group whitespace-nowrap py-1 px-2 hover:bg-white/5 rounded-md transition-colors"
                                >
                                    <div className={`w-[16px] h-[16px] rounded-sm mr-2 flex items-center justify-center transition-colors border ${fareType === fare.id
                                        ? 'bg-[#f26a36] border-[#f26a36]'
                                        : 'bg-white/20 border-white/40 group-hover:bg-white/40'
                                        }`}>
                                        {fareType === fare.id && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
                                    </div>
                                    <span className={fareType === fare.id ? 'opacity-100 font-bold text-[#f26a36]' : 'opacity-90 group-hover:opacity-100'}>
                                        {fare.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlightHero;
