import React, { useState, useEffect } from 'react';
import { X, Bus, Star, Tag, Clock, MapPin, ChevronRight, Info, ShieldCheck, Wifi, Coffee, Power, User, Users, UserRound, GraduationCap, Armchair, ChevronDown, Wind, Snowflake, Zap, Tv, Moon, Check } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBookedSeats, createBooking } from '../api/bookingApi';

const formatDateToYYYYMMDD = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split(/[-\/]/);
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d)) return d.toISOString().split('T')[0];
    return dateStr;
};

const SeatSelectionOverlay = ({ isOpen, onClose, bus, searchParams, onProceed, isLoggedIn, triggerLogin, userLocation }) => {
    const prevBusIdRef = React.useRef(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Select seats, 2: Board/Drop point, 3: Passenger Info
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedBoarding, setSelectedBoarding] = useState(null);
    const [selectedDropping, setSelectedDropping] = useState(null);
    const [selectedDeck, setSelectedDeck] = useState('lower');
    const [activeInfoTab, setActiveInfoTab] = useState('Why book this bus?');

    // Women-only booking: initialized from search params, can also be toggled on this page
    const [isWomenOnly, setIsWomenOnly] = useState(!!(searchParams?.womenBooking));
    const [primaryPassenger, setPrimaryPassenger] = useState({
        name: '',
        age: '',
        gender: searchParams?.womenBooking ? 'Female' : 'Male'
    });
    const [contactDetails, setContactDetails] = useState({ phone: '', email: '', state: '' });
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponInput, setCouponInput] = useState('');

    const isSleeper = bus?.type?.toLowerCase().includes('sleeper');
    const [isStuck, setIsStuck] = useState(false);
    const [bookedSeats, setBookedSeats] = useState([]);

    // Reset state and fetch booked seats when overlay opens or bus changes
    React.useEffect(() => {
        if (isOpen && bus) {
            const currentBusId = bus.id || bus._id;

            // Only reset these if the actual bus changed, not if just coordinates/distances updated
            if (prevBusIdRef.current !== currentBusId) {
                console.log(">>> [FRONTEND] Bus ID changed or first open, resetting state");
                setSelectedSeats([]);
                setCurrentStep(1);
                setSelectedBoarding(null);
                setSelectedDropping(null);
                prevBusIdRef.current = currentBusId;
            } else {
                console.log(">>> [FRONTEND] Bus data updated (sync), preserving state");
            }

            const fetchBookedSeats = async () => {
                try {
                    const params = new URLSearchParams(window.location.search);
                    let journeyDate = params.get("date");
                    if (!journeyDate) {
                        journeyDate = formatDateToYYYYMMDD(searchParams?.date);
                    } else {
                        journeyDate = formatDateToYYYYMMDD(journeyDate);
                    }

                    let busIdUrl = params.get("busId");
                    const busId = busIdUrl || bus.busId || bus._id || bus.id;

                    if (busId && journeyDate) {
                        console.log(`[FRONTEND DEBUG] Fetching booked seats for busId: ${busId}, journeyDate: ${journeyDate}`);
                        const seats = await getBookedSeats(busId, journeyDate);
                        console.log(`[FRONTEND DEBUG] API returned bookedSeats:`, seats);
                        setBookedSeats(seats || []);
                    }
                } catch (err) {
                    console.error("Failed to fetch booked seats", err);
                }
            };
            fetchBookedSeats();

            // Auto-select nearest boarding point if available and none selected yet
            if (bus.boardingPoints && bus.boardingPoints.length > 0 && !selectedBoarding) {
                const pointsWithDistance = bus.boardingPoints.filter(p => p.distance !== null);
                console.log(">>> [FRONTEND] Points with distance:", pointsWithDistance.length);
                if (pointsWithDistance.length > 0) {
                    const nearest = pointsWithDistance.reduce((prev, curr) =>
                        parseFloat(curr.distance) < parseFloat(prev.distance) ? curr : prev
                    );
                    console.log(">>> [FRONTEND] Auto-selecting nearest:", nearest.location);
                    setSelectedBoarding(nearest);
                } else {
                    setSelectedBoarding(bus.boardingPoints[0]);
                }
            }
        }
    }, [isOpen, bus, searchParams?.date]);

    // Pre-fill user data when logged in
    React.useEffect(() => {
        if (isLoggedIn && bus) {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            setContactDetails({
                phone: userData?.mobile || userData?.phone || '',
                email: userData?.email || '',
                state: ''
            });
            setPrimaryPassenger(prev => ({ ...prev, name: userData?.name || userData?.fullName || '' }));
        }
    }, [isLoggedIn, bus]);

    // When isWomenOnly is toggled ON => force Female gender
    useEffect(() => {
        if (isWomenOnly) {
            setPrimaryPassenger(prev => ({ ...prev, gender: 'Female' }));
        }
    }, [isWomenOnly]);

    // Process Seat Layout from Database or Fallback to Mock
    const processedLayout = React.useMemo(() => {
        const bookedSeatsMap = bookedSeats.reduce((acc, s) => {
            acc[String(s.seatNo).trim().toLowerCase()] = s.gender;
            return acc;
        }, {});

        let baseLayout = [];
        if (bus?.seatLayout && bus.seatLayout.length > 0) {
            baseLayout = bus.seatLayout.map((s, index) => {
                const deckSeats = bus.seatLayout.filter(xs => xs.deck === s.deck);
                const deckIdx = deckSeats.findIndex(xs => xs.seatNo === s.seatNo);
                const cols = s.type === 'sleeper' ? 3 : 4;
                const seatStr = String(s.seatNo).trim().toLowerCase();
                const bookedGender = bookedSeatsMap[seatStr];

                return {
                    id: s._id || `seat-${index}`,
                    label: s.seatNo,
                    isOccupied: !!bookedGender,
                    bookedGender: bookedGender,
                    basePrice: s.baseFare || bus.baseFare || s.price || 0,
                    commission: s.commission || bus.commissionApplied || 0,
                    price: s.finalPrice || s.ticketPrice || bus.price || 0,
                    type: s.type,
                    deck: s.deck,
                    row: Math.floor(deckIdx / cols) + 1,
                    col: (deckIdx % cols) + 1
                };
            });
        } else {
            // Mock fallback for older buses
            baseLayout = [...Array.from({ length: 20 }, (_, k) => {
                const label = `L${k + 1}`;
                const seatStr = String(label).trim().toLowerCase();
                const bookedGender = bookedSeatsMap[seatStr];
                return {
                    id: `lower-${k}`, label, isOccupied: !!bookedGender, bookedGender: bookedGender,
                    price: 1000, type: 'seater', deck: 'lower', row: Math.floor(k / 4) + 1, col: (k % 4) + 1
                };
            }), ...Array.from({ length: 20 }, (_, k) => {
                const label = `U${k + 1}`;
                const seatStr = String(label).trim().toLowerCase();
                const bookedGender = bookedSeatsMap[seatStr];
                return {
                    id: `upper-${k}`, label, isOccupied: !!bookedGender, bookedGender: bookedGender,
                    price: 1000, type: 'seater', deck: 'upper', row: Math.floor(k / 4) + 1, col: (k % 4) + 1
                };
            })];
        }

        // Apply adjacency restriction (Ladies Only if neighbor is female)
        return baseLayout.map(seat => {
            if (seat.isOccupied) return seat;

            let adjacentCol;
            const isSleeper = seat.type.toLowerCase().includes('sleeper');
            if (isSleeper) {
                if (seat.col === 2) adjacentCol = 3;
                else if (seat.col === 3) adjacentCol = 2;
            } else {
                if (seat.col === 1) adjacentCol = 2;
                else if (seat.col === 2) adjacentCol = 1;
                else if (seat.col === 3) adjacentCol = 4;
                else if (seat.col === 4) adjacentCol = 3;
            }

            const adjacentSeat = baseLayout.find(s => s.deck === seat.deck && s.row === seat.row && s.col === adjacentCol);
            const isLadiesOnly = adjacentSeat?.bookedGender === 'Female' || seat.type.toLowerCase().includes('ladies');

            return { ...seat, isLadiesOnly };
        });
    }, [bus?.seatLayout, bookedSeats]);

    if (!isOpen || !bus) return null;

    const toggleSeat = (seatId) => {
        const seat = processedLayout.find(s => s.id === seatId);
        if (seat.isOccupied) return;

        // Block "ladies" seats or restricted adjacent seats if womenBooking is false
        if (seat.isLadiesOnly && !searchParams?.womenBooking) {
            toast.error("This seat is reserved for women. Male passengers cannot book this seat...", {
                position: "top-right",
                theme: "colored"
            });
            return;
        }

        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            } else {
                if (prev.length >= 6) {
                    toast.error("You can only select up to 6 seats at once.", { position: "top-right", theme: "colored" });
                    return prev;
                }
                return [...prev, seatId];
            }
        });
    };

    const selectedTotalBase = selectedSeats.reduce((acc, seatId) => {
        const seat = processedLayout.find(s => s.id === seatId);
        return acc + (seat?.basePrice || 0);
    }, 0);

    const selectedTotalCommission = selectedSeats.reduce((acc, seatId) => {
        const seat = processedLayout.find(s => s.id === seatId);
        return acc + (seat?.commission || 0);
    }, 0);

    const activeBaseFare = selectedTotalBase + selectedTotalCommission;
    const gst = Math.round(activeBaseFare * 0.02); // 2% GST
    const discount = appliedCoupon
        ? (appliedCoupon.discountType === 'percent'
            ? Math.round(activeBaseFare * appliedCoupon.discountValue / 100)
            : appliedCoupon.discountValue)
        : 0;
    const totalPrice = Math.max(0, activeBaseFare + gst - discount);

    const getSeatColor = (seat, isSelected) => {
        if (seat.isOccupied) {
            if (seat.bookedGender === 'Female') return 'bg-pink-100 border-pink-300 cursor-not-allowed text-pink-500';
            return 'bg-gray-100 border-gray-200 cursor-not-allowed';
        }
        if (isSelected) return 'bg-[#10B981] border-[#10B981] text-white';
        if (seat.isLadiesOnly) return 'bg-white border-[#FF69B4] text-[#FF69B4]';
        return 'bg-white border-[#10B981] text-[#10B981]';
    };

    const SteeringWheel = () => (
        <div className="absolute top-2 right-2 opacity-30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 12L2.7 9M12 12l9.3-3M12 12v9" />
            </svg>
        </div>
    );

    const Deck = ({ deckType, title }) => {
        const deckSeats = processedLayout.filter(s => s.deck === deckType);
        if (deckSeats.length === 0) return null;

        return (
            <div className="bg-white rounded-[1.2rem] border border-gray-100 py-3 pr-3 pl-1.5 w-fit shadow-sm relative">
                <div className="flex justify-between items-center mb-3 pr-1">
                    <h3 className="text-[9px] font-black text-gray-800 uppercase tracking-[0.2em] font-sans">{title}</h3>
                    {deckType === 'lower' && <SteeringWheel />}
                </div>

                <div className="grid grid-cols-4 gap-y-3 gap-x-2.5">
                    {deckSeats.map((seat) => {
                        const isSelected = selectedSeats.includes(seat.id);
                        const isSleeperSeat = seat.type === 'sleeper';
                        // For Seater: 2 |gap| 2. For Sleeper: 1 |gap| 2
                        let gridColClass = "";
                        if (isSleeperSeat) {
                            gridColClass = seat.col === 1 ? 'col-start-1' : (seat.col === 2 ? 'col-start-3' : 'col-start-4');
                        } else {
                            gridColClass = seat.col === 1 ? 'col-start-1' : (seat.col === 2 ? 'col-start-2' : (seat.col === 3 ? 'col-start-3' : 'col-start-4'));
                        }

                        return (
                            <div
                                key={seat.id}
                                className={`flex flex-col items-center gap-0.5 ${gridColClass}`}
                            >
                                <div
                                    onClick={() => toggleSeat(seat.id)}
                                    title={seat.isOccupied ? "Seat already booked" : `Seat ${seat.label} - ₹${seat.price}`}
                                    className={`rounded-md border-[1.5px] flex flex-col justify-end p-1 cursor-pointer transition-all
                                    ${isSleeperSeat ? 'h-14 w-[38px]' : 'h-10 w-[38px]'}
                                    ${getSeatColor(seat, isSelected)}`}
                                >
                                    <div className={`h-1.5 w-full rounded-[1px] mb-0.5 ${isSelected ? 'bg-white/40' : (seat.isOccupied ? 'bg-gray-400' : (seat.isLadiesOnly ? 'bg-pink-500/20' : 'bg-emerald-500/20'))}`} />
                                    <span className="text-[8px] font-black text-center mb-0.5 opacity-60">{seat.label}</span>
                                </div>
                                {!seat.isOccupied && (
                                    <span className={`text-[7px] font-black leading-none ${isSelected ? 'text-[#10B981]' : 'text-gray-400'} font-sans`}>
                                        ₹{seat.price}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const tabs = ['Why book this bus?', 'Bus route', 'Boarding point', 'Dropping point', 'Amenities', 'Booking policy'];

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center overflow-hidden transition-opacity"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={`bg-[#F3F4F6] w-full h-[96%] rounded-t-[1.2em] shadow-2xl flex flex-col relative overflow-hidden animate-slide-up font-inter`}>

                {/* RedBus-style Compact Header */}
                <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center gap-6">
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-50 rounded-lg transition-all active:scale-90"
                    >
                        <X className="h-6 w-6 text-gray-900 stroke-[2.5]" />
                    </button>
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900 font-outfit tracking-tight">
                            {bus.departurePoint || searchParams?.fromCity || 'Sangamwadi'}
                        </h3>
                        <ArrowRightIcon className="h-4 w-4 text-gray-300 stroke-[3]" />
                        <h3 className="text-xl font-bold text-gray-900 font-outfit tracking-tight">
                            {bus.arrivalPoint || searchParams?.toCity || 'Latur'}
                        </h3>
                    </div>
                </div>

                {/* Stepper Header */}
                <div className="bg-white border-b border-gray-100 py-4 shadow-sm relative z-10">
                    <div className="max-w-2xl mx-auto flex items-center justify-center gap-10 md:gap-16">
                        {[
                            { step: 1, label: 'SELECT SEATS' },
                            { step: 2, label: 'BOARD/DROP' },
                            { step: 3, label: 'PASSENGER' }
                        ].map((s) => (
                            <div
                                key={s.step}
                                className={`flex flex-col items-center gap-2 relative cursor-pointer group transition-all`}
                                onClick={() => {
                                    if (s.step === 1) setCurrentStep(1);
                                    else if (s.step === 2 && selectedSeats.length > 0) setCurrentStep(2);
                                    else if (s.step === 3 && selectedSeats.length > 0 && selectedBoarding && selectedDropping) setCurrentStep(3);
                                    else if (s.step > 1 && selectedSeats.length === 0) toast.error("Select a seat first");
                                    else if (s.step === 3 && (!selectedBoarding || !selectedDropping)) toast.error("Select boarding/dropping points");
                                }}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300
                                ${currentStep === s.step ? 'bg-[#D84E55] text-white' : currentStep > s.step ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {currentStep > s.step ? <Check className="h-3 w-3" /> : s.step}
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors font-outfit
                                ${currentStep === s.step ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
                    <div className="max-w-[1240px] mx-auto">
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_540px] gap-8">
                                {/* Left Panel: Seat selection */}
                                <div className="space-y-6 flex flex-col items-center">
                                    <div className="flex flex-col sm:flex-row gap-8 items-start justify-center">
                                        <Deck deckType="lower" title="Lower deck" />
                                        <Deck deckType="upper" title="Upper deck" />
                                    </div>
                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] pl-4 border-l-2 border-gray-100 flex items-center gap-2">
                                        Front
                                    </div>

                                    {/* Legend */}
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-10">
                                        {[
                                            { label: 'Available', color: 'bg-white border-emerald-500' },
                                            { label: 'Booked', color: 'bg-gray-100 border-gray-200 grayscale' },
                                            { label: 'Ladies', color: 'bg-white border-[#FF69B4]' },
                                            { label: 'Selected', color: 'bg-[#10B981] border-[#10B981]' }
                                        ].map(l => (
                                            <div key={l.label} className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded border ${l.color}`}></div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{l.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Panel: Bus Info & Details */}
                                <div className="space-y-8">
                                    {/* Bus Card */}
                                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-xl font-black text-gray-800 tracking-tight">{bus.name}</h2>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">20:30 - 08:00 • {searchParams?.date || 'Thu 05 Mar'}</p>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mt-0.5">{bus.type}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm shadow-green-100">
                                                    <Star className="h-3 w-3 fill-white" />
                                                    <span className="text-sm font-black">{bus.rating?.toFixed(1) || '4.5'}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">{bus.reviews || '1082'} ratings</span>
                                            </div>
                                        </div>

                                        {/* Image Gallery */}
                                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 mb-8 pr-4">
                                            {bus.images && bus.images.length > 0 ? (
                                                bus.images.map((img, i) => (
                                                    <div key={i} className="flex-shrink-0 w-[280px] aspect-video rounded-2xl bg-gray-100 overflow-hidden group">
                                                        <img
                                                            src={img}
                                                            alt={`Bus ${i + 1}`}
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex-shrink-0 w-full h-[200px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl">
                                                    <Bus className="h-10 w-10 text-gray-200 mb-2" />
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No images available for this bus</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Secondary Navigation (Tabs) */}
                                        <div className="flex gap-8 border-b border-gray-50 mb-8 overflow-x-auto no-scrollbar">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveInfoTab(tab)}
                                                    className={`pb-3 text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2
                                                ${activeInfoTab === tab ? 'text-[#D84E55] border-[#D84E55]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Dynamic Description Section */}
                                        <div className="space-y-6">
                                            {activeInfoTab === 'Bus route' && (
                                                <div className="space-y-4">
                                                    <h4 className="text-xl font-black text-gray-800 tracking-tight">Bus Route</h4>
                                                    <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                                        <div className="relative">
                                                            <div className="absolute -left-8 top-1 w-6 h-6 bg-white border-2 border-[#D84E55] rounded-full z-10 flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-[#D84E55] rounded-full"></div>
                                                            </div>
                                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Departure</p>
                                                            <p className="text-sm font-black text-gray-800 uppercase mt-1">{bus.departurePoint || searchParams?.fromCity}</p>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="absolute -left-8 top-1 w-6 h-6 bg-white border-2 border-gray-200 rounded-full z-10 flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                                                            </div>
                                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Destination</p>
                                                            <p className="text-sm font-black text-gray-800 uppercase mt-1">{bus.arrivalPoint || searchParams?.toCity}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeInfoTab === 'Why book this bus?' && (
                                                <>
                                                    <h4 className="text-xl font-black text-gray-800 tracking-tight">Why book this bus?</h4>
                                                    <div className="bg-[#FFF4F6] p-6 rounded-3xl border border-pink-50 space-y-6">
                                                        <h5 className="text-[12px] font-black text-gray-700 uppercase tracking-tight">Highly rated by women for</h5>
                                                        <div className="flex flex-wrap gap-4">
                                                            {[
                                                                { label: 'Punctuality', val: '254' },
                                                                { label: 'Staff behavior', val: '239' },
                                                                { label: 'Driving', val: '238' },
                                                                { label: 'Seat / Sleep Comfort', val: '224' }
                                                            ].map(tag => (
                                                                <div key={tag.label} className="bg-white px-3 py-1.5 rounded-lg border border-pink-100 flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold text-gray-600 tracking-tight">{tag.label} ({tag.val})</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {activeInfoTab === 'Boarding point' && (
                                                <div className="space-y-4">
                                                    <h4 className="text-xl font-black text-gray-800 tracking-tight uppercase">Boarding Points</h4>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {(bus.boardingPoints || []).map((point, i) => (
                                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                                <div className="flex items-start gap-4">
                                                                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                                                    <div>
                                                                        <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{point.location}</p>
                                                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{point.address || 'Near main bus stop'}</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-black text-[#D84E55]">{point.time}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {activeInfoTab === 'Dropping point' && (
                                                <div className="space-y-4">
                                                    <h4 className="text-xl font-black text-gray-800 tracking-tight uppercase">Dropping Points</h4>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {(bus.droppingPoints || []).map((point, i) => (
                                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                                <div className="flex items-start gap-4">
                                                                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                                                    <div>
                                                                        <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{point.location}</p>
                                                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{point.address || 'Central drop point'}</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-black text-blue-500">{point.time}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {activeInfoTab === 'Amenities' && (
                                                <div className="space-y-4">
                                                    <h4 className="text-xl font-black text-gray-800 tracking-tight uppercase">Bus Amenities</h4>
                                                    {bus.amenities && bus.amenities.length > 0 ? (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {bus.amenities.map((amenity, i) => {
                                                                const lower = amenity.toLowerCase();
                                                                let Icon = Star;
                                                                if (lower.includes('wifi')) Icon = Wifi;
                                                                else if (lower.includes('ac')) Icon = Wind;
                                                                else if (lower.includes('charging') || lower.includes('power')) Icon = Power;
                                                                else if (lower.includes('blanket') || lower.includes('pillow')) Icon = Coffee; // Generic comfort icon
                                                                else if (lower.includes('tv') || lower.includes('entertainment')) Icon = Tv;
                                                                else if (lower.includes('water')) Icon = Coffee;

                                                                return (
                                                                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                                                            <Icon className="h-5 w-5 text-[#D84E55]" />
                                                                        </div>
                                                                        <span className="text-sm font-black text-gray-800">{amenity}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                                            <Star className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                                            <p className="text-sm font-black text-gray-500 uppercase tracking-widest">No Amenities Listed</p>
                                                            <p className="text-[11px] text-gray-400 mt-1">Basic travel facilities apply.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {activeInfoTab === 'Booking policy' && (
                                                <div className="space-y-4">
                                                    <h4 className="text-xl font-black text-gray-800 tracking-tight uppercase">Cancellation & Booking Policy</h4>
                                                    <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 space-y-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                                                <Clock className="w-4 h-4 text-orange-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-gray-800">12 hours before departure</p>
                                                                <p className="text-xs text-gray-600 mt-1">100% refund (minus payment gateway charges). Cancellation is not allowed within 12 hours of journey.</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-4 pt-4 border-t border-orange-200/50">
                                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                                                <ShieldCheck className="w-4 h-4 text-orange-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-gray-800">Luggage Policy</p>
                                                                <p className="text-xs text-gray-600 mt-1">Up to 15kg of personal luggage is allowed per passenger. Extra luggage may be charged.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Bar for Step 1 */}
                                    <div className="bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-8 flex flex-col gap-6">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">SELECTED SEATS ({selectedSeats.length})</p>
                                                <div className="flex flex-wrap gap-2 text-[11px] font-black text-gray-800">
                                                    {selectedSeats.length > 0 ? selectedSeats.map(id => processedLayout.find(s => s.id === id)?.label).join(', ') : 'None'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TOTAL FARE</p>
                                                <p className="text-2xl font-black text-gray-900 leading-none">₹{totalPrice}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Incl. ₹{gst} GST (2%)</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (!isLoggedIn) {
                                                    toast.error("Please login to proceed with booking.", { position: "top-right", theme: "colored" });
                                                    if (triggerLogin) triggerLogin(() => { });
                                                    return;
                                                }
                                                if (selectedSeats.length === 0) {
                                                    toast.error("Please select a seat first", { position: "top-right", theme: "colored" });
                                                    return;
                                                }
                                                setCurrentStep(2);
                                            }}
                                            className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]
                                        ${selectedSeats.length > 0 ? 'bg-[#D84E55] text-white hover:bg-[#C13E44] shadow-red-500/20' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}
                                        >
                                            CONTINUE TO BOARDING
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Boarding Points Card */}
                                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-xl font-black text-gray-800 tracking-tight uppercase">Boarding Points</h4>
                                            {(() => {
                                                const points = (bus.boardingPoints || []).filter(p => p.distance !== null);
                                                const nearest = points.length > 0 ? points.reduce((prev, curr) =>
                                                    parseFloat(curr.distance) < parseFloat(prev.distance) ? curr : prev
                                                ) : null;

                                                if (nearest) {
                                                    return (
                                                        <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl flex items-center gap-2 animate-bounce-subtle">
                                                            <span className="text-lg">⭐</span>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Nearest Found</span>
                                                                <span className="text-[11px] font-bold text-emerald-600">{nearest.location}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>
                                        <div className="space-y-4">
                                            {(() => {
                                                const points = (bus.boardingPoints || []).filter(p => p.distance !== null);
                                                const minDistance = points.length > 0 ? Math.min(...points.map(p => parseFloat(p.distance))) : null;
                                                const sorted = [...(bus.boardingPoints || [])].sort((a, b) => {
                                                    if (a.distance === null) return 1;
                                                    if (b.distance === null) return -1;
                                                    return parseFloat(a.distance) - parseFloat(b.distance);
                                                });

                                                const nearest = sorted.find(p => p.distance !== null && parseFloat(p.distance) === minDistance);
                                                const others = sorted.filter(p => p !== nearest);

                                                return (
                                                    <div className="space-y-6">
                                                        {nearest && (
                                                            <div className="space-y-3">
                                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-1">⭐ Nearest Boarding Point</p>
                                                                <label
                                                                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:bg-red-50/30
                                                                    ${(selectedBoarding && selectedBoarding.location === nearest.location) ? 'bg-red-50 border-[#D84E55]' : 'bg-gray-50 border-gray-100'}
                                                                    ring-2 ring-red-200 ring-offset-2`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name="boarding"
                                                                        className="mt-1 accent-[#D84E55]"
                                                                        checked={selectedBoarding && selectedBoarding.location === nearest.location}
                                                                        onChange={() => setSelectedBoarding(nearest)}
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-center">
                                                                            <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{nearest.location}</p>
                                                                            <div className="flex flex-col items-end">
                                                                                <span className="text-xs font-black text-[#D84E55]">{nearest.time}</span>
                                                                                <span className="text-[9px] font-bold text-gray-400 mt-0.5">{nearest.distance} km away</span>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{nearest.address || 'Near main station'}</p>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        )}

                                                        {others.length > 0 && (
                                                            <div className="space-y-3">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Other options:</p>
                                                                <div className="space-y-3">
                                                                    {others.map((point, i) => (
                                                                        <label
                                                                            key={i}
                                                                            className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:bg-red-50/30
                                                                            ${(selectedBoarding && selectedBoarding.location === point.location) ? 'bg-red-50 border-[#D84E55]' : 'bg-gray-50 border-gray-100'}`}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                name="boarding"
                                                                                className="mt-1 accent-[#D84E55]"
                                                                                checked={selectedBoarding && selectedBoarding.location === point.location}
                                                                                onChange={() => setSelectedBoarding(point)}
                                                                            />
                                                                            <div className="flex-1">
                                                                                <div className="flex justify-between items-center">
                                                                                    <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{point.location}</p>
                                                                                    <div className="flex flex-col items-end">
                                                                                        <span className="text-xs font-black text-[#D84E55]">{point.time}</span>
                                                                                        {point.distance && <span className="text-[9px] font-bold text-gray-400 mt-0.5">{point.distance} km away</span>}
                                                                                    </div>
                                                                                </div>
                                                                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{point.address || 'Standard stop'}</p>
                                                                            </div>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Dropping Points Card */}
                                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                                        <h4 className="text-xl font-black text-gray-800 tracking-tight mb-6 uppercase">Dropping Points</h4>
                                        <div className="space-y-4">
                                            {(bus.droppingPoints || []).map((point, i) => (
                                                <label
                                                    key={i}
                                                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:bg-blue-50/30
                                                    ${(selectedDropping && selectedDropping.location === point.location) ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-100'}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="dropping"
                                                        className="mt-1 accent-blue-500"
                                                        checked={selectedDropping && selectedDropping.location === point.location}
                                                        onChange={() => {
                                                            setSelectedDropping(point);
                                                            toast.success(`Dropping: ${point.location} selected`, { autoClose: 1000 });
                                                        }}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{point.location}</p>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-xs font-black text-blue-500">{point.time}</span>
                                                                {point.distance && <span className="text-[9px] font-bold text-gray-400 mt-0.5">{point.distance} km away</span>}
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{point.address || 'Central drop point'}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar for Step 2 */}
                                <div className="bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-8 flex flex-col gap-6">
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors flex items-center gap-2"
                                        >
                                            <ChevronRight className="h-4 w-4 rotate-180" /> Back to Seats
                                        </button>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TOTAL FARE</p>
                                            <p className="text-2xl font-black text-gray-900 leading-none">₹{totalPrice}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Incl. ₹{gst} GST (2%)</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!selectedBoarding || !selectedDropping) {
                                                toast.error("Please select boarding and dropping point", { position: "top-right", theme: "colored" });
                                                return;
                                            }
                                            setCurrentStep(3);
                                        }}
                                        className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]
                                        ${selectedBoarding && selectedDropping ? 'bg-[#D84E55] text-white hover:bg-[#C13E44] shadow-red-500/20' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}
                                    >
                                        CONTINUE TO PASSENGER INFO
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 animate-fade-in pb-12">
                                {/* Left Column: Forms */}
                                <div className="space-y-6">
                                    {/* Passenger Details Card */}
                                    <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 sm:p-8">
                                        {/* Header: title + Women-Only Toggle */}
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-2xl font-black text-gray-800 tracking-tight font-outfit">Passenger details</h4>
                                            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                                                <div className="text-right hidden sm:block">
                                                    <span className="text-[12px] font-bold text-gray-800 block leading-tight">Booking for Women</span>
                                                    <span className="text-[10px] font-semibold text-[#108ece] group-hover:underline">
                                                        {isWomenOnly ? 'Women-only mode' : 'Know more'}
                                                    </span>
                                                </div>
                                                <div className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={isWomenOnly}
                                                        onChange={() => setIsWomenOnly(prev => !prev)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-300 rounded-full peer
                                                        peer-checked:after:translate-x-full peer-checked:after:border-white
                                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                                        after:bg-white after:border-gray-300 after:border after:rounded-full
                                                        after:h-5 after:w-5 after:transition-all
                                                        peer-checked:bg-[#D84E55] transition-colors duration-300" />
                                                </div>
                                            </label>
                                        </div>

                                        {/* Women-Only Helper Banner */}
                                        {isWomenOnly && (
                                            <div className="flex items-center gap-3 px-4 py-3 mb-5 bg-pink-50 border border-pink-200 rounded-2xl">
                                                <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                                                    <Info className="h-4 w-4 text-pink-500" />
                                                </div>
                                                <p className="text-[11px] font-bold text-pink-700">
                                                    Only female passengers allowed for this booking. Male option is disabled.
                                                </p>
                                            </div>
                                        )}

                                        {/* Primary Passenger Form Only */}
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between pointer-events-none">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-emerald-50 text-emerald-700 w-11 h-11 rounded-full flex items-center justify-center border border-emerald-100">
                                                            <UserRound className="h-5 w-5 fill-emerald-700/20" strokeWidth={2.5} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[15px] font-bold text-gray-800">Primary Passenger</p>
                                                            <p className="text-[12px] font-semibold text-gray-400 mt-0.5">
                                                                Booking {selectedSeats.length} seat(s): {selectedSeats.map(id => processedLayout.find(s => s.id === id)?.label).join(", ")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-5 pt-2">
                                                    <div className="relative group">
                                                        <input type="text" value={primaryPassenger.name} onChange={e => setPrimaryPassenger({ ...primaryPassenger, name: e.target.value })} className="w-full bg-white border border-gray-300 hover:border-gray-400 rounded-xl px-4 pt-6 pb-2 text-[15px] font-semibold text-gray-900 focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all peer placeholder-transparent" placeholder="Name" />
                                                        <label className="absolute left-4 top-2 text-[11px] font-semibold text-gray-500 transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] pointer-events-none">Name *</label>
                                                    </div>

                                                    <div className="relative group">
                                                        <input type="number" value={primaryPassenger.age} onChange={e => setPrimaryPassenger({ ...primaryPassenger, age: e.target.value })} className="w-full bg-white border border-gray-300 hover:border-gray-400 rounded-xl px-4 pt-6 pb-2 text-[15px] font-semibold text-gray-900 focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all peer placeholder-transparent" placeholder="Age" />
                                                        <label className="absolute left-4 top-2 text-[11px] font-semibold text-gray-500 transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] pointer-events-none">Age *</label>
                                                    </div>

                                                    {/* Gender — smart behavior when isWomenOnly */}
                                                    <div className="space-y-3">
                                                        <label className="text-[13px] font-semibold text-gray-500 ml-1">Gender *</label>
                                                        <div className={`flex gap-4 rounded-2xl transition-colors duration-300 ${isWomenOnly ? 'p-1 bg-pink-50 border border-pink-200' : ''}`}>
                                                            {/* Male — disabled when isWomenOnly */}
                                                            <label className={`flex-1 flex items-center justify-between rounded-2xl px-5 py-3.5 select-none transition-all duration-300
                                                                ${isWomenOnly
                                                                    ? 'bg-gray-100 border border-gray-200 opacity-50 cursor-not-allowed'
                                                                    : 'bg-white border border-gray-300 cursor-pointer hover:border-gray-400 has-[:checked]:border-gray-800 has-[:checked]:bg-gray-50 group'
                                                                }`}>
                                                                <span className={`text-[15px] font-semibold ${isWomenOnly ? 'text-gray-400' : 'text-gray-800'}`}>Male</span>
                                                                <input
                                                                    type="radio"
                                                                    name="primary-gender"
                                                                    disabled={isWomenOnly}
                                                                    checked={primaryPassenger.gender === 'Male'}
                                                                    onChange={() => !isWomenOnly && setPrimaryPassenger({ ...primaryPassenger, gender: 'Male' })}
                                                                    className="hidden"
                                                                />
                                                                <div className={`w-[22px] h-[22px] rounded-full border-2 transition-all
                                                                    ${primaryPassenger.gender === 'Male' && !isWomenOnly ? 'border-[6px] border-gray-800' : 'border-gray-300'}`}></div>
                                                            </label>
                                                            {/* Female — highlighted when isWomenOnly */}
                                                            <label className={`flex-1 flex items-center justify-between rounded-2xl px-5 py-3.5 cursor-pointer select-none transition-all duration-300
                                                                ${primaryPassenger.gender === 'Female'
                                                                    ? isWomenOnly
                                                                        ? 'bg-pink-50 border-2 border-[#D84E55] shadow-md shadow-pink-200/60'
                                                                        : 'bg-gray-50 border-2 border-gray-800'
                                                                    : 'bg-white border border-gray-300 hover:border-gray-400'
                                                                }`}>
                                                                <span className={`text-[15px] font-semibold transition-colors duration-300
                                                                    ${primaryPassenger.gender === 'Female' ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
                                                                    Female
                                                                </span>
                                                                <input
                                                                    type="radio"
                                                                    name="primary-gender"
                                                                    checked={primaryPassenger.gender === 'Female'}
                                                                    onChange={() => setPrimaryPassenger({ ...primaryPassenger, gender: 'Female' })}
                                                                    className="hidden"
                                                                />
                                                                <div className={`w-[22px] h-[22px] rounded-full border-2 transition-all
                                                                    ${primaryPassenger.gender === 'Female'
                                                                        ? isWomenOnly ? 'border-[6px] border-[#D84E55]' : 'border-[6px] border-gray-800'
                                                                        : 'border-gray-300'}`}></div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Details Card */}
                                    <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 sm:p-8">
                                        <div className="mb-6">
                                            <h4 className="text-2xl font-black text-gray-800 tracking-tight font-outfit">Contact details</h4>
                                            <p className="text-[13px] font-semibold text-gray-500 mt-1">Ticket details will be sent to</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex rounded-xl overflow-hidden border border-gray-300 focus-within:border-gray-800 focus-within:ring-1 focus-within:ring-gray-800 transition-all">
                                                <div className="w-[120px] bg-gray-50 border-r border-gray-300 px-4 py-3 flex flex-col justify-center cursor-pointer hover:bg-gray-100 transition-colors group">
                                                    <span className="text-[10px] text-gray-500 font-semibold mb-0.5">Country Code</span>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[14px] font-bold text-gray-900">+91 (IND)</span>
                                                        <svg className="w-4 h-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1 bg-white relative">
                                                    <input type="tel" value={contactDetails.phone} onChange={e => setContactDetails({ ...contactDetails, phone: e.target.value })} className="w-full h-full px-4 pt-6 pb-2 text-[15px] font-bold text-gray-900 focus:outline-none bg-transparent peer placeholder-transparent" placeholder="Phone" />
                                                    <label className="absolute left-4 top-2 text-[11px] font-semibold text-gray-500 transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] pointer-events-none">Phone *</label>
                                                </div>
                                            </div>

                                            <div className="relative group">
                                                <input type="email" value={contactDetails.email} onChange={e => setContactDetails({ ...contactDetails, email: e.target.value })} className="w-full bg-white border border-gray-300 hover:border-gray-400 rounded-xl px-4 py-4 text-[15px] font-semibold text-gray-900 focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all peer placeholder-transparent" placeholder="Email ID" />
                                                <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-gray-500 transition-all peer-focus:text-[11px] peer-focus:top-3 peer-focus:-translate-y-0 peer-valid:text-[11px] peer-valid:top-3 peer-valid:-translate-y-0 pointer-events-none">Email ID</label>
                                            </div>

                                            <div className="space-y-1 pt-2">
                                                <div className="relative group">
                                                    <select value={contactDetails.state} onChange={e => setContactDetails({ ...contactDetails, state: e.target.value })} className="w-full bg-white border border-gray-300 hover:border-gray-400 rounded-xl px-4 py-4 text-[15px] font-semibold focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all appearance-none text-gray-500 group-hover:text-gray-800 outline-none">
                                                        <option value="" disabled hidden>State of Residence *</option>
                                                        <option value="mh">Maharashtra</option>
                                                        <option value="ka">Karnataka</option>
                                                        <option value="dl">Delhi</option>
                                                        <option value="gj">Gujarat</option>
                                                    </select>
                                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                                <p className="text-[12px] text-gray-400 font-medium ml-1">Required for GST Tax Invoicing</p>
                                            </div>

                                            <div className="pt-6 pb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.549 4.18 1.597 6.002l-1.688 6.175 6.321-1.658c1.761 1.01 3.771 1.543 5.801 1.543 6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zm0 21.821c-1.801 0-3.566-.484-5.111-1.4l-.367-.217-3.801.996 1.015-3.705-.238-.379C2.456 15.397 1.892 13.737 1.892 12.03 1.892 6.429 6.429 1.892 12.031 1.892c5.602 0 10.139 4.537 10.139 10.139 0 5.601-4.537 10.138-10.139 10.138z" /></svg>
                                                    </div>
                                                    <span className="text-[13px] font-semibold text-gray-800">Send booking details and trip updates on WhatsApp</span>
                                                </div>

                                                {/* Toggle Switch */}
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D84E55]"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Order Summary & Actions */}
                                <div className="space-y-6">
                                    {/* Trip Summary Card */}
                                    <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 sm:p-8 top-6 sticky">
                                        <div className="border-b border-gray-100 pb-5 mb-6">
                                            <h4 className="text-[16px] font-black text-gray-900 tracking-tight font-outfit leading-tight">{bus.name || 'Sangitam Travels'}</h4>
                                            <p className="text-[12px] font-semibold text-gray-500 mt-1">{selectedSeats.length} seat(s) • {bus.type || 'A/C Sleeper (2+1)'}</p>
                                        </div>

                                        <div className="relative pl-[18px] space-y-8 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 border-b border-gray-100 pb-8 mb-6">
                                            <div className="relative">
                                                <div className="absolute -left-[20px] top-1 w-2.5 h-2.5 bg-gray-600 rounded-full z-10 border-2 border-white ring-2 ring-transparent"></div>
                                                <div className="flex gap-4">
                                                    <span className="text-[15px] font-black text-gray-900 w-12">{selectedBoarding?.time || '23:50'}</span>
                                                    <div>
                                                        <span className="text-[15px] font-bold text-gray-900 leading-tight block">{selectedBoarding?.location || 'Shewalewadi Parking No 1'}</span>
                                                        <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{searchParams?.date || '29 Mar'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute left-[-22px] top-[40%] bg-white py-1 text-[11px] font-bold text-gray-400 z-10 hidden sm:block">
                                                {bus.duration || '7h 20m'}
                                            </div>

                                            <div className="relative">
                                                <div className="absolute -left-[20px] top-1 w-2.5 h-2.5 bg-gray-600 rounded-full z-10 border-2 border-white ring-2 ring-transparent"></div>
                                                <div className="flex gap-4">
                                                    <span className="text-[15px] font-black text-gray-900 w-12">{selectedDropping?.time || '07:10'}</span>
                                                    <div>
                                                        <span className="text-[15px] font-bold text-gray-900 leading-tight block">{selectedDropping?.location || 'Rajiv Gandhi Chowk'}</span>
                                                        <p className="text-[11px] font-semibold text-gray-500 mt-0.5">30 Mar</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h5 className="text-[14px] font-black text-gray-900 mb-1">Seat details</h5>
                                            <p className="text-[12px] font-medium text-gray-500 mb-3">{selectedSeats.length} seat(s)</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSeats.map(id => {
                                                    const s = processedLayout.find(xs => xs.id === id);
                                                    return (
                                                        <div key={id} className="bg-emerald-50 px-2.5 py-1 rounded-[6px] border border-emerald-100/50 text-[11px] font-bold text-emerald-800">
                                                            {s?.label || '2U'} • {s?.deck === 'upper' ? 'Upper deck' : 'Lower deck'}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-6 mb-6">
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                                    <span>Base Fare</span>
                                                    <span>₹{selectedTotalBase}</span>
                                                </div>
                                                <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                                    <span>Platform Fee</span>
                                                    <span>₹{selectedTotalCommission}</span>
                                                </div>
                                                <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                                    <span>GST (2%)</span>
                                                    <span>₹{gst}</span>
                                                </div>
                                                {discount > 0 && (
                                                    <div className="flex justify-between text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                                                        <span>Discount</span>
                                                        <span>-₹{discount}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">TOTAL PAYABLE</p>
                                                    <p className="text-3xl font-black text-gray-900 leading-none">₹{totalPrice}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <button
                                                onClick={async () => {
                                                    if (!isLoggedIn) {
                                                        toast.error("Please login to book tickets", { position: "top-right", theme: "colored" });
                                                        if (triggerLogin) triggerLogin(() => { });
                                                        return;
                                                    }

                                                    // Validation
                                                    if (!primaryPassenger.name || !primaryPassenger.age || !primaryPassenger.gender) {
                                                        toast.error("Please fill all primary passenger details", { position: "top-right", theme: "colored" });
                                                        return;
                                                    }
                                                    // Women-only validation
                                                    if (isWomenOnly && primaryPassenger.gender !== 'Female') {
                                                        toast.error("Only female passengers allowed for this booking.", { position: "top-right", theme: "colored" });
                                                        return;
                                                    }
                                                    if (!contactDetails.phone || !contactDetails.email || !contactDetails.state) {
                                                        toast.error("Please fill all contact details including state", { position: "top-right", theme: "colored" });
                                                        return;
                                                    }

                                                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                                                    const seatsMapped = selectedSeats.map(id => processedLayout.find(s => s.id === id)).filter(Boolean);

                                                    const params = new URLSearchParams(window.location.search);
                                                    let urlDate = params.get('date');
                                                    let finalJourneyDate = urlDate ? formatDateToYYYYMMDD(urlDate) : (formatDateToYYYYMMDD(searchParams?.date || bus?.departureDate) || new Date().toISOString().split('T')[0]);
                                                    const totalCommission = seatsMapped.reduce((acc, s) => acc + (s.commission || 0), 0);
                                                    const totalBaseFare = seatsMapped.reduce((acc, s) => acc + (s.basePrice || s.price || 0), 0);

                                                    const bookingPayload = {
                                                        userId: userData.id || userData._id || null,
                                                        busId: bus?.busId || bus?._id || bus?.id,
                                                        journeyDate: finalJourneyDate,
                                                        boardingPoint: selectedBoarding?.location || searchParams?.from || '',
                                                        droppingPoint: selectedDropping?.location || searchParams?.to || '',
                                                        boarding: {
                                                            point: selectedBoarding?.location || searchParams?.from || '',
                                                            time: selectedBoarding?.time || ''
                                                        },
                                                        dropping: {
                                                            point: selectedDropping?.location || searchParams?.to || '',
                                                            time: selectedDropping?.time || ''
                                                        },
                                                        selectedSeats: seatsMapped.map(s => s.label),
                                                        passengers: seatsMapped.map(s => ({
                                                            name: primaryPassenger.name,
                                                            age: Number(primaryPassenger.age),
                                                            gender: primaryPassenger.gender,
                                                            seatNumber: s.label
                                                        })),
                                                        contactDetails,
                                                        baseFare: totalBaseFare,
                                                        commission: totalCommission,
                                                        gst,
                                                        discount,
                                                        totalFare: totalPrice,
                                                        totalAmount: totalPrice,
                                                        couponCode: appliedCoupon?.code || couponInput || ''
                                                    };

                                                    try {
                                                        const data = await createBooking(bookingPayload);

                                                        if (data.success || data.bookingId) {
                                                            const bId = data.bookingId || data.booking?._id;
                                                            onProceed({
                                                                seats: seatsMapped,
                                                                boarding: selectedBoarding,
                                                                dropping: selectedDropping,
                                                                bookingId: bId
                                                            });
                                                        } else {
                                                            toast.error(data.message || 'Failed to create booking.', { position: "top-right", theme: "colored" });
                                                        }
                                                    } catch (err) {
                                                        console.error(err);
                                                        toast.error(err.message || 'Failed to connect to the server.', { position: "top-right", theme: "colored" });
                                                    }
                                                }}
                                                className="w-full py-4 rounded-2xl bg-[#D84E55] text-white font-black text-[15px] uppercase tracking-widest transition-all shadow-xl hover:bg-[#C13E44] shadow-red-500/20 active:scale-[0.98]"
                                            >
                                                PROCEED TO PAYMENT
                                            </button>
                                            <button
                                                onClick={() => setCurrentStep(2)}
                                                className="w-full py-4 rounded-2xl bg-white text-gray-600 border border-gray-200 font-bold text-[14px] transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
                                            >
                                                <ChevronRight className="h-4 w-4 rotate-180" /> Back to Points
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div >
    );
};
const ArrowRightIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export default SeatSelectionOverlay;
