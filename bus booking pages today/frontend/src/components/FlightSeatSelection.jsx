import React, { useState, useEffect } from 'react';
import { Armchair, Check, Info, ShieldCheck, AlertCircle, ChevronRight } from 'lucide-react';
import axios from '../api/Axios';

const FlightSeatSelection = ({ flight, passengers, selectedSeats, setSelectedSeats, onNext }) => {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPassengerIdx, setCurrentPassengerIdx] = useState(0);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/seats/${flight._id}`);
                if (res.data.success) {
                    setSeats(res.data.seats);
                }
            } catch (err) {
                console.error("Failed to fetch seats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSeats();
    }, [flight._id]);

    const handleSeatClick = async (seat) => {
        if (seat.isBooked) return;
        if (seat.isLocked && !selectedSeats.some(s => s.seatNumber === seat.seatNumber)) return;

        const isAlreadySelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber);

        if (isAlreadySelected) {
            // Deselect
            setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seat.seatNumber));
            // Optional: Backend release lock
            await axios.post('/seats/release', { flightId: flight._id, seatNumber: seat.seatNumber, userId: 'current-user-uuid' });
        } else {
            // Select if we still have passengers to assign
            if (selectedSeats.length < passengers.length) {
                try {
                    // Try to lock on backend
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    const userId = userData?._id || 'guest-' + Date.now();

                    const lockRes = await axios.post('/seats/lock', {
                        flightId: flight._id,
                        seatNumber: seat.seatNumber,
                        userId: userId
                    });

                    if (lockRes.data.success) {
                        setSelectedSeats([...selectedSeats, {
                            ...seat,
                            passengerId: passengers[currentPassengerIdx].id,
                            passengerName: `${passengers[currentPassengerIdx].firstName} ${passengers[currentPassengerIdx].lastName}`
                        }]);
                        if (currentPassengerIdx < passengers.length - 1) {
                            setCurrentPassengerIdx(prev => prev + 1);
                        }
                    } else {
                        alert(lockRes.data.message || "Failed to lock seat");
                    }
                } catch (err) {
                    alert(err.response?.data?.message || "Error locking seat");
                }
            }
        }
    };

    const renderSeat = (row, col) => {
        const seatNumber = `${row}${col}`;
        const seat = seats.find(s => s.seatNumber === seatNumber);
        if (!seat) return <div key={col} className="w-10 h-10 md:w-12 md:h-12 invisible" />;

        const isSelected = selectedSeats.some(s => s.seatNumber === seatNumber);
        const isOccupied = seat.isBooked || (seat.isLocked && !isSelected);

        // Color Logic per Requirements:
        // Grey = Available, Red = Booked, Blue = Premium, Yellow = Extra Legroom, Green = Selected
        let seatColor = "bg-gray-200 text-gray-600 hover:bg-gray-300"; // Grey (Available/Standard/Free)
        
        if (seat.type === 'Premium') seatColor = "bg-blue-600 text-white hover:bg-blue-700"; // Blue
        if (seat.type === 'Extra Legroom') seatColor = "bg-yellow-400 text-gray-800 hover:bg-yellow-500"; // Yellow
        if (isOccupied) seatColor = "bg-red-500 text-white cursor-not-allowed"; // Red (Booked or Locked)
        if (isSelected) seatColor = "bg-green-500 text-white"; // Green

        return (
            <button
                key={col}
                disabled={isOccupied}
                onClick={() => handleSeatClick(seat)}
                className={`relative w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${seatColor} group border-b-4 border-black/10`}
            >
                <span className="text-[10px] md:text-xs font-black tracking-tight z-10">{seatNumber}</span>
                
                {/* Visual indicator for selection */}
                {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 text-green-600" strokeWidth={4} />
                    </div>
                )}

                {/* Hover Details */}
                {!isOccupied && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-xl border border-white/20">
                        {seat.type} • ₹{seat.price}
                    </div>
                )}
            </button>
        );
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Configuring Aircraft Layout...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                <div className="bg-[#00695c] px-10 py-7 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-white">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Armchair className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-black text-xl uppercase tracking-tight leading-none">Choose Your Seats</h2>
                            <p className="text-white/60 text-xs font-bold mt-1 uppercase tracking-widest">Select {passengers.length} spots</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-2.5 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-inner">
                        {selectedSeats.length} / {passengers.length} Selected
                    </div>
                </div>

                <div className="p-10 bg-gradient-to-b from-white to-slate-50/30">
                    
                    {/* Legend per Requirements */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        {[
                            { label: 'Available', color: 'bg-gray-200' },
                            { label: 'Booked', color: 'bg-red-500' },
                            { label: 'Extra Legroom', color: 'bg-yellow-400' },
                            { label: 'Premium', color: 'bg-blue-600' },
                            { label: 'Selected', color: 'bg-green-500' },
                        ].map(l => (
                            <div key={l.label} className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-md ${l.color} shadow-sm border-b-2 border-black/10`}></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{l.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Current Passenger Detail */}
                    <div className="max-w-md mx-auto mb-10">
                        <div className="bg-blue-600 text-white rounded-2xl p-4 flex items-center gap-4 shadow-lg shadow-blue-200 transform hover:scale-[1.02] transition-transform">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg font-black backdrop-blur-md">
                                {currentPassengerIdx + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase text-blue-100 tracking-widest">Current Selection</p>
                                <p className="font-black uppercase tracking-tight text-sm">
                                    {passengers[currentPassengerIdx].firstName} {passengers[currentPassengerIdx].lastName}
                                </p>
                            </div>
                            <Info className="w-5 h-5 text-white/40" />
                        </div>
                    </div>

                    {/* Aircraft Body Visualization */}
                    <div className="max-w-2xl mx-auto">
                        {/* Cockpit / Nose */}
                        <div className="flex justify-center mb-0">
                            <div className="w-[340px] h-32 bg-white rounded-t-[140px] border-x-[12px] border-t-[12px] border-slate-200 relative flex flex-col items-center justify-end pb-4 bg-gradient-to-b from-slate-50 to-white">
                                <div className="absolute top-10 flex gap-12">
                                    <div className="w-12 h-6 bg-slate-900/10 rounded-tl-full rounded-tr-md backdrop-blur-sm"></div>
                                    <div className="w-12 h-6 bg-slate-900/10 rounded-tr-full rounded-tl-md backdrop-blur-sm"></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">Flight Deck</span>
                            </div>
                        </div>

                        {/* Fuselage / Cabin */}
                        <div className="bg-white border-x-[12px] border-slate-200 px-6 py-10 relative shadow-inner">
                            {/* Static Labels */}
                            <div className="flex justify-center gap-[6.5rem] md:gap-[8.5rem] mb-8 text-[11px] font-black text-slate-400">
                                <div className="flex gap-10 md:gap-14"><span>A</span><span>B</span><span>C</span></div>
                                <div className="flex gap-10 md:gap-14"><span>D</span><span>E</span><span>F</span></div>
                            </div>

                            <div className="space-y-4">
                                {[...Array(30)].map((_, i) => {
                                    const row = i + 1;
                                    return (
                                        <div key={row} className="flex items-center justify-center gap-3 md:gap-4 group/row">
                                            <div className="w-6 text-[10px] font-black text-slate-300 group-hover/row:text-blue-400 transition-colors">{row}</div>
                                            <div className="flex gap-2 md:gap-3">
                                                {['A', 'B', 'C'].map(col => renderSeat(row, col))}
                                            </div>
                                            <div className="w-8 md:w-12 flex justify-center">
                                                <div className="h-10 w-0.5 bg-slate-100 rounded-full"></div>
                                            </div>
                                            <div className="flex gap-2 md:gap-3">
                                                {['D', 'E', 'F'].map(col => renderSeat(row, col))}
                                            </div>
                                            <div className="w-6 text-[10px] font-black text-slate-300 text-right group-hover/row:text-blue-400 transition-colors">{row}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tail Section */}
                        <div className="flex justify-center -mt-1">
                            <div className="w-[340px] h-20 bg-white rounded-b-[40px] border-x-[12px] border-b-[12px] border-slate-200 flex items-center justify-center bg-gradient-to-t from-slate-50 to-white">
                                <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Rear Exit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Float Action Button / Indicator */}
            <div className="flex flex-col md:flex-row gap-4">
                <button 
                    onClick={() => window.history.back()}
                    className="flex-1 py-5 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={selectedSeats.length < passengers.length}
                    className="flex-[2] py-5 bg-[#f26a36] hover:bg-[#e05d2e] disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none text-white rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-2xl shadow-orange-200 flex items-center justify-center gap-4 relative overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Continue to Payment <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </div>
        </div>
    );
};

export default FlightSeatSelection;
