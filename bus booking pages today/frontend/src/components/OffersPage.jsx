import React, { useState } from 'react';
import { Tag, Copy, Check, Ticket, Gift, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const OffersPage = () => {
    const [copiedId, setCopiedId] = useState(null);

    const copyCode = (id, code) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const offers = [
        {
            id: 1,
            title: "CASHBACK UP TO ₹300!",
            desc: "Valid on all bus ticket bookings. Minimum transaction value ₹200.",
            code: "FIRST300",
            validity: "Valid till 28 Feb 2026",
            bgGradient: "from-orange-50 to-orange-100/50",
            icon: "🚌",
            accent: "bg-orange-500",
            glow: "shadow-orange-200/50",
            category: "General"
        },
        {
            id: 2,
            title: "FLAT 15% OFF",
            desc: "Exclusive discount for your first luxury sleeper bus booking.",
            code: "LUXURY15",
            validity: "Valid till 31 Mar 2026",
            bgGradient: "from-blue-50 to-blue-100/50",
            icon: "✨",
            accent: "bg-blue-600",
            glow: "shadow-blue-200/50",
            category: "Premium"
        },
        {
            id: 3,
            title: "₹100 INSTANT OFF",
            desc: "Get instant discount on round trip bookings above ₹500.",
            code: "ROUND100",
            validity: "Valid till 15 Mar 2026",
            bgGradient: "from-rose-50 to-rose-100/50",
            icon: "🔄",
            accent: "bg-rose-500",
            glow: "shadow-rose-200/50",
            category: "Round Trip"
        },
        {
            id: 4,
            title: "0 CONVENIENCE FEE",
            desc: "Zero convenience fee for women travelers on special identified buses.",
            code: "GOFEMALE",
            validity: "Limited Period Offer",
            bgGradient: "from-purple-50 to-purple-100/50",
            icon: "👩",
            accent: "bg-purple-600",
            glow: "shadow-purple-200/50",
            category: "Special"
        },
        {
            id: 5,
            title: "EXTRA ₹50 OFF",
            desc: "Use Amazon Pay for your transaction to get extra cashback.",
            code: "AMAZON50",
            validity: "Valid till 10 Mar 2026",
            bgGradient: "from-emerald-50 to-emerald-100/50",
            icon: "💳",
            accent: "bg-emerald-500",
            glow: "shadow-emerald-200/50",
            category: "Wallets"
        },
        {
            id: 6,
            title: "UP TO ₹500 FLAT OFF",
            desc: "Standard Chartered credit card holders exclusive winter deal.",
            code: "STAN500",
            validity: "Valid till 15 Mar 2026",
            bgGradient: "from-cyan-50 to-cyan-100/50",
            icon: "🏦",
            accent: "bg-cyan-600",
            glow: "shadow-cyan-200/50",
            category: "Bank Offer"
        }
    ];

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-32 pb-24 bg-[#f8fafc] overflow-hidden">

            {/* Advanced Multi-layered background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-radiant-coral/10 rounded-full blur-[140px] animate-pulse duration-[10s]" />
                <div className="absolute bottom-[5%] right-[-10%] w-[35%] h-[35%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse duration-[8s]" />
                <div className="absolute top-[30%] right-[15%] w-[20%] h-[20%] bg-purple-400/5 rounded-full blur-[80px] animate-bounce duration-[15s]" />

                {/* Floating particles/shapes */}
                <div className="absolute top-40 left-[10%] w-32 h-32 border-2 border-radiant-coral/5 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-spin duration-[20s]" />
                <div className="absolute bottom-60 right-[15%] w-48 h-48 border-2 border-blue-400/5 rounded-[50%_50%_20%_80%/25%_80%_20%_75%] animate-spin-slow" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6">

                {/* Enhanced Header Section */}
                <div className="text-center mb-20 space-y-6 animate-in fade-in slide-in-from-top-6 duration-1000">
                    <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md py-2 px-5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-radiant-coral shadow-sm border border-white/50">
                        <Gift className="h-4 w-4" />
                        <span>Curated Savings</span>
                    </div>
                    <div className="relative inline-block">
                        <h1 className="text-5xl md:text-7xl font-black text-deep-navy tracking-tighter leading-none uppercase italic relative z-10">
                            Exclusive <span className="text-radiant-coral italic">Offers</span>
                        </h1>
                        <div className="absolute -bottom-2 -right-4 w-24 h-24 bg-radiant-coral/10 rounded-full blur-2xl z-0" />
                    </div>
                    <p className="text-gray-400 font-bold text-sm max-w-sm mx-auto leading-relaxed uppercase tracking-tighter">
                        Unlock premium travel experiences with our handpicked discount codes and bank partner deals.
                    </p>
                </div>

                {/* Glassmorphism Features Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
                    {[
                        { icon: Zap, label: "Instant Savings", color: "text-amber-500", bg: "bg-amber-500/10", desc: "Applied directly" },
                        { icon: ShieldCheck, label: "Verified Deals", color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "100% working" },
                        { icon: Ticket, label: "Loyalty Perks", color: "text-blue-500", bg: "bg-blue-500/10", desc: "For members" }
                    ].map((feature, i) => (
                        <div key={i} className="group relative">
                            <div className="absolute inset-0 bg-white/40 blur-xl rounded-[32px] group-hover:bg-white/60 transition-all duration-500" />
                            <div className="relative flex flex-col items-center text-center gap-4 p-8 rounded-[32px] border border-white/80 bg-white/30 backdrop-blur-xl shadow-xl shadow-gray-200/20 hover:-translate-y-2 transition-all duration-500 animate-in fade-in zoom-in-95 delay-[200ms]">
                                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-deep-navy uppercase tracking-[0.15em] mb-1">{feature.label}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{feature.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Premium Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className={`group relative h-[280px] rounded-[50px] bg-gradient-to-br ${offer.bgGradient} border-[3px] border-white p-10 flex flex-col justify-between shadow-[0_30px_70px_rgba(0,0,0,0.06)] hover:shadow-[0_50px_100px_rgba(0,0,0,0.1)] hover:${offer.glow} transition-all duration-700 cursor-default`}
                        >
                            {/* Inner Glow/Glass layer */}
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-16 h-2 ${offer.accent} rounded-full shadow-lg group-hover:w-24 transition-all duration-700`} />
                                    <div className="px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full text-[9px] font-black text-gray-500 uppercase tracking-[0.15em] border border-white">
                                        {offer.category}
                                    </div>
                                </div>
                                <h3 className="text-deep-navy font-black text-3xl tracking-tighter leading-[0.9] italic mb-4 group-hover:text-radiant-coral transition-colors duration-500">
                                    {offer.title.split(' ').map((word, i) => (
                                        <React.Fragment key={i}>
                                            {word} {i === 0 && <br />}
                                        </React.Fragment>
                                    ))}
                                </h3>
                                <p className="text-gray-600/90 text-xs font-bold leading-relaxed max-w-[220px] line-clamp-2 uppercase tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">
                                    {offer.desc}
                                </p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Expires On</span>
                                    <span className="text-[10px] font-black text-deep-navy uppercase tracking-widest">
                                        {offer.validity.split(' till ')[1] || offer.validity}
                                    </span>
                                </div>
                                <button
                                    onClick={() => copyCode(offer.id, offer.code)}
                                    className="flex items-center gap-3 bg-white px-6 py-3.5 rounded-[22px] text-[11px] font-black uppercase tracking-tight shadow-2xl shadow-black/10 hover:shadow-radiant-coral/20 hover:scale-110 active:scale-95 transition-all duration-500 group/btn"
                                >
                                    <span className="text-gray-300">CODE:</span>
                                    <span className="text-deep-navy group-hover/btn:text-radiant-coral transition-colors">{offer.code}</span>
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        {copiedId === offer.id ? (
                                            <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in-50" />
                                        ) : (
                                            <Copy className="h-4 w-4 text-radiant-coral group-hover/btn:rotate-12 transition-transform" />
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Huge background icon with interaction */}
                            <div className="absolute top-[-5%] right-[-10%] text-[140px] opacity-10 grayscale-[0.8] group-hover:grayscale-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-1000 -rotate-12 group-hover:rotate-6 select-none pointer-events-none">
                                {offer.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Interactive help footer */}
                <div className="max-w-3xl mx-auto group">
                    <div className="relative overflow-hidden p-12 rounded-[40px] bg-deep-navy shadow-2xl text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-radiant-coral/20 via-transparent to-blue-500/10 opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
                        <div className="relative z-10 space-y-6">
                            <h4 className="text-2xl font-black text-white italic tracking-tight uppercase">Need more help?</h4>
                            <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-lg mx-auto uppercase tracking-widest leading-loose">
                                Check our travel guides or chat with our experts to find <span className="text-radiant-coral">more exclusive codes</span> tailored for your upcoming journeys.
                            </p>
                            <button className="inline-flex items-center gap-2 text-[10px] font-black text-white hover:text-radiant-coral uppercase tracking-[0.3em] transition-all border-b-2 border-white/10 hover:border-radiant-coral pb-2 group-hover:gap-4">
                                Contact Support <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OffersPage;
