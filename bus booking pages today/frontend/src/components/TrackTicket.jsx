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
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-32 pb-24 bg-[#f8fafc] overflow-hidden">

            {/* Background design consistent with CancelTicket */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-radiant-coral/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">

                {/* Header Section */}
                <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-radiant-coral/10 py-1.5 px-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-radiant-coral">
                        {isEmailSmsMode ? <Mail className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                        <span>{isEmailSmsMode ? 'Ticket Delivery' : 'Track Your Journey'}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-deep-navy tracking-tight leading-none uppercase italic">
                        {isEmailSmsMode ? 'Email / SMS' : 'Show My'} <span className="text-radiant-coral italic">Ticket</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm max-w-md mx-auto leading-relaxed">
                        {isEmailSmsMode
                            ? "Receive your E-Ticket details instantly on your registered mobile number or email."
                            : "Access your E-Ticket instantly by entering your booking details below."}
                    </p>
                </div>

                {/* Entry Card */}
                <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden mb-12 animate-in fade-in zoom-in-95 duration-700">
                    <div className="bg-gradient-to-r from-deep-navy to-[#1e1b4b] p-8 md:p-10 flex items-center gap-6">
                        <div className="bg-radiant-coral p-3.5 rounded-2xl shadow-lg ring-4 ring-white/10 text-white">
                            {isEmailSmsMode ? <Mail className="h-6 w-6 stroke-[3px]" /> : <Ticket className="h-6 w-6 stroke-[3px]" />}
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase italic leading-none">Enter Details</h2>
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Check your Email/SMS for Booking ID</p>
                        </div>
                    </div>

                    <div className="p-10 md:p-12 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Booking ID */}
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block group-focus-within:text-radiant-coral transition-colors">
                                    Booking ID / PNR
                                </label>
                                <div className="relative border-b-2 border-gray-50 focus-within:border-radiant-coral transition-all duration-500 flex items-center pb-3">
                                    <Search className="h-6 w-6 text-gray-300 group-focus-within/input:text-radiant-coral mr-4 transition-colors" />
                                    <input
                                        type="text"
                                        value={bookingId}
                                        onChange={(e) => setBookingId(e.target.value)}
                                        placeholder="Booking ID"
                                        className="w-full bg-transparent outline-none text-lg font-black text-deep-navy placeholder:text-gray-200 tracking-tight"
                                    />
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block group-focus-within:text-radiant-coral transition-colors">
                                    Mobile Number
                                </label>
                                <div className="relative border-b-2 border-gray-50 focus-within:border-radiant-coral transition-all duration-500 flex items-center pb-3">
                                    <Smartphone className="h-6 w-6 text-gray-300 group-focus-within/input:text-radiant-coral mr-4 transition-colors" />
                                    <input
                                        type="tel"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        placeholder="+91 - Mobile"
                                        className="w-full bg-transparent outline-none text-lg font-black text-deep-navy placeholder:text-gray-200 tracking-tight"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="w-full py-5 bg-gradient-to-r from-radiant-coral to-[#e11d48] text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-xl shadow-radiant-coral/20 hover:shadow-2xl hover:shadow-radiant-coral/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 group flex items-center justify-center gap-4"
                        >
                            <span>{isEmailSmsMode ? 'Send Ticket Details' : 'Fetch Ticket Details'}</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                        </button>
                    </div>
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
