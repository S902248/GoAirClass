import React from 'react';
import { XCircle, Percent, Clock, AlertCircle, PhoneCall } from 'lucide-react';

const CancellationPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 font-sans">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Header */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-red-50 text-red-500 p-4 rounded-2xl shadow-sm border border-red-100">
                            <XCircle className="h-8 w-8" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Cancellation <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Policy</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed border-l-4 border-red-500 pl-6">
                        Need to cancel a trip? Here's exactly how cancellation charges are calculated based on when you cancel your booking prior to departure.
                    </p>
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <AlertCircle className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-blue-900 mb-1">Important Disclaimer</h3>
                        <p className="text-sm font-medium text-blue-800/80 leading-relaxed">
                            Cancellation charges depend heavily on the specific bus operator. Detailed cancellation terms specific to your ticket are always available on your final E-Ticket.
                        </p>
                    </div>
                </div>

                {/* Standard Deduction Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 relative">
                    <Percent className="absolute top-0 right-0 h-48 w-48 text-slate-50 opacity-50 -mt-10 -mr-10 pointer-events-none" />
                    
                    <div className="p-8 border-b border-slate-100 relative z-10">
                        <h2 className="text-xl font-black text-slate-800">Standard Deduction Slabs</h2>
                        <p className="text-sm text-slate-400 font-medium">Example of standard charges applied by most operators.</p>
                    </div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-8 py-4 border-b border-slate-200">Time Before Departure</th>
                                    <th className="px-8 py-4 border-b border-slate-200">Cancellation Charge</th>
                                    <th className="px-8 py-4 border-b border-slate-200 hidden sm:table-cell">Refund Eligibility</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold text-slate-700">
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-emerald-500" /> More than 24 hours
                                    </td>
                                    <td className="px-8 py-5 border-b border-slate-100 text-emerald-600">10% - 15%</td>
                                    <td className="px-8 py-5 border-b border-slate-100 hidden sm:table-cell font-medium text-slate-500">Maximum Refund</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-amber-500" /> Between 12 to 24 hours
                                    </td>
                                    <td className="px-8 py-5 border-b border-slate-100 text-amber-600">25% - 30%</td>
                                    <td className="px-8 py-5 border-b border-slate-100 hidden sm:table-cell font-medium text-slate-500">Partial Refund</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-[#f26a36]" /> Between 6 to 12 hours
                                    </td>
                                    <td className="px-8 py-5 border-b border-slate-100 text-[#f26a36]">50%</td>
                                    <td className="px-8 py-5 border-b border-slate-100 hidden sm:table-cell font-medium text-slate-500">Low Refund</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors bg-red-50/30">
                                    <td className="px-8 py-5 flex items-center gap-3 text-red-600">
                                        <Clock className="h-4 w-4 text-red-500" /> Less than 6 hours
                                    </td>
                                    <td className="px-8 py-5 text-red-600 font-black">100%</td>
                                    <td className="px-8 py-5 hidden sm:table-cell font-black text-red-500 uppercase tracking-wider text-xs">No Refund</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-slate-50 p-6 border-t border-slate-100 text-xs font-medium text-slate-500 leading-relaxed relative z-10">
                        * Flat cancellation charges (e.g., ₹50) might apply depending on the operator. Platform convenience and service fees are strictly non-refundable regardless of the cancellation window.
                    </div>
                </div>

                {/* Support Block */}
                <div className="mt-16 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-16 duration-700">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#f26a36]/5 mix-blend-overlay pointer-events-none" />
                    <PhoneCall className="h-10 w-10 text-[#f26a36] mx-auto mb-4" />
                    <h2 className="text-2xl font-black mb-2">Need Help Canceling?</h2>
                    <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto text-sm">
                        You can cancel your tickets directly from the "Track Ticket" or "My Bookings" sections. If you're experiencing issues, our 24/7 support team is on standby.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-full sm:w-auto bg-[#f26a36] hover:bg-white hover:text-slate-900 border-2 border-[#f26a36] px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg">
                            Track & Cancel
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CancellationPolicy;
