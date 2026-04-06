import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import trainApi from '../api/trainApi';
import { CheckCircle, XCircle, Train, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
import dayjs from 'dayjs';

const TicketVerification = () => {
    const { pnr } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const verify = async () => {
            try {
                if (!pnr || !token) {
                    setError('Invalid verification link. Missing PNR or Security Token.');
                    return;
                }
                const res = await trainApi.verifyTicket(pnr, token);
                if (res.success) {
                    setBooking(res.booking);
                } else {
                    setError('Verification Failed. Invalid or tampered token.');
                }
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Server error. Could not verify ticket.');
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [pnr, token]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
                <p className="text-gray-600 font-medium">Verifying Secure Ticket...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center px-4 h-screen bg-gray-50 text-center">
                <XCircle className="w-20 h-20 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg flex items-start gap-2 text-left">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>This happens if the ticket URL is incomplete (missing token) or the ticket was modified maliciously. Please scan the original QR code again.</p>
                </div>
            </div>
        );
    }

    if (!booking) return null;

    const routeDate = dayjs(booking.journeyDate).format('DD MMM YYYY, ddd');
    const bDate = dayjs(booking.createdAt).format('DD MMM YYYY');

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8 pb-12 px-4 font-sans text-gray-800">
            {/* Success Banner */}
            <div className="w-full max-w-md bg-green-500 text-white rounded-t-2xl p-6 text-center shadow-lg relative overflow-hidden z-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-tr-full"></div>
                <CheckCircle className="w-16 h-16 mx-auto mb-3 text-white relative z-10" />
                <h1 className="text-2xl font-bold relative z-10 tracking-wide">VERIFIED TICKET</h1>
                <p className="text-green-100 font-medium text-sm mt-1 relative z-10">100% Authentic Booking</p>
            </div>

            {/* Ticket Card */}
            <div className="w-full max-w-md bg-white rounded-b-2xl shadow-xl overflow-hidden -mt-4 pt-8 pb-6 px-6 border-b-4 border-red-500 relative z-0">
                
                {/* PNR & Status */}
                <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl mb-6">
                    <div>
                        <p className="text-xs font-bold text-gray-500 tracking-wider uppercase">PNR Number</p>
                        <p className="text-2xl font-extrabold text-red-600 leading-tight">{booking.pnr}</p>
                    </div>
                    <div className="text-right">
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                            {booking.status}
                        </span>
                    </div>
                </div>

                {/* Train Information */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Train className="w-5 h-5 text-gray-500" />
                        <h2 className="text-lg font-bold">{booking.train?.name}</h2>
                    </div>
                    <p className="text-sm font-medium text-gray-500 ml-7 mb-4">Train #{booking.train?.number} • {booking.passengers[0]?.coachType || 'General'}</p>
                    
                    <div className="flex justify-between items-center ml-7 mt-2">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-gray-800">{booking.source?.code}</span>
                            <span className="text-xs font-medium text-gray-500">{booking.source?.name}</span>
                        </div>
                        <div className="flex-1 px-4 text-center text-gray-300">
                           <div className="border-t-2 border-dashed border-gray-300 w-full mb-1"></div>
                           <span className="text-xs font-semibold text-gray-500">TO</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-2xl font-black text-gray-800">{booking.destination?.code}</span>
                            <span className="text-xs font-medium text-gray-500">{booking.destination?.name}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 ml-7 mt-5">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold">{routeDate}</span>
                        </div>
                    </div>
                </div>
                
                <hr className="border-t border-dashed border-gray-200 my-6" />

                {/* Passengers */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-red-500" />
                        Passenger Layout
                    </h3>
                    <div className="space-y-3">
                        {booking.passengers.map((p, idx) => {
                            const seat = booking.allocatedSeats?.[idx] || {};
                            return (
                                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.gender}, {p.age} yrs</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 font-bold mb-0.5">Coach / Seat</p>
                                        <p className="font-bold text-red-600 text-sm">
                                            {seat.coachNumber || '-'} / {seat.seatNumber ? `${seat.seatNumber} (${seat.berthType || ''})` : '-'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Booking Date</span>
                        <span className="font-bold">{bDate}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Booking ID</span>
                        <span className="font-bold text-gray-700 text-xs mt-0.5">{booking._id}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                        <span className="text-gray-500 font-bold">Total Fare</span>
                        <span className="font-extrabold text-lg text-gray-900">₹{booking.totalFare}</span>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">GoAir Digital Boarding Pass</p>
                </div>
            </div>
        </div>
    );
};

export default TicketVerification;
