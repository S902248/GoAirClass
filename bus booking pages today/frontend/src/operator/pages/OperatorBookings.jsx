import React, { useState, useEffect } from 'react';
import { User, Ticket, Calendar, DollarSign } from 'lucide-react';
import { getOperatorBookings as getAllBookings } from '../../api/bookingApi';

const OperatorBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings(); // Scoped logic would be ideal
            setBookings(data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tight">Fleet Bookings</h1>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Monitor ticket sales and passenger lists across your fleet</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Passenger</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bus / Schedule</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Seats</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center font-black text-amber-600 text-xs">
                                            {booking.passengerName?.substring(0, 1)}
                                        </div>
                                        <div>
                                            <p className="font-black text-deep-navy uppercase text-sm">{booking.passengerName}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">TID: {booking._id.substring(booking._id.length - 8)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-gray-600 uppercase">{booking.bus?.busName}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{booking.schedule?.departureTime} Departure</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex gap-2">
                                        {booking.seats?.map(s => (
                                            <span key={s} className="px-2 py-1 bg-gray-50 text-[9px] font-black text-gray-500 rounded-md border border-gray-100">{s}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-black text-deep-navy">₹{booking.totalAmount}</td>
                                <td className="px-8 py-6">
                                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Confirmed</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OperatorBookings;
