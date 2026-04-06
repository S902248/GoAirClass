import React, { useState } from 'react';
import { Headphones, Mail, MessageSquare, Phone, Search, ExternalLink, ShieldCheck, UserCheck, Bot, Ticket, RefreshCw, Calendar, Armchair } from 'lucide-react';

const Support = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const contactMethods = [
        {
            icon: Phone,
            title: "24/7 Helpline",
            value: "+91 1800-412-9000",
            desc: "Call our travel support team anytime",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            icon: Mail,
            title: "Email Support",
            value: "support@goairclass.com",
            desc: "Send your query via email",
            color: "text-[#f26a36]",
            bg: "bg-[#f26a36]/10",
        },
        {
            icon: MessageSquare,
            title: "WhatsApp Support",
            value: "+91 91234 56789",
            desc: "Chat instantly with our support team",
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            icon: Bot,
            title: "Live Chat",
            value: "Instant replies available",
            desc: "Talk with our AI travel assistant",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        }
    ];

    const popularTopics = [
        { icon: Ticket, text: "Track My Ticket" },
        { icon: ExternalLink, text: "Cancel Booking" },
        { icon: RefreshCw, text: "Request Refund" },
        { icon: Calendar, text: "Change Travel Date" },
        { icon: Armchair, text: "Seat Selection Help" }
    ];

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-24 bg-[#f8fafc] overflow-hidden">

            {/* Premium Background Design */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-pink-400/10 rounded-full blur-[140px]" />
                <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-purple-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] bg-[#f26a36]/5 rounded-full blur-[100px]" />
                
                {/* Abstract subtle travel elements */}
                <svg className="absolute top-20 left-0 w-full h-[600px] opacity-[0.02]" viewBox="0 0 1000 600" preserveAspectRatio="none">
                    <path d="M0,300 Q250,50 500,300 T1000,300" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10,10" />
                    <circle cx="250" cy="175" r="4" fill="currentColor" />
                    <circle cx="500" cy="300" r="4" fill="currentColor" />
                    <circle cx="750" cy="425" r="4" fill="currentColor" />
                </svg>
            </div>

            <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">

                {/* Hero Section */}
                <div className="text-center mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 w-full">
                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-[1.1]">
                        Customer{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-[#f26a36]">
                            Support
                        </span> Center
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed mt-6">
                        Our support team is available 24/7 to help you with bookings, ticket tracking, cancellations, and travel assistance.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-8 relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
                            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-[#f26a36] transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            className="w-full bg-white relative text-lg font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium rounded-full py-5 pl-16 pr-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border-2 border-white hover:border-slate-100 focus:border-[#f26a36] outline-none transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(242,106,54,0.1)]"
                            placeholder="Search help topics (booking, refund, cancellation...)" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Quick Help Topics */}
                <div className="w-full mb-16 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100 flex flex-col items-center">
                    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-6">Popular Help Topics</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {popularTopics.map((topic, idx) => (
                            <button key={idx} className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-sm border border-slate-100 hover:border-[#f26a36] hover:shadow-md hover:-translate-y-0.5 transition-all text-slate-700 hover:text-[#f26a36] group">
                                <topic.icon className="h-4 w-4 text-slate-400 group-hover:text-[#f26a36] transition-colors" />
                                <span className="text-sm font-bold tracking-wide">{topic.text}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16 animate-in fade-in zoom-in-95 duration-700 delay-200">
                    {contactMethods.map((method, idx) => {
                        const Icon = method.icon;
                        return (
                            <div key={idx} className="group relative">
                                <div className={`absolute inset-0 bg-white/40 blur-xl rounded-[40px] group-hover:${method.glow} transition-all duration-700`} />
                                <div className="relative bg-white/40 backdrop-blur-xl p-10 rounded-[40px] border border-white/60 shadow-[0_20px_50px_rgba(0_0_0_/_0.03)] hover:-translate-y-3 transition-all duration-500 overflow-hidden h-full flex flex-col">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Icon className="h-24 w-24 -rotate-12 translate-x-8 -translate-y-4" />
                                    </div>
                                    <div className={`${method.bg} ${method.color} w-20 h-20 rounded-[24px] mb-8 flex items-center justify-center group-hover:rotate-12 transition-all duration-500`}>
                                        <Icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-3">{method.title}</h3>
                                    <p className="text-2xl font-black text-deep-navy mb-3 tracking-tighter italic">{method.value}</p>
                                    <p className="text-gray-500/80 text-xs font-bold leading-relaxed">{method.desc}</p>
                                    <div className="mt-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-radiant-coral opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                                        Connect Now <ArrowRight className="h-3 w-3" />
                                    </div>
                                </div>
                                <h3 className="text-[15px] font-bold text-slate-800 mb-2">{method.title}</h3>
                                {idx === 1 ? (
                                    <a href={`mailto:${method.value}`} className={`text-[15px] font-black ${method.color} mb-3 tracking-tight hover:underline`}>{method.value}</a>
                                ) : (
                                    <p className={`text-[17px] font-black ${method.color} mb-3 tracking-tight`}>{method.value}</p>
                                )}
                                <p className="text-[13px] font-medium text-slate-500 leading-relaxed mt-auto">{method.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Trust Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full border-t border-slate-200 pt-12 animate-in fade-in duration-700 delay-300">
                    {[
                        { icon: Headphones, text: "24/7 Customer Support" },
                        { icon: Ticket, text: "Instant Ticket Assistance" },
                        { icon: ShieldCheck, text: "Secure Travel Booking" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center justify-center gap-3 text-slate-600">
                            <div className="bg-emerald-50 text-emerald-500 rounded-full p-2 border border-emerald-100">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <span className="text-[14px] font-bold text-slate-700">{item.text}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Support;
