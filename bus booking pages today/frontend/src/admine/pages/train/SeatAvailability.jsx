import React from 'react';
import { Calendar, Train, Users, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const SeatAvailability = () => {
    const availability = [
        { class: '1A', total: 24, booked: 18, type: 'AC First Class' },
        { class: '2A', total: 48, booked: 42, type: 'AC 2 Tier' },
        { class: '3A', total: 64, booked: 60, type: 'AC 3 Tier' },
        { class: 'SL', total: 72, booked: 55, type: 'Sleeper' },
    ];

    return (
        <div className="p-8 space-y-10 bg-gray-50 min-h-screen animate-in fade-in duration-500">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                <div className="w-14 h-14 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                    <Users size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Seat Availability</h1>
                    <p className="text-gray-400 font-bold text-xs tracking-[0.2em] uppercase leading-none mt-1">Real-time inventory manager</p>
                </div>
            </div>

            {/* Selection Bar */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Select Train</label>
                    <div className="relative">
                        <Train className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <select className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 cursor-pointer focus:ring-2 focus:ring-emerald-400 transition-all">
                            <option>12951 - Rajdhani Express</option>
                            <option>12002 - Shatabdi Express</option>
                        </select>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Journey Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input type="date" className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 focus:ring-2 focus:ring-emerald-400 transition-all" />
                    </div>
                </div>
                <div className="pt-6">
                    <button className="w-full h-14 bg-[#d84e55] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-red-100 hover:bg-[#b03a40] transition-all">
                        Fetch Stats
                    </button>
                </div>
            </div>

            {/* Availability Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {availability.map((item) => (
                    <div key={item.class} className="group cursor-default">
                        <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-100 group-hover:-translate-y-2">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-12 h-12 bg-gray-50 text-deep-navy font-black rounded-2xl flex items-center justify-center text-lg border border-gray-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    {item.class}
                                </div>
                                <div className={`p-2 rounded-full ${item.total - item.booked > 5 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                    {item.total - item.booked > 5 ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                </div>
                            </div>
                            
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.type}</h3>
                            <p className="text-3xl font-black text-deep-navy tracking-tight mb-6">{item.total - item.booked} <span className="text-sm text-gray-300 font-bold uppercase tracking-widest">Left</span></p>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                                    <span className="text-gray-400">Total Capacity</span>
                                    <span className="text-gray-700">{item.total}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${
                                            (item.booked / item.total) > 0.8 ? 'bg-[#d84e55]' : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${(item.booked / item.total) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                                    <span className="text-gray-400">Booked Seats</span>
                                    <span className="text-gray-700">{item.booked}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-white/50 border border-dashed border-gray-200 p-10 rounded-[40px] text-center max-w-2xl mx-auto">
                <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                <h4 className="text-sm font-black text-deep-navy uppercase tracking-widest mb-2">Live Inventory Sync Active</h4>
                <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">
                    Data is refreshed every 30 seconds from the central reservation system (CRS). Passenger bookings are automatically deducted from available quotas.
                </p>
            </div>
        </div>
    );
};

export default SeatAvailability;
