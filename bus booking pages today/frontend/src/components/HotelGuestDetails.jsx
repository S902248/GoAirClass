import React from 'react';
import { User, Phone, Mail, ChevronRight, Info, ShieldCheck } from 'lucide-react';

const HotelGuestDetails = ({ setView }) => {
    return (
        <div className="min-h-screen bg-[#F2F5F9] pt-24 pb-12 font-inter">
            <div className="max-w-4xl mx-auto px-8">
                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="flex items-center gap-2 text-green-600">
                        <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-xs">✓</div>
                        <span className="text-xs font-black uppercase tracking-widest">Review</span>
                    </div>
                    <div className="h-px w-12 bg-green-600" />
                    <div className="flex items-center gap-2 text-[#d84e55]">
                        <div className="h-8 w-8 rounded-full bg-[#d84e55] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-red-200">2</div>
                        <span className="text-xs font-black uppercase tracking-widest">Guests</span>
                    </div>
                    <div className="h-px w-12 bg-gray-200" />
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="h-8 w-8 rounded-full bg-gray-200 text-white flex items-center justify-center font-black text-xs">3</div>
                        <span className="text-xs font-black uppercase tracking-widest">Payment</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Guest Information */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-deep-navy tracking-tight mb-8">Guest Details</h3>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <input type="text" placeholder="Same as ID proof" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] focus:ring-4 focus:ring-red-500/5 transition-all" />
                                            <User className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                                        <input type="number" placeholder="Years" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] focus:ring-4 focus:ring-red-500/5 transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Details</label>
                                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Ticket info will be sent here</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="relative">
                                            <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] focus:ring-4 focus:ring-red-500/5 transition-all" />
                                            <Mail className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                        </div>
                                        <div className="relative">
                                            <input type="tel" placeholder="Mobile Number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] focus:ring-4 focus:ring-red-500/5 transition-all" />
                                            <Phone className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Requests */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-deep-navy tracking-tight mb-6 flex items-center gap-3">
                                Special Requests
                                <span className="text-[10px] font-black bg-gray-50 px-3 py-1 rounded-full text-gray-400 uppercase tracking-widest">Optional</span>
                            </h3>
                            <textarea
                                placeholder="Any specific requirements? (e.g. Early check-in, Smoking room, Housekeeping)"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] transition-all min-h-[120px] resize-none"
                            />
                        </div>
                    </div>

                    <div>
                        {/* Fare Summary */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-deep-navy tracking-tight mb-8">Price Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Amount</div>
                                        <div className="text-3xl font-black text-[#d84e55]">₹7,950</div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setView('hotel-payment')}
                                className="w-full bg-[#d84e55] text-white rounded-2xl py-5 mt-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200/50 hover:bg-[#c13e44] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                            >
                                <span>Proceed to Payment</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelGuestDetails;
