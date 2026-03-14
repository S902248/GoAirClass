import React from 'react';
import { User, ShieldCheck, ChevronRight, Info, Plus } from 'lucide-react';

const TrainPassengerDetails = ({ setView }) => {
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
                        {/* IRCTC User ID Card */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">IRCTC User ID</label>
                                <button className="text-[10px] font-black text-[#d84e55] uppercase tracking-widest hover:underline">Forgot ID?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter IRCTC User ID"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] focus:ring-4 focus:ring-red-500/5 transition-all uppercase"
                                />
                                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-gray-400 italic">
                                    <Info className="h-3 w-3" />
                                    <span>IRCTC ID is required for train bookings.</span>
                                </div>
                            </div>
                        </div>

                        {/* Passenger Details */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-deep-navy tracking-tight">Traveler Details</h3>
                                <button className="flex items-center gap-2 bg-red-50 text-[#d84e55] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d84e55] hover:text-white transition-all">
                                    <Plus className="h-3 w-3" />
                                    <span>Add Extra</span>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input type="text" placeholder="Same as ID proof" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] focus:ring-4 focus:ring-red-500/5 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                                        <input type="number" placeholder="Years" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] focus:ring-4 focus:ring-red-500/5 transition-all" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    {['Male', 'Female', 'Other'].map(gender => (
                                        <button key={gender} className="flex-1 bg-gray-50 border border-gray-100 py-4 rounded-2xl text-xs font-black text-gray-500 hover:border-red-200 hover:text-deep-navy active:bg-red-50 transition-all">
                                            {gender}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-deep-navy tracking-tight mb-8">Contact Information</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-red-200 transition-all" />
                                <input type="tel" placeholder="Mobile Number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-deep-navy font-black placeholder:text-gray-300 focus:outline-none focus:border-red-200 transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <FareSummary />
                            <button
                                onClick={() => setView('train-payment')}
                                className="w-full bg-[#d84e55] text-white rounded-2xl py-5 mt-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200/50 hover:bg-[#c13e44] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                            >
                                <span>Continue to Payment</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FareSummary = () => (
    <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Fare Summary</h4>
        <div className="flex justify-between">
            <span className="text-sm font-bold text-gray-500">Adult x 1</span>
            <span className="text-sm font-black text-deep-navy">₹2,850</span>
        </div>
        <div className="flex justify-between">
            <span className="text-sm font-bold text-gray-500">Tax & Fees</span>
            <span className="text-sm font-black text-deep-navy">₹0</span>
        </div>
        <div className="pt-4 border-t border-gray-50 flex justify-between">
            <span className="text-lg font-black text-deep-navy">Total Pay</span>
            <span className="text-lg font-black text-[#d84e55]">₹2,850</span>
        </div>
    </div>
);

export default TrainPassengerDetails;
