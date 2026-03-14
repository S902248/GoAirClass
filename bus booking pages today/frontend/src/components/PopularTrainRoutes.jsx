import React from 'react';
import { MapPin, Train } from 'lucide-react';

const PopularTrainRoutes = () => {
    const routes = [
        { city: "Mumbai Trains", info: "to Delhi • Goa • Bangalore • Ahmedabad", img: "https://images.unsplash.com/photo-1570160247132-72013f9f30e0?q=80&w=2000&auto=format&fit=crop" },
        { city: "Delhi Trains", info: "to Mumbai • Goa • Bangalore • Pune", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop" },
        { city: "Bangalore Trains", info: "to Mumbai • Delhi • Goa • Hyderabad", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2000&auto=format&fit=crop" },
        { city: "Hyderabad Trains", info: "to Mumbai • Goa • Bangalore • Delhi", img: "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=2000&auto=format&fit=crop" },
        { city: "Chennai Trains", info: "to Mumbai • Delhi • Madurai • Coimbatore", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2000&auto=format&fit=crop" },
        { city: "Goa Trains", info: "to Mumbai • Delhi • Bangalore • Hyderabad", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop" }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#d84e55]/10 py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-widest text-[#d84e55]">
                            <Train className="h-3 w-3" />
                            <span>Top Rail Routes</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-deep-navy tracking-tight">
                            Popular Train <span className="text-[#d84e55]">Destinations</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {routes.map((route, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-700 group cursor-pointer"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={route.img}
                                    alt={route.city}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-xl font-black tracking-tight">{route.city}</span>
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                <p className="text-sm font-bold text-gray-500 leading-relaxed uppercase tracking-widest text-[10px]">
                                    Top Connections:
                                </p>
                                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                                    {route.info}
                                </p>
                                <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                                    <span className="text-[9px] font-black text-[#d84e55] uppercase tracking-[0.2em]">Check Seats</span>
                                    <div className="h-8 w-8 bg-red-50 text-[#d84e55] rounded-lg flex items-center justify-center group-hover:bg-[#d84e55] group-hover:text-white transition-all">
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="C14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
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

export default PopularTrainRoutes;
