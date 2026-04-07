import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    MapPin, Star, Users, Calendar, CheckCircle2, ChevronRight,
    Shield, Wifi, Coffee, Wind, Check, AlertCircle, ArrowLeft,
    CreditCard, Building2, Phone, Mail, User, Info, Ticket, X
} from 'lucide-react';
import { checkRoomAvailability, createHotelBooking, validateHotelCoupon, getAvailableHotelCoupons } from '../api/hotelApi';
import { createPaymentOrder, verifyPayment, loadRazorpayScript, openRazorpayCheckout } from '../api/paymentApi';

const TAX_RATE = 0.18;

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const fmt = (d) => d.toISOString().split('T')[0];

const HotelBooking = () => {
    const { hotelId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve data passed from HotelDetails via navigate state
    const { hotel, room } = location.state || {};

    // ── Booking state ───────────────────────────────────────────────
    const [checkIn, setCheckIn] = useState(location.state?.checkIn || fmt(today));
    const [checkOut, setCheckOut] = useState(location.state?.checkOut || fmt(tomorrow));
    const [guests, setGuests] = useState(location.state?.guests || 1);

    const [availability, setAvailability] = useState(null);
    const [availLoading, setAvailLoading] = useState(false);

    const [form, setForm] = useState({
        title: 'Mr',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        billingAddress: '',
        pincode: '',
        state: '',
        gstNumber: '',
    });

    const [step, setStep] = useState(1);   // 1 = details, 2 = payment
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState(null);

    // ── Coupon state ──────────────────────────────────────────────
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [loadingCoupons, setLoadingCoupons] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    // ── Price Calculations (Multiplicative: Guests × Nights) ────────
    const nights = Math.max(1, Math.ceil(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    ));
    
    // Per Person Base Price
    const basePrice = room?.discountPrice || room?.price || 0;
    
    // Total Room Price = Price Per Person × No. of Guests × Nights
    const roomPrice = basePrice * guests * nights;
    
    // Taxes (18% GST)
    const taxes = Math.round(roomPrice * TAX_RATE);
    
    // Total before coupon
    const subTotal = roomPrice + taxes;

    // Calculate total discount (Original - Current) multiplied by guests and nights
    const discount = room?.originalPrice && room.originalPrice > basePrice
        ? ((room.originalPrice - basePrice) * guests * nights)
        : 0;

    // Calculate final coupon discount based on applied coupon
    let finalCouponDiscount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'flat') {
            finalCouponDiscount = appliedCoupon.discountValue;
        } else if (appliedCoupon.discountType === 'percentage') {
            finalCouponDiscount = (subTotal * appliedCoupon.discountValue) / 100;
            if (appliedCoupon.maxDiscount > 0 && finalCouponDiscount > appliedCoupon.maxDiscount) {
                finalCouponDiscount = appliedCoupon.maxDiscount;
            }
        }
    }

    const finalAmount = Math.max(0, subTotal - finalCouponDiscount);

    // ── Fetch Available Coupons ──────────────────────────────────────
    useEffect(() => {
        if (!hotelId || !subTotal) return;
        const fetchCoupons = async () => {
            setLoadingCoupons(true);
            try {
                const data = await getAvailableHotelCoupons(hotelId, subTotal);
                if (data?.success) {
                    setAvailableCoupons(data.coupons || []);
                }
            } catch (err) {
                console.error('Failed to fetch coupons', err);
            } finally {
                setLoadingCoupons(false);
            }
        };
        fetchCoupons();
    }, [hotelId, subTotal]);

    // ── Apply Coupon Logic ──────────────────────────────────────────
    const applyCouponCode = async (codeToApply) => {
        setValidatingCoupon(true);
        setCouponError('');
        try {
            const data = await validateHotelCoupon({
                hotelId,
                couponCode: codeToApply,
                bookingAmount: subTotal
            });
            if (data.success) {
                setAppliedCoupon(data.coupon);
                setCouponInput('');
            }
        } catch (err) {
            setAppliedCoupon(null);
            setCouponError(err?.message || 'Invalid coupon');
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleApplyCoupon = () => {
        if (!couponInput.trim()) { setCouponError('Enter a coupon code'); return; }
        applyCouponCode(couponInput.trim().toUpperCase());
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponError('');
    };

    // ── Check availability on date change ──────────────────────────
    useEffect(() => {
        if (!room?._id || !checkIn || !checkOut) return;
        const checkAvail = async () => {
            setAvailLoading(true);
            try {
                const data = await checkRoomAvailability(room._id, checkIn, checkOut);
                setAvailability(data?.availableRooms ?? null);
            } catch {
                setAvailability(null);
            } finally {
                setAvailLoading(false);
            }
        };
        checkAvail();
    }, [room?._id, checkIn, checkOut]);

    // ── Auto-adjust guests if room capacity changes ──────────────────
    useEffect(() => {
        if (room?.capacity && guests > room.capacity) {
            setGuests(room.capacity);
        }
    }, [room?.capacity, guests]);

    if (!hotel || !room) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] pt-24">
                <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No room selected</h2>
                <p className="text-gray-500 mb-6">Please go back and select a room from the hotel details page.</p>
                <button onClick={() => navigate(-1)} className="px-6 py-3 bg-[#006ce4] text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    Go Back
                </button>
            </div>
        );
    }

    const imageUrl = hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800';
    const roomImg = room.images?.[0] || imageUrl;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validateForm = () => {
        if (!form.firstName.trim()) return 'First name is required';
        if (!form.lastName.trim()) return 'Last name is required';
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email is required';
        if (!form.phone.trim() || form.phone.length < 10) return 'Valid phone number is required';
        return null;
    };

    const handleProceed = async () => {
        const err = validateForm();
        if (err) { setError(err); return; }

        if (availability !== null && availability <= 0) {
            setError('Sorry, this room is sold out for the selected dates.');
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            // 1. Load Razorpay script
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                setError('Failed to load Razorpay SDK. Are you online?');
                setSubmitting(false);
                return;
            }

            // 2. Create Payment Order
            const orderRes = await createPaymentOrder({
                amount: finalAmount,
                notes: { bookingType: 'hotel', hotelId, roomId: room._id }
            });

            if (!orderRes.success) {
                setError(orderRes.message || 'Failed to initialize payment.');
                setSubmitting(false);
                return;
            }

            // 3. Open Razorpay Checkout
            const options = {
                key: orderRes.key,
                amount: orderRes.amount,
                currency: orderRes.currency,
                name: 'GoAirClass Hotel Booking',
                description: `${nights} Night(s) at ${hotel.hotelName}`,
                order_id: orderRes.orderId,
                prefill: {
                    name: `${form.title} ${form.firstName} ${form.lastName}`.trim(),
                    email: form.email,
                    contact: form.phone
                },
                theme: {
                    color: '#d84e55'
                }
            };

            openRazorpayCheckout(options, {
                onSuccess: async (response) => {
                    try {
                        // 4. Verify Payment
                        const verifyRes = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.success) {
                            // 5. Create Booking Record
                            const payload = {
                                hotelId,
                                roomId: room._id,
                                roomType: room.roomType,
                                checkInDate: checkIn,
                                checkOutDate: checkOut,
                                guests,
                                guestTitle: form.title,
                                guestName: form.firstName,
                                guestLastName: form.lastName,
                                guestEmail: form.email,
                                guestPhone: form.phone,
                                roomPrice,
                                taxes,
                                totalAmount: finalAmount,
                                couponCode: appliedCoupon?.couponCode || '',
                                couponDiscount: finalCouponDiscount,
                                billingAddress: form.billingAddress,
                                pincode: form.pincode,
                                state: form.state,
                                gstNumber: form.gstNumber,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                            };

                            const bookRes = await createHotelBooking(payload);

                            if (bookRes?.success) {
                                setBooking(bookRes.booking);
                                navigate('/hotel-booking-confirmation', {
                                    state: {
                                        booking: bookRes.booking,
                                        hotel,
                                        room,
                                        checkIn,
                                        checkOut,
                                        guests,
                                        roomPrice,
                                        taxes,
                                        totalAmount: finalAmount,
                                        couponDiscount: finalCouponDiscount,
                                        discount,
                                    }
                                });
                            } else {
                                setError(bookRes?.message || 'Payment successful but booking failed. Please contact support.');
                                setSubmitting(false);
                            }
                        } else {
                            setError('Payment verification failed.');
                            setSubmitting(false);
                        }
                    } catch (e) {
                        setError(e?.message || 'Payment verification failed.');
                        setSubmitting(false);
                    }
                },
                onFailure: (err) => {
                    setError(err?.description || 'Payment completely failed.');
                    setSubmitting(false);
                },
                onDismiss: () => {
                    setError('Payment was cancelled.');
                    setSubmitting(false);
                }
            });

        } catch (e) {
            setError(e?.message || 'Something went wrong initializing payment. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-20 pb-20 font-inter">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-[#006ce4] flex items-center gap-1 font-semibold text-sm hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm font-medium text-gray-600 truncate">{hotel.hotelName}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm font-semibold text-gray-900">Complete Booking</span>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
                <div className="flex items-center gap-2 mb-8">
                    {['Room Selected', 'Guest Details', 'Payment'].map((s, i) => (
                        <React.Fragment key={i}>
                            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${i + 1 <= step ? 'text-[#006ce4]' : 'text-gray-400'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i + 1 < step ? 'bg-green-500 text-white' : i + 1 === step ? 'bg-[#006ce4] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {i + 1 < step ? <Check className="h-3 w-3" /> : i + 1}
                                </div>
                                <span className="hidden sm:inline">{s}</span>
                            </div>
                            {i < 2 && <div className={`flex-1 h-0.5 rounded ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── LEFT: FORMS ──────────────────────────────── */}
                    <div className="flex-1 space-y-6">

                        {/* 1. Property Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-black text-gray-900 mb-4">Your Stay</h2>
                            <div className="flex gap-4">
                                <img src={imageUrl} alt={hotel.hotelName} className="w-24 h-20 object-cover rounded-xl flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(hotel.starRating || 4)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <h3 className="font-black text-gray-900 text-base leading-tight">{hotel.hotelName}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" /> {hotel.address || hotel.city}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mt-5">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Check-In</label>
                                    <input type="date" value={checkIn} min={fmt(today)}
                                        onChange={e => { setCheckIn(e.target.value); if (e.target.value >= checkOut) { const d = new Date(e.target.value); d.setDate(d.getDate() + 1); setCheckOut(fmt(d)); } }}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#006ce4]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Check-Out</label>
                                    <input type="date" value={checkOut} min={checkIn}
                                        onChange={e => setCheckOut(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#006ce4]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex justify-between items-center">
                                        Guests
                                        {guests >= (room?.capacity || 1) && (
                                            <span className="flex items-center gap-1 text-[8px] text-amber-600 animate-pulse">
                                                <AlertCircle className="h-2 w-2" /> Max Limit Reached
                                            </span>
                                        )}
                                    </label>
                                    <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#006ce4]">
                                        {[1, 2, 3, 4, 5, 6].map(n => (
                                            <option key={n} value={n} disabled={n > (room?.capacity || 1)}>
                                                {n} Guest{n > 1 ? 's' : ''} {n > (room?.capacity || 1) ? '(Exceeds Capacity)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <p className={`text-[9px] font-bold mt-1 uppercase tracking-wider text-center ${guests > (room?.capacity || 1) ? 'text-red-500' : 'text-gray-400'}`}>
                                        Max {room?.capacity || 1} Guests Allowed
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-600">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                <span>{nights} Night{nights !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        {/* 2. Room Selected */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-black text-gray-900 mb-4">Selected Room</h2>
                            <div className="flex gap-4">
                                <img src={roomImg} alt={room.roomType} className="w-24 h-20 object-cover rounded-xl flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="font-black text-gray-900 text-base">1 × {room.roomType}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-semibold text-gray-600">
                                        {room.capacity && <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {room.capacity} Adults</span>}
                                        {room.bedType && <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" strokeWidth={3} /> {room.bedType}</span>}
                                        {room.viewType && <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" strokeWidth={3} /> {room.viewType}</span>}
                                        {room.size && <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" strokeWidth={3} /> {room.size}</span>}
                                    </div>
                                    {room.amenities && room.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {room.amenities.slice(0, 5).map((am, i) => (
                                                <span key={i} className="bg-gray-50 border border-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-semibold">{am}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Availability indicator */}
                            <div className="mt-4 flex items-center gap-2">
                                {availLoading ? (
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                        <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                                        Checking availability...
                                    </div>
                                ) : availability !== null ? (
                                    availability > 0 ? (
                                        <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> {availability} room{availability !== 1 ? 's' : ''} available for selected dates
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                                            <AlertCircle className="h-3.5 w-3.5" /> Room Sold Out for selected dates
                                        </div>
                                    )
                                ) : null}
                            </div>
                        </div>

                        {/* 3. Guest Details Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-black text-gray-900 mb-1">Guest Details</h2>
                            <p className="text-xs text-gray-500 font-medium mb-5">Please enter details as per your ID proof</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Title</label>
                                    <select name="title" value={form.title} onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/20 focus:border-[#006ce4]">
                                        <option>Mr</option><option>Mrs</option><option>Ms</option><option>Dr</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">First Name *</label>
                                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/20 focus:border-[#006ce4]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Last Name *</label>
                                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/20 focus:border-[#006ce4]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com"
                                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/20 focus:border-[#006ce4]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Mobile Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="9876543210"
                                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/20 focus:border-[#006ce4]" />
                                    </div>
                                </div>
                            </div>

                            {/* GST Optional */}
                            <details className="mt-2">
                                <summary className="text-xs font-bold text-[#006ce4] cursor-pointer select-none hover:underline">+ Add GST Details (Optional)</summary>
                                <div className="mt-3">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">GST Number</label>
                                    <input name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="e.g. 22AABCU9603R1ZX"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/20 focus:border-[#006ce4]" />
                                </div>
                            </details>
                        </div>

                        {/* 4. Billing Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-black text-gray-900 mb-1">Billing Information</h2>
                            <p className="text-xs text-gray-500 font-medium mb-5">Optional — required for invoice</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Billing Address</label>
                                    <input name="billingAddress" value={form.billingAddress} onChange={handleChange} placeholder="Street, Area"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/20 focus:border-[#006ce4]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Pincode</label>
                                        <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="411001"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/20 focus:border-[#006ce4]" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">State</label>
                                        <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/20 focus:border-[#006ce4]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Banner */}
                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Proceed Button */}
                        <button
                            onClick={handleProceed}
                            disabled={submitting || (availability !== null && availability <= 0)}
                            className="w-full bg-[#d84e55] hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-500/30 transition-colors flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                            ) : (
                                <><CreditCard className="h-5 w-5" /> Proceed to Payment</>
                            )}
                        </button>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-6 text-xs font-semibold text-gray-400">
                            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-green-500" /> 100% Secure</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Instant Confirmation</span>
                        </div>
                    </div>

                    {/* ── RIGHT: PRICE SUMMARY (Sticky) ────────────── */}
                    <div className="w-full lg:w-[360px] shrink-0">
                        <div className="sticky top-32 space-y-4">

                            {/* Price Summary Card */}
                            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0_0_0_/_0.08)] border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5">
                                    <h3 className="text-base font-black">Price Summary</h3>
                                    <p className="text-xs text-gray-300 mt-0.5">{nights} Night{nights !== 1 ? 's' : ''} · {guests} Guest{guests !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="p-5 space-y-3">
                                    <div className="flex justify-between text-sm font-semibold text-gray-700">
                                        <span>Base Price ({nights} night{nights !== 1 ? 's' : ''})</span>
                                        <span>₹{roomPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm font-semibold text-green-600">
                                            <span>Discount</span>
                                            <span>- ₹{discount.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-semibold text-gray-700">
                                        <span className="flex items-center gap-1">Taxes & Fees <Info className="h-3.5 w-3.5 text-gray-400" /></span>
                                        <span>₹{taxes.toLocaleString('en-IN')}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-sm font-semibold text-blue-600">
                                            <span>Coupon ({appliedCoupon.couponCode})</span>
                                            <span>- ₹{Math.round(finalCouponDiscount).toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-lg">
                                        <span>Total Amount</span>
                                        <span>₹{Math.round(finalAmount).toLocaleString('en-IN')}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium">Inclusive of all applicable taxes</p>
                                </div>
                            </div>

                            {/* Coupon Input UI */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-5">
                                <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2"><Ticket className="h-4 w-4" /> Have a Coupon?</h3>
                                {appliedCoupon ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black tracking-widest uppercase text-green-700">{appliedCoupon.couponCode}</p>
                                            <p className="text-[10px] font-bold text-green-600 mt-0.5">Coupon applied successfully!</p>
                                        </div>
                                        <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500 font-bold p-1"><X className="h-4 w-4" /></button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                            placeholder="Enter Code"
                                            className="uppercase w-full text-sm font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006ce4]/30"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={validatingCoupon || !couponInput}
                                            className="bg-[#006ce4] hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-colors shrink-0"
                                        >
                                            {validatingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-[10px] font-bold text-red-500 mt-2">{couponError}</p>}

                                {/* Dynamic Offers Section */}
                                {loadingCoupons ? (
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <div className="w-3 h-3 border-2 border-gray-200 border-t-[#006ce4] rounded-full animate-spin" /> Fetching offers...
                                    </div>
                                ) : availableCoupons.length > 0 && (
                                    <div className="mt-5 space-y-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Available Offers</p>
                                        {availableCoupons.map(coupon => (
                                            <div
                                                key={coupon._id}
                                                className="border border-blue-100 bg-blue-50/50 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors"
                                                onClick={() => applyCouponCode(coupon.couponCode)}
                                            >
                                                <div>
                                                    <p className="text-xs font-black text-[#006ce4] uppercase tracking-wider">{coupon.couponCode}</p>
                                                    <p className="text-[10px] font-semibold text-gray-600 mt-0.5">
                                                        {coupon.discountType === 'flat' ? `₹${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`} on this booking
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        applyCouponCode(coupon.couponCode);
                                                    }}
                                                    className="text-[10px] font-bold text-[#006ce4] uppercase tracking-widest hover:underline"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Cancellation Policy */}
                            {hotel.freeCancellation && (
                                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-black text-green-800">Free Cancellation</p>
                                        <p className="text-xs text-green-700 font-medium mt-0.5">Cancel before check-in and get a full refund</p>
                                    </div>
                                </div>
                            )}

                            {/* Payment Partner logos */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Secure Payment via</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {['Razorpay', 'UPI', 'Visa', 'Mastercard'].map(g => (
                                        <span key={g} className="text-[10px] font-black text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">{g}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Contact box */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                                <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-black text-blue-900">Need Help?</p>
                                    <p className="text-[11px] text-blue-700 font-medium">Our support team is available 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelBooking;
