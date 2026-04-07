import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Search, Filter, MapPin, Star, ChevronDown, Check,
    Wifi, Coffee, Car, Wind, ShieldCheck, Heart, Tag,
    RotateCcw, Users
} from 'lucide-react';
import { getApprovedHotels } from '../api/hotelApi';

const HotelResults = ({ setView }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStars, setSelectedStars] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [sortBy, setSortBy] = useState('Recommended');

    const priceRanges = [
        { label: '₹0 to ₹1000', min: 0, max: 1000 },
        { label: '₹1000 to ₹1500', min: 1000, max: 1500 },
        { label: '₹1500 to ₹2000', min: 1500, max: 2000 },
        { label: '₹2000 to ₹2500', min: 2000, max: 2500 },
        { label: '₹2500 to ₹3000', min: 2500, max: 3000 },
        { label: '₹3000 to ₹6500', min: 3000, max: 6500 },
        { label: '₹6500 to ₹9500', min: 6500, max: 9500 },
        { label: '₹9500 to ₹12500', min: 9500, max: 12500 },
        { label: '₹12500 to ₹15000', min: 12500, max: 15000 },
        { label: '₹15000 to ₹30000', min: 15000, max: 30000 }
    ];

    const searchCity = location.state?.city || '';

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                const data = await getApprovedHotels(searchCity);
                if (data?.hotels) {
                    setHotels(data.hotels);
                }
            } catch (err) {
                console.error("Error fetching hotels", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, [searchCity]);

    const toggleStar = (star) => {
        if (selectedStars.includes(star)) {
            setSelectedStars(selectedStars.filter(s => s !== star));
        } else {
            setSelectedStars([...selectedStars, star]);
        }
    };

    const togglePriceRange = (range) => {
        if (selectedPriceRanges.some(r => r.label === range.label)) {
            setSelectedPriceRanges(selectedPriceRanges.filter(r => r.label !== range.label));
        } else {
            setSelectedPriceRanges([...selectedPriceRanges, range]);
        }
    };

    const getCountForRange = (min, max) => {
        return hotels.filter(h => (h.startingPrice || 0) >= min && (h.startingPrice || 0) <= max).length;
    };

    const filteredHotels = useMemo(() => {
        let result = [...hotels];

        // Filtering by City is now handled by the backend API.

        if (selectedStars.length > 0) {
            result = result.filter(h => selectedStars.includes(h.starRating));
        }

        if (selectedPriceRanges.length > 0) {
            result = result.filter(h => {
                const price = h.startingPrice || 0;
                return selectedPriceRanges.some(range => price >= range.min && price <= range.max);
            });
        }

        // Sort logic
        if (sortBy === 'Price: Low to High') result.sort((a, b) => (a.startingPrice ?? Infinity) - (b.startingPrice ?? Infinity));
        if (sortBy === 'Price: High to Low') result.sort((a, b) => (b.startingPrice ?? -Infinity) - (a.startingPrice ?? -Infinity));
        if (sortBy === 'Rating') result.sort((a, b) => (b.starRating || 0) - (a.starRating || 0));

        return result;
    }, [selectedStars, selectedPriceRanges, sortBy, hotels]);
    const { city, checkIn, checkOut, guests } = location.state || {};

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const displayCity = city || 'Goa, India';
    const displayDates = (checkIn && checkOut) 
        ? `${formatDate(checkIn)} - ${formatDate(checkOut)}` 
        : '21 Feb - 23 Feb';
    const displayGuests = guests || 2;

    return (
        <div className="min-h-screen bg-[#F4F2EE] pt-[110px] pb-20 font-['DM_Sans',sans-serif] selection:bg-[#c0392b]/20 selection:text-[#c0392b]">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                `}
            </style>

            {/* --- Sticky Dark Search Header --- */}
            <div className="sticky top-[92px] z-40 w-full mb-8 px-4">
                <div className="max-w-7xl mx-auto bg-[#1C1C1E] border border-white/5 shadow-2xl rounded-2xl px-6 py-3 flex items-center justify-between transition-all">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="bg-white/10 p-2 rounded-full shrink-0">
                                <Search className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex items-center gap-4 sm:gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-0.5">Location</span>
                                    <h1 className="text-sm font-bold text-white tracking-tight uppercase leading-none">{displayCity}</h1>
                                </div>
                                <span className="text-white/20 font-light text-xl">|</span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-0.5">Dates</span>
                                    <span className="text-[13px] font-medium text-white leading-none">{displayDates}</span>
                                </div>
                                <span className="text-white/20 font-light text-xl">|</span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-0.5">Guests</span>
                                    <div className="flex items-center gap-1.5 leading-none">
                                        <span className="text-[13px] font-medium text-white">{displayGuests} Guests</span>
                                        <Users className="h-3 w-3 text-white/40" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setView('hotel')}
                            className="bg-[#E8C547] hover:bg-[#d4b33d] text-black px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 shrink-0"
                        >
                            Modify Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col lg:flex-row gap-8">
                {/* --- Sidebar Filters --- */}
                <aside className="w-full lg:w-[280px] flex-shrink-0">
                    <div className="bg-white rounded-[16px] p-6 shadow-[0_1px_6px_rgba(0,0,0,0.07)] border border-[#eee] sticky top-32">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#f0f0f0]">
                            <h3 className="font-bold text-sm text-gray-900 tracking-wide flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-400" />
                                FILTERS
                            </h3>
                            <button onClick={() => { setSelectedStars([]); setSelectedPriceRanges([]); }} 
                                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#c0392b] transition-colors">
                                Reset
                            </button>
                        </div>

                        {/* Price Range */}
                        <div className="mb-8">
                            <span className="block text-[11px] font-bold text-[#888] uppercase tracking-[0.07em] mb-4">Price per night</span>
                            <div className="space-y-3">
                                {priceRanges.map((range, index) => (
                                    <label key={index} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-[#c0392b] focus:ring-[#c0392b] cursor-pointer accent-[#c0392b]"
                                                checked={selectedPriceRanges.some(r => r.label === range.label)}
                                                onChange={() => togglePriceRange(range)}
                                            />
                                            <span className="text-[12px] font-medium text-gray-600 group-hover:text-gray-900 leading-none">
                                                {range.label}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-medium text-[#aaa]">
                                            {getCountForRange(range.min, range.max)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="pt-6 border-t border-[#f0f0f0]">
                            <span className="block text-[11px] font-bold text-[#888] uppercase tracking-[0.07em] mb-4">Star rating</span>
                            <div className="space-y-1">
                                {[5, 4, 3, 2].map(star => (
                                    <label key={star} className="flex items-center justify-between cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-gray-50/80 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-[#c0392b] focus:ring-[#c0392b] cursor-pointer accent-[#c0392b]"
                                                checked={selectedStars.includes(star)}
                                                onChange={() => toggleStar(star)}
                                            />
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 ${i < star ? 'fill-[#F5A623] text-[#F5A623]' : 'fill-[#ddd] text-[#ddd]'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 capitalize">{star} Stars</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Assured Banner */}
                        <div className="mt-8 bg-[#EEF3FD] p-4 rounded-xl border border-[#C5D5F5] flex flex-col gap-2 relative overflow-hidden group hover:shadow-sm transition-all">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                            <span className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">VERIFIED</span>
                            <h4 className="font-bold text-blue-900 text-xs">GOAIRCLASS Assured</h4>
                            <p className="text-[10px] font-medium text-blue-600/70 leading-relaxed uppercase tracking-tighter">Premium hand-verified properties.</p>
                        </div>
                    </div>
                </aside>

                {/* --- Main Results Area --- */}
                <main className="flex-1 space-y-6">
                    {/* Compact Sorting Tabs */}
                    <div className="bg-white rounded-[12px] p-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] border border-[#eee] flex items-center">
                        <span className="text-[10px] font-bold text-[#aaa] uppercase px-4 border-r border-[#eee]">Sort By</span>
                        <div className="flex gap-1 pl-1 flex-1">
                            {[
                                { id: 'Recommended', label: 'Recommended' },
                                { id: 'Price: Low to High', label: 'Price ↑' },
                                { id: 'Price: High to Low', label: 'Price ↓' },
                                { id: 'Rating', label: 'Rating' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSortBy(tab.id)}
                                    className={`py-2 px-6 rounded-[8px] text-[10px] font-bold uppercase tracking-[0.06em] transition-all duration-200
                                        ${sortBy === tab.id
                                            ? 'bg-[#1C1C1E] text-white shadow-md'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hotel Cards List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[16px] border border-[#eee] shadow-sm">
                                <div className="w-10 h-10 border-4 border-gray-100 border-t-[#c0392b] rounded-full animate-spin" />
                                <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Searching بهترین properties...</p>
                            </div>
                        ) : filteredHotels.length === 0 ? (
                            <div className="bg-white rounded-[16px] p-16 text-center border border-[#eee] shadow-sm flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Search className="h-8 w-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No properties found</h3>
                                <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto mb-8">Try adjusting your filters to find your perfect stay.</p>
                                <button
                                    onClick={() => { setSelectedStars([]); setSelectedPriceRanges([]); }}
                                    className="px-6 py-2.5 bg-[#1C1C1E] text-white font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : filteredHotels.map((hotel) => {
                            const startingPrice = hotel.startingPrice;
                            const imageUrl = hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop";

                            return (
                                <div key={hotel._id}
                                    onClick={() => navigate(`/hotel/${hotel._id}`, { state: { ...location.state, hotel } })}
                                    className="bg-white rounded-[16px] border border-[#eee] shadow-[0_1px_6px_rgba(0,0,0,0.07)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 group flex flex-col md:flex-row overflow-hidden cursor-pointer"
                                >
                                    {/* Left Section: Image (260px) */}
                                    <div className="w-full md:w-[260px] shrink-0 border-r border-[#f8f8f8]">
                                        <div className="w-full h-[220px] relative overflow-hidden bg-gray-100">
                                            <div className="absolute top-2 left-2 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">Ad</div>
                                            {hotel.coupleFriendly && (
                                                <div className="absolute bottom-2 left-2 bg-[#FF6B6B] text-white text-[9px] font-bold pr-2 pl-1 py-1 rounded-full shadow-sm z-10 flex items-center gap-1 uppercase tracking-tighter">
                                                    <Heart className="h-2.5 w-2.5 fill-current" /> Couple Friendly
                                                </div>
                                            )}
                                            <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={hotel.hotelName} />
                                        </div>
                                        {/* Thumbnails */}
                                        <div className="grid grid-cols-4 gap-[1px] pt-[1px] bg-[#f8f8f8]">
                                            {[1, 2, 3].map((num) => (
                                                <div key={num} className="h-16 bg-white overflow-hidden">
                                                    <img src={hotel.images?.[num] || imageUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="" />
                                                </div>
                                            ))}
                                            <div className="h-16 bg-[#1C1C1E] flex items-center justify-center">
                                                <span className="text-white text-[8px] font-black text-center leading-tight">VIEW<br />ALL</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Section: Info (Flex) */}
                                    <div className="flex-1 flex flex-col p-6 gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-2.5 w-2.5 ${i < (hotel.starRating || 4) ? 'fill-[#F5A623] text-[#F5A623]' : 'fill-[#ddd] text-[#ddd]'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider">• {hotel.propertyType || 'Hotel'}</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight font-serif">
                                            {hotel.hotelName}
                                        </h3>
                                        <p className="text-[12px] font-bold text-[#2962FF] hover:underline mb-4 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {hotel.address || hotel.city}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {(hotel.amenities || []).slice(0, 3).map((amenity, idx) => (
                                                <span key={idx} className="border border-[#E0E0E0] bg-[#fafafa] text-[#666] text-[10px] px-2 py-0.5 rounded-[6px] font-bold uppercase transition-colors">
                                                    {amenity}
                                                </span>
                                            ))}
                                            <span className="text-[9px] font-bold text-[#aaa] self-center">+{(hotel.amenities?.length || 0) > 3 ? (hotel.amenities.length - 3) : 2} MORE</span>
                                        </div>

                                        <div className="space-y-1.5 mt-auto">
                                            {hotel.freeCancellation && (
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1B6C3B]">
                                                    <span className="text-xs">✓</span> Free Cancellation
                                                </div>
                                            )}
                                            {hotel.bookAtZero && (
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1B6C3B]">
                                                    <span className="text-xs">✓</span> Book @ ₹0 available
                                                </div>
                                            )}
                                            {hotel.breakfastAvailable && (
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1B6C3B]">
                                                    <span className="text-xs">✓</span> Breakfast available
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Section: Pricing (180px) */}
                                    <div className="w-full md:w-[180px] border-l border-[#F0F0F0] px-5 py-6 flex flex-col items-end justify-between bg-[#FCFCFC]">
                                        <div className="w-full flex flex-col items-end">
                                            {hotel.starRating && (
                                                <div className={`${hotel.starRating >= 4 ? 'bg-[#1B6C3B]' : 'bg-[#B85E0B]'} text-white px-2 py-1 rounded-[6px] text-xs font-bold mb-4 shadow-sm`}>
                                                    {((hotel.starRating) * 0.9 + 0.5).toFixed(1)}/5
                                                </div>
                                            )}
                                            
                                            {hotel.coupon && (
                                                <div className="w-full mb-4 bg-[#FFF8EE] border border-dashed border-[#F5A623] p-2 rounded-[8px] flex flex-col items-center">
                                                    <span className="text-[14px] font-black text-[#E8851A] italic leading-none mb-1">
                                                        {hotel.coupon.discountType === 'flat' ? `₹${hotel.coupon.discountValue}` : `${hotel.coupon.discountValue}%`} OFF
                                                    </span>
                                                    <span className="bg-[#FDEBC0] text-[#E8851A] text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
                                                        {hotel.coupon.couponCode}
                                                    </span>
                                                    <span className="text-[8px] font-bold text-[#C0820E] uppercase tracking-widest mt-1">
                                                        LIMITED TIME DEAL
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-right">
                                            {startingPrice != null ? (
                                                <>
                                                    <div className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider mb-1">Starting from</div>
                                                    <div className="text-[26px] font-black text-[#1a1a1a] tracking-tighter leading-none mb-1">
                                                        ₹{(hotel.pricing?.totalFare || startingPrice).toLocaleString('en-IN')}
                                                    </div>
                                                    <div className="text-[10px] text-[#999] leading-tight font-medium">
                                                        +₹{(hotel.pricing?.gst || Math.round(startingPrice * 0.18)).toLocaleString('en-IN')} taxes & fees<br />per night
                                                    </div>
                                                    {hotel.freeCancellation && (
                                                        <div className="text-[10px] font-bold text-[#1B6C3B] uppercase mt-2">Free Cancellation</div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-[12px] font-bold text-[#aaa] uppercase italic">Sold Out</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HotelResults;
