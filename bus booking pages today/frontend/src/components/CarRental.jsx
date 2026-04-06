import React from 'react';
import { Car, MapPin, Calendar, Search, ShieldCheck, Zap, Headphones } from 'lucide-react';

const CarRental = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-24 font-sans overflow-hidden">
            
            {/* Split Hero Section */}
            <div className="relative w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-16 pb-32 px-6">
                
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    
                    {/* Left: Text Content */}
                    <div className="w-full lg:w-1/2 pt-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-[#f26a36]/10 text-[#f26a36] py-2 px-4 rounded-full text-[12px] font-bold tracking-widest uppercase mb-6 border border-[#f26a36]/20 shadow-[0_0_15px_rgba(242,106,54,0.3)]">
                            <Car className="h-4 w-4" />
                            <span>Premium Car Rentals</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
                            Rent reliable cars for <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">Memorable Road Trips</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-lg mx-auto lg:mx-0 font-medium">
                            Choose from over 10,000+ verified vehicles across India. Self-drive or strict driver-driven options available instantly at your fingertips.
                        </p>
                    </div>

                    {/* Right: Booking Widget */}
                    <div className="w-full lg:w-1/2 max-w-md">
                        <div className="bg-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Find Your Ride</h2>
                            
                            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pick-up Location</label>
                                    <div className="relative flex items-center group">
                                        <MapPin className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-[#f26a36] transition-colors" />
                                        <input type="text" placeholder="City, Airport, or Station" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 focus:border-[#f26a36] hover:border-slate-200 rounded-2xl text-slate-800 font-bold outline-none transition-colors" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pick-up Date</label>
                                        <div className="relative flex items-center group">
                                            <Calendar className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-[#f26a36] transition-colors" />
                                            <input type="date" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 focus:border-[#f26a36] hover:border-slate-200 rounded-2xl text-slate-800 font-bold outline-none transition-colors cursor-text" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Drop-off Date</label>
                                        <div className="relative flex items-center group">
                                            <Calendar className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-[#f26a36] transition-colors" />
                                            <input type="date" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 focus:border-[#f26a36] hover:border-slate-200 rounded-2xl text-slate-800 font-bold outline-none transition-colors cursor-text" />
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-2 py-4 bg-gradient-to-r from-[#f26a36] to-[#ff8c5a] hover:to-[#f26a36] text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-[0_8px_25px_rgba(242,106,54,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                    <Search className="h-4 w-4" /> Search Cars
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Decorative Car Background (Optional) */}
                <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-gradient-to-tl from-[#f26a36]/5 to-transparent blur-[120px] rounded-tl-full pointer-events-none" />
            </div>

            {/* Why Choose Us */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] text-center">
                        <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                            <ShieldCheck className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2">Verified Vehicles</h3>
                        <p className="text-slate-500 text-sm font-medium">All partner vehicles undergo strict 50-point quality and hygiene checks.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] text-center">
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                            <Zap className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2">Instant Confirmation</h3>
                        <p className="text-slate-500 text-sm font-medium">No waiting. Book and receive your car details instantly without delays.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] text-center">
                        <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-100">
                            <Headphones className="h-8 w-8 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2">24/7 Roadside Assist</h3>
                        <p className="text-slate-500 text-sm font-medium">Travel with peace of mind. Our support team is always just a call away.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CarRental;
