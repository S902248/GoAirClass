import React from 'react';
import { Ticket, Smartphone, Calendar, ArrowRight, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

const ChangeTravelDate = () => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-32 pb-24 bg-[#f8fafc] overflow-hidden">

            {/* Background design consistent with other Manage Booking views */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-radiant-coral/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">

                {/* Header Section */}
                <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-radiant-coral/10 py-1.5 px-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-radiant-coral">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Date Rescheduling</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-deep-navy tracking-tight leading-none uppercase italic">
                        Change Travel <span className="text-radiant-coral italic">Date</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm max-w-md mx-auto leading-relaxed">
                        Need to push your trip? Quickly reschedule your journey by entering your booking details.
                    </p>
                </div>

                {/* Main Card */}
                <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-700">

                    {/* Header Bar */}
                    <div className="bg-gradient-to-r from-deep-navy to-[#1e1b4b] p-8 md:p-10 flex items-center gap-6">
                        <div className="bg-radiant-coral p-3.5 rounded-2xl shadow-lg ring-4 ring-white/10 text-white">
                            <Ticket className="h-6 w-6 stroke-[3px]" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase italic leading-none">Modify Date</h2>
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Instant Verification Required</p>
                        </div>
                    </div>

                    <div className="p-10 md:p-12 space-y-10">
                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Booking ID */}
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block group-focus-within:text-radiant-coral transition-colors">
                                    Ticket Number
                                </label>
                                <div className="relative border-b-2 border-gray-50 group-focus-within:border-radiant-coral transition-all duration-500 flex items-center pb-3">
                                    <Ticket className="h-6 w-6 text-gray-300 group-focus-within:text-radiant-coral mr-4 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Enter Ticket No"
                                        className="w-full bg-transparent outline-none text-lg font-black text-deep-navy placeholder:text-gray-200 tracking-tight"
                                    />
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block group-focus-within:text-radiant-coral transition-colors">
                                    Mobile Number
                                </label>
                                <div className="relative border-b-2 border-gray-50 group-focus-within:border-radiant-coral transition-all duration-500 flex items-center pb-3">
                                    <Smartphone className="h-6 w-6 text-gray-300 group-focus-within:text-radiant-coral mr-4 transition-colors" />
                                    <input
                                        type="tel"
                                        placeholder="+91 - Mobile"
                                        className="w-full bg-transparent outline-none text-lg font-black text-deep-navy placeholder:text-gray-200 tracking-tight"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
                            <AlertCircle className="h-5 w-5 text-radiant-coral shrink-0 mt-0.5" />
                            <div className="space-y-1 text-left">
                                <p className="text-[11px] font-black text-deep-navy uppercase tracking-widest">Rescheduling Policy</p>
                                <p className="text-[12px] font-bold text-gray-400 leading-relaxed italic">
                                    Rescheduling is subject to operator availability and may incur a <span className="text-radiant-coral font-black">convenience fee</span>. Changes must be made at least 4 hours before departure.
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button className="w-full py-5 bg-gradient-to-r from-radiant-coral to-[#e11d48] text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-xl shadow-radiant-coral/20 hover:shadow-2xl hover:shadow-radiant-coral/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 group flex items-center justify-center gap-4">
                            <span>Reschedule Journey</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Help Link */}
                <div className="mt-8">
                    <button className="text-[10px] font-black text-gray-300 hover:text-radiant-coral uppercase tracking-[0.3em] transition-colors flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        <span>Policy documentation & help</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeTravelDate;
