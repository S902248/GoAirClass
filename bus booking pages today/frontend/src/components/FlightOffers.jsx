import React from 'react';
import { Tag, Plane, ArrowRight, Sparkles } from 'lucide-react';

const FlightOffers = () => {
    const offers = [
        {
            bank: "ICICI Bank",
            logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
            title: "UP TO ₹5,000 OFF",
            desc: "On Domestic Flights with ICICI Cards.",
            gradient: "from-orange-500/10 via-orange-50/50 to-white",
            accent: "bg-orange-600",
            text: "text-orange-900",
            code: "FLYICICI"
        },
        {
            bank: "HDFC Bank",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/HDFC_Bank_Logo.svg",
            title: "FLAT ₹2,000 OFF",
            desc: "On Domestic Flights with HDFC Credit Cards.",
            gradient: "from-blue-500/10 via-blue-50/50 to-white",
            accent: "bg-blue-600",
            text: "text-blue-900",
            code: "HDFCSAVE"
        },
        {
            bank: "Axis Bank",
            logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Axis_Bank_logo.svg",
            title: "Flat 12% Off",
            desc: "On Flights with Axis Bank Credit Cards.",
            gradient: "from-rose-500/10 via-rose-50/50 to-white",
            accent: "bg-rose-600",
            text: "text-rose-900",
            code: "AXISFLY"
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-50 blur-3xl rounded-full opacity-50" />
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-indigo-50 blur-3xl rounded-full opacity-50" />

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 bg-blue-600/5 py-2 px-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 border border-blue-600/10">
                            <Tag className="h-3.5 w-3.5" />
                            <span>Exclusive Flight Deals</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-deep-navy tracking-tight leading-none">
                            Today's <span className="text-blue-600 italic">Hottest</span> Offers
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {offers.map((offer, index) => (
                        <div
                            key={index}
                            className={`group perspective-1000 cursor-pointer`}
                        >
                            <div className={`relative h-[320px] rounded-[40px] border border-gray-100 bg-gradient-to-br ${offer.gradient} p-8 flex flex-col justify-between transition-all duration-700 ease-out transform group-hover:rotate-x-1 group-hover:rotate-y-1 group-hover:scale-[1.02] group-hover:shadow-[0_40px_80px_-20px_rgba(0_0_0_/_0.1)] overflow-hidden`}>

                                {/* Ticket Perforation Effect */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-100 rounded-full z-20" />
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-100 rounded-full z-20" />
                                <div className="absolute left-6 right-6 top-1/2 h-px border-t border-dashed border-gray-200 z-10" />

                                {/* Decorative Background Icon */}
                                <Plane className={`absolute -right-12 -bottom-12 h-64 w-64 text-deep-navy/5 -rotate-12 transition-all duration-1000 group-hover:scale-110 group-hover:-translate-x-4`} />

                                <div className="space-y-6 relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <div className="h-10 px-4 bg-white/80 backdrop-blur-md rounded-2xl flex items-center shadow-sm border border-gray-100 transition-all group-hover:shadow-md">
                                            <img src={offer.logo} alt={offer.bank} className="h-5 object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/80 shadow-sm animate-pulse">
                                            <Sparkles className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ending Soon</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center gap-2 -mt-4">
                                        <h3 className={`text-4xl font-black ${offer.text} tracking-tighter leading-none group-hover:scale-105 transition-transform duration-500`}>
                                            {offer.title}
                                        </h3>
                                        <p className="text-gray-500 font-bold text-[11px] uppercase tracking-widest leading-relaxed max-w-[200px]">
                                            {offer.desc}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pb-2">
                                        <div>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Use Promo Code</span>
                                            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-dashed border-gray-200 flex items-center gap-3 group-hover:border-blue-300 transition-colors">
                                                <span className="text-sm font-black text-deep-navy tracking-widest">{offer.code}</span>
                                            </div>
                                        </div>
                                        <button className={`h-14 w-14 ${offer.accent} shadow-xl rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 hover:brightness-110`}>
                                            <ArrowRight className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .rotate-x-1 {
                    transform: rotateX(4deg);
                }
                .rotate-y-1 {
                    transform: rotateY(4deg);
                }
            `}</style>
        </section>
    );
};

export default FlightOffers;
