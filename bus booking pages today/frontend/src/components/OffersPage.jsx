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
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-24 bg-[#f8fafc] overflow-hidden">

            {/* Advanced Multi-layered background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-[#f26a36]/5 rounded-full blur-[140px] animate-pulse duration-[10s]" />
                <div className="absolute bottom-[5%] right-[-10%] w-[35%] h-[35%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse duration-[8s]" />
                <div className="absolute top-[30%] right-[15%] w-[20%] h-[20%] bg-purple-400/5 rounded-full blur-[80px] animate-bounce duration-[15s]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6">

                {/* Enhanced Header Section - Redesigned */}
                <div className="flex flex-col items-center text-center mt-12 mb-20 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#f26a36]/10 py-2 px-4 rounded-full text-[#f26a36] border border-[#f26a36]/20 shadow-sm">
                        <Gift className="h-4 w-4" />
                        <span className="text-[12px] font-bold tracking-widest uppercase">Curated Savings</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-800 leading-[1.1] max-w-4xl mx-auto">
                        Exclusive{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-[#f26a36]">
                            Offers
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-4">
                        Unlock premium travel experiences with our handpicked discount codes and bank partner deals.
                    </p>
                </div>

                {/* Feature Cards Grid - Redesigned */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24 max-w-5xl mx-auto px-4 lg:px-0">
                    {[
                        { icon: Zap, title: "Instant Savings", desc: "Applied directly at checkout", color: "text-[#f26a36]", bg: "bg-[#f26a36]/10" },
                        { icon: ShieldCheck, title: "Verified Deals", desc: "100% working & authentic", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { icon: Ticket, title: "Loyalty Perks", desc: "Exclusive to registered members", color: "text-blue-500", bg: "bg-blue-500/10" }
                    ].map((feature, i) => (
                        <div key={i} className="group flex flex-col items-center sm:items-start text-center sm:text-left gap-4 p-8 rounded-[24px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-14 h-14 rounded-full ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`h-6 w-6 ${feature.color}`} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-[17px] font-bold text-slate-800 mb-1">{feature.title}</h3>
                                <p className="text-[14px] text-slate-500 font-medium">{feature.desc}</p>
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
