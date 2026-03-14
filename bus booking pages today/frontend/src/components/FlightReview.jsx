import React, { useState, useEffect } from 'react';
import { 
    Plane, 
    Clock, 
    ShieldCheck, 
    Check, 
    ChevronRight, 
    Info, 
    AlertTriangle, 
    Timer, 
    Headphones, 
    MessageSquare, 
    Phone, 
    Zap,
    Luggage,
    ArrowRight,
    HelpCircle,
    Shield
} from 'lucide-react';

const FlightReview = ({ flight, onNext }) => {
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const baggage = flight.baggageInfo || { cabin: '7 KG', checkIn: '15 KG' };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
            
            {/* Urgency & Timer Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-orange-50 border border-orange-100 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center animate-pulse">
                        <Timer className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-orange-900 uppercase tracking-widest">Fare Locked for {formatTime(timeLeft)}</p>
                        <p className="text-[10px] font-bold text-orange-700 mt-0.5">Price may increase after the timer expires. Book now!</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">Only {flight.availableSeats || 5} seats left!</span>
                </div>
            </div>

            {/* Main Flight Card */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden group">
                <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2.5 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                <img src={flight.airlineLogo || "/airlines/default.png"} alt={flight.airline} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                    {flight.airline}
                                    <span className="text-xs font-bold text-gray-400 border-l border-gray-200 pl-2 uppercase tracking-widest">{flight.flightNumber}</span>
                                </h2>
                                <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em]">{flight.aircraftType || 'Airbus A320'} • Economy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1.5 bg-green-50 rounded-full border border-green-100">
                                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest flex items-center gap-1.5">
                                    < Zap className="h-3 w-3" /> Refundable
                                </span>
                            </div>
                            <div className="px-4 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Promo Applied</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
                            {/* Departure */}
                            <div className="flex-1 text-center md:text-left space-y-3">
                                <div>
                                    <p className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                                        {flight.departureTime?.includes(':') ? flight.departureTime : (flight.departureTime ? new Date(flight.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '—')}
                                    </p>
                                    <p className="text-lg font-black text-[#003580] mt-1">
                                        {flight.from} - {flight.departureCity || flight.searchFrom || 'City'}
                                    </p>
                                </div>
                                <div className="inline-block px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Terminal {flight.fromTerminal || 'T2'}</span>
                                </div>
                            </div>

                            {/* Center Visualization */}
                            <div className="flex-1 w-full max-w-[200px] flex flex-col items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">{flight.duration}</span>
                                <div className="w-full h-px border-t-2 border-dashed border-blue-100 relative">
                                    <div className="absolute inset-0 flex items-center justify-center -translate-y-1/2">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-50 shadow-sm flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                            <Plane className="h-5 w-5 text-blue-600 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mt-4">{flight.stops || 'Non-stop'}</span>
                            </div>

                            {/* Arrival */}
                            <div className="flex-1 text-center md:text-right space-y-3">
                                <div>
                                    <p className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                                        {flight.arrivalTime?.includes(':') ? flight.arrivalTime : (flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '—')}
                                    </p>
                                    <p className="text-lg font-black text-[#003580] mt-1">
                                        {flight.to} - {flight.arrivalCity || flight.searchTo || 'City'}
                                    </p>
                                </div>
                                <div className="inline-block px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Terminal {flight.toTerminal || 'T3'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Baggage Quick Info Footer */}
                <div className="bg-gray-50/50 border-t border-gray-100 px-8 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <Luggage className="h-4 w-4 text-gray-400" />
                            <span className="text-[11px] font-bold text-gray-600">Cabin: <span className="text-gray-900 font-black">{baggage.cabin}</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Luggage className="h-4 w-4 text-gray-400" />
                            <span className="text-[11px] font-bold text-gray-600">Check-in: <span className="text-gray-900 font-black">{baggage.checkIn}</span></span>
                        </div>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                        View Detailed Baggage Policy <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Refund Policy Timeline Redesign */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-10">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        Smart Refund Protection
                    </h3>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                        Detailed Fare Rules <HelpCircle className="h-3 w-3" />
                    </button>
                </div>
                
                <div className="relative pt-6 pb-2">
                    {/* Progress Bar Background */}
                    <div className="absolute top-[42px] inset-x-8 h-2 bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                    </div>

                    <div className="flex justify-between relative px-2">
                        {/* Day 0 */}
                        <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-white border-4 border-blue-600 shadow-lg mb-4 z-10" />
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Booking</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Instant</p>
                        </div>
                        {/* Refund Deadline */}
                        <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-white border-4 border-emerald-500 shadow-lg mb-4 z-10" />
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Full Refund Window</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Till 24h Before</p>
                        </div>
                        {/* Departure */}
                        <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-white border-4 border-gray-200 shadow-md mb-4 z-10" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Departure</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Fly Away</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-emerald-900 leading-tight">Peace of Mind Guarantee</p>
                        <p className="text-[10px] font-bold text-emerald-700/80 mt-1">Get standard airline refund + instant processing in your wallet for any cancellations within the window.</p>
                    </div>
                </div>
            </div>

            {/* Customer Support Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { title: "24x7 Support", icon: Headphones, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
                    { title: "Live Chat", icon: MessageSquare, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
                    { title: "Call Support", icon: Phone, color: "bg-indigo-50 text-indigo-600", border: "border-indigo-100" },
                    { title: "WhatsApp 24/7", icon: Zap, color: "bg-green-50 text-green-600", border: "border-green-100" }
                ].map((item, i) => (
                    <div key={i} className={`p-5 rounded-2xl border ${item.border} ${item.color} bg-white flex flex-col items-center justify-center gap-3 hover:translate-y-[-4px] transition-all cursor-pointer shadow-sm`}>
                        <item.icon className="h-5 w-5" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-center">{item.title}</span>
                    </div>
                ))}
            </div>

            {/* Final CTA Container */}
            <div className="sticky bottom-6 z-30">
                <button 
                    onClick={onNext}
                    className="w-full py-6 bg-gradient-to-r from-[#f26a36] to-[#ff7e4d] hover:shadow-[0_15px_40px_-10px_rgba(242,106,54,0.5)] text-white rounded-3xl font-black text-xl uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden group border-b-4 border-orange-700"
                >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10 flex items-center gap-3">
                        Continue to Traveller Details 
                        <ChevronRight className="w-7 h-7 transition-transform group-hover:translate-x-1" />
                    </span>
                </button>
                <div className="mt-4 flex items-center justify-center gap-4">
                    <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 uppercase tracking-widest">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        Safe & Secure Checkout
                    </p>
                    <div className="h-1 w-1 rounded-full bg-gray-300" />
                    <p className="text-[10px] font-black text-[#003580] uppercase tracking-widest italic animate-pulse">
                        You will not be charged yet.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FlightReview;
