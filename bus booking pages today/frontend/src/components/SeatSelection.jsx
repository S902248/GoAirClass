import React, { useState } from 'react';
import { ChevronLeft, Info, Armchair, User, Power, Coffee, Wifi, Tv } from 'lucide-react';

const SeatSelection = ({ bus, setView, setSelectedSeats }) => {
    const [selectedSeats, setSelectedSeatsLocal] = useState([]);

    // Mock seat data: 40 seats (8 rows, 5 columns, with aisle)
    // 0: available, 1: occupied, 2: selected (handled by state)
    const [seatLayout] = useState(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i + 1,
            isOccupied: Math.random() < 0.3,
            price: bus?.price || 1000
        }))
    );

    const toggleSeat = (seatId) => {
        if (seatLayout.find(s => s.id === seatId).isOccupied) return;

        setSelectedSeatsLocal(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    const handleProceed = () => {
        if (selectedSeats.length > 0) {
            setSelectedSeats(selectedSeats);
            setView('passenger-details');
        }
    };

    const totalPrice = selectedSeats.length * (bus?.price || 1000);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => setView('bus-results')}
                        className="flex items-center gap-2 group"
                    >
                        <div className="bg-gray-100 p-2.5 rounded-xl group-hover:bg-radiant-coral group-hover:text-white transition-all">
                            <ChevronLeft className="h-5 w-5" />
                        </div>
                        <span className="font-black text-deep-navy uppercase tracking-widest text-sm">Back to results</span>
                    </button>

                    <div className="text-right">
                        <h2 className="text-2xl font-black text-deep-navy">{bus?.name || 'Bus Operator'}</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{bus?.type || 'A/C Sleeper'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Bus Visualization */}
                    <div className="lg:col-span-8 flex flex-col items-center">
                        <div className="relative bg-gray-50/50 rounded-[60px] p-12 border-4 border-gray-100 shadow-inner max-w-2xl w-full">

                            {/* Dashboard / Driver Area */}
                            <div className="flex justify-between items-center mb-12 border-b-4 border-gray-100 pb-8 opacity-50">
                                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
                                    <div className="w-10 h-10 border-4 border-gray-300 rounded-full" />
                                </div>
                                <div className="text-right">
                                    <User className="h-8 w-8 text-gray-300 ml-auto mb-2" />
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Entrance</p>
                                </div>
                            </div>

                            {/* Seat Grid */}
                            <div className="grid grid-cols-5 gap-6">
                                {seatLayout.map((seat, index) => {
                                    const isAisle = (index + 1) % 5 === 3;
                                    const isSelected = selectedSeats.includes(seat.id);

                                    if (isAisle) return <div key={`aisle-${index}`} className="w-12" />;

                                    return (
                                        <div
                                            key={seat.id}
                                            onClick={() => toggleSeat(seat.id)}
                                            className={`
                                                aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 group relative
                                                ${seat.isOccupied
                                                    ? 'bg-gray-200 cursor-not-allowed'
                                                    : isSelected
                                                        ? 'bg-radiant-coral shadow-lg shadow-radiant-coral/30 scale-110'
                                                        : 'bg-white border-2 border-gray-100 hover:border-radiant-coral/40 hover:bg-radiant-coral/5'}
                                            `}
                                        >
                                            <Armchair
                                                className={`h-6 w-6 ${seat.isOccupied ? 'text-gray-400' : isSelected ? 'text-white' : 'text-gray-400 group-hover:text-radiant-coral'}`}
                                            />
                                            {!seat.isOccupied && !isSelected && (
                                                <span className="absolute -bottom-6 text-[8px] font-black text-gray-300 opacity-0 group-hover:opacity-100 uppercase tracking-tighter">₹{seat.price}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-12 flex items-center gap-12">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-white border-2 border-gray-100" />
                                <span className="text-[10px] font-black text-deep-navy uppercase tracking-widest">Available</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-radiant-coral shadow-lg shadow-radiant-coral/20" />
                                <span className="text-[10px] font-black text-deep-navy uppercase tracking-widest">Selected</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-gray-200" />
                                <span className="text-[10px] font-black text-deep-navy uppercase tracking-widest">Booked</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-8 rounded-[40px] border-none shadow-2xl bg-deep-navy text-white sticky top-32">
                            <h3 className="text-xl font-black mb-6 uppercase tracking-widest italic">Booking Summary</h3>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Selected Seats</span>
                                    <span className="text-lg font-black">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Total Fare</span>
                                    <span className="text-3xl font-black text-radiant-coral">₹{totalPrice}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleProceed}
                                disabled={selectedSeats.length === 0}
                                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all
                                    ${selectedSeats.length > 0
                                        ? 'bg-radiant-coral hover:bg-[#ff4d6d] shadow-xl shadow-radiant-coral/20 scale-100 hover:scale-[1.02] active:scale-95'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed'}
                                `}
                            >
                                Proceed to Pay
                            </button>

                            <div className="mt-12 space-y-4">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Amenities Provided</p>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all cursor-help" title="Charging Point">
                                        <Power className="h-4 w-4 text-white/40" />
                                    </div>
                                    <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all cursor-help" title="Snacks / Water">
                                        <Coffee className="h-4 w-4 text-white/40" />
                                    </div>
                                    <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all cursor-help" title="Free Wifi">
                                        <Wifi className="h-4 w-4 text-white/40" />
                                    </div>
                                    <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all cursor-help" title="Entertainment">
                                        <Tv className="h-4 w-4 text-white/40" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100">
                            <div className="flex gap-3">
                                <Info className="h-5 w-5 text-gray-400 shrink-0" />
                                <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
                                    Cancellation charges may apply as per operator policy. Verify your seat selection before proceeding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
