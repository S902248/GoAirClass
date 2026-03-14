import React from 'react';
import { Star, MapPin, Tag } from 'lucide-react';

const FeaturedHotels = ({ setView }) => {
    const hotels = [
        {
            name: "The Leela Palace",
            location: "Udaipur, Rajasthan",
            price: "₹24,500",
            rating: 4.8,
            img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
            tag: "Best Seller"
        },
        {
            name: "Taj Mahal Tower",
            location: "Mumbai, Maharashtra",
            price: "₹18,200",
            rating: 4.9,
            img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
            tag: "Iconic"
        },
        {
            name: "W Goa",
            location: "Vagator, Goa",
            price: "₹15,400",
            rating: 4.7,
            img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2050&auto=format&fit=crop",
            tag: "Luxury"
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#d84e55]/10 py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-widest text-[#d84e55]">
                            <Star className="h-3 w-3" />
                            <span>Premium Stays</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-deep-navy tracking-tight">
                            Handpicked <span className="text-[#d84e55]">Hotels</span>
                        </h2>
                    </div>
                    <button className="text-sm font-black text-[#d84e55] hover:underline uppercase tracking-widest">
                        Explore All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hotels.map((hotel, index) => (
                        <div
                            key={index}
                            onClick={() => setView('hotel-results')}
                            className="bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-700 group cursor-pointer"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={hotel.img}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-[#d84e55] shadow-xl">
                                    {hotel.tag}
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-deep-navy tracking-tight group-hover:text-[#d84e55] transition-colors">
                                        {hotel.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                                        <MapPin className="h-4 w-4" />
                                        <span>{hotel.location}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1.5">
                                            <Star className="h-3.5 w-3.5 text-green-600 fill-green-600" />
                                            <span className="text-xs font-black text-green-700">{hotel.rating}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">(2.4k reviews)</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Starting from</div>
                                        <div className="text-xl font-black text-deep-navy">{hotel.price}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedHotels;
