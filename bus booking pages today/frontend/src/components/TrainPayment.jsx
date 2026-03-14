import React from 'react';
import { CreditCard, Smartphone, Building2, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';

const TrainPayment = ({ setView }) => {
    const [activeMethod, setActiveMethod] = React.useState('UPI');

    const paymentMethods = [
        { id: 'UPI', name: 'UPI / Google Pay / PhonePe', icon: <Smartphone className="h-5 w-5" /> },
        { id: 'CARD', name: 'Credit / Debit Card', icon: <CreditCard className="h-5 w-5" /> },
        { id: 'NET', name: 'Net Banking', icon: <Building2 className="h-5 w-5" /> }
    ];

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
                    <div className="flex items-center gap-2 text-green-600">
                        <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-xs">✓</div>
                        <span className="text-xs font-black uppercase tracking-widest">Travelers</span>
                    </div>
                    <div className="h-px w-12 bg-green-600" />
                    <div className="flex items-center gap-2 text-[#d84e55]">
                        <div className="h-8 w-8 rounded-full bg-[#d84e55] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-red-200">3</div>
                        <span className="text-xs font-black uppercase tracking-widest">Payment</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Payment Methods */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-deep-navy tracking-tight mb-8">Payment Methods</h3>

                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setActiveMethod(method.id)}
                                        className={`flex items-center justify-between p-6 rounded-[24px] border-2 transition-all cursor-pointer group ${activeMethod === method.id ? 'border-[#d84e55] bg-red-50/10' : 'border-gray-50 hover:border-red-100 bg-gray-50/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${activeMethod === method.id ? 'bg-[#d84e55] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-[#d84e55]'
                                                }`}>
                                                {method.icon}
                                            </div>
                                            <span className={`font-black text-sm uppercase tracking-widest ${activeMethod === method.id ? 'text-deep-navy' : 'text-gray-400'}`}>
                                                {method.name}
                                            </span>
                                        </div>
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${activeMethod === method.id ? 'border-[#d84e55] bg-[#d84e55]' : 'border-gray-200 group-hover:border-red-200'
                                            }`}>
                                            {activeMethod === method.id && <CheckCircle2 className="h-4 w-4 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-green-50/50 rounded-2xl p-6 flex items-start gap-4 border border-green-100">
                            <ShieldCheck className="h-6 w-6 text-green-600 flex-shrink-0" />
                            <div>
                                <h5 className="text-xs font-black text-green-800 uppercase tracking-widest mb-1">Secure Payment</h5>
                                <p className="text-[10px] font-bold text-green-700/70 uppercase tracking-wider leading-relaxed">
                                    Your payment information is encrypted and processed securely. IRCTC authorized partnership guarantees safe bookings.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 sticky top-32">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Final Summary</h4>
                                <div className="flex justify-between">
                                    <span className="text-sm font-bold text-gray-500">Ticket Fare</span>
                                    <span className="text-sm font-black text-deep-navy">₹2,850</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between">
                                    <span className="text-lg font-black text-deep-navy uppercase tracking-widest">Payable</span>
                                    <span className="text-2xl font-black text-[#d84e55]">₹2,850</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setView('booking-success')}
                                className="w-full bg-[#d84e55] text-white rounded-2xl py-6 mt-8 font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-200/60 hover:bg-[#c13e44] hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Pay Securely
                            </button>
                            <div className="mt-6 flex items-center justify-center gap-2 opacity-50">
                                <ShieldCheck className="h-3 w-3" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">100% Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainPayment;
