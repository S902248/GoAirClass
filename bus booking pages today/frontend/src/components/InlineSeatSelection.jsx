import React, { useState } from 'react';
import { Info, Armchair, User, Power, Coffee, Wifi, Tv, ShieldCheck, Search, MapPin, Check, ChevronDown, Users, UserRound, GraduationCap } from 'lucide-react';

const InlineSeatSelection = ({ bus, onProceed, isLoggedIn }) => {
    const boardingPoints = bus?.boardingPoints || [];
    const droppingPoints = bus?.droppingPoints || [];

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [activeTab, setActiveTab] = useState('boarding'); // 'boarding' | 'dropping'
    const [selectedBoarding, setSelectedBoarding] = useState(null);
    const [selectedDropping, setSelectedDropping] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDeck, setSelectedDeck] = useState('lower');

    const isSleeper = bus?.type?.toLowerCase().includes('sleeper');

    // Mock seat data with types and prices (Lower & Upper)
    const [seatLayout, setSeatLayout] = useState(() =>
        Array.from({ length: 48 }, (_, i) => {
            const types = ['standard', 'women', 'senior', 'handicap'];
            const typeProb = Math.random();
            let type = 'standard';
            if (typeProb > 0.9) type = 'handicap';
            else if (typeProb > 0.8) type = 'senior';
            else if (typeProb > 0.65) type = 'women';

            const deck = i < 24 ? 'lower' : 'upper';
            const label = `${deck === 'lower' ? 'L' : 'U'}${i % 24 + 1}`;

            return {
                id: i + 1,
                label,
                isOccupied: Math.random() < 0.3,
                price: (bus?.price || 1000) + (Math.random() > 0.8 ? 200 : 0),
                type: type,
                deck: deck
            };
        })
    );

    const toggleSeat = (seatId) => {
        const seat = seatLayout.find(s => s.id === seatId);
        if (seat.isOccupied) return;

        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    const updateSeatType = (seatId, newType) => {
        setSeatLayout(prev => prev.map(s =>
            s.id === seatId ? { ...s, type: newType } : s
        ));
    };

    const totalPrice = selectedSeats.reduce((acc, seatId) => {
        const seat = seatLayout.find(s => s.id === seatId);
        return acc + (seat?.price || 0);
    }, 0);

    const getSeatColor = (seat, isSelected) => {
        if (seat.isOccupied) return 'bg-gray-100 cursor-not-allowed grayscale opacity-40';

        const baseClasses = isSelected
            ? 'shadow-lg ring-2 ring-radiant-coral/50 z-10 scale-105'
            : 'hover:scale-105 hover:z-10 focus-within:ring-2 focus-within:ring-radiant-coral/20';

        switch (seat.type) {
            case 'women':
                return `${baseClasses} ${isSelected ? 'bg-pink-500 border-pink-600' : 'bg-pink-50 border-pink-100 hover:bg-pink-100'}`;
            case 'senior':
                return `${baseClasses} ${isSelected ? 'bg-orange-500 border-orange-600' : 'bg-orange-50 border-orange-100 hover:bg-orange-100'}`;
            case 'handicap':
                return `${baseClasses} ${isSelected ? 'bg-blue-500 border-blue-600' : 'bg-blue-50 border-blue-100 hover:bg-blue-100'}`;
            default:
                return `${baseClasses} ${isSelected ? 'bg-deep-navy border-deep-navy' : 'bg-white border-gray-100 hover:border-radiant-coral/40 hover:bg-radiant-coral/5'}`;
        }
    };

    const getIconColor = (seat, isSelected) => {
        if (seat.isOccupied) return 'text-gray-300';
        if (isSelected) return 'text-white';

        switch (seat.type) {
            case 'women': return 'text-pink-400';
            case 'senior': return 'text-orange-400';
            case 'handicap': return 'text-blue-400';
            default: return 'text-gray-300 group-hover:text-radiant-coral';
        }
    };

    const getSeatIndicator = (type) => {
        switch (type) {
            case 'women': return 'W';
            case 'senior': return 'S';
            case 'handicap': return 'H';
            default: return null;
        }
    };

    const filteredPoints = (activeTab === 'boarding' ? boardingPoints : droppingPoints).filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const canProceed = selectedSeats.length > 0 && selectedBoarding && selectedDropping;

    return (
        <div className="bg-[#fcfcfc] border-t border-gray-100 p-8 animate-in slide-in-from-top duration-300">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">

                    {/* Left Side: Bus Decks */}
                    <div className="space-y-6">

                        {/* Deck Switcher Tabs */}
                        {isSleeper && (
                            <div className="flex gap-2 mb-4 bg-gray-100/50 p-1 rounded-xl w-fit border border-gray-200">
                                {['lower', 'upper'].map(deck => (
                                    <button
                                        key={deck}
                                        onClick={() => setSelectedDeck(deck)}
                                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedDeck === deck ? 'bg-white text-radiant-coral shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {deck} Deck
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <div className="relative bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-[0_20px_50px_-20px_rgba(0_0_0_/_0.05)] w-full max-w-2xl overflow-hidden">

                                {/* Steering & Entrance */}
                                <div className="flex justify-between items-center mb-12 border-b border-gray-50 pb-8">
                                    <div className="flex items-center gap-4 opacity-40">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border-b-4 border-gray-200">
                                            <div className="w-9 h-9 border-4 border-gray-200 rounded-full flex items-center justify-center shadow-inner">
                                                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Driver</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-1.5 rounded-full">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{selectedDeck} Deck</p>
                                    </div>
                                    <div className="opacity-20 flex flex-col items-center">
                                        <div className="w-8 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                            <div className="w-5 h-2 bg-gray-300 rounded-full" />
                                        </div>
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-tighter mt-1">Entrance</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-x-4 gap-y-8">
                                    {seatLayout.filter(s => s.deck === selectedDeck).map((seat, index) => {
                                        const isSelected = selectedSeats.includes(seat.id);
                                        const isAisle = (index + 1) % 3 === 0;
                                        const indicator = getSeatIndicator(seat.type);

                                        return (
                                            <React.Fragment key={seat.id}>
                                                <div
                                                    onClick={() => toggleSeat(seat.id)}
                                                    className={`
                                                        ${isSleeper ? 'h-24 w-12' : 'aspect-square w-12'} rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group relative border-2
                                                        ${getSeatColor(seat, isSelected)}
                                                    `}
                                                >
                                                    <div className={`text-[8px] font-black absolute top-1 left-1.5 transition-opacity ${isSelected ? 'text-white/60' : 'text-gray-300'}`}>{seat.label}</div>

                                                    {indicator && !isSelected && (
                                                        <div className={`absolute top-1 right-1.5 text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-md 
                                                            ${seat.type === 'women' ? 'bg-pink-100 text-pink-500' :
                                                                seat.type === 'senior' ? 'bg-orange-100 text-orange-500' :
                                                                    'bg-blue-100 text-blue-500'}`}
                                                        >
                                                            {indicator}
                                                        </div>
                                                    )}

                                                    <Armchair className={`h-4 w-4 transition-transform duration-500 ${getIconColor(seat, isSelected)} ${isSleeper ? 'rotate-90' : ''} ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />

                                                    {!seat.isOccupied && (
                                                        <span className={`absolute -bottom-6 text-[8px] font-black transition-all whitespace-nowrap ${isSelected ? 'text-radiant-coral' : 'text-gray-400 opacity-60 group-hover:opacity-100'}`}>
                                                            ₹{seat.price}
                                                        </span>
                                                    )}
                                                </div>
                                                {isAisle && <div className="w-6" />} {/* Aisle */}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm grid grid-cols-3 md:grid-cols-5 gap-4">
                            {[
                                { color: 'bg-white border-gray-200', text: 'Available' },
                                { color: 'bg-gray-100 border-gray-200 grayscale', text: 'Booked' },
                                { color: 'bg-deep-navy border-deep-navy ring-1 ring-radiant-coral/30', text: 'Selected' },
                                { color: 'bg-pink-50 border-pink-100', text: 'Women' },
                                { color: 'bg-orange-50 border-orange-100', text: 'Senior' }
                            ].map((l, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-lg flex items-center justify-center border-2 ${l.color}`}>
                                        {l.text === 'Women' && <span className="text-[6px] font-black text-pink-400">W</span>}
                                        {l.text === 'Senior' && <span className="text-[6px] font-black text-orange-400">S</span>}
                                    </div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{l.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Tabbed Sidebar */}
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden flex flex-col h-[700px]">

                        {/* Tabs */}
                        <div className="flex bg-gray-50 border-b border-gray-100">
                            {[
                                { id: 'boarding', label: 'Boarding', icon: selectedBoarding },
                                { id: 'dropping', label: 'Dropping', icon: selectedDropping }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-4 px-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative
                                        ${activeTab === tab.id ? 'text-radiant-coral bg-white' : 'text-gray-400 hover:text-gray-600'}
                                    `}
                                >
                                    {tab.icon && <Check className="h-3 w-3 text-green-500" />}
                                    {tab.label}
                                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-radiant-coral" />}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                            {/* Search Bar - only show if there's enough points */}
                            <div className="p-4 border-b border-gray-50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-300" />
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeTab === 'boarding' ? 'Boarding' : 'Dropping'} Point`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:border-radiant-coral focus:ring-4 focus:ring-radiant-coral/5 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Points List */}
                            <div className="flex-1 overflow-y-auto p-3 no-scrollbar space-y-2">
                                {filteredPoints.map(point => {
                                    const isSelected = activeTab === 'boarding'
                                        ? selectedBoarding?.id === point.id
                                        : selectedDropping?.id === point.id;

                                    return (
                                        <div
                                            key={point.id}
                                            onClick={() => activeTab === 'boarding' ? setSelectedBoarding(point) : setSelectedDropping(point)}
                                            className={`p-4 rounded-2xl cursor-pointer transition-all border-2 group
                                                ${isSelected ? 'border-radiant-coral bg-radiant-coral/5 shadow-sm' : 'border-transparent hover:bg-gray-50'}
                                            `}
                                        >
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-radiant-coral' : 'border-gray-200'}`}>
                                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-radiant-coral animate-in zoom-in duration-300" />}
                                                    </div>
                                                    <h4 className={`text-[11px] font-black uppercase tracking-tight ${isSelected ? 'text-deep-navy' : 'text-gray-700'}`}>{point.name}</h4>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                                                    <span>{point.time}</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 pl-8 group-hover:text-gray-500 transition-colors uppercase leading-relaxed">{point.address}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Selected Seats Passenger Assignment */}
                            {selectedSeats.length > 0 && (
                                <div className="border-t border-gray-100 bg-white p-5 animate-in slide-in-from-bottom duration-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-deep-navy flex items-center gap-2">
                                            <Users className="h-4 w-4 text-radiant-coral" />
                                            Passenger Selection
                                        </h3>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{selectedSeats.length} Selected</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar p-1">
                                        {selectedSeats.map(seatId => {
                                            const seat = seatLayout.find(s => s.id === seatId);
                                            return (
                                                <div key={seatId} className="relative group/seat">
                                                    <div className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all cursor-pointer select-none
                                                        ${seat.type === 'women' ? 'bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-100' :
                                                            seat.type === 'senior' ? 'bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-100' :
                                                                'bg-gray-50 border-gray-100 text-deep-navy hover:bg-gray-100'}`}
                                                        onClick={() => {
                                                            const types = ['standard', 'women', 'senior'];
                                                            const nextType = types[(types.indexOf(seat.type) + 1) % types.length];
                                                            updateSeatType(seatId, nextType);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {seat.type === 'women' ? <UserRound className="h-3 w-3" /> :
                                                                seat.type === 'senior' ? <GraduationCap className="h-3 w-3" /> :
                                                                    <User className="h-3 w-3" />}
                                                            <span className="text-xs font-black uppercase">{seat.label}</span>
                                                        </div>
                                                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">
                                                            {seat.type === 'standard' ? 'General' : seat.type}
                                                        </span>
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 bg-radiant-coral text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover/seat:opacity-100 transition-opacity">
                                                        <ChevronDown className="h-2 w-2" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Summary & Proceed */}
                        <div className="bg-gray-50 p-8 border-t border-gray-100 space-y-5">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                        Total Fare
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-deep-navy tracking-tighter">₹{totalPrice === 0 ? bus?.price : totalPrice}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Excl. taxes</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onProceed(selectedSeats.map(id => seatLayout.find(s => s.id === id)))}
                                    disabled={!canProceed}
                                    className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all relative overflow-hidden group
                                            ${canProceed
                                            ? 'bg-radiant-coral text-white shadow-xl shadow-radiant-coral/20 hover:shadow-2xl hover:shadow-radiant-coral/30 hover:scale-[1.05] active:scale-95'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                        `}
                                >
                                    <span className="relative z-10">{isLoggedIn ? 'Proceed to Book' : 'Login to Book'}</span>
                                    {canProceed && (
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    )}
                                </button>
                            </div>

                            {!canProceed && selectedSeats.length > 0 && (
                                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-2xl border border-pink-100">
                                    <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center shrink-0 shadow-sm shadow-pink-200">
                                        <Info className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <p className="text-[9px] font-black text-pink-600 uppercase tracking-tight">Select {!selectedBoarding ? 'Boarding' : 'Dropping'} point to proceed</p>
                                </div>
                            )}

                            {canProceed && !isLoggedIn && (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100 animate-pulse">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
                                        <ShieldCheck className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-tight">Sign in required to confirm your booking</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InlineSeatSelection;
