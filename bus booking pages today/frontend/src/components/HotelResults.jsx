import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Search, Filter, MapPin, Star, ChevronDown, Check,
    Wifi, Coffee, Car, Wind, ShieldCheck, Heart, Tag
} from 'lucide-react';
import { getApprovedHotels } from '../api/hotelApi';

const HotelResults = ({ setView }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStars, setSelectedStars] = useState([]);
    const [priceRange, setPriceRange] = useState(25000);
    const [sortBy, setSortBy] = useState('Recommended');

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

    const filteredHotels = useMemo(() => {
        let result = [...hotels];

        // Filtering by City is now handled by the backend API.

        if (selectedStars.length > 0) {
            result = result.filter(h => selectedStars.includes(h.starRating));
        }

        // Filter by startingPrice (lowest room price). Skip hotels with no rooms only if user lowered the bound.
        result = result.filter(h => h.startingPrice == null || h.startingPrice <= priceRange);

        // Sort logic
        if (sortBy === 'Price: Low to High') result.sort((a, b) => (a.startingPrice ?? Infinity) - (b.startingPrice ?? Infinity));
        if (sortBy === 'Price: High to Low') result.sort((a, b) => (b.startingPrice ?? -Infinity) - (a.startingPrice ?? -Infinity));
        if (sortBy === 'Rating') result.sort((a, b) => (b.starRating || 0) - (a.starRating || 0));

        return result;
    }, [selectedStars, priceRange, sortBy, hotels]);

    const displayCity = location.state?.city || 'Goa, India';
    const displayDates = location.state?.date ? new Date(location.state.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '21 Feb - 23 Feb';
    const displayGuests = location.state?.guests || 2;

    return (
        <div className="min-h-screen bg-[#f8f9fa] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-[#f8f9fa] to-gray-100 pt-20 pb-20 font-inter selection:bg-[#d84e55]/20 selection:text-[#d84e55]">

            {/* --- Floating Search Header --- */}
            <div className="sticky top-16 z-40 w-full px-4 sm:px-8 pt-6 pb-2 backdrop-blur-md">
                <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="flex flex-wrap items-center gap-6 divide-x divide-gray-200/50 w-full md:w-auto">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-3 rounded-2xl shadow-inner">
                                <Search className="h-5 w-5 text-[#d84e55]" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-gray-900 tracking-tight">{displayCity}</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-2">
                                    <span>{displayDates}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span>{displayGuests} Guests</span>
                                </p>
                            </div>
                        </div>
                        <div className="pl-6 hidden sm:block">
                            <div className="inline-flex flex-col">
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 leading-none">
                                    {filteredHotels.length}
                                </span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Properties Found</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setView('hotel')}
                        className="w-full md:w-auto bg-white text-gray-900 border-2 border-gray-100 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-[#d84e55] hover:text-[#d84e55] hover:bg-red-50/50 transition-all duration-300 shadow-sm"
                    >
                        Modify Search
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 flex flex-col lg:flex-row gap-8">

                {/* --- Elegant Filters Sidebar --- */}
                <aside className="w-full lg:w-[320px] flex-shrink-0">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 sticky top-48">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-black text-xl text-gray-900 tracking-tight flex items-center gap-2">
                                <Filter className="h-5 w-5 text-[#d84e55]" />
                                Filters
                            </h3>
                            <button onClick={() => { setSelectedStars([]); setPriceRange(25000); }} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#d84e55] transition-colors relative group">
                                Clear All
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d84e55] transition-all group-hover:w-full" />
                            </button>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-6 mb-10">
                            <div>
                                <label className="block text-xs font-black text-gray-900 mb-6 flex items-center justify-between">
                                    <span>Price Range</span>
                                    <span className="text-[#d84e55] bg-red-50 px-3 py-1 rounded-full">Up to ₹{priceRange}</span>
                                </label>
                                <div className="relative pt-2">
                                    <input
                                        type="range"
                                        min="1000"
                                        max="25000"
                                        step="500"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#d84e55] hover:accent-red-600 transition-all"
                                    />
                                    <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span>₹1,000</span>
                                        <span>₹25,000+</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="pt-8 border-t border-gray-100/80">
                            <label className="block text-xs font-black text-gray-900 mb-6">Star Category</label>
                            <div className="space-y-3">
                                {[5, 4, 3, 2].map(star => (
                                    <label key={star} className="flex items-center gap-4 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-gray-50/80 transition-colors">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="peer hidden"
                                                checked={selectedStars.includes(star)}
                                                onChange={() => toggleStar(star)}
                                            />
                                            <div className="w-5 h-5 rounded-[6px] border-2 border-gray-200 transition-all peer-checked:bg-[#d84e55] peer-checked:border-[#d84e55] group-hover:border-[#d84e55]/50 flex items-center justify-center shadow-sm">
                                                <Check className={`h-3 w-3 text-white scale-0 transition-transform ${selectedStars.includes(star) ? 'scale-100' : ''}`} strokeWidth={4} />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-1">
                                            {[...Array(star)].map((_, i) => <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400 drop-shadow-sm" />)}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">Stars</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Assured Banner */}
                        <div className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100/50 flex flex-col items-start gap-2 relative overflow-hidden group cursor-pointer">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/50 transition-colors" />
                            <ShieldCheck className="h-6 w-6 text-blue-600 z-10" />
                            <h4 className="font-black text-blue-900 text-sm z-10">GOAIRCLASS Assured</h4>
                            <p className="text-[10px] font-bold text-blue-600/70 z-10 uppercase tracking-widest leading-relaxed">Filter for hand-verified premium properties.</p>
                        </div>
                    </div>
                </aside>

                {/* --- Main Results Area --- */}
                <main className="flex-1 space-y-6">
                    {/* Sophisticated Sorting Tabs */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-2 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white/60 flex gap-2 overflow-x-auto no-scrollbar relative z-10">
                        {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSortBy(tab)}
                                className={`whitespace-nowrap flex-1 py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden
                                    ${sortBy === tab
                                        ? 'text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                {sortBy === tab && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl" />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        ))}
                    </div>

                    {/* Premium Hotel Cards List */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white/60">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#d84e55] rounded-full animate-spin shadow-lg" />
                                <p className="mt-6 text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Curating best properties...</p>
                            </div>
                        ) : filteredHotels.length === 0 ? (
                            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <Search className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No escapes found</h3>
                                <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto leading-relaxed text-center">We couldn't find any properties matching your sophisticated criteria. Try adjusting the filters.</p>
                                <button
                                    onClick={() => { setSelectedStars([]); setPriceRange(10000); }}
                                    className="mt-8 px-8 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#d84e55] transition-colors shadow-lg hover:shadow-red-500/30"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : filteredHotels.map((hotel, index) => {
                            const startingPrice = hotel.startingPrice;
                            const imageUrl = hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop";

                            return (
                                <div key={hotel._id}
                                    onClick={() => navigate(`/hotel/${hotel._id}`, { state: { ...location.state, hotel } })}
                                    className="bg-white rounded-xl p-3 border border-[#006ce4]/30 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col lg:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 fill-mode-both relative cursor-pointer"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Left Section: Images */}
                                    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2">
                                        <div className="w-full h-[200px] rounded-lg overflow-hidden relative bg-gray-100">
                                            <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">Ad</div>
                                            <img src={imageUrl} className="w-full h-full object-cover" alt={hotel.hotelName} loading="lazy" />
                                        </div>
                                        {/* Thumbnails */}
                                        <div className="grid grid-cols-4 gap-2">
                                            {[1, 2, 3].map((num) => (
                                                <div key={num} className="w-full h-[45px] rounded-md overflow-hidden bg-gray-100">
                                                    <img src={hotel.images?.[num] || imageUrl} className="w-full h-full object-cover opacity-80 hover:opacity-100 cursor-pointer transition-opacity" alt={`Thumbnail ${num}`} />
                                                </div>
                                            ))}
                                            <div className="w-full h-[45px] rounded-md overflow-hidden bg-black/80 relative cursor-pointer group/th flex items-center justify-center">
                                                <img src={hotel.images?.[4] || imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover/th:opacity-60 transition-opacity" alt="More" />
                                                <span className="relative z-10 text-white text-[10px] font-bold text-center leading-tight">VIEW<br />ALL</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Section: Info */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex items-center justify-between gap-4 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-[11px] font-medium text-gray-700">
                                                        <span>{hotel.starRating || 4}</span>
                                                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                        <span className="text-gray-400">•</span>
                                                        <span>{hotel.propertyType || 'Hotel'}</span>
                                                    </div>
                                                </div>
                                                {hotel.starRating && (
                                                    <div className="bg-[#1ea124] text-white px-1.5 py-0.5 rounded text-[11px] font-bold">
                                                        {((hotel.starRating) * 0.9 + 0.5).toFixed(1)}/5
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-[18px] font-bold text-[#1a1a1a] tracking-tight leading-tight mb-1">
                                                {hotel.hotelName} {hotel.address && `@ ${hotel.address.split(',')[0]}`}
                                            </h3>
                                            <p className="text-[12px] font-medium text-[#006ce4] hover:underline cursor-pointer mb-3">{hotel.address ? hotel.address.split(',').slice(-2).join(',') : hotel.city}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {(hotel.amenities || []).slice(0, 3).map((amenity, idx) => (
                                                    <span key={idx} className="border border-gray-200 text-gray-600 text-[11px] px-2 py-1 rounded-md">
                                                        {amenity}
                                                    </span>
                                                ))}
                                                <span className="border border-gray-200 text-gray-600 text-[11px] px-2 py-1 rounded-md bg-gray-50/50">+{(hotel.amenities?.length || 0) > 3 ? (hotel.amenities.length - 3) : 2} more</span>
                                            </div>

                                            <div className="space-y-1">
                                                {hotel.coupleFriendly && (
                                                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#f26a36]">
                                                        <Heart className="h-3 w-3 fill-current" />
                                                        Couple Friendly
                                                    </div>
                                                )}
                                                {hotel.freeCancellation && (
                                                    <div className="flex items-center gap-2 text-[12px] text-[#2d2d2d]">
                                                        <Check className="h-3.5 w-3.5 text-[#1ea124]" strokeWidth={3} />
                                                        Free Cancellation
                                                    </div>
                                                )}
                                                {hotel.bookAtZero && (
                                                    <div className="flex items-center gap-2 text-[12px] text-[#2d2d2d]">
                                                        <Check className="h-3.5 w-3.5 text-[#1ea124]" strokeWidth={3} />
                                                        Book @ ₹0 available
                                                    </div>
                                                )}
                                                {hotel.breakfastAvailable && (
                                                    <div className="flex items-center gap-2 text-[12px] text-[#2d2d2d]">
                                                        <Check className="h-3.5 w-3.5 text-[#1ea124]" strokeWidth={3} />
                                                        Breakfast available at extra charges
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section: Pricing */}
                                    <div className="w-full lg:w-[220px] lg:border-l border-gray-200 flex flex-col justify-end pt-2 lg:pt-0 px-1">
                                        <div className="flex-1 flex flex-col justify-start">
                                            {hotel.coupon && (
                                                <div className="mb-3 flex justify-end animate-in fade-in slide-in-from-right-4 duration-500">
                                                    <div className="relative group/coupon">
                                                        <div className="bg-[#fff9f0] border border-dashed border-[#ff9500]/40 px-3 py-2 rounded-lg flex items-center gap-2.5 shadow-sm hover:border-[#ff9500]/60 transition-all relative overflow-hidden">
                                                            {/* Compact Notch Effects */}
                                                            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-[#ff9500]/20 rounded-full"></div>
                                                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-[#ff9500]/20 rounded-full"></div>
                                                            
                                                            <div className="bg-[#ff9500] p-1.5 rounded-md flex items-center justify-center shadow-md transform -rotate-12 group-hover:rotate-0 transition-transform">
                                                                <Tag className="h-3.5 w-3.5 text-white" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[15px] font-black text-[#d97706] italic leading-none">
                                                                        {hotel.coupon.discountType === 'flat' ? `₹${hotel.coupon.discountValue}` : `${hotel.coupon.discountValue}%`} OFF
                                                                    </span>
                                                                    <span className="bg-[#ff9500]/10 text-[#d97706] text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter border border-[#ff9500]/20">
                                                                        {hotel.coupon.couponCode}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[8px] font-bold text-[#b45309] uppercase tracking-widest mt-1 opacity-70">
                                                                    LIMITED TIME DEAL
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {hotel.bankOffer && (
                                                <div className="py-2 px-3 border border-dashed border-gray-200 rounded-md mb-4 bg-gray-50/50">
                                                    <p className="text-[10px] font-medium text-gray-500 text-right leading-tight italic">
                                                        {hotel.bankOffer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end">
                                            {startingPrice != null ? (
                                                <>
                                                    <div className="text-[11px] font-medium text-gray-500 mb-0.5">Starting from</div>
                                                    <div className="text-[24px] font-black text-[#1a1a1a] tracking-tight leading-none">₹{startingPrice.toLocaleString('en-IN')}</div>
                                                    <div className="text-[11px] text-[#777] text-right mt-1">
                                                        +₹{Math.round(startingPrice * 0.18).toLocaleString('en-IN')} taxes & fees<br />per night
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-[14px] font-bold text-gray-500">Price not available</div>
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
