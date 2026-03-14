import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, Star, MapPin, ChevronRight, Filter, SortAsc, Info,
    Wifi, Power, Coffee, Tv, ShieldCheck, MapPin as MapPinIcon,
    ChevronDown, ArrowRight, Share2, PhoneCall, User,
    Search, ArrowLeftRight, Calendar, Mic, Sparkles, Tag, Timer, Bus
} from 'lucide-react';
import SeatSelectionOverlay from './SeatSelectionOverlay';
import BoardingPointMap from './BoardingPointMap';
import { searchSchedules } from '../api/scheduleApi';
import { searchCities } from '../api/cityApi';
import { validateCoupon, getActiveCoupons } from '../api/couponApi';
import WomenBookingToggle from './WomenBookingToggle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Haversine formula to calculate distance between two coordinates in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
};

const calculateDuration = (dep, arr) => {
    const [h1, m1] = dep.split(':').map(Number);
    const [h2, m2] = arr.split(':').map(Number);
    let totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
};

const dates = [
    { day: "Fri", date: "20 Feb", price: "850" },
    { day: "Sat", date: "21 Feb", price: "950" },
    { day: "Sun", date: "22 Feb", price: "1250" },
    { day: "Mon", date: "23 Feb", price: "750" },
    { day: "Tue", date: "24 Feb", price: "750" },
    { day: "Wed", date: "25 Feb", price: "750" },
    { day: "Thu", date: "26 Feb", price: "750" },
];

const BusResults = ({ searchParams, setSearchParams, setView, setSelectedBus, setSelectedSeats, setBusBookingData, isLoggedIn, triggerLogin, onOverlayToggle }) => {
    const navigate = useNavigate();
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCoupons, setActiveCoupons] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    // Geolocation detection
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    console.log("[GEOLOCATION] User location captured:", position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("[GEOLOCATION] Permission denied or error:", error.message);
                }
            );
        }
    }, []);

    // Local state for the editable search bar
    const [localFrom, setLocalFrom] = useState(searchParams?.fromCity || "");
    const [localTo, setLocalTo] = useState(searchParams?.toCity || "");
    const [localDate, setLocalDate] = useState(searchParams?.date || "");
    const [localWomenBooking, setLocalWomenBooking] = useState(searchParams?.womenBooking || false);

    const [selectedDate, setSelectedDate] = useState(searchParams?.date || "20 Feb");
    const [expandedBusId, setExpandedBusId] = useState(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [overlayBus, setOverlayBus] = useState(null);

    // Autocomplete States
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [isCityLoading, setIsCityLoading] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.suggestion-container')) {
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
            setIsCityLoading(true);
            const data = await searchCities(query);
            setSuggestions(data);
            setShow(data.length > 0);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setIsCityLoading(false);
        }
    };

    const handleFromChange = (e) => {
        const val = e.target.value;
        setLocalFrom(val);

        if (debounceTimer) clearTimeout(debounceTimer);
        const timer = setTimeout(() => {
            fetchCities(val, setFromSuggestions, setShowFromSuggestions);
        }, 300);
        setDebounceTimer(timer);
    };

    const handleToChange = (e) => {
        const val = e.target.value;
        setLocalTo(val);

        if (debounceTimer) clearTimeout(debounceTimer);
        const timer = setTimeout(() => {
            fetchCities(val, setToSuggestions, setShowToSuggestions);
        }, 300);
        setDebounceTimer(timer);
    };

    const selectCity = (city, type) => {
        if (type === 'from') {
            setLocalFrom(city.name);
            setShowFromSuggestions(false);
        } else {
            setLocalTo(city.name);
            setShowToSuggestions(false);
        }
    };

    const handleViewSeats = (bus) => {
        setOverlayBus(bus);
        setIsOverlayOpen(true);
        onOverlayToggle?.(true);

        // Append URL params context when opening overlay
        let formattedDate = localDate;
        if (localDate.includes('-') && localDate.split('-')[0].length === 4) {
            const [year, month, day] = localDate.split('-');
            formattedDate = `${day}-${month}-${year}`;
        }

        const params = new URLSearchParams(window.location.search);
        const resolvedBusId = bus.id || bus.busId || bus._id;
        console.log(`[FRONTEND DEBUG] Opening seat overlay. Resolved bus URL ID from object:`, resolvedBusId);

        params.set('busId', resolvedBusId);
        params.set('date', formattedDate);
        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    };

    const handleSearch = () => {
        if (!localFrom || !localTo) {
            toast.error("Add first from to", { position: "top-right", theme: "colored" });
            return;
        }
        if (!localDate) {
            toast.error("Please select a date", { position: "top-right", theme: "colored" });
            return;
        }

        // The native date picker outputs YYYY-MM-DD, but our API expects DD-MM-YYYY
        let formattedDate = localDate;
        if (localDate.includes('-') && localDate.split('-')[0].length === 4) {
            const [year, month, day] = localDate.split('-');
            formattedDate = `${day}-${month}-${year}`;
        }

        // Update the parent's search parameters if the setter is available
        // Or just trigger the local fetch
        if (setSearchParams) {
            setSearchParams({
                fromCity: localFrom,
                toCity: localTo,
                date: formattedDate,
                womenBooking: localWomenBooking
            });
        } else {
            // Fallback to manual local fetch if parent doesn't provide a setter
            fetchBuses(localFrom, localTo, formattedDate, localWomenBooking);
        }
    };

    const fetchBuses = async (
        from = searchParams?.fromCity,
        to = searchParams?.toCity,
        date = searchParams?.date,
        womenBooking = searchParams?.womenBooking
    ) => {
        if (!from || !to) return;
        setLoading(true);
        try {
            const data = await searchSchedules({
                from: from,
                to: to,
                date: date,
                womenBooking: womenBooking
            });

            const mappedBuses = data.map(s => ({
                id: (s.bus?._id || s.bus || undefined),
                scheduleId: s._id,
                busId: (s.bus?._id || s.bus || undefined),
                routeId: (s.route?._id || s.route || undefined),
                name: s.bus?.busName || "Express Bus",
                type: s.bus?.busType || "Standard AC",
                departure: s.departureTime,
                departurePoint: s.route?.fromCity || searchParams.fromCity,
                arrival: s.arrivalTime,
                arrivalPoint: s.route?.toCity || searchParams.toCity,
                duration: calculateDuration(s.departureTime, s.arrivalTime),
                price: s.ticketPrice,
                rating: 4.5 + (Math.random() * 0.5),
                reviews: 100 + Math.floor(Math.random() * 1000),
                seatsLeft: s.availableSeats || 40,
                amenities: s.bus?.amenities || ["water"],
                images: (s.bus?.images || s.images || []).map(img => {
                    if (img.startsWith('http')) return img;
                    // For paths like "/uploads/123.jpg", we want to ensure it works with the proxy
                    const path = img.startsWith('/') ? img : `/${img}`;
                    return path;
                }),
                liveTracking: true,
                primo: Math.random() > 0.5,
                boardingPoints: (s.boardingPoints || []).map(p => ({
                    ...p,
                    distance: calculateDistance(userLocation?.lat, userLocation?.lng, p.lat, p.lng)
                })).sort((a, b) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return parseFloat(a.distance) - parseFloat(b.distance);
                }),
                droppingPoints: (s.droppingPoints || []).map(p => ({
                    ...p,
                    distance: calculateDistance(userLocation?.lat, userLocation?.lng, p.lat, p.lng)
                })).sort((a, b) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return parseFloat(a.distance) - parseFloat(b.distance);
                }),
                seatLayout: s.bus?.seatLayout || [],
                singleSeatsAvailable: true
            }));

            setBuses(mappedBuses);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // Recalculate distances when user location is detected
    React.useEffect(() => {
        if (userLocation) {
            console.log(">>> [FRONTEND] Detect User Location in BusResults:", userLocation);
            const updatedBusesList = (buses || []).map(bus => {
                const updatedBoarding = (bus.boardingPoints || []).map(p => ({
                    ...p,
                    distance: calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng)
                })).sort((a, b) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return parseFloat(a.distance) - parseFloat(b.distance);
                });

                const updatedDropping = (bus.droppingPoints || []).map(p => ({
                    ...p,
                    distance: calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng)
                })).sort((a, b) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return parseFloat(a.distance) - parseFloat(b.distance);
                });

                return {
                    ...bus,
                    boardingPoints: updatedBoarding,
                    droppingPoints: updatedDropping
                };
            });
            setBuses(updatedBusesList);

            // Keep overlay data in sync with the freshest calculated data
            if (isOverlayOpen && overlayBus) {
                const updatedBus = updatedBusesList.find(b => b.id === overlayBus.id);
                if (updatedBus) setOverlayBus(updatedBus);
            }
        }
    }, [userLocation, isOverlayOpen]);

    // Helper to format the incoming date (which might be DD-MM-YYYY or a string like "20 Feb") into YYYY-MM-DD for the native date input
    const getInitialDateValue = (dateStr) => {
        if (!dateStr) return "";
        // If it's already YYYY-MM-DD
        if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) return dateStr;

        // If it's DD-MM-YYYY
        if (dateStr.includes('-') && dateStr.split('-')[2]?.length === 4) {
            const [day, month, year] = dateStr.split('-');
            return `${year}-${month}-${day}`;
        }
        return dateStr; // fallback
    };

    useEffect(() => {
        fetchBuses();

        const loadCoupons = async () => {
            try {
                const coupons = await getActiveCoupons();
                setActiveCoupons(coupons);
            } catch (err) {
                console.error("Failed to fetch coupons", err);
            }
        };
        loadCoupons();

        // Sync local inputs if searchParams changes from outside
        setLocalFrom(searchParams?.fromCity || "");
        setLocalTo(searchParams?.toCity || "");
        setLocalDate(getInitialDateValue(searchParams?.date));
        setLocalWomenBooking(searchParams?.womenBooking || false);
    }, [searchParams]);

    const [expandedFilters, setExpandedFilters] = useState({
        boarding: true,
        dropping: true,
        amenities: true,
        specialFeatures: true,
        departure: true,
        arrival: true,
        type: true,
        singleWindow: true,
        features: true,
        operator: true
    });

    const [isStuck, setIsStuck] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [mapConfig, setMapConfig] = useState({
        isOpen: false,
        points: [],
        title: "",
        center: null
    });

    const [activeFilters, setActiveFilters] = useState({
        ac: false,
        sleeper: false,
        seater: false,
        nonAc: false,
        liveTracking: false,
        amenities: [],
        departureTime: [],
        arrivalTime: [],
        operators: [],
        boardingPoints: [],
        droppingPoints: [],
        singleSeats: false,
        primo: false,
        hybrid: false
    });

    const toggleFilter = (category, value) => {
        setActiveFilters(prev => {
            const current = prev[category];
            if (Array.isArray(current)) {
                return {
                    ...prev,
                    [category]: current.includes(value)
                        ? current.filter(item => item !== value)
                        : [...current, value]
                };
            } else {
                return {
                    ...prev,
                    [category]: value === undefined ? !prev[category] : value
                };
            }
        });
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setActiveFilters({
            ac: false,
            sleeper: false,
            seater: false,
            nonAc: false,
            liveTracking: false,
            amenities: [],
            departureTime: [],
            arrivalTime: [],
            operators: [],
            boardingPoints: [],
            droppingPoints: [],
            singleSeats: false,
            primo: false,
            hybrid: false
        });
        setCurrentPage(1);
    };

    const filteredBuses = buses.filter(bus => {
        const typeLower = (bus.type || '').toLowerCase();
        const isHybrid = (typeLower.includes('sleeper') && typeLower.includes('seater')) || typeLower.includes('hybrid');
        const isSleeper = typeLower.includes('sleeper') && !isHybrid;
        const isSeater = typeLower.includes('seater') && !isHybrid;

        if (activeFilters.ac && !typeLower.includes('a/c')) return false;
        if (activeFilters.sleeper && !isSleeper) return false;
        if (activeFilters.seater && !isSeater) return false;
        if (activeFilters.hybrid && !isHybrid) return false;
        if (activeFilters.nonAc && typeLower.includes('a/c')) return false;
        if (activeFilters.liveTracking && !bus.liveTracking) return false;
        if (activeFilters.primo && !bus.primo) return false;

        if (activeFilters.amenities.length > 0) {
            const hasAll = activeFilters.amenities.every(a => bus.amenities.includes(a.toLowerCase()));
            if (!hasAll) return false;
        }

        if (activeFilters.operators.length > 0) {
            if (!activeFilters.operators.includes(bus.name)) return false;
        }

        return true;
    });

    const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Show all buses for now as there is no pagination UI
    const currentBuses = filteredBuses;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) setIsStuck(true);
            else setIsStuck(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleFilterSection = (section) => {
        setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSeatProceed = (bus, selectedSeats) => {
        const proceed = () => {
            setSelectedBus(bus);
            setSelectedSeats(selectedSeats);
            setView('passenger-details');
        };
        if (isLoggedIn) proceed();
        else triggerLogin(proceed);
    };

    return (
        <div className="min-h-screen bg-[#F7F8F9] pb-20 font-gelasio animate-slide-in-right overflow-x-hidden">
            {/* Main Header / Search Bar Section */}
            {!isOverlayOpen && (
                <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-[1240px] mx-auto px-4 pt-32 pb-12">
                        <div className="flex items-center gap-6">
                            {/* Search Bar Container */}
                            <div className="flex-1 flex items-center bg-white border border-gray-100 rounded-[24px] h-[84px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
                                {/* FROM */}
                                <div className="suggestion-container flex-1 flex items-center px-8 relative hover:bg-gray-50/50 transition-colors h-full rounded-l-[24px]">
                                    <Bus className="h-7 w-7 text-gray-800 flex-shrink-0" />
                                    <div className="ml-4 flex flex-col justify-center w-full">
                                        <label className="text-gray-400 text-[11px] font-medium mb-1">From</label>
                                        <input
                                            type="text"
                                            value={localFrom}
                                            onChange={handleFromChange}
                                            onFocus={() => localFrom.length >= 2 && setShowFromSuggestions(true)}
                                            className="text-[17px] font-extrabold text-gray-900 tracking-tight bg-transparent border-none p-0 focus:ring-0 w-full placeholder:text-gray-300"
                                            placeholder="Departing from"
                                        />

                                        {/* From Suggestions Dropdown */}
                                        {showFromSuggestions && (
                                            <div className="absolute top-[calc(100%+8px)] left-0 w-[300px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] max-h-[300px] overflow-y-auto overflow-x-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {fromSuggestions.map((city) => (
                                                    <div
                                                        key={city._id}
                                                        onClick={() => selectCity(city, 'from')}
                                                        className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0 group"
                                                    >
                                                        <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-[#D84E55]/10 transition-colors">
                                                            <MapPin className="h-4 w-4 text-slate-400 group-hover:text-[#D84E55]" />
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
                                    <div className="absolute -right-[21px] top-1/2 -translate-y-1/2 z-20">
                                        <div
                                            onClick={() => {
                                                const temp = localFrom;
                                                setLocalFrom(localTo);
                                                setLocalTo(temp);
                                            }}
                                            className="bg-[#4D4D4D] border-2 border-white rounded-full p-2.5 shadow-md hover:scale-110 transition-transform cursor-pointer group"
                                        >
                                            <ArrowLeftRight className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* TO */}
                                <div className="suggestion-container flex-1 flex items-center pl-10 pr-8 border-l border-gray-100 hover:bg-gray-50/50 transition-colors h-full relative">
                                    <Bus className="h-7 w-7 text-gray-800 flex-shrink-0" />
                                    <div className="ml-4 flex flex-col justify-center w-full">
                                        <label className="text-gray-400 text-[11px] font-medium mb-1">To</label>
                                        <input
                                            type="text"
                                            value={localTo}
                                            onChange={handleToChange}
                                            onFocus={() => localTo.length >= 2 && setShowToSuggestions(true)}
                                            className="text-[17px] font-extrabold text-gray-900 tracking-tight bg-transparent border-none p-0 focus:ring-0 w-full placeholder:text-gray-300"
                                            placeholder="Going to"
                                        />

                                        {/* To Suggestions Dropdown */}
                                        {showToSuggestions && (
                                            <div className="absolute top-[calc(100%+8px)] left-0 w-[300px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] max-h-[300px] overflow-y-auto overflow-x-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {toSuggestions.map((city) => (
                                                    <div
                                                        key={city._id}
                                                        onClick={() => selectCity(city, 'to')}
                                                        className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0 group"
                                                    >
                                                        <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-[#D84E55]/10 transition-colors">
                                                            <MapPin className="h-4 w-4 text-slate-400 group-hover:text-[#D84E55]" />
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

                                {/* DATE */}
                                <div className="flex-[1.4] flex items-center border-l border-gray-100 h-full">
                                    <div className="flex-1 flex items-center px-8 hover:bg-gray-50/50 transition-colors h-full">
                                        <Calendar className="h-7 w-7 text-gray-800 flex-shrink-0" />
                                        <div className="ml-4 flex flex-col justify-center w-full">
                                            <label className="text-gray-400 text-[11px] font-medium mb-1">Date of journey</label>
                                            <input
                                                type="date"
                                                value={localDate}
                                                onChange={(e) => setLocalDate(e.target.value)}
                                                className="text-[17px] font-extrabold text-gray-900 tracking-tight bg-transparent border-none p-0 focus:ring-0 w-full uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-6">
                                        <button
                                            onClick={() => {
                                                const today = new Date();
                                                const yyyyMmDd = today.toISOString().split('T')[0];
                                                const ddMmYyyy = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
                                                setLocalDate(yyyyMmDd);
                                                if (setSearchParams) {
                                                    setSearchParams({ ...searchParams, fromCity: localFrom, toCity: localTo, date: ddMmYyyy, womenBooking: localWomenBooking });
                                                } else {
                                                    fetchBuses(localFrom, localTo, ddMmYyyy, localWomenBooking);
                                                }
                                            }}
                                            className="px-5 py-2.5 bg-[#EBEBEB] hover:bg-gray-300 rounded-[20px] text-[13px] font-bold text-gray-700 transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            Today
                                        </button>
                                        <button
                                            onClick={() => {
                                                const tomorrow = new Date();
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                const yyyyMmDd = tomorrow.toISOString().split('T')[0];
                                                const ddMmYyyy = `${tomorrow.getDate().toString().padStart(2, '0')}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getFullYear()}`;
                                                setLocalDate(yyyyMmDd);
                                                if (setSearchParams) {
                                                    setSearchParams({ ...searchParams, fromCity: localFrom, toCity: localTo, date: ddMmYyyy, womenBooking: localWomenBooking });
                                                } else {
                                                    fetchBuses(localFrom, localTo, ddMmYyyy, localWomenBooking);
                                                }
                                            }}
                                            className="px-5 py-2.5 bg-[#FFE1E1] hover:bg-[#FFD5D5] rounded-[20px] text-[13px] font-bold text-[#D84E55] transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            Tomorrow
                                        </button>
                                    </div>
                                </div>

                                <div className="w-px bg-gray-100 h-10 my-auto"></div>

                                {/* Women Booking Toggle */}
                                <div className="px-6 flex items-center h-full">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-bold text-gray-800">Booking for women</span>
                                            <span className="text-[10px] font-bold text-[#108ece] hover:underline">Know more</span>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer ml-2">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={localWomenBooking}
                                                onChange={() => setLocalWomenBooking(!localWomenBooking)}
                                            />
                                            <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D84E55]"></div>
                                        </div>
                                    </label>
                                </div>

                                {/* SEARCH BUTTON */}
                                <div className="pl-2 pr-4 bg-white border-l border-gray-100 flex items-center h-full rounded-r-[24px]">
                                    <button onClick={handleSearch} className="h-[58px] w-[58px] bg-[#D84E55] hover:bg-[#C13E44] rounded-[22px] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(216,78,85,0.4)] transition-all hover:scale-105 active:scale-95">
                                        <Search className="h-6 w-6 stroke-[3px]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date Slider / Filter Strip */}
                    <div className="bg-[#F8F9FA] border-t border-gray-100">
                        <div className="max-w-[1240px] mx-auto flex items-center justify-center px-4">
                            {/* We'll use a simplified horizontal scroll for promo banners here as seen in the UI */}
                            <div className="flex items-center gap-4 py-4 overflow-x-auto hide-scrollbar">
                                {/* AI Filter Card */}
                                <div className="flex-shrink-0 w-60 h-[110px] bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] rounded-2xl p-4 border border-[#DDD6FE] relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex items-center gap-2 text-[#7C3AED] mb-2">
                                        <Sparkles className="h-4 w-4 fill-current" />
                                        <span className="font-black text-xs uppercase tracking-wider">Eazzy filter</span>
                                    </div>
                                    <p className="text-[10px] text-[#8B5CF6] font-bold mb-3">AI powered <span className="text-gray-500">smart search</span></p>
                                    <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-[#DDD6FE]">
                                        <Search className="h-3 w-3 text-gray-400" />
                                        <span className="text-[10px] text-gray-400 font-medium">Try "evening ..."</span>
                                        <Mic className="h-3 w-3 text-gray-400 ml-auto" />
                                    </div>
                                    <div className="absolute top-0 right-0 -mr-2 -mt-2 opacity-5">
                                        <Sparkles className="h-24 w-24" />
                                    </div>
                                </div>

                                {/* Dynamic Promo Cards from Coupons */}
                                {activeCoupons.map((coupon) => (
                                    <div key={coupon._id || coupon.code} className="flex-shrink-0 w-60 h-[110px] bg-white rounded-2xl p-4 border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-[#FEE2E2] rounded-xl flex items-center justify-center">
                                                <Tag className="h-6 w-6 text-[#D84E55]" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-800">Use {coupon.code}</h4>
                                                <p className="text-[11px] text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis w-32">{coupon.description || 'Special Deal'}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-[#D84E55] font-black text-xs">
                                            {coupon.discountType === 'flat' ? `Flat ₹${coupon.discountValue || coupon.discountAmount} OFF` : `Get ${coupon.discountValue || coupon.discountAmount}% OFF`}
                                        </div>
                                    </div>
                                ))}

                                {/* Promo Card 3 - Vijayant Travels example from image */}
                                <div className="flex-shrink-0 w-60 h-[110px] bg-[#C13E44] rounded-2xl p-4 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div>
                                            <h4 className="text-white font-black italic text-lg leading-tight">Vijayant<br />Travels</h4>
                                            <p className="text-white/70 text-[9px] font-bold">Safe, Comfortable, On time</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="px-2 py-0.5 bg-yellow-400 text-[#C13E44] text-[8px] font-black rounded uppercase">Premium</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-black/20 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[1240px] mx-auto px-4 py-8 font-inter">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
                    {/* Sidebar Filters */}
                    <div className="hidden lg:block">
                        <div className="sticky top-[100px]">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-800 text-sm">Filter buses</h3>
                                    <button onClick={clearFilters} className="text-[11px] font-bold text-blue-600 hover:underline">CLEAR ALL</button>
                                </div>

                                {/* Quick Filters */}
                                <div className="p-4 space-y-4">
                                    <div className="space-y-3 font-medium">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#D84E55] focus:ring-[#D84E55]" checked={activeFilters.ac} onChange={() => toggleFilter('ac')} />
                                            <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">AC ({buses.filter(b => b.type.toLowerCase().includes('a/c')).length})</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#D84E55] focus:ring-[#D84E55]" checked={activeFilters.sleeper} onChange={() => toggleFilter('sleeper')} />
                                            <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">SLEEPER ({buses.filter(b => b.type.toLowerCase().includes('sleeper')).length})</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#D84E55] focus:ring-[#D84E55]" checked={activeFilters.singleSeats} onChange={() => toggleFilter('singleSeats')} />
                                            <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Single Seats (51)</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#D84E55] focus:ring-[#D84E55]" checked={activeFilters.seater} onChange={() => toggleFilter('seater')} />
                                            <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">SEATER ({buses.filter(b => (b.type || '').toLowerCase().includes('seater') && !(b.type || '').toLowerCase().includes('sleeper')).length})</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#D84E55] focus:ring-[#D84E55]" checked={activeFilters.hybrid} onChange={() => toggleFilter('hybrid')} />
                                            <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">HYBRID ({buses.filter(b => (b.type || '').toLowerCase().includes('sleeper') && (b.type || '').toLowerCase().includes('seater')).length})</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#D84E55] focus:ring-[#D84E55]" checked={activeFilters.nonAc} onChange={() => toggleFilter('nonAc', !activeFilters.nonAc)} />
                                            <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">NONAC (1)</span>
                                        </label>
                                    </div>

                                    {/* Departure Time Filter */}
                                    <div className="pt-4 border-t border-gray-50 space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Departure time</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            <button className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:border-gray-300 transition-all text-left">
                                                <Clock className="h-3 w-3 text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-600 uppercase">18:00-24:00 (45)</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Results Header Strip */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-800 font-outfit">{filteredBuses.length} buses found</h2>
                                <div className="flex items-center gap-8 bg-white px-6 py-2 rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sort by:</span>
                                    <div className="flex gap-8 text-[11px] font-black">
                                        <button className="text-gray-500 hover:text-gray-900 transition-colors uppercase">Ratings</button>
                                        <button className="text-gray-500 hover:text-gray-900 transition-colors uppercase">Departure time</button>
                                        <button className="text-gray-500 hover:text-gray-900 transition-colors uppercase">Price</button>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Info Green Banner */}
                            <div className="bg-[#E6F9F1] border border-[#BFF2DE] px-4 py-2 rounded-xl flex items-center gap-3 relative overflow-hidden group">
                                <div className="w-1.5 h-full absolute left-0 bg-[#10B981]"></div>
                                <div className="p-1 bg-[#10B981] rounded-full">
                                    <Tag className="h-3 w-3 text-white" />
                                </div>
                                <p className="text-[11px] font-bold text-[#065F46] uppercase tracking-wider">
                                    <span className="font-black">18500+</span> bookings on this route last month
                                </p>
                                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4">
                                    <div className="w-20 h-[120%] bg-white/20 -skew-x-12 translate-x-20 group-hover:-translate-x-60 transition-transform duration-1000"></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-12 h-12 border-4 border-[#D84E55]/20 border-t-[#D84E55] rounded-full animate-spin mb-4"></div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Searching for the best buses...</p>
                                </div>
                            ) : filteredBuses.length === 0 ? (
                                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm text-center px-10">
                                    <Search className="h-10 w-10 text-gray-200 mb-6" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Buses Found</h3>
                                    <p className="text-gray-400 text-sm max-w-sm">We couldn't find any buses for this route on the selected date. Try changing filters or date.</p>
                                    <button onClick={clearFilters} className="mt-8 px-8 py-3 bg-[#D84E55] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#C13E44] transition-all">Clear All Filters</button>
                                </div>
                            ) : (
                                currentBuses.map((bus) => (
                                    <div key={bus.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group relative">
                                        {/* Dynamic Coupon Badge */}
                                        {activeCoupons.length > 0 && (() => {
                                            const bestCoupon = activeCoupons.reduce((best, current) => {
                                                if (current.minBookingAmount && bus.price < current.minBookingAmount) return best;
                                                const currentVal = current.discountValue || current.discountAmount || 0;
                                                const currentDiscount = current.discountType === 'flat' ? currentVal : (bus.price * currentVal / 100);
                                                const maxCapped = current.maxDiscountAmount ? Math.min(currentDiscount, current.maxDiscountAmount) : currentDiscount;

                                                const bestVal = best ? (best.discountValue || best.discountAmount || 0) : 0;
                                                const bestDiscount = best ? (best.discountType === 'flat' ? bestVal : (bus.price * bestVal / 100)) : 0;
                                                const bestMaxCapped = best?.maxDiscountAmount ? Math.min(bestDiscount, best.maxDiscountAmount) : bestDiscount;

                                                return maxCapped > bestMaxCapped ? current : best;
                                            }, null);

                                            if (!bestCoupon) return null;

                                            const val = bestCoupon.discountValue || bestCoupon.discountAmount || 0;
                                            const discountAmt = bestCoupon.discountType === 'flat' ? val : Math.min(bus.price * val / 100, bestCoupon.maxDiscountAmount || Infinity);

                                            return (
                                                <div className="absolute top-4 right-6 flex items-center gap-1.5 bg-[#FFFBEB] px-3 py-1 rounded-lg border border-[#FEF3C7]">
                                                    <Tag className="h-3 w-3 text-[#D97706]" />
                                                    <span className="text-[10px] font-black text-[#D97706] uppercase tracking-tighter">Save up to ₹{Math.round(discountAmt)} with {bestCoupon.code}</span>
                                                </div>
                                            );
                                        })()}

                                        <div className="p-6">
                                            {(() => {
                                                const nearestBP = (bus.boardingPoints || []).filter(p => p.distance).reduce((prev, curr) => {
                                                    if (!prev || parseFloat(curr.distance) < parseFloat(prev.distance)) return curr;
                                                    return prev;
                                                }, null);

                                                if (!nearestBP) return null;

                                                return (
                                                    <div className="absolute top-0 left-0 bg-[#E0F2FE] px-4 py-2 rounded-br-2xl border-b border-r border-[#BAE6FD] flex items-center gap-2 z-10 shadow-md animate-fade-in-right">
                                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                        <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest flex items-center gap-1.5">
                                                            <span className="text-base leading-none">⭐</span> 
                                                            Nearest Boarding: <span className="text-blue-900 font-extrabold">{nearestBP.location}</span> — {nearestBP.distance} km away
                                                        </span>
                                                    </div>
                                                );
                                            })()}
                                            <div className="flex flex-col md:flex-row items-center gap-8">
                                                {/* Left: Operator Info */}
                                                <div className="w-full md:w-[220px]">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-black text-gray-800 leading-tight group-hover:text-[#D84E55] transition-colors">{bus.name}</h3>
                                                        {bus.primo && <div className="bg-[#1E293B] text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase italic">Primo</div>}
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-medium mb-4">{bus.type}</p>

                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1.5 bg-[#10B981] text-white px-2 py-0.5 rounded-md">
                                                            <Star className="h-3 w-3 fill-white" />
                                                            <span className="text-xs font-black">{bus.rating.toFixed(1)}</span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{bus.reviews} ratings</div>
                                                    </div>
                                                </div>

                                                {/* Center: Route Info */}
                                                <div className="flex-1 flex items-center justify-between px-8 border-x border-gray-50">
                                                    <div className="text-center md:text-left">
                                                        <p className="text-2xl font-black text-gray-800">{bus.departure}</p>
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{bus.departurePoint}</p>
                                                    </div>

                                                    <div className="flex flex-col items-center px-4">
                                                        <span className="text-[10px] font-bold text-gray-400 mb-1">{bus.duration}</span>
                                                        <div className="flex items-center gap-1 w-24">
                                                            <div className="h-[2px] flex-1 bg-gray-200 rounded-full"></div>
                                                            <div className="w-1.5 h-1.5 rounded-full border border-gray-200"></div>
                                                            <div className="h-[2px] flex-1 bg-gray-200 rounded-full"></div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 mt-1">{bus.seatsLeft} Seats <span className="text-[#D84E55] italic">(4 Single)</span></span>
                                                    </div>

                                                    <div className="text-center md:text-right">
                                                        <p className="text-2xl font-black text-gray-800">{bus.arrival}</p>
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{bus.arrivalPoint}</p>
                                                    </div>
                                                </div>

                                                {/* Right: Pricing and Action */}
                                                <div className="md:w-[220px] flex flex-col items-end">
                                                    <div className="text-right mb-6">
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest line-through">₹{Math.floor(bus.price * 1.15)}</p>
                                                        <div className="flex items-baseline justify-end gap-1">
                                                            <span className="text-xs font-bold text-gray-400">Onwards</span>
                                                            <span className="text-3xl font-black text-gray-800 leading-none">₹{bus.price}</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleViewSeats(bus)}
                                                        className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-md active:scale-[0.98] bg-[#D84E55] text-white hover:bg-[#C13E44] hover:shadow-lg"
                                                    >
                                                        View Seats
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Bottom Features Strip */}
                                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 group cursor-pointer">
                                                        <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#D84E55]/10 transition-colors">
                                                            <MapPin className="h-3 w-3 text-gray-400 group-hover:text-[#D84E55]" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-gray-600">Boarding & Dropping</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 group cursor-pointer">
                                                        <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#10B981]/10 transition-colors">
                                                            <ShieldCheck className="h-3 w-3 text-gray-400 group-hover:text-[#10B981]" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-gray-600">Travel Policy</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 group cursor-pointer">
                                                        <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                                                            <Info className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-gray-600">Amenities</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {bus.amenities.slice(0, 3).map((amenity, i) => (
                                                        <div key={i} className="text-gray-300 hover:text-gray-500 transition-colors cursor-help">
                                                            {amenity === 'wifi' && <Wifi className="h-4 w-4" />}
                                                            {amenity === 'water' && <Coffee className="h-4 w-4" />}
                                                            {amenity === 'power' && <Power className="h-4 w-4" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Inline seat selection removed in favor of slide-up overlay */}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Seat Selection Overlay */}
            <SeatSelectionOverlay
                isOpen={isOverlayOpen}
                onClose={() => {
                    setIsOverlayOpen(false);
                    onOverlayToggle?.(false);

                    // Clear URL params when closing overlay
                    const params = new URLSearchParams(window.location.search);
                    params.delete('busId');
                    params.delete('date');
                    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
                    window.history.pushState({}, '', newUrl);
                }}
                bus={overlayBus}
                searchParams={searchParams}
                isLoggedIn={isLoggedIn}
                triggerLogin={triggerLogin}
                userLocation={userLocation}
                onProceed={(bookingData) => {
                    setSelectedBus(overlayBus);
                    // seats are now full seat objects from processedLayout
                    setSelectedSeats(bookingData?.seats || []);
                    if (setBusBookingData) {
                        setBusBookingData({ boarding: bookingData?.boarding, dropping: bookingData?.dropping });
                    }
                    setIsOverlayOpen(false);
                    onOverlayToggle?.(false);

                    const destination = bookingData?.bookingId
                        ? `/payment/${bookingData.bookingId}`
                        : '/bus-payment';

                    if (!isLoggedIn) {
                        triggerLogin(() => navigate(destination));
                    } else {
                        navigate(destination);
                    }
                }}
            />

            <BoardingPointMap
                isOpen={mapConfig.isOpen}
                onClose={() => setMapConfig(prev => ({ ...prev, isOpen: false }))}
                points={mapConfig.points}
                title={mapConfig.title}
                center={mapConfig.center}
            />
            <ToastContainer />
        </div>
    );
};

export default BusResults;
