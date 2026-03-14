import React from 'react';
import { Bus, Info } from 'lucide-react';

const SteeringWheel = () => (
    <div className="flex justify-end mb-6 pb-6 border-b border-gray-100">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a3 3 0 1 0-7.82 0 8.974 8.974 0 0 1 7.82 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.625v-2.95m0 0a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25Z" />
        </svg>
    </div>
);

const SeaterSeat = ({ seat }) => (
    <div className="relative group cursor-not-allowed">
        <div className="w-8 h-10 border-2 border-gray-300 rounded-md bg-white flex items-center justify-center transition-all">
            <div className="absolute top-1 w-5 h-1.5 bg-gray-200 rounded-full"></div>
            <span className="text-[10px] font-bold text-gray-500">{seat.seatNo}</span>
        </div>
    </div>
);

const SleeperSeat = ({ seat }) => (
    <div className="relative group cursor-not-allowed">
        <div className="w-12 h-20 border-2 border-gray-300 rounded-md bg-white flex flex-col items-center justify-center transition-all">
            {/* Pillow marker */}
            <div className="absolute top-1.5 w-8 h-3 bg-gray-200 rounded-md"></div>
            <span className="text-[11px] font-bold text-gray-500 mt-2">{seat.seatNo}</span>
        </div>
    </div>
);

const SeaterLayout = ({ seats }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Seater Deck</h4>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm inline-block min-w-full">
                <SteeringWheel />
                <div className="grid grid-cols-[auto_auto_40px_auto_auto] gap-x-3 gap-y-4 place-items-center">
                    {seats.map((seat, i) => (
                        <React.Fragment key={seat.seatNo}>
                            {i > 0 && i % 4 === 2 && <div className="w-full h-full" />}
                            <SeaterSeat seat={seat} />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SleeperLayoutDeck = ({ seats, title, hasSteering = false }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{title}</h4>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm inline-block min-w-full">
                {hasSteering && <SteeringWheel />}
                <div className="grid grid-cols-[auto_60px_auto] gap-x-4 gap-y-6 place-items-center">
                    {seats.map((seat, i) => (
                        <React.Fragment key={seat.seatNo}>
                            {i > 0 && i % 2 === 1 && <div className="w-full h-full" />}
                            <SleeperSeat seat={seat} />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

const HybridLayout = ({ seaterSeats, lowerSleeperSeats, upperSleeperSeats }) => {
    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Lower Deck (Hybrid)</h4>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm inline-block min-w-full">
                    <SteeringWheel />

                    <div className="mb-8 border-b border-gray-100 pb-8">
                        {/* Front Seater Section */}
                        <div className="grid grid-cols-[auto_auto_40px_auto_auto] gap-x-3 gap-y-4 place-items-center mb-2">
                            {seaterSeats.map((seat, i) => (
                                <React.Fragment key={seat.seatNo}>
                                    {i > 0 && i % 4 === 2 && <div className="w-full h-full" />}
                                    <SeaterSeat seat={seat} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Back Sleeper Section */}
                    <div>
                        <div className="grid grid-cols-[auto_60px_auto] gap-x-4 gap-y-6 place-items-center">
                            {lowerSleeperSeats.map((seat, i) => (
                                <React.Fragment key={seat.seatNo}>
                                    {i > 0 && i % 2 === 1 && <div className="w-full h-full" />}
                                    <SleeperSeat seat={seat} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {upperSleeperSeats.length > 0 && (
                <SleeperLayoutDeck seats={upperSleeperSeats} title="Upper Deck" />
            )}
        </div>
    );
};

const SeatLayoutPreview = ({ seatLayout = [], busType = 'Seater' }) => {

    if (!seatLayout || seatLayout.length === 0) {
        return (
            <div className="bg-white/5 border border-dashed border-white/20 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center">
                <Info className="h-8 w-8 text-white/40 mb-3" />
                <p className="text-sm font-bold text-white/60">Generate a layout to preview</p>
            </div>
        );
    }

    const lowerSeats = seatLayout.filter(s => s.deck === 'lower');
    const upperSeats = seatLayout.filter(s => s.deck === 'upper');

    // For Hybrid
    const seaterSeats = seatLayout.filter(s => s.type === 'seater');
    const hybridLowerSleepers = seatLayout.filter(s => s.type === 'sleeper' && s.deck === 'lower');
    const hybridUpperSleepers = seatLayout.filter(s => s.type === 'sleeper' && s.deck === 'upper');

    return (
        <div className="mt-6 w-full max-h-[600px] overflow-y-auto custom-scrollbar pr-4 rounded-[2rem] bg-white p-6 shadow-transparent">
            {busType === 'Seater' && (
                <SeaterLayout seats={lowerSeats} />
            )}

            {busType === 'Sleeper' && (
                <div className="space-y-4">
                    <SleeperLayoutDeck seats={lowerSeats} title="Lower Deck" hasSteering={true} />
                    {upperSeats.length > 0 && <SleeperLayoutDeck seats={upperSeats} title="Upper Deck" />}
                </div>
            )}

            {busType === 'Sleeper + Seater' && (
                <HybridLayout
                    seaterSeats={seaterSeats}
                    lowerSleeperSeats={hybridLowerSleepers}
                    upperSleeperSeats={hybridUpperSleepers}
                />
            )}

            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-gray-300 bg-white"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-300"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-400"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ladies</span>
                </div>
            </div>
        </div>
    );
};

export default SeatLayoutPreview;
