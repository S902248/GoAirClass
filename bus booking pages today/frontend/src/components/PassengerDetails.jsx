import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, User, Phone, Mail, ShieldCheck, ArrowRight,
    UserPlus, ChevronDown, ChevronUp, MapPin, Clock, Info,
    CreditCard, CheckCircle2, Armchair, Star, GraduationCap, UserRound
} from 'lucide-react';
import { createBooking } from '../api/bookingApi';

const PassengerDetails = ({ bus, seats, setView, setPassengers, searchParams }) => {
    const navigate = useNavigate();
    // seats is now an array of objects: { id, label, type, price, ... }
    const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(true);
    const [localPassengers, setLocalPassengers] = useState(
        seats.map(seat => ({
            seatId: seat.id,
            seatLabel: seat.label,
            seatType: seat.type,
            name: '',
            age: seat.type === 'senior' ? '65' : '',
            gender: seat.type === 'women' ? 'Female' : 'Male'
        }))
    );

    const [contact, setContact] = useState({
        email: '',
        phone: ''
    });

    const handlePassengerChange = (index, field, value) => {
        const updated = [...localPassengers];
        updated[index][field] = value;
        setLocalPassengers(updated);
    };

    const handleContactChange = (field, value) => {
        let val = value;
        if (field === 'phone') val = value.replace(/\D/g, '').slice(0, 10);
        setContact(prev => ({ ...prev, [field]: val }));
    };

    const handleBooking = (e) => {
        e.preventDefault();

        // Basic Validation
        const isAllPassengersFilled = localPassengers.every(p => p.name.trim() !== '' && p.age !== '');
        if (!isAllPassengersFilled) {
            alert('Please fill in all passenger details.');
            return;
        }

        if (!contact.email || contact.phone.length !== 10) {
            alert('Please provide valid contact email and 10-digit mobile number.');
            return;
        }

        // Pass to global state
        if (typeof setPassengers === 'function') {
            setPassengers(localPassengers);
        }

        // Save local passenger detail snapshot to localStorage (Optional, to use as fallback)
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.email = contact.email;
        userData.mobile = contact.phone;
        localStorage.setItem('userData', JSON.stringify(userData));

        const baseFareLocal = seats.reduce((acc, seat) => acc + (seat.price || bus?.price || 1000), 0);
        const taxesLocal = Math.round(baseFareLocal * 0.05);

        const bookingPayload = {
            userId: userData.id || userData._id || null,
            busId: bus?.busId || bus?._id || bus?.id,
            journeyDate: searchParams?.date || bus?.departureDate || new Date().toISOString().split('T')[0],
            selectedSeats: localPassengers.map(p => p.seatLabel || p.seatId),
            passengers: localPassengers.map(p => ({
                name: p.name,
                age: Number(p.age),
                gender: p.gender,
                seatNumber: p.seatLabel || p.seatId
            })),
            contactDetails: {
                phone: contact.phone,
                email: contact.email,
                state: "Maharashtra" // Default/hardcoded based on existing UI
            },
            totalAmount: (baseFareLocal + taxesLocal) - 50
        };

        createBooking(bookingPayload)
            .then(data => {
                if (data.success || data.bookingId) {
                    const bId = data.bookingId || data.booking?._id;
                    navigate(`/payment/${bId}`);
                } else {
                    alert(data.message || 'Failed to create booking.');
                }
            })
            .catch(err => {
                console.error(err);
                alert(err.message || 'Failed to connect to the server.');
            });
    };

    // Calculate fare based on individual seat prices from the selection
    const baseFare = seats.reduce((acc, seat) => acc + (seat.price || bus?.price || 1000), 0);
    const taxes = Math.round(baseFare * 0.05); // 5% GST
    const totalAmount = baseFare + taxes;

    return (
        <div className="pt-28 pb-20 min-h-screen bg-[#f3f4f9]">

            {/* Top Navigation Bar Branding */}
            <div className="bg-white border-b border-gray-200 py-3 mb-6 sticky top-20 z-40 shadow-sm hidden md:block">
                <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-[11px] font-black text-deep-navy uppercase tracking-widest border-b-2 border-radiant-coral pb-1">
                            <span className="bg-radiant-coral text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]">1</span>
                            Passenger Details
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest pb-1 opacity-50">
                            <span className="bg-gray-200 text-gray-500 w-4 h-4 rounded-full flex items-center justify-center text-[8px]">2</span>
                            Payment
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-radiant-coral uppercase tracking-widest">
                        <span>Offers: RETURN500W Applied</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-radiant-coral animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

                    <div className="space-y-6">

                        {/* Trip Details Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setIsTripDetailsOpen(!isTripDetailsOpen)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all border-b border-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-sm font-black text-deep-navy uppercase tracking-widest">Trip Details</h3>
                                </div>
                                {isTripDetailsOpen ? <ChevronUp className="h-5 w-5 text-gray-300" /> : <ChevronDown className="h-5 w-5 text-gray-300" />}
                            </button>

                            {isTripDetailsOpen && (
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center min-w-[80px]">
                                                    <p className="text-lg font-black text-deep-navy leading-none">{bus?.departure || '22:30'}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">20 Feb 2026</p>
                                                </div>
                                                <div className="flex-1 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full border border-gray-300" />
                                                    <div className="flex-1 h-px border-t border-dashed border-gray-200" />
                                                    <div className="px-3 py-1 bg-gray-50 rounded-full text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{bus?.duration || '06h 45m'}</div>
                                                    <div className="flex-1 h-px border-t border-dashed border-gray-200" />
                                                    <div className="w-2 h-2 rounded-full bg-deep-navy" />
                                                </div>
                                                <div className="text-center min-w-[80px]">
                                                    <p className="text-lg font-black text-deep-navy leading-none">{bus?.arrival || '05:15'}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">21 Feb 2026</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-[11px] font-bold text-gray-600 uppercase tracking-tighter italic">
                                                <span>{bus?.fromCity || 'Pune'} ({bus?.departurePoint || 'Wakad'})</span>
                                                <span>{bus?.toCity || 'Mumbai'} ({bus?.arrivalPoint || 'Borivali'})</span>
                                            </div>
                                        </div>
                                        <div className="md:w-[220px] md:pl-8 md:border-l border-gray-100">
                                            <p className="text-sm font-black text-deep-navy mb-1">{bus?.name || 'Zingbus Plus'}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">{bus?.type || 'A/C Sleeper (2+1)'}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Premium Fleet</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact Details Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-50">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-black text-deep-navy uppercase tracking-widest">Contact Details</h3>
                            </div>
                            <div className="p-8">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-8">Your Ticket and Bus Info will be sent here.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-deep-navy uppercase tracking-widest ml-1">Mobile Number</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3">
                                                <span className="text-sm font-black text-gray-400">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={contact.phone}
                                                onChange={(e) => handleContactChange('phone', e.target.value)}
                                                className="w-full pl-20 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black focus:border-radiant-coral outline-none transition-all"
                                                placeholder="Mobile Number"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-deep-navy uppercase tracking-widest ml-1">Email ID</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={contact.email}
                                                onChange={(e) => handleContactChange('email', e.target.value)}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black focus:border-radiant-coral outline-none transition-all"
                                                placeholder="Email ID"
                                            />
                                            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Passenger Details Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-50">
                                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-black text-deep-navy uppercase tracking-widest">Passenger Details</h3>
                            </div>
                            <div className="p-8 space-y-12">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">Please enter details as per Govt. ID for smooth boarding.</p>

                                {localPassengers.map((p, idx) => (
                                    <div key={p.seatId} className="space-y-6 bg-gray-50/30 p-6 rounded-3xl border border-gray-100 relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-deep-navy/5">
                                        {/* Seat Label Pill */}
                                        <div className="absolute -top-3 left-6 flex items-center gap-2">
                                            <div className="bg-deep-navy text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                                                <Armchair className="h-3 w-3" />
                                                Seat {p.seatLabel}
                                            </div>
                                            {p.seatType !== 'standard' && (
                                                <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2
                                                    ${p.seatType === 'women' ? 'bg-pink-100 text-pink-600' :
                                                        p.seatType === 'senior' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-blue-100 text-blue-600'}`}>
                                                    {p.seatType === 'women' ? <UserRound className="h-3 w-3" /> :
                                                        p.seatType === 'senior' ? <GraduationCap className="h-3 w-3" /> :
                                                            <ShieldCheck className="h-3 w-3" />}
                                                    {p.seatType} Preference
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_200px] gap-6 w-full pt-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="As per Government ID"
                                                    value={p.name}
                                                    onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                                                    className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-black focus:border-radiant-coral outline-none transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                                                <input
                                                    type="number"
                                                    placeholder="Age"
                                                    value={p.age}
                                                    onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                                                    className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-black focus:border-radiant-coral outline-none transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                                                <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
                                                    {['Male', 'Female'].map(g => (
                                                        <button
                                                            key={g}
                                                            type="button"
                                                            onClick={() => handlePassengerChange(idx, 'gender', g)}
                                                            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                                                ${p.gender === g ? 'bg-radiant-coral shadow-md text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
                                                            `}
                                                        >
                                                            {g}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Abhi Assured / Protection Section (Visual Only) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
                            <div className="flex flex-col items-center text-center mb-10">
                                <div className="bg-blue-50 text-blue-600 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest mb-4">GAC Assured</div>
                                <h3 className="text-sm font-black text-deep-navy uppercase tracking-[0.1em] flex items-center gap-2">
                                    Secure your trip only at ₹99
                                    <Info className="h-3 w-3 opacity-30 cursor-pointer" />
                                </h3>
                            </div>
                            <div className="grid grid-cols-3 gap-8 mb-10">
                                {[
                                    { icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50', title: 'Zero Cancellation', desc: 'if cancelled by you' },
                                    { icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-50', title: 'Travel Guarantee', desc: '1.5x Refund' },
                                    { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', title: 'Money back', desc: 'for delays' }
                                ].map((it, i) => (
                                    <div key={i} className="flex flex-col items-center text-center group">
                                        <div className={`w-14 h-14 rounded-2xl ${it.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500`}>
                                            <it.icon className={`h-7 w-7 ${it.color}`} strokeWidth={1.5} />
                                        </div>
                                        <h4 className="text-[11px] font-black text-deep-navy mb-1 uppercase tracking-tight leading-none">{it.title}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase leading-relaxed tracking-tighter">{it.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <div className="p-6 rounded-2xl border-2 border-radiant-coral bg-radiant-coral/5 flex items-center justify-between cursor-pointer group shadow-lg shadow-radiant-coral/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-5 h-5 rounded-full border-2 border-radiant-coral flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-radiant-coral" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black text-deep-navy uppercase tracking-widest">Secure this booking only</h4>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5 tracking-tighter">Recommended for peace of mind</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#1e1ea0] text-white text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-sm">Most Popular</div>
                                </div>
                                <div className="p-6 rounded-2xl border border-gray-100 hover:bg-gray-50 flex items-center gap-4 cursor-pointer transition-all">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                                    <div>
                                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">No, I don't want this</h4>
                                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-0.5 tracking-tighter italic">I understand the risks</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Fare Details Sidebar */}
                    <div className="space-y-6 lg:sticky lg:top-32">
                        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-8">
                                    <div>
                                        <h3 className="text-lg font-black text-deep-navy leading-none mb-2 tracking-tight uppercase">Fare Summary</h3>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Price details for {seats.length} seats</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-gray-300" />
                                    </div>
                                </div>

                                <div className="space-y-5 mb-10">
                                    <div className="flex justify-between items-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                        <span>Base Fare</span>
                                        <span className="text-deep-navy">₹{baseFare}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                        <span>Taxes & GST (5%)</span>
                                        <span className="text-deep-navy">₹{taxes}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-black text-green-500 uppercase tracking-widest">
                                        <span>Discounts</span>
                                        <span>-₹50</span>
                                    </div>
                                    <div className="pt-5 border-t border-gray-50 flex justify-between items-baseline">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Total Payable</span>
                                            <span className="text-4xl font-black text-deep-navy tracking-tighter">₹{totalAmount - 50}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-10 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 text-center leading-relaxed uppercase tracking-tight">
                                        By proceeding, I agree to the <span className="text-blue-500 cursor-pointer hover:underline">Fare Rules</span> and <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>
                                    </p>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    className="w-full py-5 rounded-3xl bg-radiant-coral text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-radiant-coral/30 hover:shadow-radiant-coral/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                                >
                                    Proceed to Pay <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        {/* Offers / Extra Sections */}
                        <div className="bg-gradient-to-br from-deep-navy to-[#1e1b4b] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-radiant-coral/10 rounded-full -mr-16 -mt-16 blur-3xl transition-transform group-hover:scale-150 duration-700" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md">
                                        <Star className="h-4 w-4 fill-radiant-coral text-radiant-coral" />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Exclusive Offer</h4>
                                </div>
                                <p className="text-lg font-black mb-1 tracking-tight italic">Saved extra ₹50!</p>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-6 leading-relaxed">Promo applied successfully at checkout.</p>
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">GACSPRING</span>
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PassengerDetails;
