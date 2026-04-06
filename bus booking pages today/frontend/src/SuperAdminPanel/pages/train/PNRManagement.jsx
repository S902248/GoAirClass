import { useState } from 'react';
import { Search, Hash, Train, User, Calendar, MapPin, Printer, Download } from 'lucide-react';
import trainApi from '../../../api/trainApi';
import { toast } from 'react-toastify';

const PNRManagement = () => {
    const [pnr, setPnr] = useState('');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!pnr) return toast.warn('Please enter a PNR number');
        
        setLoading(true);
        setBooking(null);
        try {
            const res = await trainApi.getBookingByPNR(pnr);
            if (res.success) {
                setBooking(res.booking);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'PNR not found or invalid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">PNR Management</h1>
                    <p className="text-slate-500 text-sm">Quickly search and manage bookings using PNR numbers.</p>
                </div>
            </div>

            <div className="card p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-train-primary-light dark:bg-train-primary/10 rounded-3xl flex items-center justify-center text-train-primary mx-auto mb-4">
                            <Hash size={32} />
                        </div>
                        <h2 className="text-xl font-bold">Verify PNR Status</h2>
                        <p className="text-sm text-slate-500 mt-1">Enter the 10-digit PNR number to fetch live status.</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Enter PNR Number..." 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-train-primary outline-none text-lg font-black tracking-[0.2em]" 
                                value={pnr}
                                onChange={(e) => setPnr(e.target.value)}
                            />
                        </div>
                        <button 
                            disabled={loading}
                            onClick={handleSearch}
                            className="bg-train-primary hover:bg-train-primary-dark text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-train-primary/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {booking && (
                        <div className="mt-12 animate-in slide-in-from-bottom-5 duration-500">
                            <div className="p-1 bg-gradient-to-r from-train-primary to-train-secondary rounded-3xl">
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[22px]">
                                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                                <Train size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">PNR {booking.pnr}</p>
                                                <h3 className="text-xl font-black text-green-600 uppercase">Confirmed</h3>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                                <Train size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Train</span>
                                            </div>
                                            <p className="font-bold">{booking.trainId?.name} ({booking.trainId?.number})</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                                <User size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Passenger</span>
                                            </div>
                                            <p className="font-bold">{booking.passengerDetails?.[0]?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                                <Calendar size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Journey Date</span>
                                            </div>
                                            <p className="font-bold">{new Date(booking.journeyDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="lg:col-span-1">
                                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                                <MapPin size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">From</span>
                                            </div>
                                            <p className="font-bold">{booking.source?.name || 'N/A'}</p>
                                        </div>
                                        <div className="lg:col-span-1">
                                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                                <MapPin size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">To</span>
                                            </div>
                                            <p className="font-bold">{booking.destination?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                             <div className="flex items-center gap-2 mb-2 text-slate-400">
                                                <Hash size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Seat Info</span>
                                            </div>
                                             <p className="font-black text-train-primary">
                                                {booking.classType} - {booking.passengerDetails?.[0]?.seatNumber || 'Waitlisted'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PNRManagement;
