import React from 'react';
import { ExternalLink } from 'lucide-react';

const TrainFaresTable = () => {
    const routes = [
        { from: "New Delhi", to: "Mumbai Central", duration: "15h 30m", fare: "₹450" },
        { from: "New Delhi", to: "Howrah (Kolkata)", duration: "17h 15m", fare: "₹550" },
        { from: "Mumbai Central", to: "Chennai Central", duration: "24h 00m", fare: "₹650" },
        { from: "New Delhi", to: "Lucknow", duration: "6h 30m", fare: "₹350" },
        { from: "Chennai Central", to: "Bangalore", duration: "5h 45m", fare: "₹250" },
        { from: "Hyderabad", to: "Mumbai Central", duration: "12h 45m", fare: "₹400" }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-deep-navy tracking-tight">
                        Train Routes, <span className="text-[#d84e55]">Fares & Time</span>
                    </h2>
                    <p className="text-gray-500 font-bold max-w-2xl mx-auto">
                        Check live seat availability and fares for the most popular train routes across the country.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-[40px] border border-gray-100 shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-gray-400">Train Route</th>
                                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-gray-400">Duration (Approx)</th>
                                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-gray-400">Starting Fare</th>
                                <th className="px-10 py-8 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Seat Availability</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {routes.map((route, index) => (
                                <tr key={index} className="hover:bg-red-50/30 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm font-black text-deep-navy">{route.from}</div>
                                            <div className="w-4 h-px bg-gray-300" />
                                            <div className="text-sm font-black text-deep-navy">{route.to}</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-sm font-bold text-gray-500">{route.duration}</td>
                                    <td className="px-10 py-8 text-sm font-black text-[#d84e55]">{route.fare}</td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#d84e55] transition-colors">
                                            <span>Check Seats</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        *Fares are subject to change and seat availability is live.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TrainFaresTable;
