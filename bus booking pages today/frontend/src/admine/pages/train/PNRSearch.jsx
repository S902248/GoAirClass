import React, { useState } from 'react';
import { Search, Train, User, MapPin, Map, TicketCheck, ArrowRightLeft, Clock } from 'lucide-react';

const PNRSearch = () => {
    const [pnr, setPnr] = useState('');
    const [result, setResult] = useState(null);

    const handleSearch = () => {
        if (pnr.length === 10) {
            setResult({
                name: 'Arjun Malhotra',
                train: '12951 - RAJDHANI EXP',
                route: 'MMCT → NDLS',
                class: '2A (AC 2-TIER)',
                status: 'CONFIRMED',
                coach: 'A2',
                seat: '48 (LB)',
                fare: '₹2,640'
            });
        }
    };

    return (
        <div className="p-8 space-y-10 bg-gray-50 min-h-screen animate-in fade-in duration-700">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 mx-auto mb-8 transition-transform hover:rotate-12 duration-500">
                        <TicketCheck size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tight mb-3">PNR Verification</h1>
                    <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.3em]">Query Central Passenger Records</p>
                </div>

                {/* Search Input */}
                <div className="bg-white p-3 rounded-[40px] shadow-2xl shadow-indigo-100 flex items-center gap-2 border border-blue-50">
                    <div className="flex-1 relative">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
                        <input 
                            type="text" 
                            maxLength={10}
                            placeholder="ENTER 10-DIGIT PNR NUMBER..." 
                            className="w-full pl-20 pr-8 py-7 bg-white border-none rounded-[32px] text-xl font-black tracking-[0.2em] text-deep-navy placeholder:text-gray-200 focus:ring-0 transition-all uppercase"
                            value={pnr}
                            onChange={(e) => setPnr(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-7 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-200 active:scale-95"
                    >
                        Search
                    </button>
                </div>

                {/* Result Card */}
                {result && (
                    <div className="animate-in slide-in-from-bottom-10 duration-700">
                        <div className="bg-white rounded-[45px] overflow-hidden border border-gray-50 shadow-2xl shadow-gray-200/50">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-12 py-10 text-white relative overflow-hidden">
                                <Map className="absolute right-[-20px] bottom-[-20px] h-48 w-48 opacity-10 rotate-12" />
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Primary Passenger</p>
                                            <h2 className="text-2xl font-black uppercase tracking-tight">{result.name}</h2>
                                        </div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-xl border border-white/30 px-6 py-3 rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1">Current Status</p>
                                        <p className="text-lg font-black tracking-widest">{result.status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Train size={14} />
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Train Information</p>
                                    </div>
                                    <p className="text-sm font-black text-deep-navy uppercase">{result.train}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <MapPin size={14} />
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Travel Route</p>
                                    </div>
                                    <p className="text-sm font-black text-deep-navy uppercase">{result.route}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock size={14} />
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Travel Class</p>
                                    </div>
                                    <p className="text-sm font-black text-deep-navy uppercase">{result.class}</p>
                                </div>
                                
                                <div className="md:col-span-2 lg:col-span-1 bg-gray-50 rounded-3xl p-6 flex items-center justify-between border border-gray-100">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Seat Allocation</p>
                                        <p className="text-xl font-black text-indigo-600 tracking-tighter uppercase">{result.coach} / {result.seat}</p>
                                    </div>
                                    <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                                        <ArrowRightLeft size={20} />
                                    </div>
                                </div>

                                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 lg:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest">Transaction Total</p>
                                            <p className="text-2xl font-black text-emerald-600 tracking-tighter">{result.fare}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">
                                            Verified Receipt
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PNRSearch;
