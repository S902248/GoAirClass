import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Calendar, Clock, User, Armchair, ChevronLeft, Search, Ticket, Smartphone, HelpCircle, ArrowRight, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

const TrackTicket = ({ isEmailSmsMode = false }) => {
    const [openFaq, setOpenFaq] = useState(-1);
    const [bookingId, setBookingId] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const faqs = [
        {
            question: "How to track my booking?",
            answer: "Enter your Booking ID and Passenger Mobile number to view your ticket details. You can download or print your E-ticket from the result page."
        },
        {
            question: "Where can I find my Booking ID?",
            answer: "Your Booking ID/PNR is sent to your registered mobile number and email address immediately after a successful payment."
        },
        {
            question: "Can I track guest bookings?",
            answer: "Yes, both guest and registered users can track their tickets using the Booking ID and Mobile Number."
        },
        {
            question: "What if I haven't received my SMS/Email?",
            answer: "If you haven't received your ticket within 30 minutes of booking, please contact our 24/7 support team with your transaction details."
        }
    ];

    const handleSearch = () => {
        if (bookingId.trim() && mobileNumber.trim()) {
            setShowResult(true);
        } else {
            alert('Please enter both Booking ID and Mobile Number');
        }
    };

    const handleDownload = () => {
        window.print();
    };

    const handleSendTicket = () => {
        setIsSent(true);
        setTimeout(() => setIsSent(false), 3000);
    };

    if (showResult) {
        return (
            <div className="min-h-screen bg-[#f8fafc] pt-28 pb-12">
                <div className="max-w-4xl mx-auto px-4">
                    <button
                        onClick={() => {
                            setShowResult(false);
                            setIsSent(false);
                        }}
                        className="flex items-center gap-2 text-gray-400 hover:text-radiant-coral font-black text-[10px] uppercase tracking-widest mb-8 transition-all group no-print"
                    >
                        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Search
                    </button>

                    <div id="ticket-print-area" className="bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-700">
                        {/* Ticket Left Side: Main Info */}
                        <div className="flex-1 p-10 md:p-12 border-b md:border-b-0 md:border-r border-dashed border-gray-100 relative">
                            {/* Decorative semi-circles for ticket punch effect */}
                            <div className="hidden md:block absolute -top-4 -right-4 w-8 h-8 bg-[#f8fafc] rounded-full border border-gray-100 no-print" />
                            <div className="hidden md:block absolute -bottom-4 -right-4 w-8 h-8 bg-[#f8fafc] rounded-full border border-gray-100 no-print" />

                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-2xl font-black text-deep-navy tracking-tight italic">Premium Express</h2>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">GAC Assured Service</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Confirmed</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12 mb-12">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Boarding Time</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-radiant-coral/5 rounded-lg">
                                            <Clock className="h-4 w-4 text-radiant-coral" />
                                        </div>
                                        <span className="text-xl font-black text-deep-navy">21:00</span>
                                    </div>
                                    <p className="font-black text-gray-400 text-[10px] uppercase tracking-tighter">20 Feb, 2026</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Arrival Time</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <span className="text-xl font-black text-deep-navy">05:30</span>
                                    </div>
                                    <p className="font-black text-gray-400 text-[10px] uppercase tracking-tighter">21 Feb, 2026</p>
                                </div>
                            </div>

                            <div className="space-y-8 mb-4">
                                <div className="flex gap-5">
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="w-2.5 h-2.5 rounded-full border-2 border-radiant-coral bg-white" />
                                        <div className="w-[1.5px] h-12 bg-gray-50 my-1" />
                                        <MapPin className="h-5 w-5 text-deep-navy" />
                                    </div>
                                    <div className="space-y-8">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-deep-navy">Pune (Boarding)</p>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Wakad Highway, Opp Ginger Hotel</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-deep-navy">Mumbai (Dropping)</p>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Sion Circle, Near Highway</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Right Side: Details & QR */}
                        <div className="w-full md:w-80 bg-gray-50/30 p-10 md:p-12 flex flex-col justify-between">
                            <div className="space-y-10">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Booking ID</p>
                                    <p className="text-xl font-black text-radiant-coral tracking-tighter">{bookingId}</p>
                                </div>

                                <div className="space-y-5 pt-8 border-t border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Passenger</p>
                                            <p className="text-[11px] font-black text-deep-navy uppercase">Rahul Sharma</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                                            <Armchair className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Seat No</p>
                                            <p className="text-[11px] font-black text-deep-navy uppercase tracking-widest">L14, L15</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-4 shadow-sm">
                                    <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-100 p-2">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`}
                                            alt="QR"
                                            className="w-full h-full object-contain opacity-80"
                                        />
                                    </div>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">GAC digital pass</p>
                                </div>
                            </div>

                            {isEmailSmsMode ? (
                                <button
                                    onClick={handleSendTicket}
                                    className={`w-full font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all mt-8 no-print shadow-xl flex items-center justify-center gap-2 ${isSent ? 'bg-green-500 text-white shadow-green-500/10' : 'bg-deep-navy text-white shadow-deep-navy/10 hover:bg-[#1e1b4b]'}`}
                                >
                                    {isSent ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Ticket Sent!
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="h-4 w-4" />
                                            Send via SMS/Email
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleDownload}
                                    className="w-full bg-deep-navy hover:bg-[#1e1b4b] text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all mt-8 no-print shadow-xl shadow-deep-navy/10"
                                >
                                    Get E-Ticket
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-24 bg-[#f8fafc] overflow-hidden">

            {/* Premium Background Design */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#f26a36]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]" />
                {/* Abstract flight path lines */}
                <svg className="absolute top-20 left-0 w-full h-[500px] opacity-[0.03]" viewBox="0 0 1000 500" preserveAspectRatio="none">
                    <path d="M0,250 Q250,50 500,250 T1000,250" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10,10" />
                    <path d="M0,150 Q250,350 500,150 T1000,150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,15" />
                </svg>
            </div>

            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">

                {/* Header Section - Redesigned */}
                <div className="text-center mb-10 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#f26a36]/10 py-2 px-4 rounded-full text-[#f26a36] border border-[#f26a36]/20 shadow-sm">
                        {isEmailSmsMode ? <Mail className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                        <span className="text-[12px] font-bold tracking-widest uppercase">{isEmailSmsMode ? 'Ticket Delivery' : 'Track Your Journey'}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-[1.1]">
                        Track Your{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-[#f26a36]">
                            Booking
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-500 font-medium text-base md:text-lg max-w-lg mx-auto leading-relaxed mt-4">
                        {isEmailSmsMode
                            ? "Enter your details to receive your E-Ticket instantly on your mobile or email."
                            : "Enter your Booking ID and Mobile Number to instantly access your ticket details."}
                    </p>
                </div>

                {/* Entry Card - Premium Redesign */}
                <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden mb-12 animate-in fade-in zoom-in-95 duration-700">
                    {/* Gradient Top Bar */}
                    <div className="bg-gradient-to-r from-slate-900 to-[#1e1b4b] p-8 flex items-center gap-5">
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white">
                            {isEmailSmsMode ? <Mail className="h-6 w-6 stroke-[2px]" /> : <Ticket className="h-6 w-6 stroke-[2px]" />}
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Enter Your Booking Details</h2>
                            <p className="text-slate-300 text-[13px] font-medium mt-1">Find your Booking ID in your confirmation email or SMS.</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 space-y-8 bg-white/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Booking ID */}
                            <div className="space-y-2 group">
                                <label className="text-[13px] font-bold text-slate-700 block transition-colors">
                                    Booking ID / PNR
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-slate-400 group-focus-within:text-[#f26a36] transition-colors z-10">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={bookingId}
                                        onChange={(e) => setBookingId(e.target.value)}
                                        placeholder="e.g. GOA123456"
                                        className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 focus:border-[#f26a36] outline-none text-base font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium tracking-wide rounded-2xl py-4 pl-12 pr-4 transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_rgba(242,106,54,0.1)]"
                                    />
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-2 group">
                                <label className="text-[13px] font-bold text-slate-700 block transition-colors">
                                    Mobile Number
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-slate-400 group-focus-within:text-[#f26a36] transition-colors z-10">
                                        <Smartphone className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        placeholder="e.g. +91 9876543210"
                                        className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 focus:border-[#f26a36] outline-none text-base font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium tracking-wide rounded-2xl py-4 pl-12 pr-4 transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_rgba(242,106,54,0.1)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="pt-2">
                            <button
                                onClick={handleSearch}
                                className="w-full py-4 bg-gradient-to-r from-[#f26a36] to-[#ff8c5a] hover:to-[#f26a36] text-white rounded-full font-black text-sm tracking-widest uppercase shadow-[0_8px_25px_rgba(242,106,54,0.3)] hover:shadow-[0_12px_35px_rgba(242,106,54,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 group flex items-center justify-center gap-3"
                            >
                                <span>{isEmailSmsMode ? 'Send Ticket Details' : 'Track Ticket'}</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Help Footer */}
                    <div className="bg-slate-50 border-t border-slate-100 p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span className="text-[13px] font-bold text-slate-800">Can't find your Booking ID?</span>
                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] font-medium text-slate-500">
                                <a href="#" className="hover:text-[#f26a36] transition-colors hover:underline">Check Email</a>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <a href="#" className="hover:text-[#f26a36] transition-colors hover:underline">Check SMS</a>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <a href="#" className="hover:text-[#f26a36] transition-colors hover:underline font-bold text-[#f26a36]">Contact Support</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full mb-12 border-b border-slate-200 pb-12">
                    {[
                        { icon: ShieldCheck, text: "Secure Ticket Lookup" },
                        { icon: Ticket, text: "Instant Ticket Access" },
                        { icon: HelpCircle, text: "24/7 Customer Support" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-2 text-slate-600">
                            <div className="bg-emerald-50 text-emerald-500 rounded-full p-1.5 border border-emerald-100">
                                <item.icon className="h-4 w-4" />
                            </div>
                            <span className="text-[13px] font-bold">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Simplified FAQ Section */}
                <div className="w-full max-w-2xl bg-white/50 backdrop-blur-sm rounded-[32px] border border-white p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <HelpCircle className="h-5 w-5 text-radiant-coral" />
                        </div>
                        <h2 className="text-xl font-black text-deep-navy tracking-tight italic uppercase">Quick FAQs</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-50 overflow-hidden shadow-sm hover:border-radiant-coral/20 transition-all">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                    className="w-full flex items-center justify-between p-5 text-left group"
                                >
                                    <span className={`text-[12px] font-black uppercase tracking-tight transition-colors ${openFaq === index ? 'text-radiant-coral' : 'text-deep-navy group-hover:text-radiant-coral'}`}>
                                        {faq.question}
                                    </span>
                                    {openFaq === index ? (
                                        <ChevronUp className="h-4 w-4 text-radiant-coral transition-all" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-300 transition-all" />
                                    )}
                                </button>
                                {openFaq === index && (
                                    <div className="p-5 pt-0 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-[12px] font-bold text-gray-400 leading-relaxed italic">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Helpful Contact Link */}
                <div className="mt-12">
                    <button className="text-[10px] font-black text-gray-300 hover:text-radiant-coral uppercase tracking-[0.3em] transition-colors flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        <span>Need further assistance?</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackTicket;
