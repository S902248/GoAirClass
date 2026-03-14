import React, { useState } from 'react';
import { X, Plane, Clock, Info, Briefcase, ShieldCheck, Zap, Calendar, ArrowRight, PlaneTakeoff, PlaneLanding, Luggage, Shield, AlertCircle } from 'lucide-react';

const FlightDetails = ({ flight, onClose, onBook }) => {
    const [activeTab, setActiveTab] = useState('Flight Details');

    if (!flight) return null;

    const tabs = ['Flight Details', 'Cancellation', 'Rescheduling'];

    return (
        <div className="fixed inset-0 z-[100] flex justify-end bg-[#020617]/40 backdrop-blur-[4px] transition-all duration-500">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>
            
            <div className="bg-white w-full lg:w-3/4 h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col relative z-10 overflow-hidden animate-slide-in-right">
                
                {/* Premium Header */}
                <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0 sticky top-0 z-20">
                    <div className="flex items-center justify-between px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <Info className="h-5 w-5 text-[#003580]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 leading-none">Flight Itinerary</h2>
                                <p className="text-[10px] font-black text-gray-400 mt-1.5 uppercase tracking-widest">{flight.airline} • {flight.flightNumber}</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2.5 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900 hover:rotate-90 group"
                        >
                            <X className="h-6 w-6 group-active:scale-90" />
                        </button>
                    </div>
                    
                    <div className="flex px-8 space-x-10">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                                    activeTab === tab 
                                    ? 'text-[#003580]' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#003580] rounded-t-full shadow-[0_-4px_10px_rgba(0,53,128,0.2)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 no-scrollbar">
                    {activeTab === 'Flight Details' && (
                        <div className="space-y-8 animate-fade-in-up">
                            
                            {/* Detailed Route Card */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Plane className="h-32 w-32 -rotate-12" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row items-start justify-between gap-10">
                                        
                                        {/* Departure Terminal */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-black text-xs">DEP</div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{flight.searchDate}</span>
                                            </div>
                                            <div>
                                                <p className="text-4xl font-black text-gray-900 tracking-tighter">{flight.departureTime}</p>
                                                <p className="text-lg font-black text-[#003580] mt-1">{flight.fromCity}</p>
                                                <p className="text-xs font-bold text-gray-400 mt-1.5 leading-relaxed">{flight.fromAirport || 'Chhatrapati Shivaji International Airport'}</p>
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Terminal</span>
                                                <span className="text-xs font-black text-gray-900">{flight.fromTerminal || '2'}</span>
                                            </div>
                                        </div>

                                        {/* Middle Section - Visual Time */}
                                        <div className="flex-1 flex flex-col items-center justify-center h-full pt-10">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">{flight.duration}</div>
                                            <div className="w-full h-px border-t-2 border-dashed border-gray-200 relative">
                                                <div className="absolute inset-0 flex items-center justify-center -translate-y-1/2">
                                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                                        <Plane className="h-5 w-5 text-[#f26a36] rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex flex-col items-center">
                                                <div className="px-3 py-1 bg-blue-50 rounded-full">
                                                    <span className="text-[10px] font-black text-[#003580] uppercase tracking-widest">{flight.stops}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrival Terminal */}
                                        <div className="flex-1 text-right space-y-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{flight.searchDate}</span>
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">ARR</div>
                                            </div>
                                            <div>
                                                <p className="text-4xl font-black text-gray-900 tracking-tighter">{flight.arrivalTime}</p>
                                                <p className="text-lg font-black text-[#003580] mt-1">{flight.toCity}</p>
                                                <p className="text-xs font-bold text-gray-400 mt-1.5 leading-relaxed ml-auto max-w-[200px]">{flight.toAirport || 'Indira Gandhi International Airport'}</p>
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Terminal</span>
                                                <span className="text-xs font-black text-gray-900">{flight.toTerminal || '3'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Blocks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Baggage Detail */}
                                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                                            <Luggage className="h-4 w-4 text-[#f26a36]" />
                                        </div>
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Baggage Info</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-xs font-bold text-gray-500">Cabin</span>
                                            <span className="text-sm font-black text-gray-900">7 KG</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-xs font-bold text-gray-500">Check-in</span>
                                            <span className="text-sm font-black text-gray-900">15 KG</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Aircraft Detail */}
                                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <Info className="h-4 w-4 text-[#003580]" />
                                        </div>
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Flight Info</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-xs font-bold text-gray-500">Aircraft</span>
                                            <span className="text-sm font-black text-gray-900">{flight.aircraftType || 'Airbus A320'}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-xs font-bold text-gray-500">Layout</span>
                                            <span className="text-sm font-black text-gray-900">3-3 Seat Plan</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Refund Status */}
                                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-xl ${flight.isRefundable ? 'bg-green-50' : 'bg-red-50'} flex items-center justify-center`}>
                                            <Shield className={`h-4 w-4 ${flight.isRefundable ? 'text-green-600' : 'text-red-500'}`} />
                                        </div>
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Refund Policy</h3>
                                    </div>
                                    <div className="space-y-3 h-full flex flex-col justify-center">
                                        <div className={`text-center py-4 rounded-xl border-2 border-dashed ${flight.isRefundable ? 'bg-green-50/30 border-green-100' : 'bg-red-50/30 border-red-100'}`}>
                                            <p className={`text-lg font-black ${flight.isRefundable ? 'text-green-600' : 'text-red-500'}`}>
                                                {flight.isRefundable ? 'REFUNDABLE' : 'NON-REFUNDABLE'}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Based on Selected Fare</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Offers/Upsell */}
                            <div className="bg-gradient-to-br from-[#003580] to-[#0052cc] p-6 rounded-[24px] text-white flex items-center justify-between gap-6 shadow-xl shadow-blue-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Zap className="h-6 w-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black uppercase tracking-wider">Fast-Track Your Booking</h4>
                                        <p className="text-xs font-bold text-white/70 mt-1">Add free cancellation & priority check-in for just ₹599</p>
                                    </div>
                                </div>
                                <button className="px-6 py-2.5 bg-white text-[#003580] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Add Protection</button>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'Cancellation' || activeTab === 'Rescheduling') && (
                        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 animate-slide-up">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{activeTab} Policy</h3>
                            </div>
                            
                            <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-10 border-b border-gray-100 pb-10">
                                    <div className="space-y-6">
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Timeline</p>
                                        <ul className="space-y-4 font-black">
                                            <li className="text-sm text-gray-900 pb-4 border-b border-gray-50 flex justify-between items-center">
                                                <span>0 - 2 Hours</span>
                                                <span className="text-red-500">PROHIBITED</span>
                                            </li>
                                            <li className="text-sm text-gray-900 pb-4 border-b border-gray-50 flex justify-between items-center">
                                                <span>2 - 24 Hours</span>
                                                <span>₹3,500 + Fare Diff</span>
                                            </li>
                                            <li className="text-sm text-gray-900 flex justify-between items-center">
                                                <span>24+ Hours</span>
                                                <span>₹2,500 + Fare Diff</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Important Notes</h4>
                                        <ul className="space-y-3">
                                            {[
                                                'Calculated per passenger',
                                                'Excludes airline surcharges',
                                                'Refund to original source',
                                                'Valid for direct flights only'
                                            ].map((note, i) => (
                                                <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                                                    <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                                    {note}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Action Section */}
                <div className="bg-white border-t border-gray-100 px-8 py-6 shrink-0 z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Exclusive Fare</p>
                            <div className="flex items-center gap-3">
                                <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{(flight.price || 0).toLocaleString('en-IN')}</p>
                                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded border border-green-100 tracking-wider">LATEST PRICE</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={onClose}
                                className="px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    onBook(flight);
                                    onClose();
                                }}
                                className="px-12 py-4 bg-[#f26a36] hover:bg-[#e05d2e] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-orange-100 active:scale-95 flex items-center gap-2 group"
                            >
                                Confirm Selection
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FlightDetails;
