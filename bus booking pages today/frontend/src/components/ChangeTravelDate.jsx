import React from 'react';
import { Ticket, Smartphone, Calendar, ArrowRight, ShieldCheck, AlertCircle, HelpCircle, RefreshCw } from 'lucide-react';

const ChangeTravelDate = () => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start bg-slate-50 overflow-hidden font-sans">

            {/* 1. HERO HEADER SECTION */}
            <div className="w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-32 pb-24 px-6 relative overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-10 w-64 h-64 bg-[#f26a36] rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
                    <svg className="absolute top-10 left-0 w-full h-[300px] opacity-[0.1]" viewBox="0 0 1000 300" preserveAspectRatio="none">
                        <path d="M0,150 Q250,50 500,150 T1000,150" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10,10" />
                    </svg>
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md py-2 px-4 rounded-full text-white border border-white/20 shadow-sm mb-6">
                        <Calendar className="h-4 w-4 text-[#f26a36]" />
                        <span className="text-[12px] font-bold tracking-widest uppercase">Date Rescheduling</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
                        Change Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">Travel Date</span>
                    </h1>
                    <p className="text-slate-300 font-medium text-lg max-w-xl mx-auto">
                        Quickly reschedule your journey using your ticket details.
                    </p>
                </div>
            </div>

            {/* 5. PAGE LAYOUT IMPROVEMENTS (2-Column Layout) */}
            <div className="w-full max-w-6xl mx-auto px-6 -mt-16 relative z-20 pb-24">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
                    
                    {/* Left Column: Visual/Illustration */}
                    <div className="w-full lg:w-5/12 hidden lg:flex flex-col items-center justify-center p-8 mt-12 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="relative w-full aspect-square max-w-sm">
                            {/* Abstract Travel Graphic Container */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-[#f8fafc] rounded-full shadow-inner border-4 border-white flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute top-8 right-8 w-20 h-20 bg-blue-100 rounded-full blur-xl animate-pulse" />
                                <div className="absolute bottom-8 left-8 w-32 h-32 bg-[#f26a36]/10 rounded-full blur-xl animate-pulse delay-1000" />
                                
                                <Calendar className="h-24 w-24 text-slate-300 mb-6 drop-shadow-sm" />
                                <div className="flex items-center gap-4 text-slate-400">
                                    <div className="w-12 h-2 bg-slate-200 rounded-full" />
                                    <RefreshCw className="h-6 w-6 text-[#f26a36]" />
                                    <div className="w-12 h-2 bg-slate-200 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-10">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Seamless Rescheduling</h3>
                            <p className="text-slate-500 font-medium mt-2">Modify your plans instantly with minimal hassle.</p>
                        </div>
                    </div>

                    {/* Right Column: 2. CENTERED BOOKING CARD */}
                    <div className="w-full lg:w-7/12 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden w-full max-w-2xl mx-auto">
                            
                            {/* Card Header */}
                            <div className="bg-white px-8 py-6 border-b border-slate-100 flex items-center gap-4">
                                <div className="bg-[#f26a36]/10 p-3 rounded-xl text-[#f26a36]">
                                    <RefreshCw className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Modify Travel Date</h2>
                                    <p className="text-slate-500 text-[13px] font-medium mt-1">Verification Required</p>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 space-y-8 bg-slate-50/50">
                                {/* Form Inputs */}
                                <div className="space-y-6">
                                    {/* Ticket Number */}
                                    <div className="group relative">
                                        <label className="text-[13px] font-bold text-slate-700 block mb-2 transition-colors">
                                            Ticket Number / PNR
                                        </label>
                                        <div className="relative flex items-center">
                                            <div className="absolute left-4 text-slate-400 group-focus-within:text-[#f26a36] transition-colors z-10">
                                                <Ticket className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="e.g. TKT12345678"
                                                className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-[#f26a36] outline-none text-base font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium tracking-wide rounded-2xl py-4 pl-12 pr-4 transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_rgba(242,106,54,0.1)]"
                                            />
                                        </div>
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="group relative">
                                        <label className="text-[13px] font-bold text-slate-700 block mb-2 transition-colors">
                                            Mobile Number
                                        </label>
                                        <div className="relative flex items-center">
                                            <div className="absolute left-4 text-slate-400 group-focus-within:text-[#f26a36] transition-colors z-10">
                                                <Smartphone className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="e.g. +91 9876543210"
                                                className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-[#f26a36] outline-none text-base font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium tracking-wide rounded-2xl py-4 pl-12 pr-4 transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_rgba(242,106,54,0.1)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. RESCHEDULING POLICY BOX */}
                                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/60 flex items-start gap-3 shadow-sm">
                                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="text-[13px] font-bold text-amber-900 mb-1">Important Note</p>
                                        <p className="text-[13px] font-medium text-amber-800/80 leading-relaxed">
                                            Rescheduling may include a <span className="font-bold text-amber-900">convenience fee</span>. Changes must be made at least 4 hours before departure.
                                        </p>
                                    </div>
                                </div>

                                {/* 4. PRIMARY ACTION BUTTON */}
                                <button className="w-full py-4 bg-gradient-to-r from-[#f26a36] to-[#ff8c5a] hover:to-[#f26a36] text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-[0_8px_25px_rgba(242,106,54,0.3)] hover:shadow-[0_12px_35px_rgba(242,106,54,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 group flex items-center justify-center gap-3">
                                    <span>Reschedule Journey</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* 6. ADDITIONAL UI ELEMENTS (Quick Help Links) */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4">
                            <button className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-[#f26a36] transition-colors group">
                                <Ticket className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>Track Ticket</span>
                            </button>
                            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                            <button className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-[#f26a36] transition-colors group">
                                <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>Cancellation Policy</span>
                            </button>
                            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                            <button className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-[#f26a36] transition-colors group">
                                <HelpCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>Contact Support</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChangeTravelDate;
