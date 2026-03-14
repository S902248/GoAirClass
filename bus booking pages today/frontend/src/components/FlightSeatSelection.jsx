import React, { useState, useEffect } from 'react';
import { Armchair, Check, Info, ShieldCheck, AlertCircle } from 'lucide-react';
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
        if (!seat) return <div key={col} className="w-8 h-8 md:w-10 md:h-10 invisible" />;

        const isSelected = selectedSeats.some(s => s.seatNumber === seatNumber);
        const isOccupied = seat.isBooked || (seat.isLocked && !isSelected);

        let bgColor = "bg-white border-2 border-slate-200 hover:border-blue-400";
        if (isOccupied) bgColor = "bg-slate-100 border-none cursor-not-allowed";
        if (isSelected) bgColor = "bg-blue-600 border-blue-600 shadow-lg shadow-blue-100";

        let iconColor = "text-slate-300";
        if (seat.type === 'Premium') iconColor = isSelected ? "text-white" : "text-amber-400";
        if (seat.type === 'Standard') iconColor = isSelected ? "text-white" : "text-blue-400";
        if (seat.type === 'Free') iconColor = isSelected ? "text-white" : "text-emerald-400";
        if (isOccupied) iconColor = "text-slate-200";

        return (
            <button
                key={col}
                disabled={isOccupied}
                onClick={() => handleSeatClick(seat)}
                className={`relative w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${bgColor} group`}
            >
                <Armchair className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
                {isSelected && <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" />}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {seatNumber} • {seat.type} • ₹{seat.price}
                </div>
            </button>
        );
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-400 uppercase tracking-widest animate-pulse">Scanning Seat Availability...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <Armchair className="w-6 h-6" />
                        <h2 className="font-black text-lg uppercase tracking-tight">Select Seats</h2>
                    </div>
                    <div className="bg-white/20 px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                        {selectedSeats.length} / {passengers.length} Assigned
                    </div>
                </div>

                <div className="p-8">
                    {/* Current Passenger Indicator */}
                    <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl mb-8 border border-blue-100">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xs font-black">
                            {currentPassengerIdx + 1}
                        </div>
                        <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                            Selecting seat for: <span className="font-black underline">{passengers[currentPassengerIdx].firstName} {passengers[currentPassengerIdx].lastName}</span>
                        </p>
                    </div>

                    {/* Seat Map Legend */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: 'Premium (₹785)', color: 'bg-amber-400' },
                            { label: 'Standard (₹390)', color: 'bg-blue-400' },
                            { label: 'Free (₹0)', color: 'bg-emerald-400' },
                            { label: 'Occupied', color: 'bg-slate-100' },
                        ].map(l => (
                            <div key={l.label} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${l.color}`}></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{l.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Seat Map Layout */}
                    <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100 max-w-lg mx-auto overflow-x-auto">
                        <div className="flex justify-center mb-12">
                            <div className="w-full max-w-[280px] h-20 bg-white rounded-t-[100px] border-x-4 border-t-4 border-slate-200 flex flex-col items-center justify-center">
                                <div className="w-12 h-1 bg-slate-100 rounded-full mb-2"></div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Cockpit</span>
                            </div>
                        </div>

                        <div className="space-y-4 min-w-[300px]">
                            {/* Rows */}
                            {[...Array(30)].map((_, i) => {
                                const row = i + 1;
                                return (
                                    <div key={row} className="flex items-center justify-center gap-2 md:gap-4 relative">
                                        <div className="absolute -left-8 text-[10px] font-black text-slate-300">{row}</div>
                                        <div className="flex gap-2">
                                            {['A', 'B', 'C'].map(col => renderSeat(row, col))}
                                        </div>
                                        <div className="w-8 md:w-12 h-10 flex items-center justify-center">
                                            <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest [writing-mode:vertical-lr]">Aisle</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {['D', 'E', 'F'].map(col => renderSeat(row, col))}
                                        </div>
                                        <div className="absolute -right-8 text-[10px] font-black text-slate-300">{row}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-center mt-12">
                            <div className="w-full max-w-[280px] h-12 bg-white rounded-b-2xl border-x-4 border-b-4 border-slate-100 flex items-center justify-center">
                                <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Tail Section</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={selectedSeats.length < passengers.length}
                className="w-full py-5 bg-[#f26a36] hover:bg-[#e05d2e] disabled:bg-gray-300 disabled:shadow-none text-white rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3"
            >
                Continue to Add-ons <Check className="w-6 h-6" />
            </button>
        </div>
    );
};

export default FlightSeatSelection;
