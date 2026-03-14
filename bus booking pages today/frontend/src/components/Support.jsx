import React, { useState } from 'react';
import { Headphones, Mail, MessageSquare, Phone, ChevronDown, ChevronUp, Search, ExternalLink, ShieldCheck, Clock, UserCheck, ArrowRight } from 'lucide-react';

const Support = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const faqs = [
        {
            question: "How do I book a bus ticket?",
            answer: "Simply enter your departure and destination cities, select your travel date, and click 'Search'. Browse available buses, select your preferred seat, and proceed to payment."
        },
        {
            question: "Can I cancel my ticket?",
            answer: "Yes, you can cancel your ticket through the 'Manage Booking' section. Cancellation charges depend on the operator's policy and the time remaining before departure."
        },
        {
            question: "How do I get a refund for a cancelled ticket?",
            answer: "Refunds are processed automatically to your original payment method within 5-7 business days of cancellation."
        },
        {
            question: "What is the policy for rescheduling?",
            answer: "Rescheduling depends on the bus operator. You can check the rescheduling options in the 'Manage Booking' section or contact our support team."
        },
        {
            question: "Is there a women-only seat option?",
            answer: "Yes, we offer special seats for women travelers. Look for the pink 'Women Only' toggle or icon during seat selection."
        }
    ];

    const contactMethods = [
        {
            icon: Phone,
            title: "24/7 Helpline",
            value: "+91 1800-412-9000",
            desc: "For urgent booking assistance",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            glow: "shadow-blue-200/50"
        },
        {
            icon: Mail,
            title: "Email Support",
            value: "support@goairclass.com",
            desc: "Get response within 2-4 hours",
            color: "text-radiant-coral",
            bg: "bg-radiant-coral/10",
            glow: "shadow-radiant-coral/20"
        },
        {
            icon: MessageSquare,
            title: "WhatsApp",
            value: "+91 91234-56789",
            desc: "Chat with our support agent",
            color: "text-green-500",
            bg: "bg-green-500/10",
            glow: "shadow-green-200/50"
        }
    ];

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative min-h-screen bg-[#f8fafc] pt-32 pb-24 overflow-hidden">

            {/* Premium Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-radiant-coral/10 rounded-full blur-[140px] animate-pulse duration-[10s]" />
                <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[35%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse duration-[8s]" />
                <div className="absolute top-[40%] right-[10%] w-64 h-64 border-2 border-gray-100 rounded-full opacity-30 animate-spin-slow" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">

                {/* Refined Header Section */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md py-2 px-6 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-radiant-coral shadow-sm border border-white mb-8">
                        <Headphones className="h-4 w-4 animate-bounce" />
                        <span>Support Center</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-deep-navy tracking-tight leading-none uppercase italic mb-8">
                        How can we <span className="text-radiant-coral italic">help you?</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm max-w-lg mx-auto leading-loose uppercase tracking-tighter opacity-80">
                        Experience world-class assistance 24/7. Our team is dedicated to making <span className="text-deep-navy">every journey</span> seamless.
                    </p>
                </div>

                {/* Glassmorphism Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
                    {contactMethods.map((method, idx) => {
                        const Icon = method.icon;
                        return (
                            <div key={idx} className="group relative">
                                <div className={`absolute inset-0 bg-white/40 blur-xl rounded-[40px] group-hover:${method.glow} transition-all duration-700`} />
                                <div className="relative bg-white/40 backdrop-blur-xl p-10 rounded-[40px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:-translate-y-3 transition-all duration-500 overflow-hidden h-full flex flex-col">
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
                            </div>
                        );
                    })}
                </div>

                {/* Polished FAQ Section */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-white/50 blur-3xl rounded-[60px] opacity-50 transition-opacity duration-1000" />
                    <div className="relative bg-white/60 backdrop-blur-2xl rounded-[50px] p-10 md:p-16 border border-white shadow-2xl overflow-hidden">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16 relative z-10">
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black text-deep-navy tracking-tighter italic">Common Enquiries</h2>
                                <div className="w-16 h-2 bg-radiant-coral rounded-full group-hover:w-32 transition-all duration-700" />
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.25em]">Instant answers at your fingertips</p>
                            </div>
                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-radiant-coral" />
                                <input
                                    type="text"
                                    placeholder="Search topic or keyword..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-8 py-5 bg-white border-2 border-gray-50 focus:border-radiant-coral/20 rounded-3xl outline-none text-sm font-black text-deep-navy transition-all shadow-sm focus:shadow-xl focus:shadow-radiant-coral/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-5 relative z-10">
                            {filteredFaqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className={`group/item border-2 rounded-[32px] transition-all duration-500 ${activeFaq === idx ? 'border-radiant-coral/10 bg-white shadow-xl' : 'border-gray-50/50 hover:border-gray-100 bg-white/20'}`}
                                >
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-8 text-left"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className={`text-[12px] font-black w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeFaq === idx ? 'bg-radiant-coral text-white scale-125' : 'bg-gray-50 text-gray-300 group-hover/item:bg-deep-navy group-hover/item:text-white'}`}>
                                                {idx + 1}
                                            </span>
                                            <span className={`text-xl font-black tracking-tight leading-none transition-colors ${activeFaq === idx ? 'text-radiant-coral' : 'text-deep-navy'}`}>
                                                {faq.question}
                                            </span>
                                        </div>
                                        <div className={`p-2 rounded-2xl transition-all duration-500 ${activeFaq === idx ? 'bg-radiant-coral text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover/item:bg-white'}`}>
                                            <ChevronDown className="h-6 w-6" />
                                        </div>
                                    </button>
                                    {activeFaq === idx && (
                                        <div className="px-10 md:px-20 pb-10 animate-in slide-in-from-top-4 duration-500">
                                            <div className="h-px bg-gray-50 mb-8" />
                                            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-3xl uppercase tracking-tighter">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Trust Indicators */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">
                    {[
                        { icon: ShieldCheck, label: "Encrypted Payments" },
                        { icon: Clock, label: "Always Active" },
                        { icon: UserCheck, label: "Official Partners" },
                        { icon: ExternalLink, label: "Seamless Refunds" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 group/trust">
                            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm group-hover/trust:text-radiant-coral transition-all">
                                <item.icon className="h-10 w-10" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-deep-navy">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Support;
