import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    AlertCircle, ArrowLeft, CheckCircle2,
    CreditCard, ShieldAlert, Clock, Receipt,
    Building2, MapPin, Check, ChevronRight,
    MessageSquare, X
} from 'lucide-react';
import { getHotelBookingById, cancelHotelBooking } from '../api/hotelApi';

// ── CANCELLATION REASONS ─────────────────────────────────────────────
const CANCELLATION_REASONS = [
    { id: 'change_of_plans', label: 'Change of plans' },
    { id: 'better_hotel', label: 'Found a better hotel' },
    { id: 'travel_cancelled', label: 'Travel cancelled' },
    { id: 'booking_mistake', label: 'Booking mistake' },
    { id: 'other', label: 'Other' },
];

// ── STEPPER ───────────────────────────────────────────────────────────
const STEPS = ['Policy', 'Reason', 'Refund', 'Done'];

const Stepper = ({ step }) => (
    <div className="flex items-center justify-center gap-0 mb-10">
        {STEPS.map((s, idx) => {
            const num = idx + 1;
            const isCompleted = step > num;
            const isActive = step === num;
            return (
                <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 shadow-sm transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                            isActive ? 'bg-[#006ce4] border-[#006ce4] text-white scale-110' :
                            'bg-white border-gray-200 text-gray-400'
                        }`}>
                            {isCompleted ? <Check className="w-4 h-4" /> : num}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                            {s}
                        </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                        <div className={`h-0.5 w-12 mb-4 mx-1 transition-all duration-500 ${step > num ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────
const CancelHotel = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState(null);
    const [selectedReason, setSelectedReason] = useState('');
    const [refundPreview, setRefundPreview] = useState(null);   // computed locally for step 2–3
    const [refundDetails, setRefundDetails] = useState(null);   // from backend after confirm

    useEffect(() => { fetchBookingDetails(); }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getHotelBookingById(bookingId);
            if (data.success) {
                setBooking(data.booking);
                // Pre-compute refund preview
                const checkInTime = new Date(data.booking.checkInDate).getTime();
                const diff = (checkInTime - Date.now()) / (1000 * 60 * 60);
                const charge = diff < 24 ? Math.round(data.booking.totalPrice * 0.5) : 0;
                setRefundPreview({
                    totalPaid: data.booking.totalPrice,
                    cancellationCharge: charge,
                    serviceFee: 0,
                    refundAmount: data.booking.totalPrice - charge,
                    policy: diff >= 24 ? 'Free Cancellation' : 'Late Cancellation (50% charge)',
                    isFree: diff >= 24,
                    hoursLeft: Math.max(0, Math.floor(diff)),
                });
            } else {
                setError(data.message || 'Failed to fetch booking details.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const confirmCancellation = async () => {
        try {
            setCancelling(true);
            const data = await cancelHotelBooking(bookingId, selectedReason);
            if (data.success) {
                setRefundDetails(data.refundDetails);
                setStep(4);
                window.scrollTo(0, 0);
            } else {
                setError(data.message || 'Cancellation failed. Please try again.');
            }
        } catch {
            setError('Failed to cancel. Please contact support.');
        } finally {
            setCancelling(false);
        }
    };

    const goBack = () => {
        if (step > 1) { setStep(s => s - 1); window.scrollTo(0, 0); }
        else navigate('/my-bookings');
    };

    // ── LOADING ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-[#006ce4]/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#006ce4] rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Loading booking…</p>
        </div>
    );

    // ── ERROR ────────────────────────────────────────────────────────
    if (error && step !== 4) return (
        <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center px-6 text-center gap-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-500 text-sm font-bold">{error}</p>
            </div>
            <button onClick={() => navigate('/my-bookings')}
                className="px-8 py-4 bg-[#006ce4] text-white rounded-full font-black text-xs uppercase tracking-widest">
                Back to Bookings
            </button>
        </div>
    );

    const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#F4F6FA] pt-28 pb-20 font-sans">
            {/* ambient bg */}
            <div className="fixed top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-96 h-96 bg-rose-100/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-[700px] mx-auto px-4">

                {/* ── TOP NAV ──────────────────────────────────── */}
                {step < 4 && (
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={goBack}
                            className="inline-flex items-center gap-2 text-[#006ce4] font-black text-xs uppercase tracking-widest bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            {step === 1 ? 'My Bookings' : 'Back'}
                        </button>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancellation</span>
                    </div>
                )}

                <Stepper step={step} />

                {/* ════════════════════════════════════════════════
                    STEP 1 – POLICY & BOOKING DETAILS
                ════════════════════════════════════════════════ */}
                {step === 1 && booking && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Booking Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Hotel Header */}
                            <div className="bg-[#006ce4] px-8 py-6 flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Property</p>
                                    <h2 className="text-white font-black text-xl leading-tight truncate">{booking.hotelId?.hotelName}</h2>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <MapPin className="w-3 h-3 text-white/60" />
                                        <span className="text-white/60 text-xs font-bold">{booking.hotelId?.city}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="px-8 py-6 grid grid-cols-2 gap-x-8 gap-y-6">
                                {[
                                    { label: 'Room Type', value: booking.roomType || '—' },
                                    { label: 'Room Number', value: booking.assignedRoomNumber || '—' },
                                    { label: 'Check-in', value: fmt(booking.checkInDate) },
                                    { label: 'Check-out', value: fmt(booking.checkOutDate) },
                                    { label: 'Guests', value: `${booking.guests} Adult(s)` },
                                    { label: 'Amount Paid', value: `₹${booking.totalPrice?.toLocaleString('en-IN')}` },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                                        <p className="text-sm font-black text-gray-900">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cancellation Policy Card */}
                        <div className={`rounded-3xl border overflow-hidden ${refundPreview?.isFree ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                            <div className="px-8 py-6 flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${refundPreview?.isFree ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                    <ShieldAlert className={`w-6 h-6 ${refundPreview?.isFree ? 'text-emerald-600' : 'text-amber-600'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className={`font-black text-[10px] uppercase tracking-widest mb-1 ${refundPreview?.isFree ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        Cancellation Policy
                                    </p>
                                    {refundPreview?.isFree ? (
                                        <>
                                            <p className="font-black text-green-900 text-sm">✅ Free cancellation available</p>
                                            <p className="text-xs font-bold text-green-800/60 mt-1">
                                                Cancel now for a full refund of ₹{booking.totalPrice?.toLocaleString('en-IN')}.
                                                Free cancellation window closes in ~{refundPreview.hoursLeft}h.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-black text-amber-900 text-sm">⚠️ Late cancellation — charges apply</p>
                                            <p className="text-xs font-bold text-amber-800/60 mt-1">
                                                50% cancellation charge applies. You will receive a refund of ₹{refundPreview?.refundAmount?.toLocaleString('en-IN')}.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Refund Tiers */}
                            <div className="px-8 pb-6 space-y-2">
                                {[
                                    { label: 'Full Refund', sub: `Cancel before ${fmt(new Date(new Date(booking.checkInDate).getTime() - 24 * 3600000))}`, badge: '100%', active: refundPreview?.isFree, color: 'emerald' },
                                    { label: '50% Refund', sub: 'Within 24h of check-in', badge: '50%', active: !refundPreview?.isFree && refundPreview?.refundAmount > 0, color: 'amber' },
                                    { label: 'No Refund', sub: 'After check-in time', badge: '0%', active: refundPreview?.refundAmount === 0, color: 'rose' },
                                ].map(({ label, sub, badge, active, color }) => (
                                    <div key={label} className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${active
                                        ? color === 'emerald' ? 'bg-white border-emerald-200 shadow-sm'
                                        : color === 'amber' ? 'bg-white border-amber-200 shadow-sm'
                                        : 'bg-white border-rose-200 shadow-sm'
                                        : 'bg-white/50 border-transparent opacity-40'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                            <div>
                                                <p className="text-xs font-black text-gray-900">{label}</p>
                                                <p className="text-[10px] font-bold text-gray-400">{sub}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {active && <span className="text-[9px] font-black bg-[#006ce4] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Current</span>}
                                            <span className={`text-xs font-black ${color === 'emerald' ? 'text-emerald-600' : color === 'amber' ? 'text-amber-600' : 'text-rose-600'}`}>{badge}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <button onClick={() => { setStep(2); window.scrollTo(0, 0); }}
                            className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                            Proceed to Cancel <ChevronRight className="w-5 h-5" />
                        </button>
                        <button onClick={() => navigate('/my-bookings')}
                            className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest border border-gray-200 hover:border-gray-400 active:scale-[0.98] transition-all">
                            Keep My Booking
                        </button>
                    </div>
                )}

                {/* ════════════════════════════════════════════════
                    STEP 2 – CANCELLATION REASON
                ════════════════════════════════════════════════ */}
                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-7 border-b border-gray-50">
                                <div className="flex items-center gap-3 mb-1">
                                    <MessageSquare className="w-5 h-5 text-[#006ce4]" />
                                    <p className="text-[10px] font-black text-[#006ce4] uppercase tracking-widest">Your Feedback</p>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Why are you cancelling?</h2>
                                <p className="text-xs font-bold text-gray-400 mt-1">This helps us improve our service.</p>
                            </div>

                            <div className="px-8 py-6 space-y-3">
                                {CANCELLATION_REASONS.map(({ id, label }) => (
                                    <button key={id} onClick={() => setSelectedReason(id)}
                                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all text-left ${
                                            selectedReason === id
                                                ? 'border-[#006ce4] bg-blue-50'
                                                : 'border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
                                        }`}>
                                        <span className={`text-sm font-black ${selectedReason === id ? 'text-[#006ce4]' : 'text-gray-700'}`}>{label}</span>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                            selectedReason === id ? 'border-[#006ce4] bg-[#006ce4]' : 'border-gray-300'
                                        }`}>
                                            {selectedReason === id && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={() => { setStep(3); window.scrollTo(0, 0); }}
                            disabled={!selectedReason}
                            className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            Continue <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* ════════════════════════════════════════════════
                    STEP 3 – REFUND BREAKDOWN & CONFIRM
                ════════════════════════════════════════════════ */}
                {step === 3 && refundPreview && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-7 border-b border-gray-50">
                                <p className="text-[10px] font-black text-[#006ce4] uppercase tracking-widest mb-1">Summary</p>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Refund Breakdown</h2>
                            </div>

                            {/* Line Items */}
                            <div className="px-8 py-6 space-y-4">
                                {[
                                    { label: 'Total Paid', value: `₹${refundPreview.totalPaid.toLocaleString('en-IN')}`, color: 'text-gray-900', sub: null },
                                    { label: 'Cancellation Charges', value: `- ₹${refundPreview.cancellationCharge.toLocaleString('en-IN')}`, color: refundPreview.cancellationCharge > 0 ? 'text-rose-500' : 'text-emerald-500', sub: refundPreview.policy },
                                    { label: 'Service Fee', value: `₹0`, color: 'text-gray-500', sub: null },
                                ].map(({ label, value, color, sub }) => (
                                    <div key={label} className="flex items-center justify-between py-3 border-b border-dashed border-gray-100 last:border-0">
                                        <div>
                                            <p className="text-sm font-black text-gray-700">{label}</p>
                                            {sub && <p className="text-[10px] font-bold text-gray-400 mt-0.5">{sub}</p>}
                                        </div>
                                        <span className={`text-sm font-black ${color}`}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Refund Total */}
                            <div className="mx-6 mb-6 bg-[#006ce4] rounded-2xl p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Refund Amount</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">₹{refundPreview.refundAmount.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="bg-white/20 rounded-xl px-4 py-2 flex items-center gap-2 border border-white/20">
                                    <Clock className="w-4 h-4 text-white" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider">5–7 Working Days</span>
                                </div>
                            </div>

                            {/* Refund Info */}
                            <div className="px-8 pb-6 flex items-start gap-3 p-4 bg-blue-50/50 mx-6 mb-6 rounded-2xl border border-blue-100">
                                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-blue-900/60 leading-relaxed">
                                    {refundPreview.refundAmount > 0
                                        ? `Your refund of ₹${refundPreview.refundAmount.toLocaleString('en-IN')} will be credited to your original payment method within 5–7 working days.`
                                        : 'This booking is non-refundable. No amount will be credited.'}
                                </p>
                            </div>
                        </div>

                        {/* Confirm Modal */}
                        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden">
                            <div className="px-8 py-7">
                                <h3 className="text-lg font-black text-gray-900 mb-2">Are you sure you want to cancel?</h3>
                                <p className="text-xs font-bold text-gray-400">This action cannot be undone. Your room will be released immediately.</p>
                            </div>
                            <div className="px-8 pb-6 grid grid-cols-2 gap-4">
                                <button onClick={goBack}
                                    className="py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    <X className="w-4 h-4" /> Keep Booking
                                </button>
                                <button onClick={confirmCancellation} disabled={cancelling}
                                    className="py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 disabled:opacity-60">
                                    {cancelling ? (
                                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                                    ) : (
                                        <><Check className="w-4 h-4" /> Confirm Cancel</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════
                    STEP 4 – SUCCESS SCREEN
                ════════════════════════════════════════════════ */}
                {step === 4 && refundDetails && (
                    <div className="space-y-6 animate-in zoom-in-95 fade-in duration-700">
                        {/* Success Header */}
                        <div className="text-center py-8">
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-[30px] animate-pulse" />
                                <div className="relative w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center border-8 border-white shadow-2xl shadow-emerald-200">
                                    <CheckCircle2 className="w-14 h-14 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Booking Cancelled</h1>
                            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.3em]">Successfully Processed</p>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-3">
                                <Receipt className="w-5 h-5 text-[#006ce4]" />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cancellation Summary</p>
                            </div>
                            <div className="px-8 py-6 space-y-5">
                                {[
                                    { label: 'Hotel', value: refundDetails.hotelName || booking?.hotelId?.hotelName || '—' },
                                    { label: 'Room Type', value: refundDetails.roomType || booking?.roomType || '—' },
                                    { label: 'Room Number', value: refundDetails.assignedRoomNumber || booking?.assignedRoomNumber || '—' },
                                    { label: 'Refund Amount', value: `₹${refundDetails.refundAmount?.toLocaleString('en-IN') || 0}`, highlight: true },
                                    { label: 'Refund Status', value: refundDetails.refundStatus || 'Processing' },
                                    { label: 'Transaction ID', value: `RFD-${bookingId.substring(0, 10).toUpperCase()}` },
                                ].map(({ label, value, highlight }) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                                        <p className={`text-sm font-black ${highlight ? 'text-[#006ce4] text-lg' : 'text-gray-900'}`}>{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Refund Status */}
                        <div className={`rounded-3xl p-6 border flex items-center gap-4 ${refundDetails.refundAmount > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                            {refundDetails.refundAmount > 0 ? (
                                <>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                    <div>
                                        <p className="text-sm font-black text-emerald-900">Your refund has been initiated.</p>
                                        <p className="text-xs font-bold text-emerald-700/60 mt-0.5">
                                            ₹{refundDetails.refundAmount.toLocaleString('en-IN')} will be credited to your original payment method within 5–7 working days.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
                                    <p className="text-sm font-black text-gray-500">This booking was non-refundable.</p>
                                </>
                            )}
                        </div>

                        {/* Notification Note */}
                        <div className="bg-blue-50 rounded-3xl px-6 py-5 border border-blue-100 flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                <Receipt className="w-4 h-4 text-[#006ce4]" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-blue-900">Confirmation sent!</p>
                                <p className="text-[11px] font-bold text-blue-600/70 mt-0.5 leading-relaxed">
                                    A cancellation confirmation with refund details has been dispatched to{' '}
                                    <span className="text-blue-900">{refundDetails.guestEmail || booking?.guestEmail}</span>.
                                </p>
                            </div>
                        </div>

                        <button onClick={() => navigate('/my-bookings')}
                            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all shadow-lg">
                            Return to My Bookings
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CancelHotel;
