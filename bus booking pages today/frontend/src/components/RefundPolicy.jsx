import React from 'react';
import { RefreshCcw, ShieldCheck, Clock, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 font-sans">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Header */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-[#f26a36]/10 text-[#f26a36] p-4 rounded-2xl shadow-sm">
                            <RefreshCcw className="h-8 w-8" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Refund <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">Policy</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed border-l-4 border-[#f26a36] pl-6">
                        We believe in transparent pricing and clear policies. This document details our refund structure, timelines, and exactly what to expect when a booking is modified or canceled.
                    </p>
                </div>

                {/* Content Cards */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-700">
                    
                    {/* General Rules */}
                    <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                        <ShieldCheck className="absolute top-0 right-0 h-48 w-48 text-slate-50 opacity-50 -mt-10 -mr-10 pointer-events-none" />
                        <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2 relative z-10">
                            1. General Refund Rules
                        </h2>
                        <ul className="space-y-4 text-slate-500 font-medium relative z-10 ml-6 list-disc marker:text-[#f26a36]">
                            <li>Base ticket fares are refundable subject to the cancellation policy active at the time of booking.</li>
                            <li><strong>Service fees and convenience fees are strictly non-refundable</strong> under any circumstances.</li>
                            <li>Taxes (GST) applied on the ticket fare will be refunded proportionally.</li>
                            <li>Promotional discounts applied will be deducted proportionally from the final refund amount.</li>
                        </ul>
                    </div>

                    {/* Timelines */}
                    <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                        <Clock className="absolute top-0 right-0 h-48 w-48 text-slate-50 opacity-50 -mt-10 -mr-10 pointer-events-none" />
                        <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2 relative z-10">
                            2. Refund Processing Timelines
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mt-6">
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                                <CreditCard className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                                <h4 className="font-bold text-slate-800 text-sm">Wallets / UPI</h4>
                                <p className="text-[#f26a36] font-black text-lg mt-1">Instant</p>
                                <p className="text-xs text-slate-400 mt-1">Up to 24 Hours max</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                                <CreditCard className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                                <h4 className="font-bold text-slate-800 text-sm">Credit/Debit Cards</h4>
                                <p className="text-[#f26a36] font-black text-lg mt-1">3 - 5 Days</p>
                                <p className="text-xs text-slate-400 mt-1">Bank working days</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                                <CreditCard className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                                <h4 className="font-bold text-slate-800 text-sm">Net Banking</h4>
                                <p className="text-[#f26a36] font-black text-lg mt-1">5 - 7 Days</p>
                                <p className="text-xs text-slate-400 mt-1">Bank working days</p>
                            </div>
                        </div>
                    </div>

                    {/* Edge Cases */}
                    <div className="bg-red-50 p-8 md:p-10 rounded-3xl border border-red-100/50 relative overflow-hidden">
                        <AlertTriangle className="absolute top-0 right-0 h-48 w-48 text-red-500 opacity-5 -mt-10 -mr-10 pointer-events-none" />
                        <h2 className="text-xl font-black text-red-900 mb-4 flex items-center gap-2 relative z-10">
                            3. Operator Cancellations & Delays
                        </h2>
                        <ul className="space-y-4 text-red-800/80 font-medium relative z-10 ml-6 list-disc marker:text-red-400">
                            <li>If a bus/flight is canceled completely by the operator, you are eligible for a <strong>100% full refund</strong> (including convenience fees).</li>
                            <li>Delays caused by natural disasters, strikes, or unavoidable traffic do not qualify for a full refund.</li>
                            <li>No-Shows (where the passenger fails to board) are <strong>not</strong> eligible for any refund.</li>
                        </ul>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 text-center animate-in fade-in slide-in-from-bottom-16 duration-700">
                    <p className="text-sm font-bold text-slate-400 mb-4">Last updated: March 2026</p>
                    <button className="bg-white border-2 border-slate-200 hover:border-[#f26a36] text-slate-600 hover:text-[#f26a36] px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm inline-flex items-center gap-2">
                        Contact Refund Support <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RefundPolicy;
