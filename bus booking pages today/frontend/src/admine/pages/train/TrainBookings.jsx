import React from 'react';
import { Ticket, Search, Filter, Calendar, MapPin, User, Eye } from 'lucide-react';

const TrainBookings = () => {
    const bookings = [
        { id: 'T284950', user: 'Amit Sharma', train: 'Rajdhani (12951)', seat: 'B2 - 45', status: 'CONFIRMED', payment: 'Paid', date: '2026-04-12' },
        { id: 'T859604', user: 'Priya Verma', train: 'Shatabdi (12002)', seat: 'C4 - 12', status: 'RAC', payment: 'Paid', date: '2026-04-13' },
        { id: 'T475869', user: 'Rahul Gupta', train: 'Paschim (12925)', seat: 'S6 - 22', status: 'WL-14', payment: 'Unpaid', date: '2026-04-12' },
    ];

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#d84e55] rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-red-100">
                        <Ticket size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase leading-none mb-1">Train Bookings</h1>
                        <p className="text-gray-400 font-bold text-[11px] tracking-[0.25em] uppercase">Reservation Management System</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-red-400 transition-all" placeholder="Search by PNR or Name..." />
                </div>
                <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="date" className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 focus:ring-2 focus:ring-red-400 transition-all" />
                </div>
                <select className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 cursor-pointer focus:ring-2 focus:ring-red-400">
                    <option>All Status</option>
                    <option>Confirmed</option>
                    <option>RAC</option>
                    <option>Waiting List</option>
                </select>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                {['Booking ID', 'Passenger', 'Train Info', 'Seat/Status', 'Payment', 'Actions'].map(h => (
                                    <th key={h} className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-7">
                                        <p className="text-xs font-black text-gray-800 tracking-widest">#{b.id}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{b.date}</p>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-black">
                                                {b.user[0]}
                                            </div>
                                            <p className="text-sm font-black text-gray-700 uppercase tracking-tight">{b.user}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <p className="text-xs font-black text-gray-800 uppercase leading-none">{b.train}</p>
                                        <div className="flex items-center gap-1 mt-1 text-gray-400">
                                            <MapPin size={10} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">Live Tracking</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 whitespace-nowrap">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-xs font-black text-red-500 tracking-tight">{b.seat}</span>
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black w-fit uppercase tracking-[0.15em]
                                                ${b.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                    b.status === 'RAC' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                                {b.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${b.payment === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {b.payment}
                                        </span>
                                    </td>
                                    <td className="px-8 py-7">
                                        <button className="p-3 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-800 rounded-2xl transition-all" title="View Full Details">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrainBookings;
