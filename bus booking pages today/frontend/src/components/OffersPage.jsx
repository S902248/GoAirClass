import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, Ticket, Gift, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { getActiveCoupons } from '../api/couponApi';

const OffersPage = () => {
    const [copiedId, setCopiedId] = useState(null);
    const [dynamicOffers, setDynamicOffers] = useState([]);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const data = await getActiveCoupons();
                const coupons = data.coupons || data || [];
                
                const mapped = coupons.map((c, index) => {
                    const gradients = [
                        "from-indigo-600 to-blue-700",
                        "from-rose-500 to-orange-500",
                        "from-emerald-500 to-teal-700",
                        "from-violet-600 to-purple-800",
                        "from-amber-400 to-orange-600",
                        "from-cyan-500 to-blue-600"
                    ];
                    const accents = ["bg-white/40", "bg-white/40", "bg-white/40", "bg-white/40", "bg-white/40", "bg-white/40"];
                    const icons = ["🚌", "✨", "🔄", "👩", "💳", "🏦"];

                    return {
                        id: c._id,
                        title: c.discountType === 'flat' 
                            ? `FLAT ₹${c.discountValue} OFF!` 
                            : `GET ${c.discountValue}% OFF!`,
                        desc: c.description || "Special offer on your next booking.",
                        code: c.code,
                        validity: c.validTill ? `Valid till ${new Date(c.validTill).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : "Limited period",
                        bgGradient: gradients[index % gradients.length],
                        accent: accents[index % accents.length],
                        icon: icons[index % icons.length],
                        category: c.applicableOn || "General"
                    };
                });
                setDynamicOffers(mapped);
            } catch (err) {
                console.error("Failed to fetch offers", err);
            }
        };
        fetchCoupons();
    }, []);

    const copyCode = (id, code) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const staticOffers = [
        {
            id: 's1',
            title: "CASHBACK UP TO ₹300!",
            desc: "Valid on all bus ticket bookings. Minimum transaction value ₹200.",
            code: "FIRST300",
            validity: "Valid till 28 Feb 2026",
            bgGradient: "from-indigo-600 to-blue-700",
            icon: "🚌",
            accent: "bg-white/30",
            category: "General"
        }
    ];

    const allOffers = [...dynamicOffers, ...staticOffers];

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-32 pb-24 bg-[#f8fafc] overflow-hidden">

            {/* Fresh multi-layered background */}
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

                {/* Airy Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {allOffers.map((offer) => (
                        <div
                            key={offer.id}
                            className={`group relative h-[300px] rounded-[50px] bg-gradient-to-br shadow-2xl ${offer.bgGradient} p-10 flex flex-col justify-between transition-all duration-700 cursor-default overflow-hidden`}
                        >
                            {/* Decorative Glow Layer */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] transition-all duration-700 group-hover:w-48 group-hover:h-48 group-hover:bg-white/20" />
                            
                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-1 ${offer.accent} rounded-full group-hover:w-20 transition-all duration-700`} />
                                    <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-[0.15em] border border-white/20">
                                        {offer.category}
                                    </div>
                                </div>
                                <h3 className="text-white font-black text-3xl tracking-tighter leading-[1] mb-4 group-hover:translate-x-1 transition-transform duration-500">
                                    {offer.title.split(' ').map((word, i) => (
                                        <React.Fragment key={i}>
                                            {word} {i === 0 && <br />}
                                        </React.Fragment>
                                    ))}
                                </h3>
                                <p className="text-white/80 text-xs font-bold leading-relaxed max-w-[220px] line-clamp-2 uppercase tracking-tighter group-hover:text-white transition-colors">
                                    {offer.desc}
                                </p>

                                <div className="relative z-10 flex items-center justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Limited Time</span>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                            {offer.validity.split(' till ')[1] || offer.validity || "Active"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => copyCode(offer.id, offer.code)}
                                        className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-full text-[11px] font-black uppercase tracking-tight text-white shadow-xl hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-500 group/btn border border-white/20"
                                    >
                                        <span className="opacity-40">CODE:</span>
                                        <span>{offer.code}</span>
                                        <div className="w-5 h-5 flex items-center justify-center">
                                            {copiedId === offer.id ? (
                                                <Check className="h-4 w-4 text-emerald-300 animate-in zoom-in-50" />
                                            ) : (
                                                <Check className="hidden" /> || <Copy className="h-4 w-4 text-white/60 group-hover/btn:text-white transition-colors" />
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Ghost Icon background */}
                            <div className="absolute bottom-[-10%] left-[-5%] text-[120px] opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-1000 rotate-12 select-none pointer-events-none">
                                {offer.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Professional Help Banner */}
                <div className="max-w-4xl mx-auto group">
                    <div className="relative overflow-hidden p-12 rounded-[40px] bg-sky-50 border border-sky-100 text-center">
                        <div className="relative z-10 space-y-6">
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Still searching for the best deal?</h4>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed max-lg mx-auto uppercase tracking-widest leading-loose">
                                Our support team is available 24/7 to help you find <span className="text-sky-600 underline underline-offset-4 decoration-2">exclusive member rates</span> for your specific dates.
                            </p>
                            <button className="inline-flex items-center gap-2 text-[10px] font-black text-sky-600 hover:text-slate-900 uppercase tracking-[0.3em] transition-all border-b-2 border-sky-200 hover:border-slate-900 pb-2">
                                Talk to an Expert <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OffersPage;
