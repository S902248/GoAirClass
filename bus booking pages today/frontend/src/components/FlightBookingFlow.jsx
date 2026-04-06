import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plane, ShieldCheck, Check, CreditCard, Users, Gift, Lock,
    ArrowRight, Plus, Trash2, Mail, Smartphone, AlertTriangle,
    Timer, Luggage, Eye, ChevronDown, Zap, RefreshCw, Package,
    CheckCircle2, Armchair, Info, Star, Coffee
} from 'lucide-react';
import axios from '../api/Axios';
import { message, Select as AntSelect, DatePicker, Input as AntInput } from 'antd';
import dayjs from 'dayjs';
import FlightSeatSelection from './FlightSeatSelection';

const { Option } = AntSelect;

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: 'Review' },
    { id: 2, label: 'Travellers' },
    { id: 3, label: 'Add-ons' },
    { id: 4, label: 'Seats' },
    { id: 5, label: 'Payment' },
];

const NATIONALITY_LIST = ['Indian', 'American', 'British', 'Canadian', 'Australian', 'Emirati', 'Singaporean', 'German', 'French', 'Japanese'];

const SEAT_COLS = ['A', 'B', 'C', 'D', 'E', 'F'];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

/** Reusable form field wrapper */
const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-1.5">
        {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>}
        {children}
        {error && <span className="text-[10px] text-red-500 font-bold">{error}</span>}
    </div>
);

/** Styled input */
const Input = React.forwardRef(({ className = '', ...props }, ref) => (
    <input
        ref={ref}
        className={`h-[50px] border border-gray-200 rounded-2xl px-4 font-semibold text-sm text-gray-800 
        focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] transition-all
        placeholder:text-gray-300 bg-white ${className}`}
        {...props}
    />
));

/** Styled select */
const Select = ({ className = '', children, ...props }) => (
    <select
        className={`h-[50px] border border-gray-200 rounded-2xl px-4 font-semibold text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] transition-all bg-white ${className}`}
        {...props}
    >
        {children}
    </select>
);

/** Section card */
const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-[32px] border border-gray-100 shadow-[0_4px_24px_rgba(0_0_0_/_0.04)] ${className}`}>
        {children}
    </div>
);

/** Card header */
const CardHeader = ({ icon: Icon, title, color = 'bg-[#003580]' }) => (
    <div className={`${color} px-8 py-5 rounded-t-[32px] flex items-center gap-3 text-white`}>
        <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center"><Icon className="w-4 h-4" /></div>
        <h2 className="font-black text-base uppercase tracking-widest">{title}</h2>
    </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const FlightBookingFlow = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [flight, setFlight] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Travellers state
    const [travellers, setTravellers] = useState([
        { id: Date.now(), title: 'Mr', firstName: '', lastName: '', gender: 'Male', dob: '', nationality: 'Indian', passportNumber: '', passportExpiry: '', frequentFlyer: '' }
    ]);
    const [travellerErrors, setTravellerErrors] = useState([{}]);

    // Contact state
    const [contact, setContact] = useState({ email: '', mobile: '', countryCode: '+91', gst: '', saveDetails: true });
    const [contactErrors, setContactErrors] = useState({});

    // Add-ons
    const [addons, setAddons] = useState({ insurance: false, baggage: false, priority: false });

    const [selectedSeats, setSelectedSeats] = useState([]); // [{seatNumber, passengerId, ...}]

    // Payment
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [payLoading, setPayLoading] = useState(false);

    // ── Load flight from session ──
    useEffect(() => {
        const saved = sessionStorage.getItem('selectedFlight');
        if (!saved) { navigate('/flights'); return; }
        setFlight(JSON.parse(saved));
    }, [navigate]);

    // ── Pre-fill user profile ──
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('/users/profile');
                const user = response.data;
                
                // Prefill first traveller if empty
                setTravellers(prev => {
                    if (prev.length > 0 && !prev[0].firstName && !prev[0].lastName) {
                        const updated = [...prev];
                        updated[0] = {
                            ...updated[0],
                            firstName: user.firstName || user.fullName?.split(' ')[0] || '',
                            lastName: user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '',
                            gender: user.gender || 'Male',
                            nationality: user.nationality || 'Indian',
                            dob: user.dob ? dayjs(user.dob).format('YYYY-MM-DD') : '',
                            passportNumber: user.passportNumber || '',
                            passportExpiry: user.passportExpiry ? dayjs(user.passportExpiry).format('YYYY-MM-DD') : '',
                            frequentFlyer: user.frequentFlyer || ''
                        };
                        return updated;
                    }
                    return prev;
                });

                // Prefill contact info if empty
                setContact(prev => ({
                    ...prev,
                    email: user.email || prev.email,
                    mobile: user.mobileNumber || prev.mobile
                }));
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);


    // ── Fare calculation ──
    const baseFare = flight ? flight.price * travellers.length : 0;
    const taxes = Math.round(baseFare * 0.12);
    const convenience = 350 * travellers.length;
    const addonTotal = (addons.insurance ? 199 : 0) + (addons.baggage ? 999 : 0) + (addons.priority ? 299 : 0);
    const seatTotal = selectedSeats.reduce((acc, ss) => acc + (ss.price || 0), 0);
    const total = baseFare + taxes + convenience + addonTotal + seatTotal;

    // ── Validation ──
    const validateTravellers = () => {
        const errs = travellers.map(t => {
            const e = {};
            if (!t.firstName || t.firstName.length < 2) e.firstName = 'Min 2 characters';
            if (!t.lastName || t.lastName.length < 2) e.lastName = 'Min 2 characters';
            if (!t.dob) e.dob = 'Required';
            else if (new Date(t.dob) >= new Date()) e.dob = 'Must be in the past';
            if (!t.passportNumber || t.passportNumber.length < 5) e.passportNumber = 'Invalid passport number';
            if (!t.passportExpiry) e.passportExpiry = 'Required';
            else if (new Date(t.passportExpiry) <= new Date()) e.passportExpiry = 'Must be a future date';
            return e;
        });
        setTravellerErrors(errs);
        return errs.every(e => Object.keys(e).length === 0);
    };

    const validateContact = () => {
        const e = {};
        if (!contact.email || !/\S+@\S+\.\S+/.test(contact.email)) e.email = 'Valid email required';
        if (!contact.mobile || !/^\d{10}$/.test(contact.mobile)) e.mobile = '10-digit number required';
        setContactErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = useCallback(() => {
        if (step === 2 && (!validateTravellers() || !validateContact())) return;
        setStep(s => Math.min(s + 1, 5));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step, travellers, contact]);

    const handleBack = () => {
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Traveller helpers ──
    const updateTraveller = (idx, field, val) => {
        setTravellers(prev => prev.map((t, i) => i === idx ? { ...t, [field]: val } : t));
    };
    const addTraveller = () => {
        setTravellers(prev => [...prev, { id: Date.now(), title: 'Mr', firstName: '', lastName: '', gender: 'Male', dob: '', nationality: 'Indian', passportNumber: '', passportExpiry: '', frequentFlyer: '' }]);
        setTravellerErrors(prev => [...prev, {}]);
    };
    const removeTraveller = (idx) => {
        setTravellers(prev => prev.filter((_, i) => i !== idx));
        setTravellerErrors(prev => prev.filter((_, i) => i !== idx));
    };

    // ── Seat helpers ──
    const handleSeatClick = (seat) => {
        if (seat.booked) return;
        const passenger = travellers[activePassengerIdx];
        const alreadySelected = selectedSeats.find(s => s.seatNumber === seat.seatNumber);
        if (alreadySelected) {
            setSelectedSeats(prev => prev.filter(s => s.seatNumber !== seat.seatNumber));
            return;
        }
        if (selectedSeats.length >= travellers.length) {
            message.warning('All passengers already have seats assigned.');
            return;
        }
        setSelectedSeats(prev => [...prev, { seatNumber: seat.seatNumber, passengerId: passenger.id, passengerName: `${passenger.firstName} ${passenger.lastName}`, price: seat.price }]);
        const nextUnassigned = travellers.findIndex((t, i) => i > activePassengerIdx && !selectedSeats.some(s => s.passengerId === t.id));
        if (nextUnassigned !== -1) setActivePassengerIdx(nextUnassigned);
    };

    // ── Payment ──
    const handlePayment = async () => {
        try {
            setPayLoading(true);

            // Build payload matching CreateFlightBooking controller contract
            const baseFareVal = flight.price * travellers.length;
            const taxesVal = Math.round(baseFareVal * 0.12);
            const seatFeeVal = selectedSeats.reduce((a, s) => a + (s.price || 0), 0);

            const payload = {
                flightId: flight._id,
                passengers: travellers.map(t => {
                    const seat = selectedSeats.find(s => s.passengerId === t.id);
                    return {
                        firstName: t.firstName,
                        lastName: t.lastName,
                        gender: t.gender,
                        dateOfBirth: t.dob,
                        nationality: t.nationality,
                        passportNumber: t.passportNumber,
                        passportExpiry: t.passportExpiry,
                        seatNumber: seat?.seatNumber || '1A', 
                        seatType: seat?.type || 'standard',
                        seatPrice: seat?.price || 0,
                    };
                }),
                contactDetails: {
                    email: contact.email,
                    // Always send with country code — model validates E.164 format (+91XXXXXXXXXX)
                    phone: contact.mobile.startsWith('+') ? contact.mobile : `${contact.countryCode}${contact.mobile}`,
                },
                fareDetails: {
                    baseFare: baseFareVal,
                    taxes: taxesVal,
                    seatFee: seatFeeVal,
                    addons: addonTotal,
                    discount: 0,
                },
                currency: 'INR',
                totalAmount: total,
            };

            try {
                const bookingRes = await axios.post('/flight-bookings/create', payload);
                const booking = bookingRes.data.booking;

                // Try Razorpay order
                const orderRes = await axios.post('/flight-payments/create-order', {
                    amount: total,
                    receipt: booking.bookingId,
                });
                const order = orderRes.data.order;

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo',
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Antigravity Flights',
                    description: `Booking ${booking.pnr}`,
                    order_id: order.id,
                    handler: async (response) => {
                        const verify = await axios.post('/flight-payments/verify', {
                            ...response,
                            bookingId: booking.bookingId,
                        });
                        if (verify.data.success) {
                            const finalPnr = verify.data.pnr || booking.pnr;
                            const finalBooking = { ...booking, pnr: finalPnr };
                            sessionStorage.setItem('lastBooking', JSON.stringify(finalBooking));
                            navigate(`/flight-ticket/${finalPnr}`);
                        }
                    },
                    prefill: {
                        name: `${travellers[0].firstName} ${travellers[0].lastName}`,
                        email: contact.email,
                        contact: contact.mobile,
                    },
                    theme: { color: '#003580' },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();

            } catch (apiErr) {
                console.error('Booking/Payment failed:', apiErr);
                message.error(apiErr?.response?.data?.message || apiErr.message || 'Payment failed. Please try again.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            message.error('Payment failed. Please try again.');
        } finally {
            setPayLoading(false);
        }
    };

    if (!flight) return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-[#003580] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading your booking…</p>
            </div>
        </div>
    );

    // ── Section renderers ──────────────────────────────────────────────────
    const renderReview = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Urgency banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-orange-50 border border-orange-100 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center animate-pulse">
                        <Timer className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-xs font-black text-orange-900 uppercase tracking-wide">Price locked — Book within 15 min!</p>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[11px] font-black text-orange-700 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Only {flight.availableSeats || 5} seats left</span>
                    <span className="text-[11px] font-black text-blue-600 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> 12 people viewing</span>
                </div>
            </div>

            <Card>
                <CardHeader icon={Plane} title="Selected Flight" />
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 shadow-sm">
                                <img src={flight.airlineLogo || '/airlines/default.png'} alt={flight.airline} className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; }} />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 text-lg">{flight.airline}</h3>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{flight.flightNumber} · {flight.aircraftType || 'Airbus A320'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] font-black uppercase">Refundable</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                        <div className="text-center flex-1">
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{flight.departureTime}</p>
                            <p className="text-base font-black text-[#003580] mt-1">{flight.from}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Terminal {flight.fromTerminal || 'T2'}</p>
                        </div>
                        <div className="flex flex-col items-center flex-shrink-0">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{flight.duration}</p>
                            <div className="w-32 h-0.5 bg-dashed border-t-2 border-dashed border-blue-200 relative">
                                <div className="absolute inset-0 flex items-center justify-center -translate-y-1/2">
                                    <div className="w-8 h-8 bg-white border border-gray-100 rounded-full shadow-sm flex items-center justify-center">
                                        <Plane className="h-4 w-4 text-blue-600 rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-blue-500 mt-2 uppercase">{flight.stops || 'Non-stop'}</p>
                        </div>
                        <div className="text-center flex-1">
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{flight.arrivalTime}</p>
                            <p className="text-base font-black text-[#003580] mt-1">{flight.to}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Terminal {flight.toTerminal || 'T3'}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-50 pt-5 flex gap-6">
                        <span className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                            <Luggage className="w-4 h-4 text-gray-400" /> Cabin: <strong>7 KG</strong>
                        </span>
                        <span className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                            <Luggage className="w-4 h-4 text-gray-400" /> Check-in: <strong>15 KG</strong>
                        </span>
                    </div>
                </div>
            </Card>

            <button onClick={handleNext}
                className="w-full py-5 bg-gradient-to-r from-[#f26a36] to-[#ff7e4d] text-white rounded-3xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl shadow-orange-100 flex items-center justify-center gap-3 group hover:shadow-orange-200 active:scale-[0.98]">
                Continue to Travellers <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );

    const renderTravellers = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader icon={Users} title="Traveller Details" />
                <div className="p-8 space-y-8">
                    {travellers.map((t, idx) => (
                        <div key={t.id} className="p-6 bg-gray-50/60 rounded-[24px] border border-gray-100 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-[#003580] rounded-xl text-white flex items-center justify-center font-black text-sm">{idx + 1}</div>
                                    <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm">Adult {idx + 1}</h4>
                                </div>
                                {travellers.length > 1 && (
                                    <button onClick={() => removeTraveller(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Field label="Title">
                                    <AntSelect 
                                        value={t.title} 
                                        onChange={val => updateTraveller(idx, 'title', val)}
                                        className="w-full h-[50px] border-none"
                                        size="large"
                                    >
                                        {['Mr', 'Mrs', 'Miss', 'Dr'].map(v => <Option key={v} value={v}>{v}</Option>)}
                                    </AntSelect>
                                </Field>
                                <Field label="First Name" error={travellerErrors[idx]?.firstName}>
                                    <Input value={t.firstName} onChange={e => updateTraveller(idx, 'firstName', e.target.value)} placeholder="As per passport" />
                                </Field>
                                <Field label="Last Name" error={travellerErrors[idx]?.lastName}>
                                    <Input value={t.lastName} onChange={e => updateTraveller(idx, 'lastName', e.target.value)} placeholder="As per passport" />
                                </Field>
                                <Field label="Gender">
                                    <AntSelect 
                                        value={t.gender} 
                                        onChange={val => updateTraveller(idx, 'gender', val)}
                                        className="w-full h-[50px]"
                                        size="large"
                                    >
                                        {['Male', 'Female', 'Other'].map(v => <Option key={v} value={v}>{v}</Option>)}
                                    </AntSelect>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Date of Birth" error={travellerErrors[idx]?.dob}>
                                    <DatePicker 
                                        className="w-full h-[50px] rounded-2xl border-gray-200"
                                        value={t.dob ? dayjs(t.dob) : null} 
                                        onChange={(date, dateString) => updateTraveller(idx, 'dob', dateString)}
                                        format="YYYY-MM-DD"
                                        disabledDate={curr => curr && curr > dayjs().endOf('day')}
                                    />
                                </Field>
                                <Field label="Nationality">
                                    <AntSelect 
                                        showSearch
                                        value={t.nationality} 
                                        onChange={val => updateTraveller(idx, 'nationality', val)}
                                        className="w-full h-[50px]"
                                        size="large"
                                    >
                                        {NATIONALITY_LIST.map(n => <Option key={n} value={n}>{n}</Option>)}
                                    </AntSelect>
                                </Field>
                                <Field label="Passport Number" error={travellerErrors[idx]?.passportNumber}>
                                    <Input value={t.passportNumber} onChange={e => updateTraveller(idx, 'passportNumber', e.target.value.toUpperCase())} placeholder="A1234567" />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Passport Expiry" error={travellerErrors[idx]?.passportExpiry}>
                                    <DatePicker 
                                        className="w-full h-[50px] rounded-2xl border-gray-200"
                                        value={t.passportExpiry ? dayjs(t.passportExpiry) : null} 
                                        onChange={(date, dateString) => updateTraveller(idx, 'passportExpiry', dateString)}
                                        format="YYYY-MM-DD"
                                        disabledDate={curr => curr && curr < dayjs().endOf('day')}
                                    />
                                </Field>
                                <Field label="Frequent Flyer No. (Optional)">
                                    <Input value={t.frequentFlyer} onChange={e => updateTraveller(idx, 'frequentFlyer', e.target.value)} placeholder="Optional" />
                                </Field>
                            </div>
                        </div>
                    ))}

                    <button onClick={addTraveller}
                        className="w-full h-16 border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50/30 text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                        <Plus className="w-5 h-5" /> Add Another Traveller
                    </button>
                </div>
            </Card>

            <Card>
                <CardHeader icon={Mail} title="Contact Information" color="bg-indigo-700" />
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Email Address" error={contactErrors.email}>
                            <Input type="email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} placeholder="you@example.com" />
                        </Field>
                        <Field label="Mobile Number" error={contactErrors.mobile}>
                            <div className="flex gap-2">
                                <div className="w-24">
                                    <AntSelect 
                                        value={contact.countryCode} 
                                        onChange={val => setContact(c => ({ ...c, countryCode: val }))}
                                        className="w-full h-[50px]"
                                        size="large"
                                    >
                                        {['+91', '+1', '+44', '+61', '+971'].map(v => <Option key={v} value={v}>{v}</Option>)}
                                    </AntSelect>
                                </div>
                                <Input className="flex-1" value={contact.mobile} onChange={e => setContact(c => ({ ...c, mobile: e.target.value }))} placeholder="9876543210" />
                            </div>
                        </Field>
                    </div>
                    <Field label="GST Number (Optional for Business Booking)">
                        <Input value={contact.gst} onChange={e => setContact(c => ({ ...c, gst: e.target.value }))} placeholder="22AAAAA0000A1Z5" />
                    </Field>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div onClick={() => setContact(c => ({ ...c, saveDetails: !c.saveDetails }))}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${contact.saveDetails ? 'bg-[#003580] border-[#003580]' : 'border-gray-300'}`}>
                            {contact.saveDetails && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Save traveller details for faster checkout</span>
                    </label>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] font-bold text-emerald-800">You will receive e-tickets and flight updates via SMS and Email.</p>
                    </div>
                </div>
            </Card>

            <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-5 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-800 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all">Back</button>
                <button onClick={handleNext} className="flex-[2] py-5 bg-[#f26a36] hover:bg-[#e05d2e] text-white rounded-[24px] font-black text-lg uppercase tracking-widest transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3">
                    Continue <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const renderAddons = () => {
        const addonCards = [
            { id: 'insurance', icon: ShieldCheck, title: 'Travel Insurance', desc: 'Medical & trip cancellation cover', price: 199, color: 'bg-blue-500', recommended: true },
            { id: 'baggage', icon: Luggage, title: 'Extra Baggage +10kg', desc: 'Additional check-in allowance', price: 999, color: 'bg-purple-500' },
            { id: 'priority', icon: Zap, title: 'Priority Boarding', desc: 'Board first, pick overhead space', price: 299, color: 'bg-amber-500' },
        ];
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                    <CardHeader icon={Gift} title="Add-ons & Extras" color="bg-purple-700" />
                    <div className="p-8 space-y-4">
                        {addonCards.map(card => (
                            <div key={card.id} onClick={() => setAddons(a => ({ ...a, [card.id]: !a[card.id] }))}
                                className={`cursor-pointer flex items-center justify-between p-6 rounded-[24px] border-2 transition-all ${addons[card.id] ? 'border-[#003580] bg-blue-50/20 shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className="flex items-center gap-5">
                                    <div className={`${card.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm`}>
                                        <card.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-black text-gray-900 uppercase text-sm tracking-tight">{card.title}</h4>
                                            {card.recommended && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase">Recommended</span>}
                                        </div>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{card.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-black text-gray-900">+ ₹{card.price}</span>
                                    <div className={`w-12 h-6 rounded-full transition-all relative ${addons[card.id] ? 'bg-[#003580]' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${addons[card.id] ? 'left-[26px]' : 'left-0.5'}`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <div className="flex gap-4">
                    <button onClick={handleBack} className="flex-1 py-5 bg-white border-2 border-gray-100 text-gray-800 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all">Back</button>
                    <button onClick={handleNext} className="flex-[2] py-5 bg-[#f26a36] text-white rounded-[24px] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-orange-100">
                        Continue to Seat Selection <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };


    const renderPayment = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader icon={Lock} title="Secure Payment" color="bg-emerald-700" />
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'razorpay', title: 'Razorpay', desc: 'UPI · Cards · Netbanking', icon: Zap, color: 'bg-blue-600' },
                            { id: 'card', title: 'Credit / Debit Card', desc: 'Visa · Mastercard · Amex', icon: CreditCard, color: 'bg-indigo-600' },
                            { id: 'wallet', title: 'Digital Wallet', desc: 'GPay · Paytm · PhonePe', icon: Smartphone, color: 'bg-purple-600' },
                        ].map(m => (
                            <div key={m.id} onClick={() => setPaymentMethod(m.id)}
                                className={`cursor-pointer p-6 rounded-[24px] border-2 transition-all ${paymentMethod === m.id ? 'border-[#003580] bg-blue-50/20 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className={`${m.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4`}>
                                    <m.icon className="w-5 h-5" />
                                </div>
                                <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{m.title}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{m.desc}</p>
                                {paymentMethod === m.id && (
                                    <div className="mt-3 flex items-center gap-1.5 text-[#003580]">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase">Selected</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                            <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-2">Refund Policy</p>
                            <p className="text-[11px] text-orange-700/80 font-semibold leading-relaxed">Cancellations made at least 24h before departure are eligible for a full refund per airline rules. Convenience fees are non-refundable.</p>
                        </div>
                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                            <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-2">Travel Guidelines</p>
                            <p className="text-[11px] text-blue-700/80 font-semibold leading-relaxed">Carry a valid government ID. Web check-in opens 48h before departure. Arrive at airport 2h prior.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 pt-4">
                        <div className="text-center">
                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Total Payable</p>
                            <p className="text-5xl font-black text-gray-900 tracking-tighter mt-1">₹{total.toLocaleString()}</p>
                        </div>
                        <button onClick={handlePayment} disabled={payLoading}
                            className={`w-full max-w-md py-5 rounded-[24px] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-2xl shadow-orange-100 group
                                ${payLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#f26a36] hover:bg-[#e05d2e] text-white active:scale-[0.98]'}`}>
                            {payLoading
                                ? <div className="w-7 h-7 border-4 border-[#f26a36] border-t-white rounded-full animate-spin" />
                                : <><Lock className="w-5 h-5" /> Complete Booking <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                        <p className="text-[10px] text-gray-400 font-semibold text-center">By completing this booking you agree to our Terms &amp; Conditions and Privacy Policy.</p>
                    </div>
                </div>
            </Card>
            <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-5 bg-white border-2 border-gray-100 text-gray-800 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all">Back</button>
            </div>
        </div>
    );

    // ── Layout ──────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Sticky Header + Progress */}
            <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100 py-5 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-[#003580] w-10 h-10 rounded-2xl flex items-center justify-center shadow-md">
                            <Plane className="h-5 w-5 text-white -rotate-12" />
                        </div>
                        <span className="font-black text-lg text-gray-900 uppercase tracking-tighter hidden sm:block">Secure Checkout</span>
                    </div>

                    {/* Progress steps */}
                    <div className="hidden lg:flex items-center gap-4">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <div className={`flex items-center gap-2 transition-all duration-300 ${step >= s.id ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border-2 transition-all
                                        ${step === s.id ? 'bg-[#003580] border-[#003580] text-white shadow-lg scale-110'
                                        : step > s.id ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'bg-white border-gray-200 text-gray-400'}`}>
                                        {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
                                </div>
                                {i < STEPS.length - 1 && <div className="w-6 h-px bg-gray-200" />}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-right">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                            <p className="text-xl font-black text-gray-900 tracking-tighter">₹{total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        {step === 1 && renderReview()}
                        {step === 2 && renderTravellers()}
                        {step === 3 && renderAddons()}
                        {step === 4 && <FlightSeatSelection 
                            flight={flight} 
                            passengers={travellers} 
                            selectedSeats={selectedSeats} 
                            setSelectedSeats={setSelectedSeats} 
                            onNext={handleNext} 
                        />}
                        {step === 5 && renderPayment()}
                    </div>

                    {/* Fare Summary Sidebar */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <Card>
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Fare Summary</h3>
                                <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[9px] font-black text-gray-500 uppercase">
                                    {travellers.length} Traveller{travellers.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { label: 'Base Fare', val: baseFare },
                                    { label: 'Taxes & Fees', val: taxes },
                                    { label: 'Convenience Fee', val: convenience },
                                    ...(addonTotal > 0 ? [{ label: 'Add-ons', val: addonTotal, color: 'text-purple-600' }] : []),
                                    ...(seatTotal > 0 ? [{ label: 'Seat Charges', val: seatTotal, color: 'text-teal-600' }] : []),
                                ].map(row => (
                                    <div key={row.label} className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{row.label}</span>
                                        <span className={`text-sm font-black ${row.color || 'text-gray-900'}`}>₹{row.val.toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="border-t-2 border-dashed border-gray-100 pt-4 flex justify-between items-end">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payable</span>
                                    <span className="text-2xl font-black text-gray-900 tracking-tighter">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Trust Badges */}
                        <Card className="p-6">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Booking Security</p>
                            <div className="space-y-3">
                                {[
                                    { icon: Lock, text: '100% Secure & Encrypted' },
                                    { icon: ShieldCheck, text: 'PCI DSS Verified' },
                                    { icon: Star, text: 'IATA Certified Agent' },
                                    { icon: Coffee, text: '24/7 Customer Support' },
                                ].map(b => (
                                    <div key={b.text} className="flex items-center gap-3">
                                        <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                                            <b.icon className="w-3.5 h-3.5 text-emerald-600" />
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-600">{b.text}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Support */}
                        <div className="bg-[#003580] rounded-[28px] p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10 p-4">
                                <ShieldCheck className="w-20 h-20" />
                            </div>
                            <h4 className="font-black text-sm uppercase tracking-widest mb-2">Need Help?</h4>
                            <p className="text-[11px] opacity-70 leading-relaxed mb-5">Our booking specialists are available 24/7.</p>
                            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightBookingFlow;
