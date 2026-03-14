import React from 'react';
import { Tag, Building2, MapPin, ArrowRight } from 'lucide-react';

const PopularHotelDestinations = ({ setView }) => {
    const destinations = [
        { city: "New Delhi", count: "1400+ Properties", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop" },
        { city: "Mumbai", count: "1200+ Properties", img: "https://images.unsplash.com/photo-1570160247132-72013f9f30e0?q=80&w=2000&auto=format&fit=crop" },
        { city: "Goa", count: "1800+ Properties", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop" },
        { city: "Bangalore", count: "900+ Properties", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2000&auto=format&fit=crop" },
        { city: "Chennai", count: "700+ Properties", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2000&auto=format&fit=crop" },
        { city: "Kolkata", count: "600+ Properties", img: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=2000&auto=format&fit=crop" }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#d84e55]/10 py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-widest text-[#d84e55]">
                            <MapPin className="h-3 w-3" />
                            <span>Top Destinations</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-deep-navy tracking-tight">
                            Popular <span className="text-[#d84e55]">Hotel Cities</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((dest, index) => (
                        <div
                            key={index}
                            onClick={() => setView('hotel-results')}
                            className="h-64 rounded-[40px] relative overflow-hidden group cursor-pointer"
                        >
                            <img
                                src={dest.img}
                                alt={dest.city}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/20 to-transparent" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white tracking-tight">{dest.city}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{dest.count}</span>
                                        <div className="h-8 w-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
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

export default PopularHotelDestinations;
