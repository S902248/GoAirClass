import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck, Zap, ThumbsUp, ChevronDown, ChevronUp, CreditCard, Landmark, Smartphone, Tag, ArrowLeft, Check, Clock, MapPin, User } from 'lucide-react';
import { loadRazorpayScript, openRazorpayCheckout, createPaymentOrder } from '../api/paymentApi';
import { saveBooking } from '../api/bookingApi';
import { validateCoupon, getActiveCoupons, getPaymentCoupons } from '../api/couponApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDateToYYYYMMDD = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split(/[-\/]/);
    if (parts.length === 3) {
        // Assume DD-MM-YYYY
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d)) return d.toISOString().split('T')[0];
    return dateStr;
};

const BusPayment = ({ bus, seats, boarding, dropping, searchParams, passengers, onSuccess, setView }) => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('upi');
    const [expandedCoupon, setExpandedCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [activeCoupons, setActiveCoupons] = useState([]);
    const [deviceId] = useState(() => {
        const savedId = localStorage.getItem('go_dev_id');
        if (savedId) return savedId;
        const newId = 'DEV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        localStorage.setItem('go_dev_id', newId);
        return newId;
    });
    const [slabInfo, setSlabInfo] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            toast.error("Please login to access the payment page.", { position: "top-right", theme: "colored" });
            setView('landing');
            return;
        }

        const loadCoupons = async () => {
            try {
                const busId = bus?.id || bus?.busId || bus?._id || bus?.bus?._id || bus?.bus || null;
                const coupons = await getPaymentCoupons(busId);
                setActiveCoupons(coupons);

                // Auto-apply logic
                if (coupons.length > 0 && !couponApplied && !couponCode) {
                    const bestCoupon = coupons.reduce((best, current) => {
                        if (current.minBookingAmount && baseFare < current.minBookingAmount) return best;
                        const currentVal = current.discountValue || current.discountAmount || 0;
                        const currentDiscount = current.discountType === 'flat' ? currentVal : (baseFare * currentVal / 100);
                        const maxCapped = current.maxDiscountAmount ? Math.min(currentDiscount, current.maxDiscountAmount) : currentDiscount;

                        const bestVal = best ? (best.discountValue || best.discountAmount || 0) : 0;
                        const bestDiscount = best ? (best.discountType === 'flat' ? bestVal : (baseFare * bestVal / 100)) : 0;
                        const bestMaxCapped = best?.maxDiscountAmount ? Math.min(bestDiscount, best.maxDiscountAmount) : bestDiscount;

                        return maxCapped > bestMaxCapped ? current : best;
                    }, null);

                    if (bestCoupon) {
                        const val = bestCoupon.discountValue || bestCoupon.discountAmount || 0;
                        const discountAmt = bestCoupon.discountType === 'flat' ? val : Math.min(baseFare * val / 100, bestCoupon.maxDiscountAmount || Infinity);

                        setCouponCode(bestCoupon.code);
                        setDiscount(Math.round(discountAmt));
                        setCouponApplied(true);
                        toast.success(`Best Offer Applied — You saved ₹${Math.round(discountAmt)}`, { position: "top-right", theme: "colored" });
                    }
                }
            } catch (err) {
                console.error("Failed to load active coupons:", err);
            }
        };
        loadCoupons();
        // eslint-disable-next-line
    }, []);

    const totalCommission = seats?.reduce((acc, s) => acc + (s?.commission || 0), 0) || 0;
    const baseFare = seats?.reduce((acc, s) => acc + (s?.basePrice || s?.price || 850), 0) || 0;
    const gst = Math.round((baseFare + totalCommission) * 0.05);
    const total = baseFare + totalCommission + gst - discount;

    const paymentMethods = [
        { id: 'upi', label: 'UPI', icon: Smartphone },
        { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
        { id: 'netbanking', label: 'Net Banking', icon: Landmark },
    ];

    const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda'];

    const handlePay = async () => {
        setIsProcessing(true);
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            toast.error('Razorpay SDK failed to load. Check your internet connection.', { position: "top-right", theme: "colored" });
            setIsProcessing(false);
            return;
        }

        let orderId = null;
        let razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

        // Pull logged-in user data for passenger info
        const userData = (() => {
            try { return JSON.parse(localStorage.getItem('userData') || '{}'); }
            catch { return {}; }
        })();

        try {
            // Call backend to create Razorpay order (secure — uses secret key server-side)
            const orderData = await createPaymentOrder({
                amount: total,
                notes: { bus: bus?.name || '', seats: seats?.map(s => s?.label).join(', ') },
            });
            orderId = orderData.orderId;
            // Backend also sends back the public key (optional cross-check)
            if (orderData.key) razorpayKey = orderData.key;
        } catch (err) {
            console.warn('Backend order creation failed, using direct amount (dev mode):', err);
            // In dev, continue without order_id — Razorpay test mode allows this
        }
        if (!razorpayKey) {
            console.error('❌ Razorpay Key ID is missing! Ensure VITE_RAZORPAY_KEY_ID is set in .env or backend provides it.');
            toast.error('Payment system misconfigured. Please contact support.', { position: "top-right", theme: "colored" });
            setIsProcessing(false);
            return;
        }

        openRazorpayCheckout(
            {
                key: razorpayKey,
                amount: Math.round(total * 100),
                ...(orderId && { order_id: orderId }),
                currency: 'INR',
                name: 'BusGo',
                description: `Bus Ticket — ${seats?.length || 1} Seat(s)`,
                prefill: {
                    name: userData?.name || 'Guest',
                    email: userData?.email || '',
                    contact: userData?.mobile || userData?.phone || '',
                },
                notes: { bus: bus?.name || '', seats: seats?.map(s => s?.label).join(', ') },
                theme: { color: '#D84E55' },
            },
            {
                onSuccess: async (response) => {
                    const paymentInfo = {
                        total, baseFare, gst, discount, couponApplied, couponCode,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                        passengerName: (passengers && passengers.length > 0) ? passengers[0].name : (userData?.name || userData?.fullName || 'Guest'),
                    };

                    // ── Save booking to backend ───────────────────────────────
                    try {
                        const travelerName = (passengers && passengers.length > 0) ? passengers[0].name : (userData?.name || userData?.fullName || 'Guest');
                        const passengerName = travelerName;
                        const passengerEmail = userData?.email || 'guest@busgo.in';
                        const passengerMobile = userData?.mobile || userData?.phone || '0000000000';

                        // CRITICAL: Ensure we have a valid Bus ID
                        const finalBusId = bus?.busId || (typeof bus?.bus === 'string' ? bus.bus : bus?.bus?._id) || bus?._id || bus?.id;

                        console.log('--- Preparing to save booking ---');
                        console.log('Selected Bus Object:', bus);
                        console.log('Final Bus ID:', finalBusId);

                        const savedData = await saveBooking({
                            bookingId,
                            userId: userData?._id || userData?.id,
                            deviceId: deviceId,
                            ipAddress: '127.0.0.1', // Real IP should be captured on server
                            // Passenger
                            passengerName,
                            passengerEmail,
                            passengerMobile,
                            passengers: passengers?.map(p => ({
                                name: p.name || passengerName,
                                age: p.age || '25',
                                gender: p.gender || 'Male'
                            })) || [],

                            // Bus / journey
                            busId: finalBusId,
                            routeId: bus?.routeId || (typeof bus?.route === 'string' ? bus.route : bus?.route?._id) || bus?.route,
                            scheduleId: bus?.scheduleId || bus?._id || bus?.id,
                            travelDate: formatDateToYYYYMMDD(searchParams?.date || bus?.travelDate) || '',
                            boardingPoint: boarding?.location || bus?.departurePoint || '',
                            droppingPoint: dropping?.location || bus?.arrivalPoint || '',
                            boarding: {
                                point: boarding?.location || bus?.departurePoint || '',
                                time: boarding?.time || ''
                            },
                            dropping: {
                                point: dropping?.location || bus?.arrivalPoint || '',
                                time: dropping?.time || ''
                            },
                            seatNumbers: seats?.map(s => s?.label || s?.seatNo) || [],
                            seatDetails: seats?.map(s => ({
                                seatNumber: s?.label || s?.seatNo,
                                seatType: s?.type || 'seater',
                                price: s?.price || 0
                            })) || [],

                            // Fare
                            baseFare,
                            commission: totalCommission,
                            gst,
                            discount,
                            totalFare: total,
                            couponCode: couponApplied ? couponCode : '',

                            // Payment
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        console.log('✅ Booking saved to backend.');

                        if (savedData && savedData.booking) {
                            paymentInfo.bookingId = savedData.booking.pnrNumber || savedData.booking._id;
                        }
                    } catch (saveErr) {
                        console.error('❌ Failed to save booking:', saveErr);
                        // Don't block the user — payment already done, show confirmation anyway
                    }
                    // ─────────────────────────────────────────────────────────

                    setIsProcessing(false);
                    onSuccess(paymentInfo);
                },
                onFailure: (err) => {
                    toast.error(`Payment failed: ${err.description}`, { position: "top-right", theme: "colored" });
                    setIsProcessing(false);
                },
                onDismiss: () => setIsProcessing(false),
            }
        );
        setIsProcessing(false);
    };

    // ─── Coupon validation using API ────────────────────────────────────────
    const handleApplyCoupon = async () => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        try {
            const result = await validateCoupon(couponCode, baseFare, userData?._id || userData?.id, {
                deviceId: deviceId,
                category: 'Bus',
                operatorId: bus?.operator?._id || bus?.operator || bus?.operatorId,
                busId: bus?.busId || (typeof bus?.bus === 'string' ? bus.bus : bus?.bus?._id) || bus?._id || bus?.id,
                routeId: bus?.routeId || (typeof bus?.route === 'string' ? bus.route : bus?.route?._id) || bus?.route,
                sourceCity: bus?.departurePoint || '',
                destinationCity: bus?.arrivalPoint || ''
            });
            if (result?.valid || result?.success) {
                setCouponApplied(true);
                setDiscount(result.discount || 0);
                setSlabInfo(result.appliedSlab || null);
                toast.success(result.message || 'Coupon applied successfully!', { position: "top-right", theme: "colored" });
            } else {
                toast.error(result?.message || 'Invalid coupon code.', { position: "top-right", theme: "colored" });
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to apply coupon. Try again.', { position: "top-right", theme: "colored" });
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setCouponApplied(false);
        setDiscount(0);
        setSlabInfo(null);
        toast.info('Coupon removed', { position: "top-right", theme: "colored" });
    };

    const trustBadges = [
        { icon: ShieldCheck, label: 'Secure Payment', color: 'text-emerald-600' },
        { icon: Zap, label: 'Superfast Refunds', color: 'text-amber-500' },
        { icon: ThumbsUp, label: 'Trusted by 30M+', color: 'text-blue-500' },
    ];

    return (
        <div className="min-h-screen bg-[#F7F8F9] font-sans pt-28 pb-16">
            <div className="max-w-[1200px] mx-auto px-4">
                {/* Back button */}
                <button onClick={() => setView('bus-results')} className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 mb-6 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Seat Selection
                </button>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 mb-8 bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm">
                    {trustBadges.map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex items-center gap-2.5">
                            <Icon className={`h-5 w-5 ${color}`} strokeWidth={2} />
                            <span className="text-[13px] font-bold text-gray-700">{label}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                    {/* LEFT: Payment Options */}
                    <div className="space-y-4">
                        {/* Coupon Code */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <button
                                onClick={() => setExpandedCoupon(!expandedCoupon)}
                                className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-50 p-2 rounded-xl">
                                        <Tag className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <span className="text-[15px] font-bold text-gray-800">Have a coupon code?</span>
                                    {couponApplied && <span className="bg-emerald-100 text-emerald-700 text-[11px] font-black px-2 py-0.5 rounded-full">Coupon Applied!</span>}
                                </div>
                                {expandedCoupon ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                            </button>
                            {expandedCoupon && (
                                <div className="px-6 pb-5 border-t border-gray-100">
                                    <div className="flex gap-3 mt-4">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter coupon code (try: SAVE10)"
                                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-semibold text-gray-800 focus:outline-none focus:border-gray-400 placeholder:text-gray-300"
                                            disabled={couponApplied}
                                        />
                                        {couponApplied ? (
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-[13px] px-5 py-3 rounded-xl transition-all active:scale-95 border border-gray-200"
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleApplyCoupon}
                                                className="bg-[#D84E55] hover:bg-[#C13E44] text-white font-black text-[13px] px-5 py-3 rounded-xl transition-all active:scale-95"
                                            >
                                                Apply
                                            </button>
                                        )}
                                    </div>
                                    {couponApplied && <p className="text-[12px] font-bold text-emerald-600 mt-2 flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Coupon applied! ₹{discount} off on your booking.</p>}

                                    {/* Available Offers Section */}
                                    {!couponApplied && activeCoupons.length > 0 && (
                                        <div className="mt-6">
                                            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-3">Available Offers</p>
                                            <div className="space-y-3">
                                                {activeCoupons.map((coupon, index) => {
                                                    const gradients = [
                                                        'from-[#FFF1F1] to-[#FFE4E4] border-[#FED7D7]',
                                                        'from-[#EBF5FF] to-[#D6E9FF] border-[#B9E0FF]',
                                                        'from-[#E6FFFA] to-[#D1FFF5] border-[#A7F3D0]',
                                                        'from-[#FFFBEB] to-[#FEF3C7] border-[#FDE68A]',
                                                        'from-[#EEF2FF] to-[#E0E7FF] border-[#C7D2FE]'
                                                    ];
                                                    const gradientClass = gradients[index % gradients.length];
                                                    return (
                                                        <div key={coupon._id || coupon.code} className={`border bg-gradient-to-br ${gradientClass} rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group hover:shadow-md transition-all cursor-pointer shadow-sm hover:-translate-y-0.5`}>
                                                            <div className="flex items-start gap-3">
                                                                <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-xl border border-white shadow-sm mt-0.5">
                                                                    <Tag className="h-5 w-5 text-[#D84E55]" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="font-black text-gray-800 tracking-wide text-[14px]">{coupon.code}</span>
                                                                        {coupon.discountType === 'flat' ? (
                                                                            <span className="bg-[#D84E55] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Flat ₹{coupon.discountValue || coupon.discountAmount} OFF</span>
                                                                        ) : (
                                                                            <span className="bg-purple-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Get {coupon.discountValue || coupon.discountAmount}% OFF</span>
                                                                        )}
                                                                        {coupon.role === 'superadmin' || coupon.role === 'admin' ? (
                                                                            <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest ml-1">GoAir Special</span>
                                                                        ) : (
                                                                            <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest ml-1">Operator Deal</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">{coupon.description || `Save on bookings above ₹${coupon.minBookingAmount || 0}`}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={async () => {
                                                                    setCouponCode(coupon.code);
                                                                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                                                                    try {
                                                                        const result = await validateCoupon(coupon.code, baseFare, userData?._id || userData?.id, {
                                                                            deviceId: deviceId,
                                                                            category: 'Bus',
                                                                            operatorId: bus?.operator?._id || bus?.operator || bus?.operatorId,
                                                                            busId: bus?.busId || (typeof bus?.bus === 'string' ? bus.bus : bus?.bus?._id) || bus?._id || bus?.id,
                                                                            routeId: bus?.routeId || (typeof bus?.route === 'string' ? bus.route : bus?.route?._id) || bus?.route,
                                                                            sourceCity: bus?.departurePoint || '',
                                                                            destinationCity: bus?.arrivalPoint || ''
                                                                        });
                                                                        if (result?.valid || result?.success) {
                                                                            setCouponApplied(true);
                                                                            setDiscount(result.discount || 0);
                                                                            toast.success(result.message || 'Coupon applied successfully!', { position: "top-right", theme: "colored" });
                                                                        } else {
                                                                            toast.error(result?.message || 'Invalid coupon code.', { position: "top-right", theme: "colored" });
                                                                        }
                                                                    } catch (err) {
                                                                        toast.error(err?.message || 'Failed to apply coupon. Try again.', { position: "top-right", theme: "colored" });
                                                                    }
                                                                }}
                                                                className="text-[12px] font-black text-white bg-gray-900 hover:bg-gray-800 px-6 py-2.5 rounded-xl transition-all w-full sm:w-auto text-center shadow-lg shadow-black/5"
                                                            >
                                                                TAP TO APPLY
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                                <h2 className="text-[17px] font-black text-gray-800">Select Payment Method</h2>
                            </div>

                            <div className="flex border-b border-gray-100">
                                {paymentMethods.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setSelectedMethod(id)}
                                        className={`flex-1 flex flex-col items-center gap-1.5 py-4 text-[12px] font-bold transition-all border-b-2 ${selectedMethod === id ? 'border-[#D84E55] text-[#D84E55] bg-red-50/30' : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50/60'}`}
                                    >
                                        <Icon className="h-5 w-5" strokeWidth={selectedMethod === id ? 2.5 : 1.5} />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {/* UPI */}
                                {selectedMethod === 'upi' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div>
                                            <label className="text-[12px] font-black text-gray-500 uppercase tracking-wider mb-3 block">Pay via QR Code</label>
                                            <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 border border-gray-100">
                                                <div className="text-center">
                                                    {/* Minimal QR SVG placeholder */}
                                                    <div className="w-40 h-40 mx-auto bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-300 mb-3">
                                                        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                                                            <rect x="5" y="5" width="35" height="35" rx="2" fill="#1a1a1a" />
                                                            <rect x="12" y="12" width="21" height="21" rx="1" fill="white" />
                                                            <rect x="16" y="16" width="13" height="13" rx="0.5" fill="#1a1a1a" />
                                                            <rect x="60" y="5" width="35" height="35" rx="2" fill="#1a1a1a" />
                                                            <rect x="67" y="12" width="21" height="21" rx="1" fill="white" />
                                                            <rect x="71" y="16" width="13" height="13" rx="0.5" fill="#1a1a1a" />
                                                            <rect x="5" y="60" width="35" height="35" rx="2" fill="#1a1a1a" />
                                                            <rect x="12" y="67" width="21" height="21" rx="1" fill="white" />
                                                            <rect x="16" y="71" width="13" height="13" rx="0.5" fill="#1a1a1a" />
                                                            <rect x="60" y="55" width="8" height="8" fill="#1a1a1a" />
                                                            <rect x="72" y="55" width="8" height="8" fill="#1a1a1a" />
                                                            <rect x="84" y="55" width="8" height="8" fill="#1a1a1a" />
                                                            <rect x="60" y="67" width="8" height="8" fill="#1a1a1a" />
                                                            <rect x="72" y="67" width="20" height="20" fill="#1a1a1a" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-[13px] font-bold text-gray-500">Scan with any UPI app</p>
                                                    <p className="text-[11px] text-gray-400 mt-1">PhonePe • GPay • Paytm • BHIM</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative flex items-center gap-3">
                                            <div className="flex-1 h-px bg-gray-100" />
                                            <span className="text-[11px] font-bold text-gray-400">OR</span>
                                            <div className="flex-1 h-px bg-gray-100" />
                                        </div>
                                        <div>
                                            <label className="text-[12px] font-black text-gray-500 uppercase tracking-wider mb-2 block">Enter UPI ID</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={upiId}
                                                    onChange={e => setUpiId(e.target.value)}
                                                    placeholder="yourname@upi"
                                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-semibold focus:outline-none focus:border-gray-400 placeholder:font-normal placeholder:text-gray-300"
                                                />
                                                <button className="bg-gray-900 hover:bg-gray-700 text-white font-black text-[13px] px-5 rounded-xl transition-all">Verify</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Card */}
                                {selectedMethod === 'card' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" className="h-6 object-contain opacity-70" alt="Visa" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" className="h-6 object-contain opacity-70" alt="Mastercard" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png" className="h-6 object-contain opacity-70" alt="Amex" />
                                            <span className="text-[11px] font-bold text-gray-400 ml-auto">256-bit SSL Encrypted</span>
                                        </div>
                                        <div className="relative">
                                            <input type="text" placeholder="Card Number" maxLength={19}
                                                className="w-full border border-gray-200 rounded-xl px-4 pt-6 pb-2.5 text-[15px] font-semibold text-gray-800 focus:outline-none focus:border-gray-400 placeholder-transparent peer"
                                            />
                                            <label className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] transition-all pointer-events-none">Card Number *</label>
                                            <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                        </div>
                                        <div className="relative">
                                            <input type="text" placeholder="Cardholder Name"
                                                className="w-full border border-gray-200 rounded-xl px-4 pt-6 pb-2.5 text-[15px] font-semibold text-gray-800 focus:outline-none focus:border-gray-400 placeholder-transparent peer"
                                            />
                                            <label className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] transition-all pointer-events-none">Cardholder Name *</label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="relative">
                                                <input type="text" placeholder="MM / YY"
                                                    className="w-full border border-gray-200 rounded-xl px-4 pt-6 pb-2.5 text-[15px] font-semibold text-gray-800 focus:outline-none focus:border-gray-400 placeholder-transparent peer"
                                                />
                                                <label className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] transition-all pointer-events-none">Expiry *</label>
                                            </div>
                                            <div className="relative">
                                                <input type="password" maxLength={3} placeholder="CVV"
                                                    className="w-full border border-gray-200 rounded-xl px-4 pt-6 pb-2.5 text-[15px] font-semibold text-gray-800 focus:outline-none focus:border-gray-400 placeholder-transparent peer"
                                                />
                                                <label className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] transition-all pointer-events-none">CVV *</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Netbanking */}
                                {selectedMethod === 'netbanking' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div className="relative">
                                            <input type="text" placeholder="Search banks..."
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-semibold focus:outline-none focus:border-gray-400 placeholder:font-normal placeholder:text-gray-300"
                                            />
                                        </div>
                                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                            {banks.map(bank => (
                                                <label key={bank} className={`flex items-center justify-between px-4 py-3.5 border rounded-xl cursor-pointer group transition-all ${selectedBank === bank ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                            <Landmark className="h-4 w-4 text-indigo-400" />
                                                        </div>
                                                        <span className="text-[14px] font-semibold text-gray-700">{bank}</span>
                                                    </div>
                                                    <input type="radio" name="bank" value={bank} checked={selectedBank === bank} onChange={() => setSelectedBank(bank)} className="hidden" />
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedBank === bank ? 'border-gray-900' : 'border-gray-300'}`}>
                                                        {selectedBank === bank && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Booking Summary */}
                    <div className="sticky top-28 self-start">
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            {/* Fare Breakup */}
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-[15px] font-black text-gray-800 mb-4">Fare Breakup</h3>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="font-semibold text-gray-500">Base Fare ({seats?.length || 1} seat{(seats?.length || 1) > 1 ? 's' : ''})</span>
                                        <span className="font-bold text-gray-800">₹{baseFare}</span>
                                    </div>
                                    {totalCommission > 0 && (
                                        <div className="flex justify-between text-[13px]">
                                            <span className="font-semibold text-gray-500">Platform Fee</span>
                                            <span className="font-bold text-gray-800">₹{totalCommission}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[13px]">
                                        <span className="font-semibold text-gray-500">GST (5%)</span>
                                        <span className="font-bold text-gray-800">₹{gst}</span>
                                    </div>
                                    {couponApplied && (
                                        <div className="flex justify-between items-start text-[13px] animate-in slide-in-from-right-2">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-emerald-600">Coupon Discount ({couponCode})</span>
                                                {slabInfo && (
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 -mt-0.5">
                                                        <Zap className="h-3 w-3 fill-emerald-500" /> Slab benefit applied
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-bold text-emerald-600">-₹{discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-3 mt-1 border-t border-dashed border-gray-200">
                                        <span className="text-[14px] font-black text-gray-900">Total Amount</span>
                                        <span className="text-[20px] font-black text-gray-900">₹{total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bus Details */}
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-[15px] font-black text-gray-800 mb-4">Bus Details</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-gray-100 p-1.5 rounded-lg mt-0.5"><Smartphone className="h-3.5 w-3.5 text-gray-500" /></div>
                                        <div>
                                            <p className="text-[13px] font-black text-gray-800">{bus?.name || 'Express Bus'}</p>
                                            <p className="text-[11px] font-semibold text-gray-400">{bus?.type || 'A/C Seater'}</p>
                                        </div>
                                    </div>
                                    <div className="relative pl-4 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-200">
                                        <div className="relative flex items-start gap-3">
                                            <div className="absolute -left-[13px] top-1 w-2 h-2 bg-gray-500 rounded-full z-10"></div>
                                            <div>
                                                <p className="text-[13px] font-bold text-gray-800">{boarding?.time || bus?.departure || '--:--'}</p>
                                                <p className="text-[11px] font-semibold text-gray-400">{boarding?.location || bus?.departurePoint || 'Boarding Point'}</p>
                                            </div>
                                        </div>
                                        <div className="relative flex items-start gap-3">
                                            <div className="absolute -left-[13px] top-1 w-2 h-2 bg-gray-500 rounded-full z-10"></div>
                                            <div>
                                                <p className="text-[13px] font-bold text-gray-800">{dropping?.time || bus?.arrival || '--:--'}</p>
                                                <p className="text-[11px] font-semibold text-gray-400">{dropping?.location || bus?.arrivalPoint || 'Dropping Point'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {bus?.duration && (
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            Duration: {bus.duration}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Passenger & Seat */}
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-[15px] font-black text-gray-800 mb-3">Seat Details</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {seats?.map((s, i) => (
                                        <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-black px-2.5 py-1 rounded-lg">
                                            {s?.label || `Seat ${i + 1}`} • {s?.deck === 'upper' ? 'Upper' : 'Lower'}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Pay Button */}
                            <div className="p-6">
                                <button
                                    onClick={handlePay}
                                    disabled={isProcessing}
                                    className={`w-full py-4 rounded-2xl font-black text-[16px] uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3
                                    ${isProcessing ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#D84E55] hover:bg-[#C13E44] text-white shadow-red-500/20'}`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : `Pay ₹${total}`}
                                </button>
                                <p className="text-center text-[11px] font-semibold text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 100% safe & secure payment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BusPayment;
