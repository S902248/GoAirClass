import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, MapPin, Tag, Home, Download, Copy } from 'lucide-react';
import { downloadInvoice } from '../api/hotelApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HotelBookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, hotel, room, checkIn, checkOut, guests, roomPrice, taxes, totalAmount, discount } = location.state || {};

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] pt-24">
                <p className="text-gray-500 font-semibold mb-4">No booking information found.</p>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#006ce4] text-white rounded-xl font-bold">Go Home</button>
            </div>
        );
    }

    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const imageUrl = hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800';

    const handleDownloadInvoice = async () => {
        try {
            const data = await downloadInvoice(booking._id);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_${booking._id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download invoice.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-[#f8f9fa] to-blue-50 pt-24 pb-20 font-inter">
            <ToastContainer />
            <div className="max-w-2xl mx-auto px-4 sm:px-6">

                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900">Booking Confirmed!</h1>
                    <p className="text-gray-500 font-medium mt-2">Your room has been reserved. A confirmation will be sent to your email.</p>
                    <div className="mt-4 inline-flex items-center bg-gray-100 rounded-full pl-4 pr-1.5 py-1.5 text-xs font-black text-gray-600 tracking-wider uppercase border border-gray-200 shadow-sm">
                        Booking ID: <span className="text-[#006ce4] ml-1">{booking.bookingId || booking._id?.substring(0, 8).toUpperCase()}</span>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(booking.bookingId || booking._id?.substring(0, 8).toUpperCase());
                                toast.success('Booking ID copied to clipboard!');
                            }} 
                            className="ml-2 p-1.5 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-800 border border-transparent hover:border-gray-200"
                            title="Copy Booking ID"
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                </div>

                {/* Booking Card */}
                <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgb(0_0_0_/_0.08)] border border-gray-100 overflow-hidden">

                    {/* Hotel Banner */}
                    <div className="relative h-48">
                        <img src={imageUrl} alt={hotel?.hotelName} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-4 left-5 text-white">
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(hotel?.starRating || 4)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                            </div>
                            <h2 className="text-xl font-black">{hotel?.hotelName}</h2>
                            <p className="text-xs text-gray-200 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" /> {hotel?.address || hotel?.city}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Stay Details */}
                        <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50 rounded-2xl overflow-hidden">
                            <div className="p-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-In</p>
                                <p className="font-black text-gray-900 text-sm">{new Date(checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">12:00 PM</p>
                            </div>
                            <div className="p-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-Out</p>
                                <p className="font-black text-gray-900 text-sm">{new Date(checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">11:00 AM</p>
                            </div>
                            <div className="p-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                                <p className="font-black text-gray-900 text-sm">{nights} Night{nights !== 1 ? 's' : ''}</p>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">{guests} Guest{guests !== 1 ? 's' : ''}</p>
                            </div>
                        </div>

                        {/* Room */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                                <p className="font-black text-gray-900">{room?.roomType || 'Room'}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-xs text-gray-500 font-medium">1 Room · {room?.capacity || 2} Guests max</p>
                                    {booking.assignedRoomNumber && (
                                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100">
                                            <Tag className="h-3 w-3" /> Room: {booking.assignedRoomNumber}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-gray-900">₹{roomPrice?.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-gray-400 font-medium">Base ({nights} night{nights !== 1 ? 's' : ''})</p>
                            </div>
                        </div>

                        {/* Price breakdown */}
                        <div className="space-y-2">
                            {discount > 0 && (
                                <div className="flex justify-between text-sm font-semibold text-green-600">
                                    <span>Discount</span><span>- ₹{discount?.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm font-semibold text-gray-600">
                                <span>Taxes & Fees</span><span>₹{taxes?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between font-black text-gray-900 text-lg pt-2 border-t border-gray-100">
                                <span>Total Paid</span><span>₹{totalAmount?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Guest */}
                        <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Primary Guest</p>
                            <p className="font-black text-blue-900 text-sm">{booking.guestName}</p>
                            <p className="text-xs text-blue-700 font-medium">{booking.guestEmail}</p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking Status</p>
                                <p className={`font-black capitalize mt-0.5 ${booking.status === 'confirmed' ? 'text-green-600' : booking.status === 'cancelled' ? 'text-red-500' : 'text-amber-600'}`}>{booking.status}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Payment</p>
                                <p className={`font-black mt-0.5 text-right ${booking.paymentStatus === 'Completed' ? 'text-green-600' : booking.paymentStatus === 'Failed' ? 'text-red-500' : 'text-amber-600'}`}>{booking.paymentStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-gray-400 transition-colors"
                    >
                        <Home className="h-4 w-4" /> Back to Home
                    </button>
                    <button
                        onClick={handleDownloadInvoice}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#006ce4] transition-colors"
                    >
                        <Download className="h-4 w-4" /> Download Invoice
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 font-medium mt-6">
                    Questions? Contact our 24/7 support team for assistance.
                </p>
            </div>
        </div>
    );
};

export default HotelBookingConfirmation;
