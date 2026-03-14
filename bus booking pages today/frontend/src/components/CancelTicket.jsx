import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, Clock, Ticket, Bus, MapPin, Calendar, Users, ShieldAlert, ArrowRight, CreditCard } from 'lucide-react';
import { getBookingDetails, cancelBooking } from '../api/bookingApi';

const CancelTicket = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    // Refund Calculation State
    const [refundData, setRefundData] = useState({
        hoursLeft: 0,
        refundPercentage: 0,
        refundAmount: 0,
        cancellationCharges: 0
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getBookingDetails(bookingId);
                if (response.success && response.booking) {
                    setBooking(response.booking);
                    calculateRefund(response.booking);
                } else {
                    setError('Failed to load booking details.');
                }
            } catch (err) {
                console.error("Error fetching booking details:", err);
                setError(err.message || 'Error loading booking');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [bookingId]);

    const calculateRefund = (b) => {
        if (!b || !b.travelDate) return;

        const now = new Date();
        const travelParts = b.travelDate.split('-');
        const year = parseInt(travelParts[0], 10);
        const month = parseInt(travelParts[1], 10) - 1;
        const day = parseInt(travelParts[2], 10);

        let hour = 10, minute = 0; // Default 10:00 AM
        if (b.schedule && b.schedule.departureTime) {
            const timeParts = b.schedule.departureTime.split(':');
            hour = parseInt(timeParts[0], 10);
            minute = parseInt(timeParts[1], 10);
        } else if (b.boardingPoint) {
            const match = b.boardingPoint.match(/(\d{2}):(\d{2})/);
            if (match) {
                hour = parseInt(match[1], 10);
                minute = parseInt(match[2], 10);
            }
        }

        const departureDate = new Date(year, month, day, hour, minute, 0);
        const hoursUntilDeparture = (departureDate - now) / (1000 * 60 * 60);

        let percentage = 0;
        if (hoursUntilDeparture > 24) percentage = 0.90;
        else if (hoursUntilDeparture > 12) percentage = 0.70;
        else if (hoursUntilDeparture > 6) percentage = 0.50;
        else percentage = 0;

        const totalFare = b.totalFare || 0;
        const refundAmount = Math.round(totalFare * percentage);
        const cancellationCharges = totalFare - refundAmount;

        setRefundData({
            hoursLeft: Math.max(0, hoursUntilDeparture),
            refundPercentage: percentage,
            refundAmount,
            cancellationCharges
        });
    };

    const handleConfirmCancellation = async () => {
        if (refundData.hoursLeft <= 0) {
            alert("Cannot cancel ticket after journey has started.");
            return;
        }

        try {
            setCancelling(true);
            const response = await cancelBooking({
                bookingId: booking._id,
                seatNumbers: booking.seatNumbers || []
            });

            if (response.success) {
                // Show success and redirect
                alert("Your ticket has been cancelled successfully.");
                navigate('/my-bookings');
            } else {
                alert(response.message || "Failed to cancel ticket.");
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "An error occurred while cancelling.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F8F9] flex flex-col items-center justify-center pt-28">
                <div className="w-16 h-16 border-4 border-[#D84E55]/20 border-t-[#D84E55] rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Ticket Details...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-[#F7F8F9] flex flex-col items-center justify-center pt-28 px-4">
                <AlertTriangle className="h-16 w-16 text-rose-500 mb-4" />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Booking Not Found</h2>
                <p className="mt-2 text-gray-500 font-medium mb-8 text-center">{error || "The ticket you are trying to cancel doesn't exist."}</p>
                <button
                    onClick={() => navigate('/my-bookings')}
                    className="bg-[#D84E55] px-8 py-3.5 text-white rounded-xl font-bold tracking-widest text-xs uppercase hover:bg-[#C13E44] transition-colors"
                >
                    Back to My Bookings
                </button>
            </div>
        );
    }

    const isAlreadyCancelled = booking.paymentStatus === 'Cancelled' || booking.status === 'Cancelled';

    return (
        <div className="min-h-screen bg-[#F7F8F9] pb-24 font-sans pt-28">
            <div className="max-w-[700px] mx-auto px-4">

                {/* Header Subtitle Section */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors mb-4 uppercase tracking-wider"
                    >
                        <ArrowLeft className="h-4 w-4" /> Go Back
                    </button>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Cancel Ticket</h1>
                    <p className="text-gray-500 font-medium mt-2">Review cancellation charges before confirming your cancellation.</p>
                </div>

                {isAlreadyCancelled && (
                    <div className="mb-8 bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <ShieldAlert className="h-8 w-8 text-rose-500" />
                        </div>
                        <h2 className="text-xl font-black text-rose-600 mb-1">Ticket Already Cancelled</h2>
                        <p className="text-rose-500/80 font-medium text-sm">This booking has already been cancelled.</p>
                    </div>
                )}

                <div className={`space-y-6 ${isAlreadyCancelled ? 'opacity-60 pointer-events-none' : ''}`}>
                    {/* SECTION 1: TICKET DETAILS */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
                        {/* Decorative Top Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#D84E55]"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-1">
                                    <Bus className="h-5 w-5 text-[#D84E55]" />
                                    {booking.bus?.busName || 'Bus Operator'}
                                </h2>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{booking.bus?.busType || 'AC / SLEEPER'}</p>
                                <div className="mt-3 flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-lg inline-flex border border-rose-100 shadow-sm">
                                    <Users className="w-4 h-4 text-rose-500" />
                                    <span className="text-xs font-black text-rose-600 uppercase tracking-widest">
                                        {booking.passengerName || (booking.passengers && booking.passengers.length > 0 ? booking.passengers[0].name : 'Passenger')}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Fare</span>
                                <p className="text-2xl font-black text-emerald-600 tracking-tight">₹{booking.totalFare}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Route</p>
                                <div className="flex items-center gap-2 font-black text-gray-800 text-sm">
                                    <span className="truncate max-w-[120px]" title={booking.route?.fromCity}>{booking.route?.fromCity || 'Origin'}</span>
                                    <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                    <span className="truncate max-w-[120px]" title={booking.route?.toCity}>{booking.route?.toCity || 'Destination'}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Journey Date</p>
                                <p className="font-black text-gray-800 text-sm">{booking.travelDate}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1 flex items-center gap-1.5"><Ticket className="h-3.5 w-3.5" /> PNR Number</p>
                                <p className="text-sm font-bold text-gray-800">{booking.pnrNumber || booking._id?.substring(0, 8).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1 flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5" /> Seats</p>
                                <p className="text-sm font-bold text-gray-800">{booking.seatNumbers?.join(', ') || booking.seatNumber} ({booking.passengers?.length || 1} Pax)</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: CANCELLATION POLICY */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-400" />
                            Cancellation Policy
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600">
                                        <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-wider rounded-l-lg border-y border-l border-gray-100">Time Before Departure</th>
                                        <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-wider text-right rounded-r-lg border-y border-r border-gray-100">Refund Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={`border-b border-gray-100 ${refundData.refundPercentage === 0.90 ? 'bg-emerald-50/50' : ''}`}>
                                        <td className="px-4 py-3 font-medium text-gray-700">More than 24 hours</td>
                                        <td className="px-4 py-3 font-black text-gray-900 text-right">90% refund</td>
                                    </tr>
                                    <tr className={`border-b border-gray-100 ${refundData.refundPercentage === 0.70 ? 'bg-amber-50/30' : ''}`}>
                                        <td className="px-4 py-3 font-medium text-gray-700">12 - 24 hours</td>
                                        <td className="px-4 py-3 font-black text-gray-900 text-right">70% refund</td>
                                    </tr>
                                    <tr className={`border-b border-gray-100 ${refundData.refundPercentage === 0.50 ? 'bg-orange-50/30' : ''}`}>
                                        <td className="px-4 py-3 font-medium text-gray-700">6 - 12 hours</td>
                                        <td className="px-4 py-3 font-black text-gray-900 text-right">50% refund</td>
                                    </tr>
                                    <tr className={`${refundData.refundPercentage === 0 ? 'bg-rose-50/50' : ''}`}>
                                        <td className="px-4 py-3 font-medium text-gray-700">Less than 6 hours</td>
                                        <td className="px-4 py-3 font-black text-rose-500 text-right">No refund</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SECTION 3: REFUND CALCULATION */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-white to-gray-50/80">
                        <h3 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            Refund Calculation
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100 border-dashed">
                                <span className="text-gray-600 font-medium text-sm">Total Ticket Fare</span>
                                <span className="font-bold text-gray-900">₹{booking.totalFare}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100 border-dashed">
                                <span className="text-gray-600 font-medium text-sm">Cancellation Charges</span>
                                <span className="font-bold text-rose-500">-₹{refundData.cancellationCharges}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-900 font-black text-lg">Estimated Refund Amount</span>
                                <span className="font-black text-2xl text-emerald-600 tracking-tight">₹{refundData.refundAmount}</span>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">
                            <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0" />
                            <div>
                                <h4 className="text-blue-900 font-black text-sm mb-1">Refund Processing Time</h4>
                                <p className="text-blue-700/80 text-xs font-medium leading-relaxed">
                                    Refund will be credited to your original payment method within <strong className="font-bold text-blue-800">5–7 working days</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: IMPORTANT NOTES */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <ul className="space-y-3 text-sm font-medium text-gray-600">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
                                Cancellation is not allowed after the journey starts or within 6 hours of departure.
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
                                Refund will be processed to the original payment method.
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
                                Partial cancellation is allowed for multiple seat bookings (Requires customer support).
                            </li>
                        </ul>
                    </div>
                </div>

                {/* SECTION 5: ACTION BUTTONS */}
                {!isAlreadyCancelled && (
                    <div className="mt-10 mb-8 flex flex-col md:flex-row gap-4">
                        <button
                            onClick={handleConfirmCancellation}
                            disabled={cancelling || refundData.hoursLeft <= 0}
                            className={`flex-1 py-4 px-6 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg transition-all flex justify-center items-center gap-2 ${cancelling || refundData.hoursLeft <= 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200 active:scale-[0.98]'}`}
                        >
                            {cancelling ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                            ) : (
                                "Confirm Cancellation"
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="flex-1 bg-white border-2 border-gray-200 text-gray-800 py-4 px-6 rounded-xl font-black uppercase tracking-widest text-sm hover:border-gray-800 hover:bg-gray-50 transition-colors active:scale-[0.98]"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CancelTicket;
