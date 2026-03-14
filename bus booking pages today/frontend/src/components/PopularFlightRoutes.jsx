import React from 'react';
import { MapPin, Plane, ArrowRight } from 'lucide-react';

const PopularFlightRoutes = () => {
    const destinations = [
        {
            city: "Mumbai Flights",
            to: "Goa • Delhi • Bangalore • Ahmedabad",
            img: "https://images.unsplash.com/photo-1570160247132-72013f9f30e0?q=80&w=2000&auto=format&fit=crop",
            price: "₹2,199"
        },
        {
            city: "Delhi Flights",
            to: "Mumbai • Goa • Bangalore • Pune",
            img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop",
            price: "₹2,499"
        },
        {
            city: "Bangalore Flights",
            to: "Mumbai • Delhi • Goa • Hyderabad",
            img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2000&auto=format&fit=crop",
            price: "₹1,999"
        },
        {
            city: "Hyderabad Flights",
            to: "Mumbai • Goa • Bangalore • Delhi",
            img: "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=2000&auto=format&fit=crop",
            price: "₹1,850"
        },
        {
            city: "Chennai Flights",
            to: "Mumbai • Delhi • Madurai • Coimbatore",
            img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2000&auto=format&fit=crop",
            price: "₹2,099"
        },
        {
            city: "Goa Flights",
            to: "Mumbai • Delhi • Bangalore • Hyderabad",
            img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop",
            price: "₹2,250"
        }
    ];

    return (
        <section className="py-24 bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/20 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 bg-blue-600/5 py-2 px-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 border border-blue-600/10">
                            <Plane className="h-4 w-4" />
                            <span>Top Destinations</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-deep-navy tracking-tight leading-none">
                            Popular Flight <span className="text-blue-600">Routes</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {destinations.map((dest, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-[48px] p-4 border border-gray-100 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2"
                        >
                            <div className="relative h-64 rounded-[36px] overflow-hidden">
                                <img
                                    src={dest.img}
                                    alt={dest.city}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 via-deep-navy/20 to-transparent" />

                                <div className="absolute top-6 right-6">
                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/50 animate-bounce-slow">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Starts at</span>
                                        <span className="text-sm font-black text-blue-600 tracking-tight">{dest.price}</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8 flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <span className="text-2xl font-black tracking-tighter uppercase">{dest.city}</span>
                                </div>
                            </div>

                            <div className="p-6 pt-8 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-0.5 w-6 bg-blue-600 rounded-full" />
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Top Connections</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 leading-relaxed group-hover:text-deep-navy transition-colors">
                                        {dest.to}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-500 cursor-pointer">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Explore Routes</span>
                                        <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                                    </div>
                                    <div className="h-12 w-12 bg-gray-50 text-gray-300 rounded-[20px] flex items-center justify-center transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-100 group-hover:rotate-12">
                                        <Plane className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 rounded-[48px] shadow-[0_0_40px_rgba(37,99,235,0)] group-hover:shadow-[0_0_40px_rgba(37,99,235,0.05)] transition-all duration-700 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow {
                    animation: bounceSlow 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default PopularFlightRoutes;
