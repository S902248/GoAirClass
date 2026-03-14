import React from 'react';
import { ArrowRight, MapPin, Star, TrendingUp, Users } from 'lucide-react';

const PopularRoutes = () => {
    const routes = [
        { from: "Chennai", to: "Bangalore", price: "450", rating: "4.8", dailyTrips: "42" },
        { from: "Mumbai", to: "Pune", price: "350", rating: "4.9", dailyTrips: "120" },
        { from: "Hyderabad", to: "Vijayawada", price: "550", rating: "4.7", dailyTrips: "35" },
        { from: "Bangalore", to: "Hyderabad", price: "750", rating: "4.6", dailyTrips: "28" },
        { from: "Pune", to: "Mumbai", price: "350", rating: "4.9", dailyTrips: "115" },
        { from: "Delhi", to: "Jaipur", price: "400", rating: "4.5", dailyTrips: "24" },
        { from: "Ahmedabad", to: "Mumbai", price: "600", rating: "4.7", dailyTrips: "32" },
        { from: "Bangalore", to: "Chennai", price: "450", rating: "4.8", dailyTrips: "45" }
    ];

    return (
        <section className="py-20 bg-[#f8fafc] overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-radiant-coral/10 py-2 px-4 rounded-full text-[10px] font-black uppercase tracking-widest text-radiant-coral">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>Trending Choices</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-deep-navy tracking-tight leading-none">
                            Popular Bus <span className="text-radiant-coral italic">Routes</span>
                        </h2>
                        <p className="text-gray-400 font-bold text-sm max-w-lg">
                            Trusted by thousands of daily travelers for comfort and reliability across India's top destinations.
                        </p>
                    </div>
                    <button className="bg-white border border-gray-100 px-8 py-4 rounded-2xl text-[12px] font-black text-deep-navy hover:text-radiant-coral hover:border-radiant-coral transition-all shadow-xl shadow-gray-200/40 active:scale-95">
                        View All Destinations
                    </button>
                </div>

                {/* Routes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {routes.map((route, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-[32px] border border-gray-100 hover:border-radiant-coral/20 hover:shadow-2xl hover:shadow-radiant-coral/10 hover:-translate-y-2 transition-all duration-500 group cursor-pointer relative overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Accent Background Decor */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-radiant-coral/5 rounded-full blur-2xl group-hover:bg-radiant-coral/10 transition-colors" />

                            {/* Top Info Bar */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-lg">
                                    <Star className="h-3 w-3 text-green-500 fill-current" />
                                    <span className="text-[10px] font-black text-green-600">{route.rating}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-deep-navy transition-colors">
                                    <Users className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{route.dailyTrips} Daily Trips</span>
                                </div>
                            </div>

                            {/* Route Connection Visual */}
                            <div className="space-y-2 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full border-2 border-radiant-coral bg-white group-hover:bg-radiant-coral transition-colors" />
                                    <span className="text-sm font-black text-deep-navy group-hover:text-radiant-coral transition-colors">
                                        {route.from}
                                    </span>
                                </div>
                                <div className="ml-1 w-px h-6 bg-gradient-to-b from-radiant-coral/40 to-transparent" />
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-deep-navy transition-colors" />
                                    <span className="text-sm font-black text-gray-500 group-hover:text-deep-navy transition-colors">
                                        {route.to}
                                    </span>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Starts From</p>
                                    <p className="text-xl font-black text-deep-navy group-hover:text-radiant-coral transition-colors">₹{route.price}</p>
                                </div>
                                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#fafafa] group-hover:bg-radiant-coral group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-sm shadow-gray-200">
                                    <ArrowRight className="h-5 w-5 group-hover:scale-110" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Stats Indicator */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-12 opacity-40">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-deep-navy italic">500+</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Operators</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-deep-navy italic">10K+</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Buses Daily</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-deep-navy italic">2000+</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Routes</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PopularRoutes;
