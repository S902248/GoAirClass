import React from 'react';
import { Sparkles, Shield, Clock, Coffee } from 'lucide-react';

const Experience = () => {
    const features = [
        { icon: <Sparkles className="h-5 w-5" />, label: "Top Notch Service" },
        { icon: <Shield className="h-5 w-5" />, label: "Safety First" },
        { icon: <Clock className="h-5 w-5" />, label: "On Time Always" },
        { icon: <Coffee className="h-5 w-5" />, label: "Luxury Comfort" }
    ];

    return (
        <section className="py-24 bg-deep-navy text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">
                {/* Header */}
                <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-radiant-coral">
                        <Sparkles className="h-3 w-3" />
                        <span>Experience Premium</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                        Experience Our New <br />
                        <span className="startup-gradient-text italic">Premium Bus Services</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-white/50 font-bold text-lg">
                        Pushing the boundaries of travel with absolute comfort,
                        unmatched safety, and a world-class on-board experience.
                    </p>
                </div>

                {/* Cinematic Image Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="group relative rounded-[40px] overflow-hidden aspect-[16/10] shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
                            alt="Luxury Bus"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-10 left-10 space-y-2">
                            <span className="bg-radiant-coral px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Global Fleet</span>
                            <h3 className="text-2xl font-black">Next-Gen Luxury</h3>
                        </div>
                    </div>

                    <div className="group relative rounded-[40px] overflow-hidden aspect-[16/10] shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2070&auto=format&fit=crop"
                            alt="Bus Interior"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-10 left-10 space-y-2">
                            <span className="bg-vibrant-violet px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Lifestyle</span>
                            <h3 className="text-2xl font-black">On-Board Comfort</h3>
                        </div>
                    </div>
                </div>

                {/* Feature Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors shadow-lg group"
                        >
                            <div className="bg-radiant-coral/10 p-3 rounded-xl text-radiant-coral group-hover:bg-radiant-coral group-hover:text-white transition-all">
                                {feature.icon}
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest text-white/70">
                                {feature.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
