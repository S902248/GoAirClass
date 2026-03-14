import React from 'react';
import { Train, ArrowRight, ShieldCheck, CreditCard, ChevronRight, Info, Zap } from 'lucide-react';

const TrainReview = ({ setView }) => {
    return (
        <div className="min-h-screen bg-[#F2F5F9] pt-24 pb-12 font-inter">
            <div className="max-w-4xl mx-auto px-8">
                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="flex items-center gap-2 text-[#d84e55]">
                        <div className="h-8 w-8 rounded-full bg-[#d84e55] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-red-200">1</div>
                        <span className="text-xs font-black uppercase tracking-widest">Review</span>
                    </div>
                    <div className="h-px w-12 bg-gray-200" />
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="h-8 w-8 rounded-full bg-white text-gray-400 border border-gray-200 flex items-center justify-center font-black text-xs">2</div>
                        <span className="text-xs font-black uppercase tracking-widest">Travelers</span>
                    </div>
                    <div className="h-px w-12 bg-gray-200" />
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="h-8 w-8 rounded-full bg-white text-gray-400 border border-gray-200 flex items-center justify-center font-black text-xs">3</div>
                        <span className="text-xs font-black uppercase tracking-widest">Payment</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Train Details Card */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#d84e55]">
                                    <Train className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-deep-navy tracking-tight">Mumbai Rajdhani</h3>
                                    <span className="text-[10px] font-black text-[#d84e55] bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-widest">#12951 • 2A Class</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-8 border-t border-b border-gray-50 mb-8">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-deep-navy">16:30</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">New Delhi (NDLS)</div>
                                    <div className="text-xs font-bold text-gray-500 mt-1">20 Feb, Fri</div>
                                </div>
                                <div className="flex-1 px-12 text-center">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">16h 05m</div>
                                    <div className="h-px bg-gray-100 w-full relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-gray-200 bg-white">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-deep-navy">08:35</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Mumbai Central (MMCT)</div>
                                    <div className="text-xs font-bold text-gray-500 mt-1">21 Feb, Sat</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-4">
                                <Info className="h-5 w-5 text-[#d84e55] flex-shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-wider">
                                    Boarding at <span className="text-deep-navy">NDLS - New Delhi</span> on 20 Feb, 16:30. Please arrive 30 minutes before departure.
                                </p>
                            </div>
                        </div>

                        {/* Why Book with us */}
                        <div className="bg-gradient-to-br from-[#d84e55] to-[#e13552] rounded-[32px] p-8 text-white shadow-xl shadow-red-100">
                            <h4 className="text-xl font-black mb-6">Benefits of Booking on GoAir</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">₹0 Gateway Fee</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">Instant Refund</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Fare Summary */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Fare Summary</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm font-bold text-gray-500">Base Fare</span>
                                    <span className="text-sm font-black text-deep-navy">₹2,850</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-bold text-gray-500">Service Fee</span>
                                    <span className="text-sm font-black text-green-600">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between">
                                    <span className="text-lg font-black text-deep-navy">To Pay</span>
                                    <span className="text-lg font-black text-[#d84e55]">₹2,850</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setView('train-passengers')}
                                className="w-full bg-[#d84e55] text-white rounded-2xl py-5 mt-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200/50 hover:bg-[#c13e44] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                            >
                                <span>Proceed to Travelers</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainReview;
