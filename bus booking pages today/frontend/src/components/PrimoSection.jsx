import React from 'react';
import { UserCheck, Star, Sparkles, Heart } from 'lucide-react';

const PrimoSection = () => {
    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">
                {/* Main Primo Card */}
                <div className="glass-startup-charcoal bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    {/* Left: Visual */}
                    <div className="lg:w-1/2 relative h-[250px] lg:h-auto overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
                            alt="Primo Bus"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/30 to-transparent" />
                        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            <span className="text-white text-[8px] font-black uppercase tracking-widest">Premium Fleet</span>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:w-1/2 p-10 lg:p-12 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Feature 1: Punctuality */}
                            <div className="feature-card !p-6 group cursor-default">
                                <div className="go-corner">
                                    <div className="go-arrow">→</div>
                                </div>
                                <div className="space-y-3 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="feature-icon-container bg-blue-50 p-2.5 rounded-xl text-blue-600 transition-all">
                                            <Star className="feature-icon h-5 w-5 fill-current" />
                                        </div>
                                        <h4 className="feature-title text-base font-black text-deep-navy uppercase tracking-tight">Punctuality</h4>
                                    </div>
                                    <p className="feature-desc text-gray-500 text-xs font-bold leading-relaxed">
                                        Our Primo buses are guaranteed to arrive and depart on time, every time.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2: Staff Conduct */}
                            <div className="feature-card !p-6 group cursor-default">
                                <div className="go-corner">
                                    <div className="go-arrow">→</div>
                                </div>
                                <div className="space-y-3 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="feature-icon-container bg-green-50 p-2.5 rounded-xl text-green-600 transition-all">
                                            <UserCheck className="feature-icon h-5 w-5" />
                                        </div>
                                        <h4 className="feature-title text-base font-black text-deep-navy uppercase tracking-tight">Staff conduct</h4>
                                    </div>
                                    <p className="feature-desc text-gray-500 text-xs font-bold leading-relaxed">
                                        Professionally trained drivers and attendants for a safe, respectful journey.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Banner for Women Special */}
                        <div className="bg-purple-50 rounded-[32px] p-6 flex items-center justify-between border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-5">
                                <div className="bg-white p-3 rounded-2xl shadow-xl">
                                    <Heart className="h-6 w-6 text-pink-500 fill-current animate-pulse-heart" />
                                </div>
                                <div className="space-y-0.5 text-left">
                                    <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest">Women Exclusive</span>
                                    <h3 className="text-lg font-black text-deep-navy tracking-tight">Special Women-Only Seats</h3>
                                    <p className="text-gray-500 text-[10px] font-bold">Secure and comfortable travel for our community.</p>
                                </div>
                            </div>
                            <button className="hidden md:block bg-pink-500 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-pink-600 transition-colors">
                                View Layout
                            </button>
                        </div>

                        <button className="w-full bg-radiant-coral text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-[0_15px_30px_-8px_rgba(244,63,94,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group primo-button-sweep">
                            <Sparkles className="h-4 w-4 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                            Book a Primo Bus
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrimoSection;
