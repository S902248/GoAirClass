import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import flightApi from '../api/flightApi';
import { Plane, ArrowLeft, AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FlightCancel = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                // Because we don't have getBookingById wrapper in flightApi, we can fetch
                // by PNR if parameter is PNR, OR we can just fetch all and find it.
                // Wait, we need an API call for by ID. We can use axios directly or add it.
                // Let's use getBookingByPNR if bookingId is 6 chars, otherwise we add a new endpoint.
                // For safety, let's use the standard axios instance here.
                const axios = (await import('../api/Axios')).default;
                const res = await axios.get(`/flight-bookings/${bookingId}`);
                if (res?.data?.success) {
                    setBooking(res.data.booking);
                } else {
                    toast.error('Booking not found');
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [bookingId]);

    const handleConfirmCancel = async () => {
        try {
            setCancelling(true);
            const axios = (await import('../api/Axios')).default;
            const res = await axios.post('/flight-bookings/cancel', { bookingId });
            if (res.data.success) {
                toast.success('Ticket cancelled successfully');
                // Refresh booking to show cancelled state
                const updatedRes = await axios.get(`/flight-bookings/${bookingId}`);
                setBooking(updatedRes.data.booking);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel the booking');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold">Go Home</button>
            </div>
        );
    }

    const isAlreadyCancelled = booking.bookingStatus === 'CANCELLED' || booking.cancellationDetails?.isCancelled;
    
    // Calculate preview of refund
    const departureTime = new Date(booking.flightDetails.departureTime);
    const now = new Date();
    const hoursLeft = (departureTime - now) / (1000 * 60 * 60);
    const totalFare = booking.fareDetails.totalAmount || 0;
    
    let refundPercentage = 0;
    if (hoursLeft > 24) refundPercentage = 0.90;
    else if (hoursLeft >= 12) refundPercentage = 0.70;
    else if (hoursLeft >= 4) refundPercentage = 0.50;
    else refundPercentage = 0.00;

    const previewRefund = isAlreadyCancelled ? (booking.cancellationDetails?.refundAmount || 0) : (totalFare * refundPercentage);
    const previewCharges = isAlreadyCancelled ? (booking.cancellationDetails?.cancellationCharges || 0) : (totalFare - previewRefund);

    return (
        <div className="min-h-[100vh] bg-[#F4F6F8] pt-32 pb-16 px-4 font-sans flex justify-center">
            <ToastContainer />
            <div className="w-full max-w-[800px]">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(`/flight-ticket/${booking.pnr}`)} className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Ticket
                    </button>
                </div>

                <div className="bg-white rounded-[24px] shadow-lg overflow-hidden border border-gray-100">
                    <div className={`${isAlreadyCancelled ? 'bg-gray-800' : 'bg-red-600'} px-8 py-6 text-white flex items-center gap-4`}>
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                            {isAlreadyCancelled ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">
                                {isAlreadyCancelled ? 'TICKET CANCELLED' : 'CANCEL BOOKING'}
                            </h1>
                            <p className="text-red-100 text-xs font-bold tracking-widest uppercase mt-1">
                                {isAlreadyCancelled ? 'Refund processed as per policy' : 'Review cancellation charges before proceeding'}
                            </p>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Booking Summary */}
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Flight Summary</h3>
                        <div className="flex items-center justify-between mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-[14px] flex items-center justify-center border border-gray-200 shadow-sm text-red-600 font-black">
                                    <Plane size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-gray-900 text-lg uppercase tracking-wide">{booking.flightDetails.departureAirport} → {booking.flightDetails.arrivalAirport}</p>
                                    <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-widest">PNR: <span className="text-[#1E40AF]">{booking.pnr}</span> · {new Date(booking.flightDetails.departureTime).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Status</p>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase rounded ${isAlreadyCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{booking.bookingStatus}</span>
                            </div>
                        </div>

                        {/* Financials Breakdown */}
                        <div className="mb-8">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Refund Calculation</h3>
                            
                            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm font-bold text-gray-600">Total Amount Paid</p>
                                    <p className="text-lg font-black text-gray-900">₹{totalFare.toLocaleString()}</p>
                                </div>
                                
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                    <p className="text-sm font-bold text-red-600 flex items-center gap-2">
                                        <AlertTriangle size={16} /> Cancellation Charges
                                    </p>
                                    <p className="text-lg font-black text-red-600">-₹{previewCharges.toLocaleString()}</p>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <div>
                                        <p className="text-sm font-black text-green-600 uppercase tracking-wide">Total Refund Amount</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1">
                                            {isAlreadyCancelled ? 'Refunded to original source / wallet' : 'Will be refunded to original payment method'}
                                        </p>
                                    </div>
                                    <p className="text-3xl font-black text-green-600 tracking-tighter">₹{previewRefund.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Policy Info */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 flex gap-3">
                            <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[11px] font-black text-blue-800 uppercase tracking-widest mb-2">Cancellation Policy Guidelines</p>
                                <ul className="text-xs font-semibold text-blue-700/80 space-y-1.5 list-disc pl-4">
                                    <li>Cancellations more than 24h prior: 90% Refund</li>
                                    <li>Between 12 to 24 hours prior: 70% Refund</li>
                                    <li>Between 4 to 12 hours prior: 50% Refund</li>
                                    <li>Less than 4 hours: No Refund (0%)</li>
                                </ul>
                            </div>
                        </div>

                        {/* Actions */}
                        {!isAlreadyCancelled && (
                            <div className="flex gap-4">
                                <button onClick={() => navigate(-1)} className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-800 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition">
                                    Keep Ticket
                                </button>
                                <button 
                                    onClick={handleConfirmCancel} 
                                    disabled={cancelling || hoursLeft < 0}
                                    className={`flex-[2] py-4 rounded-xl font-black text-lg uppercase tracking-widest flex justify-center items-center shadow-lg transition
                                        ${cancelling || hoursLeft < 0 ? 'bg-red-400 cursor-not-allowed text-white' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'}
                                    `}>
                                    {cancelling ? (
                                        <span className="flex items-center gap-2"><div className="w-5 h-5 border-y-2 border-white rounded-full animate-spin"></div> Processing...</span>
                                    ) : (
                                        hoursLeft < 0 ? 'Past Flight (Cannot Cancel)' : 'Confirm Cancellation'
                                    )}
                                </button>
                            </div>
                        )}
                        
                        {isAlreadyCancelled && (
                            <button onClick={() => navigate(`/flight-ticket/${booking.pnr}`)} className="w-full py-4 bg-[#1E40AF] hover:bg-[#1e3a8a] text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-200 transition">
                                View Cancelled E-Ticket
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightCancel;
