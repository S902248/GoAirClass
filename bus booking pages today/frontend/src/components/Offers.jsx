import React, { useRef, useState } from 'react';
import { Tag, Copy, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const Offers = () => {
    const scrollRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [copiedId, setCopiedId] = useState(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const totalScroll = scrollWidth - clientWidth;
            const progress = (scrollLeft / totalScroll) * 100;
            setScrollProgress(progress);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const copyCode = (id, code) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const offers = [
        {
            id: 1,
            title: "CASHBACK UP TO ₹300!",
            desc: "On bus tickets. Min. value ₹200.",
            code: "FIRST300",
            validity: "Valid till 28 Feb",
            bgGradient: "from-orange-50 to-orange-100",
            icon: "🚌",
            accent: "bg-orange-500"
        },
        {
            id: 2,
            title: "FLAT 15% OFF",
            desc: "For your first luxury booking.",
            code: "LUXURY15",
            validity: "Valid till 31 Mar",
            bgGradient: "from-blue-50 to-blue-100",
            icon: "✨",
            accent: "bg-blue-600"
        },
        {
            id: 3,
            title: "₹100 INSTANT OFF",
            desc: "On round trips above ₹500.",
            code: "ROUND100",
            validity: "Valid till 15 Mar",
            bgGradient: "from-rose-50 to-rose-100",
            icon: "🔄",
            accent: "bg-rose-500"
        },
        {
            id: 4,
            title: "0 CONVENIENCE FEE",
            desc: "For women travelers on special buses.",
            code: "GOFEMALE",
            validity: "Limited period",
            bgGradient: "from-purple-50 to-purple-100",
            icon: "👩",
            accent: "bg-purple-600"
        },
        {
            id: 5,
            title: "EXTRA ₹50 OFF",
            desc: "Use Amazon Pay for transaction.",
            code: "AMAZON50",
            validity: "Valid till 10 Mar",
            bgGradient: "from-emerald-50 to-emerald-100",
            icon: "💳",
            accent: "bg-emerald-500"
        }
    ];

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 relative">
                <div className="flex justify-between items-end mb-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-radiant-coral/10 py-1 px-2.5 rounded-full text-[9px] font-black uppercase tracking-widest text-radiant-coral">
                            <Tag className="h-2.5 w-2.5" />
                            <span>Exclusive Deals</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-deep-navy tracking-tight">
                            Offers For <span className="text-radiant-coral">You</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center text-deep-navy shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:bg-radiant-coral hover:text-white hover:border-radiant-coral hover:shadow-lg hover:shadow-radiant-coral/20 transition-all duration-300 active:scale-90 group"
                        >
                            <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center text-deep-navy shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:bg-radiant-coral hover:text-white hover:border-radiant-coral hover:shadow-lg hover:shadow-radiant-coral/20 transition-all duration-300 active:scale-90 group"
                        >
                            <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar -mx-8 px-8 scroll-smooth"
                >
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className={`flex-shrink-0 w-[350px] h-[200px] rounded-[32px] bg-gradient-to-br ${offer.bgGradient} border border-white p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-xl transition-all duration-500 cursor-pointer`}
                        >
                            <div className="relative z-10 space-y-3">
                                <div className={`w-10 h-1 ${offer.accent} rounded-full mb-4`} />
                                <h3 className="text-deep-navy font-black text-xl tracking-tight leading-tight">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-600/70 text-sm font-bold max-w-[180px]">
                                    {offer.desc}
                                </p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {offer.validity}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        copyCode(offer.id, offer.code);
                                    }}
                                    className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-sm border border-transparent hover:border-radiant-coral transition-all group/btn"
                                >
                                    <span className="text-gray-400">CODE:</span>
                                    <span className="text-deep-navy group-hover/btn:text-radiant-coral transition-colors">{offer.code}</span>
                                    {copiedId === offer.id ? (
                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5 text-radiant-coral group-hover/btn:scale-110 transition-transform" />
                                    )}
                                </button>
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute top-[-20%] right-[-10%] text-6xl opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700 -rotate-12 group-hover:rotate-0">
                                {offer.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Bar Container */}
                <div className="max-w-md mx-auto">
                    <div className="slider-progress-track">
                        <div
                            className="slider-progress-bar"
                            style={{ width: `${Math.max(10, scrollProgress)}%` }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Offers;
