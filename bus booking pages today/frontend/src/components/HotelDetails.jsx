import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star, MapPin, Check, Wifi, Coffee, Car, Wind, BellRing, Phone, Shield,
    ChevronLeft, Image as ImageIcon, Heart, Share2, Grid, ChevronRight, CheckCircle2
} from 'lucide-react';
import { getHotelById, getRoomsByHotel, getRoomAvailability } from '../api/hotelApi';

const HotelDetails = ({ setView }) => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                setLoading(true);
                const hotelData = await getHotelById(hotelId);
                const currentHotel = hotelData.hotel || hotelData;
                setHotel(currentHotel);

                let currentRooms = [];
                if (hotelData.rooms) {
                    currentRooms = hotelData.rooms;
                } else {
                    try {
                        const roomsData = await getRoomsByHotel(hotelId);
                        currentRooms = roomsData.rooms || roomsData || [];
                    } catch (e) {
                        console.log('Error fetching rooms', e);
                    }
                }
                setRooms(currentRooms);

                // Fetch dynamic availability for each room
                if (currentRooms.length > 0) {
                    const availPromises = currentRooms.map(r => getRoomAvailability(r._id));
                    const availResults = await Promise.all(availPromises);
                    const availMap = {};
                    availResults.forEach(res => {
                        if (res.success) {
                            availMap[res.roomId] = res.availableRooms;
                        }
                    });
                    setAvailability(availMap);
                }
            } catch (err) {
                console.error("Error fetching hotel details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        
        // Refresh availability every 30 seconds for "real-time" feel
        const interval = setInterval(async () => {
            if (rooms.length > 0) {
                const availMap = { ...availability };
                for (const r of rooms) {
                    try {
                        const res = await getRoomAvailability(r._id);
                        if (res.success) availMap[res.roomId] = res.availableRooms;
                    } catch (e) { }
                }
                setAvailability(availMap);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [hotelId, rooms.length]);

    // Load Google Maps Script
    useEffect(() => {
        const apiKey = "AIzaSyBUfh9lqcFGgqNMC7FCyfvaEL8h9USr8vk";
        const scriptId = "google-maps-script";

        const existingScript = document.getElementById(scriptId);

        if (!existingScript) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`;
            script.async = true;
            script.defer = true;
            script.onload = () => setMapLoaded(true);
            document.head.appendChild(script);
        } else {
            // Script tag exists — check if Google Maps API is already ready
            if (window.google?.maps?.Map) {
                setMapLoaded(true);
            } else {
                // Script is still loading — attach to its onload
                existingScript.addEventListener('load', () => setMapLoaded(true));
            }
        }
    }, []);

    // Initialize Map
    useEffect(() => {
        if (mapLoaded && hotel && hotel.latitude && hotel.longitude) {
            const mapContainer = document.getElementById('hotel-map');
            if (mapContainer) {
                const position = { lat: parseFloat(hotel.latitude), lng: parseFloat(hotel.longitude) };
                
                // Initialize the map
                const map = new window.google.maps.Map(mapContainer, {
                    center: position,
                    zoom: 15,
                    mapId: 'DEMO_MAP_ID', // AdvancedMarkerElement requires a MapID
                    disableDefaultUI: false,
                    scrollwheel: true,
                });

                // Use the new AdvancedMarkerElement
                if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                    new window.google.maps.marker.AdvancedMarkerElement({
                        map: map,
                        position: position,
                        title: hotel.hotelName,
                    });
                } else {
                    // Fallback to legacy marker if AdvancedMarker is not yet available
                    new window.google.maps.Marker({
                        position: position,
                        map: map,
                        title: hotel.hotelName,
                    });
                }
            }
        }
    }, [mapLoaded, hotel]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#d84e55] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20 flex justify-center items-center flex-col">
                <h2 className="text-2xl font-bold text-gray-800">Hotel not found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
            </div>
        );
    }

    const images = hotel.images && hotel.images.length > 0
        ? hotel.images
        : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"];

    // Dummy random logic needs to be replaced later if reviews API is added
    const reviewsCount = hotel.reviewsCount || null;
    const ratingValue = hotel.starRating ? ((hotel.starRating) * 0.9 + 0.5).toFixed(1) : null;


    const scrollToRooms = () => {
        const roomsSection = document.getElementById('rooms-list-section');
        if (roomsSection) {
            roomsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-20 pb-20 font-inter">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <button onClick={() => navigate(-1)} className="text-[#006ce4] hover:underline font-medium flex items-center gap-1">
                            <ChevronLeft className="h-4 w-4" /> Back to Search
                        </button>
                        <span>•</span>
                        <span>{hotel.city || 'India'}</span>
                        <span>•</span>
                        <span className="text-gray-900 font-medium truncate max-w-[200px]">{hotel.hotelName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Share2 className="h-5 w-5 text-gray-600" /></button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Heart className="h-5 w-5 text-gray-600" /></button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">

                {/* 1. HOTEL HEADER SECTION */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold">
                                <span>{hotel.starRating || 4}</span>
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                <span>Hotel</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-2 py-0.5 border border-gray-200 rounded">Premium</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">{hotel.hotelName}</h1>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600 font-medium">
                            <MapPin className="h-4 w-4 text-[#d84e55]" />
                            <span>{hotel.address || `${hotel.city}, India`}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[#006ce4] hover:underline cursor-pointer font-bold">1.5 km from Metro Station</span>
                            <span className="text-gray-300">•</span>
                            <button className="text-[#006ce4] hover:underline font-bold">View Map</button>
                        </div>
                    </div>
                    {reviewsCount && ratingValue && (
                        <div className="flex flex-col items-end shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-lg font-black text-gray-900">Exceptional</div>
                                    <div className="text-xs font-medium text-gray-500">{reviewsCount} verified reviews</div>
                                </div>
                                <div className="bg-[#008234] text-white h-12 w-12 rounded-xl flex items-center justify-center text-xl font-black shadow-lg">
                                    {ratingValue}
                                </div>
                            </div>
                            <button onClick={() => { }} className="text-sm font-bold text-[#006ce4] hover:underline mt-2">View Reviews</button>
                        </div>
                    )}
                </div>

                {/* 2. HOTEL IMAGE GALLERY */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] mb-8 rounded-2xl overflow-hidden shadow-sm">
                    <div className="md:col-span-3 relative group cursor-pointer h-full" onClick={() => setShowGallery(true)}>
                        <img src={images[0]} alt={hotel.hotelName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="hidden md:flex flex-col gap-2 h-full">
                        {images.slice(1, 3).map((img, idx) => (
                            <div key={idx} className="flex-1 relative group cursor-pointer overflow-hidden" onClick={() => setShowGallery(true)}>
                                <img src={img} alt={`${hotel.hotelName} ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                        ))}
                        <div className="flex-1 relative group cursor-pointer overflow-hidden" onClick={() => setShowGallery(true)}>
                            <img src={images[3] || images[0]} alt="Gallery Map" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/50">
                                <Grid className="h-8 w-8 mb-2" />
                                <span className="font-bold text-sm tracking-wider">PROPERTY PHOTOS</span>
                                <span className="text-xs bg-white/20 px-3 py-1 rounded-full mt-2 font-semibold backdrop-blur-sm">{images.length}+</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column (Details) */}
                    <div className="flex-1 space-y-8">

                        {/* 3. HOTEL QUICK TAGS - Only show if any flags are set */}
                        {(hotel.coupleFriendly || hotel.freeCancellation || hotel.bookAtZero || hotel.breakfastAvailable) && (
                            <div className="flex flex-wrap gap-3">
                                {hotel.coupleFriendly && (
                                    <div className="flex items-center gap-2 bg-[#fef5f3] text-[#d84e55] px-4 py-2 rounded-xl text-sm font-bold border border-red-100">
                                        <Heart className="h-4 w-4 fill-current" /> Couple Friendly
                                    </div>
                                )}
                                {hotel.freeCancellation && (
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold border border-green-100">
                                        <CheckCircle2 className="h-4 w-4" /> Free Cancellation
                                    </div>
                                )}
                                {hotel.bookAtZero && (
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
                                        <Shield className="h-4 w-4" /> Book @ ₹0 available
                                    </div>
                                )}
                                {hotel.breakfastAvailable && (
                                    <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold border border-amber-100">
                                        <Coffee className="h-4 w-4" /> Breakfast available
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. AMENITIES SECTION */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-black text-gray-900 mb-6">Top Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                    {hotel.amenities.slice(0, 7).map((amenity, idx) => {
                                        let Icon = Check;
                                        const lower = amenity.toLowerCase();
                                        if (lower.includes('wifi')) Icon = Wifi;
                                        else if (lower.includes('restaurant') || lower.includes('food')) Icon = Coffee;
                                        else if (lower.includes('ac') || lower.includes('air conditioning')) Icon = Wind;
                                        else if (lower.includes('park')) Icon = Car;
                                        else if (lower.includes('room service')) Icon = BellRing;
                                        else if (lower.includes('front desk') || lower.includes('reception')) Icon = Phone;
                                        else if (lower.includes('secur')) Icon = Shield;

                                        return (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">{amenity}</span>
                                            </div>
                                        );
                                    })}
                                    {hotel.amenities.length > 7 && (
                                        <div className="flex items-center gap-3 cursor-pointer text-[#006ce4] hover:text-blue-800">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#006ce4]">
                                                <Check className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-semibold">+{hotel.amenities.length - 7} More</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 7. HOTEL DESCRIPTION SECTION */}

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 mb-4">About the Hotel</h2>
                            <div className="text-sm text-gray-600 leading-relaxed font-medium">
                                <p className="mb-4">{hotel.description || "Experience top-notch hospitality at this premium property. Located in the heart of the city, this hotel offers easy access to major tourist attractions and business hubs. With elegantly designed rooms equipped with modern amenities, your stay is guaranteed to be comfortable and memorable."}</p>
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <h3 className="text-lg font-bold text-gray-900 mb-4">Property Rules</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="block text-gray-500 font-bold mb-1 uppercase tracking-wider text-xs">Check-in</span>
                                    <span className="text-lg font-black text-gray-900">12:00 PM</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="block text-gray-500 font-bold mb-1 uppercase tracking-wider text-xs">Check-out</span>
                                    <span className="text-lg font-black text-gray-900">11:00 AM</span>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-2 text-sm text-gray-600 font-medium list-disc pl-5">
                                <li>Couples are welcome.</li>
                                <li>Guests can check in using any local or outstation ID proof (PAN card not accepted).</li>
                                <li>No smoking inside the rooms.</li>
                            </ul>
                        </div>

                    </div>

                    {/* Right Column (Sticky Preview Card) */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <div className="sticky top-32">
                            {/* 5. ROOM PREVIEW CARD */}
                            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-white">
                                    <h3 className="text-lg font-black">Book Your Stay</h3>
                                    <p className="text-xs font-medium text-gray-300">Select rooms below to customize</p>
                                </div>

                                <div className="p-6">
                                    <h4 className="font-bold text-gray-900 text-lg mb-2">{rooms?.[0]?.roomType || 'Standard Room'}</h4>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-4 font-medium">
                                        {rooms?.[0]?.capacity && <span>Max: {rooms[0].capacity} Guests</span>}
                                        {rooms?.[0]?.capacity && <span className="text-gray-300">•</span>}
                                        <span>{rooms?.[0]?.bedType || 'King Bed'}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{rooms?.[0]?.size || '200 sq.ft'}</span>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        {hotel.freeCancellation && (
                                            <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                                                <CheckCircle2 className="h-4 w-4" /> Free Cancellation
                                            </div>
                                        )}
                                        {hotel.breakfastAvailable && (
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                <Coffee className="h-4 w-4 text-gray-400" /> Breakfast included
                                            </div>
                                        )}
                                    </div>

                                    {rooms && rooms.length > 0 && (
                                        <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    {rooms[0].originalPrice && rooms[0].originalPrice > rooms[0].price && (
                                                        <div className="text-sm text-gray-500 line-through font-medium">₹{rooms[0].originalPrice.toLocaleString()}</div>
                                                    )}
                                                    <div className="text-2xl font-black text-gray-900">₹{rooms[0].price.toLocaleString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    {rooms[0].originalPrice && rooms[0].originalPrice > rooms[0].price && (
                                                        <div className="text-xs font-bold text-white bg-[#008234] px-2 py-1 rounded">
                                                            {Math.round((1 - (rooms[0].price / rooms[0].originalPrice)) * 100)}% OFF
                                                        </div>
                                                    )}
                                                    {rooms[0].taxes && <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">+₹{rooms[0].taxes} taxes & fees</div>}
                                                    {!rooms[0].taxes && <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Taxes & Fees Included</div>}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={scrollToRooms}
                                        className="w-full bg-[#d84e55] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                                    >
                                        View Room Options
                                    </button>
                                </div>
                            </div>

                            {/* Location Mini-Map below Book card */}
                            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                <div className="h-48 bg-gray-100 relative group">
                                    <div id="hotel-map" className="w-full h-full"></div>
                                    {(!hotel.latitude || !hotel.longitude) && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 text-xs font-medium px-6 text-center">
                                            Map coordinates not available for this property
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">Location Details</h4>
                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                        {hotel.address}<br />
                                        {hotel.city}, India
                                    </p>
                                    <button 
                                        onClick={() => {
                                            const url = hotel.latitude && hotel.longitude 
                                                ? `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`
                                                : `https://www.google.com/maps/search/${encodeURIComponent(hotel.hotelName + ' ' + hotel.city)}`;
                                            window.open(url, '_blank');
                                        }}
                                        className="w-full mt-4 py-2 px-4 rounded-lg border border-[#006ce4] text-[#006ce4] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MapPin className="h-3 w-3" /> Explore Area
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* 6. ROOM LIST SECTION */}
                <div id="rooms-list-section" className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">Available Rooms</h2>

                    <div className="space-y-6">
                        {(rooms && rooms.length > 0 ? rooms : []).map((room, idx) => {
                            const roomName = room.roomType;
                            const currentPrice = room.discountPrice || room.price;
                            const originalPrice = room.originalPrice;
                            const taxes = room.taxes || Math.round(currentPrice * 0.18);
                            const roomImg = room.images?.[0] || images[1] || images[0];
                            const viewType = room.view || 'City View';
                            const bedType = room.bedType || 'King Bed';
                            const size = room.size || (room.capacity ? `${room.capacity * 100} sq.ft` : null);
                            const roomAmenities = room.amenities || [];
                            
                            // Use dynamic availability if fetched, otherwise fallback to room.availableRooms
                            const availableRooms = availability[room._id] !== undefined 
                                ? availability[room._id] 
                                : (room.availableRooms ?? room.totalRooms);
                            
                            const isSoldOut = availableRooms <= 0;


                            return (
                                <div key={room._id || idx} className={`border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row transition-all ${isSoldOut ? 'opacity-75 grayscale-[0.5]' : 'hover:border-gray-300'}`}>
                                    <div className="w-full md:w-[300px] h-48 md:h-auto relative">
                                        <img src={roomImg} className="w-full h-full object-cover" alt={roomName} />
                                        {isSoldOut && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-white font-black text-2xl uppercase tracking-widest border-2 border-white px-4 py-2">Sold Out</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 p-5 flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{roomName}</h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4 font-medium">
                                                {size && (
                                                    <span className="flex items-center gap-1"><Grid className="h-4 w-4" /> {size}</span>
                                                )}
                                                {size && <span className="text-gray-300">•</span>}
                                                <span className="flex items-center gap-1"><Wind className="h-4 w-4" /> {viewType}</span>
                                                <span className="text-gray-300">•</span>
                                                <span className="flex items-center gap-1"><Coffee className="h-4 w-4" /> {bedType}</span>
                                            </div>

                                            {roomAmenities.length > 0 && (
                                                <div className="grid grid-cols-2 gap-y-2 text-sm font-medium text-gray-700 mb-4">
                                                    {roomAmenities.slice(0, 4).map((am, i) => (
                                                        <div key={i} className="flex items-center gap-2"><Check className="h-3 w-3 text-green-500" strokeWidth={3} /> {am}</div>
                                                    ))}
                                                </div>
                                            )}

                                            {availableRooms > 0 && (
                                                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 ${availableRooms <= 5 ? 'text-red-600 bg-red-50 animate-pulse' : 'text-gray-600 bg-gray-50'}`}>
                                                    Only {availableRooms} rooms left!
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-full md:w-[220px] flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                            <div className="space-y-1 text-right">
                                                {originalPrice && originalPrice > currentPrice && (
                                                    <div className="text-sm font-medium text-gray-500 line-through">₹{originalPrice.toLocaleString()}</div>
                                                )}
                                                <div className="text-2xl font-black text-gray-900">₹{currentPrice.toLocaleString()}</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">+₹{taxes.toLocaleString()} taxes & fees</div>
                                                <div className="text-xs font-medium text-gray-500 mt-1">Per Night</div>
                                            </div>

                                            <button
                                                disabled={isSoldOut}
                                                onClick={() => {
                                                    navigate(`/hotel-booking/${hotelId}`, {
                                                        state: {
                                                            hotel,
                                                            room,
                                                            hotelId,
                                                            checkIn: new Date().toISOString().split('T')[0],
                                                            checkOut: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })(),
                                                            guests: 1,
                                                        }
                                                    });
                                                }}
                                                className={`mt-6 w-full py-3 rounded-lg font-black text-sm uppercase tracking-widest transition-colors shadow-md ${isSoldOut
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                                                        : 'bg-[#006ce4] hover:bg-blue-700 text-white shadow-blue-500/20'
                                                    }`}
                                            >
                                                {isSoldOut ? 'Sold Out' : 'Select Room'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


                {/* 9. REVIEWS SECTION */}
                {
                    reviewsCount && ratingValue && (
                        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h2 className="text-2xl font-black text-gray-900 mb-8">Guest Reviews</h2>

                            <div className="flex flex-col md:flex-row gap-8 mb-10">
                                <div className="flex flex-col items-center justify-center p-8 bg-[#008234]/5 rounded-2xl border border-[#008234]/10 shrink-0">
                                    <div className="text-5xl font-black text-[#008234]">{ratingValue}</div>
                                    <div className="text-sm font-bold text-gray-900 mt-2">Exceptional</div>
                                    <div className="text-xs font-medium text-gray-500 mt-1">Based on {reviewsCount} reviews</div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                    {[
                                        { name: "Cleanliness", score: "4.8" },
                                        { name: "Comfort", score: "4.7" },
                                        { name: "Location", score: "4.9" },
                                        { name: "Facilities", score: "4.5" },
                                        { name: "Staff", score: "4.6" },
                                        { name: "Value for money", score: "4.4" }
                                    ].map((cat, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm font-medium mb-1.5">
                                                <span className="text-gray-700">{cat.name}</span>
                                                <span className="text-gray-900 font-bold">{cat.score}</span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#008234] rounded-full" style={{ width: `${(parseFloat(cat.score) / 5) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

            </div >

            {/* Gallery Modal */}
            {
                showGallery && (
                    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-xl">
                        <button onClick={() => setShowGallery(false)} className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 z-50">
                            <span className="text-lg font-bold tracking-widest uppercase">Close ✕</span>
                        </button>
                        <div className="w-full max-w-5xl px-4 flex flex-col items-center">
                            <img src={images[0]} alt="Gallery Max" className="w-full max-h-[70vh] object-contain rounded-lg" />
                            <div className="flex gap-2 mt-4 overflow-x-auto w-full pb-4 items-center justify-center no-scrollbar">
                                {images.map((img, i) => (
                                    <img key={i} src={img} className="w-20 h-20 object-cover rounded cursor-pointer opacity-50 hover:opacity-100 border-2 border-transparent hover:border-white transition-all" />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default HotelDetails;
