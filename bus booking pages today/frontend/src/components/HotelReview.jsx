import React from 'react';
import { Hotel, Calendar, Users, ShieldCheck, ChevronRight, Info, Star, MapPin } from 'lucide-react';

const HotelReview = ({ setView }) => {
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
                        <div className="h-8 w-8 rounded-full bg-gray-200 text-white flex items-center justify-center font-black text-xs">2</div>
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
                        {/* Hotel Summary */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-full -mr-16 -mt-16 blur-2xl" />

                            <div className="flex gap-6 relative z-10">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Hotel" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-deep-navy tracking-tight mb-2">Grand Regency Hotel</h2>
                                    <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                                        <MapPin className="h-4 w-4" />
                                        <span>Candolim, North Goa</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mt-10 pt-8 border-t border-gray-50">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="h-5 w-5 text-[#d84e55]" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-in</span>
                                    </div>
                                    <div className="font-black text-deep-navy">Fri, 21 Feb 2026</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">From 02:00 PM</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="h-5 w-5 text-[#d84e55]" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-out</span>
                                    </div>
                                    <div className="font-black text-deep-navy">Sun, 23 Feb 2026</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Before 11:00 AM</div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-red-50/30 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-xl">
                                        <Users className="h-5 w-5 text-[#d84e55]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Type</div>
                                        <div className="font-bold text-deep-navy">Deluxe Queen Room (2 Nights)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Info */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-deep-navy tracking-tight mb-6">Important Information</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <ShieldCheck className="h-5 w-5 text-[#d84e55] mt-1" />
                                    <p className="text-sm font-bold text-gray-500 leading-relaxed">Free cancellation until 20 Feb. Cancel after that for a fee of 1 night stay.</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <Info className="h-5 w-5 text-[#d84e55] mt-1" />
                                    <p className="text-sm font-bold text-gray-500 leading-relaxed">Govt. ID proofs are mandatory for all guests during check-in.</p>
                                </div>
                            </div>
                        </div>

                        {/* Premium Benefits */}
                        <div className="bg-[#d84e55] rounded-[32px] p-8 shadow-xl shadow-red-200/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                            <div className="relative z-10">
                                <h3 className="text-xl font-black text-white tracking-tight mb-6">Booking Benefits</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                        <div className="text-xs font-black text-white uppercase tracking-widest mb-1">Free Wi-Fi</div>
                                        <div className="text-[10px] text-white/60 font-medium">Standard speed in all rooms</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                        <div className="text-xs font-black text-white uppercase tracking-widest mb-1">Early Check-in</div>
                                        <div className="text-[10px] text-white/60 font-medium">Subject to availability</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                        <div className="text-xs font-black text-white uppercase tracking-widest mb-1">Loyalty Points</div>
                                        <div className="text-[10px] text-white/60 font-medium">Earn 500 points on stay</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                        <div className="text-xs font-black text-white uppercase tracking-widest mb-1">Hygiene Plus</div>
                                        <div className="text-[10px] text-white/60 font-medium">Verified safety protocols</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Coupon Section */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-deep-navy tracking-tight mb-6">Offer & Coupons</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Coupon Code"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] focus:ring-4 focus:ring-red-500/5 transition-all uppercase"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-deep-navy text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Apply</button>
                            </div>
                        </div>

                        {/* Fare Summary */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-deep-navy tracking-tight mb-8">Price Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Room Price (2 Nights)</span>
                                    <span className="text-deep-navy">₹9,000</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Total Discount</span>
                                    <span className="text-green-600">- ₹1,500</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Taxes & Fees</span>
                                    <span className="text-deep-navy">₹450</span>
                                </div>
                                <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Amount</div>
                                        <div className="text-3xl font-black text-[#d84e55]">₹7,950</div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setView('hotel-guests')}
                                className="w-full bg-[#d84e55] text-white rounded-2xl py-5 mt-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200/50 hover:bg-[#c13e44] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                            >
                                <span>Continue to Guests</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelReview;
