import React from 'react';
import { Building2, Users, Target, ShieldCheck, Globe, Trophy } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 bg-[#f26a36]/10 text-[#f26a36] py-2 px-4 rounded-full text-[12px] font-bold tracking-widest uppercase mb-6">
                        <Building2 className="h-4 w-4" />
                        <span>About GoAirClass</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                        Connecting India, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">One Journey at a Time</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        GoAirClass is India's premier smart travel booking platform, dedicated to making bus, flight, and train travel seamless, accessible, and affordable for millions of travelers.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-12 duration-700">
                    
                    {/* Mission */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                        <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Target className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Our Mission</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            To empower travelers with a unified platform that offers transparent pricing, vast choices, and instant bookings, eliminating the friction from travel planning.
                        </p>
                    </div>

                    {/* Reach */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                        <div className="bg-emerald-50 text-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Globe className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Our Reach</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Partnering with over 2,500 trusted operators across the country, we connect every major city, town, and destination, ensuring you can reach anywhere, anytime.
                        </p>
                    </div>

                    {/* Trust */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                        <div className="bg-[#f26a36]/10 text-[#f26a36] w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Why Trust Us</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            With military-grade secure payments, 24/7 dedicated customer support, and instant ticket confirmations, your journey is always guaranteed and protected.
                        </p>
                    </div>

                </div>

                {/* Stats Section */}
                <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl p-12 relative overflow-hidden text-center animate-in fade-in slide-in-from-bottom-16 duration-700">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#f26a36] rounded-full blur-[100px] opacity-20" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20" />
                    
                    <h2 className="text-3xl font-black text-white relative z-10 mb-12">By The Numbers</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                        <div>
                            <p className="text-4xl lg:text-5xl font-black text-[#f26a36] mb-2">5M+</p>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Happy Travelers</p>
                        </div>
                        <div>
                            <p className="text-4xl lg:text-5xl font-black text-white mb-2">2500+</p>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Bus Operators</p>
                        </div>
                        <div>
                            <p className="text-4xl lg:text-5xl font-black text-[#f26a36] mb-2">500+</p>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cities Connected</p>
                        </div>
                        <div>
                            <p className="text-4xl lg:text-5xl font-black text-white mb-2">24/7</p>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Customer Support</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;
