import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import flightApi from '../api/flightApi';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image-more';
import { QRCodeCanvas } from 'qrcode.react';
import { Plane, User, Download, Mail, CheckCircle2, Copy, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FlightTicket = () => {
    const { pnr } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const ticketRef = useRef(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await flightApi.getBookingByPNR(pnr);
                if (res?.success) {
                    setBooking(res.booking);
                } else {
                    toast.error('Ticket not found');
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load ticket details');
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [pnr]);

    const handleDownloadPDF = async () => {
        if (!ticketRef.current) return;
        const buttonActions = document.getElementById('ticket-actions');
        if (buttonActions) buttonActions.style.display = 'none';

        try {
            // Fix tailwind v4 border glitch in dom-to-image
            const allNodes = ticketRef.current.querySelectorAll('*');
            allNodes.forEach(node => {
                const style = window.getComputedStyle(node);
                if (style.borderWidth === '0px' || style.borderWidth === '') {
                    node.dataset.originalBorderStyle = node.style.borderStyle;
                    node.style.borderStyle = 'none';
                }
            });

            const dataUrl = await domtoimage.toPng(ticketRef.current, { scale: 2, bgcolor: '#ffffff' });
            
            allNodes.forEach(node => {
                if (node.dataset.originalBorderStyle !== undefined) {
                    node.style.borderStyle = node.dataset.originalBorderStyle;
                    delete node.dataset.originalBorderStyle;
                }
            });

            const img = new Image();
            img.src = dataUrl;
            await new Promise((resolve) => { img.onload = resolve; });
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (img.height * pdfWidth) / img.width;
            
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Flight_Ticket_${pnr}.pdf`);
            toast.success('Ticket downloaded successfully!');
        } catch (err) {
            console.error('PDF generation error', err);
            toast.error('Failed to download ticket');
        } finally {
            if (buttonActions) buttonActions.style.display = 'flex';
        }
    };

    // Auto-trigger PDF download when scanned via QR code
    useEffect(() => {
        if (booking && searchParams.get('download') === 'true') {
            const timer = setTimeout(() => {
                handleDownloadPDF();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [booking, searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E40AF]"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ticket Not Found</h2>
                <p className="text-gray-500 mb-6">We couldn't find a flight booking with PNR: {pnr}</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#1E40AF] text-white rounded-lg font-bold">Go Home</button>
            </div>
        );
    }

    const { flightDetails, passengers, fareDetails, contactDetails, pnr: pnrNumber, bookingId, ticketStatus } = booking;
    
    let hostStr = window.location.host;
    if (hostStr.includes('localhost')) {
        hostStr = hostStr.replace('localhost', '192.168.1.2'); 
    }
    const verificationUrl = `${window.location.protocol}//${hostStr}/flight-ticket/${pnrNumber}?download=true`;

    // --- Fare Calculations ---
    const fare = booking?.fareDetails || {};
    const baseFare = fare.baseFare || 0;
    const taxes = fare.taxes || 0;
    const discount = fare.discount || 0;
    const addons = fare.addons || 0;
    const seatFee = fare.seatFee || 0;
    const totalFare = fare.totalAmount || (baseFare + taxes + addons + seatFee - discount);

    const isCancelled = booking?.bookingStatus === 'CANCELLED' || booking?.cancellationDetails?.isCancelled;

    return (
        <div className="min-h-[100vh] bg-[#F4F6F8] pt-32 pb-16 px-4 font-sans flex justify-center">
            <ToastContainer />
            
            <div className="w-full max-w-[900px]">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-2">
                        &larr; Go Back Home
                    </button>
                </div>

                <div ref={ticketRef} className="bg-white rounded-[20px] shadow-gl overflow-hidden border border-gray-100 relative">
                    {/* Header */}
                    <div className={`${isCancelled ? 'bg-red-600' : 'bg-[#1E40AF]'} px-10 py-6 text-white flex justify-between items-center flex-wrap gap-6 relative overflow-hidden`}>
                        <Plane className="absolute -right-8 -top-8 w-48 h-48 text-white opacity-5 rotate-45" />
                        <div className="flex items-center gap-4 z-10">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <Plane className="w-8 h-8 text-white rotate-45" />
                            </div>
                            <div>
                                <h1 className={`text-[28px] font-black uppercase tracking-tight leading-none bg-gradient-to-r from-white ${isCancelled ? 'to-red-200' : 'to-blue-200'} bg-clip-text text-transparent`}>
                                    {isCancelled ? 'CANCELLED TICKET' : 'Boarding Pass'}
                                </h1>
                                <p className={`${isCancelled ? 'text-red-200' : 'text-blue-200'} text-[12px] font-bold tracking-widest uppercase mt-2 flex items-center gap-1.5`}>
                                    <CheckCircle2 className="w-3.5 h-3.5" /> E-Ticket {isCancelled ? 'CANCELLED' : ticketStatus}
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl px-6 py-3 text-center sm:text-right shadow-lg z-10 border border-white/20">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1E40AF] mb-1">PNR NUMBER</p>
                            <p className="text-[24px] font-black tracking-wider text-[#1e3a8a]">{pnrNumber}</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 flex flex-col md:flex-row gap-0 md:gap-10">
                        {/* Main Flight Info */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-[18px] flex items-center justify-center p-2 border border-gray-100 shadow-sm">
                                        <Plane className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-[22px] text-gray-900 leading-tight">{flightDetails.airline || 'Antigravity Air'}</h2>
                                        <p className="text-slate-500 font-bold tracking-widest uppercase text-[11px] mt-1">Flight {flightDetails.flightNumber || 'FL-X'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Aircraft</p>
                                    <p className="text-gray-900 font-bold text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-block">{flightDetails.aircraft || 'Airbus A320'}</p>
                                </div>
                            </div>

                            {/* Routing Graphic */}
                            <div className="flex items-center justify-between mb-10 bg-[#F8FAFC] p-6 rounded-[20px] border border-blue-50 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                <div className="text-left w-24">
                                    <p className="text-[32px] font-black text-[#1E40AF] leading-none mb-1">{flightDetails.departureAirport || 'DEP'}</p>
                                    <p className="text-[12px] font-bold text-gray-500">{flightDetails.departureCity || 'City'}</p>
                                    <div className="mt-3">
                                        <p className="text-[14px] font-black text-gray-900">{new Date(flightDetails.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(flightDetails.departureTime).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col items-center px-4 relative">
                                    <div className="w-full border-t-[3px] border-dashed border-[#CBD5E1] relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F8FAFC] px-3">
                                            <Plane className="w-5 h-5 text-blue-500 rotate-90" />
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mt-4 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{flightDetails.durationMinutes || 0} MINS</p>
                                </div>

                                <div className="text-right w-24">
                                    <p className="text-[32px] font-black text-[#1E40AF] leading-none mb-1">{flightDetails.arrivalAirport || 'ARR'}</p>
                                    <p className="text-[12px] font-bold text-gray-500">{flightDetails.arrivalCity || 'City'}</p>
                                    <div className="mt-3">
                                        <p className="text-[14px] font-black text-gray-900">{flightDetails.arrivalTime ? new Date(flightDetails.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{flightDetails.arrivalTime ? new Date(flightDetails.arrivalTime).toLocaleDateString() : '--/--/--'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Passengers List */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Passenger Details</h3>
                                {passengers?.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden">
                                        <div className="absolute left-0 top-0 w-1 h-full bg-blue-100"></div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-black text-[14px] text-gray-900 uppercase tracking-wide">{p.firstName} {p.lastName}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-0.5">Gender: {p.gender}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Seat</p>
                                            <p className="font-black text-[18px] text-[#1E40AF] bg-blue-50 px-3 py-0.5 rounded-md border border-blue-100 leading-none">{p.seatNumber || 'TBA'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rip Line (Desktop) */}
                        <div className="hidden md:block w-0 border-l-[3px] border-dashed border-gray-200 mx-2 relative">
                            <div className="absolute -top-[52px] -left-3 w-6 h-6 bg-[#F4F6F8] rounded-full border border-gray-100 z-10"></div>
                            <div className="absolute -bottom-10 -left-3 w-6 h-6 bg-[#F4F6F8] rounded-full border border-gray-100 z-10"></div>
                        </div>
                        {/* Rip Line (Mobile) */}
                        <div className="block md:hidden h-0 border-t-[3px] border-dashed border-gray-200 my-8 relative"></div>

                        {/* Right Area - Boarding Data & QR */}
                        <div className="w-full md:w-[260px] flex flex-col flex-shrink-0">
                            
                            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex-1">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Terminal</p>
                                        <p className="font-black text-[24px] text-gray-900 leading-none">{flightDetails.terminal || '1'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gate</p>
                                        <p className="font-black text-[24px] text-gray-900 leading-none">{flightDetails.gate || '-'}</p>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Boarding Time</p>
                                    <p className="font-black text-[16px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
                                        {flightDetails.boardingTime ? new Date(flightDetails.boardingTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Prior 1 Hour'}
                                    </p>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Fare Summary</p>
                                    <div className="space-y-1 text-[11px] font-bold text-gray-600 mb-3">
                                        <div className="flex justify-between"><span>Base:</span><span>₹{fareDetails?.baseFare || 0}</span></div>
                                        <div className="flex justify-between"><span>Taxes:</span><span>₹{fareDetails?.taxes || 0}</span></div>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-gray-200 pt-2">
                                        <span className="text-[10px] font-black text-gray-900 uppercase">Total</span>
                                        <span className="font-black text-[22px] text-[#1E40AF] leading-none">₹{fareDetails?.totalAmount || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
                                <QRCodeCanvas value={verificationUrl} size={130} level="H" includeMargin={true} />
                                <p className="text-[10px] font-black text-gray-400 mt-4 tracking-[0.2em] uppercase">Scan to Verify</p>
                            </div>
                        </div>

                    </div>

                    {/* Fare Details Section */}
                    <div className="bg-gray-50/50 p-6 border-t border-gray-100">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Fare Breakdown</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Base Fare</p>
                                <p className="text-sm font-black text-gray-800">₹{baseFare.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Taxes</p>
                                <p className="text-sm font-black text-gray-800">₹{taxes.toLocaleString()}</p>
                            </div>
                            {discount > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Discount</p>
                                    <p className="text-sm font-black text-green-600">-₹{discount.toLocaleString()}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Fare</p>
                                <p className="text-lg font-black text-[#1E40AF]">₹{totalFare.toLocaleString()}</p>
                            </div>
                            {booking?.paymentStatus && (
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {booking.paymentStatus}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Desktop and Mobile Action Buttons Below Ticket */}
                <div className="mt-8 mb-20">
                    <div id="ticket-actions" className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 overflow-hidden">
                        {!isCancelled && (
                            <button onClick={() => navigate(`/flight/cancel/${booking.bookingId}`)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-4 md:py-3 rounded-xl font-bold uppercase tracking-widest border border-red-200 hover:bg-red-100 transition shadow-sm">
                                <X size={18} /> Cancel Ticket
                            </button>
                        )}
                        <button onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success('Ticket Link copied!');
                        }} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-gray-800 px-6 py-4 md:py-3 rounded-xl font-bold uppercase tracking-widest border border-gray-300 hover:bg-gray-50 transition shadow-sm">
                            <Copy size={18} /> Copy Ticket Link
                        </button>
                        <button onClick={handleDownloadPDF} className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#1E40AF] text-white px-8 py-4 md:py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-[#1e3a8a] transition shadow-lg">
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FlightTicket;
