import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getBookingByPNR } from '../api/bookingApi';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image-more';
import { QRCodeCanvas } from 'qrcode.react';
import { Share2, ArrowLeft, ShieldCheck, Bus, User, Mail, Download } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WhatsAppIcon = () => (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
       <path d="M11.996 0C5.372 0 0 5.373 0 11.998c0 2.646.862 5.103 2.36 7.098L.742 24l5.06-1.638C7.72 23.491 9.794 24 11.996 24 18.621 24 24 18.625 24 11.998 24 5.373 18.621 0 11.996 0zm0 22.09c-2.193 0-4.24-.71-5.908-1.92l-.424-.308-3.15 1.02.842-3.076-.338-.538c-1.332-2.128-2.036-4.606-2.036-7.27 0-5.556 4.52-10.08 10.078-10.08 5.558 0 10.08 4.524 10.08 10.08 0 5.557-4.522 10.081-10.08 10.081zm5.534-7.56c-.302-.15-1.786-.882-2.064-.984-.278-.102-.482-.15-.684.15-.202.302-.782.984-.956 1.186-.176.202-.352.228-.654.076-1.616-.806-2.738-1.554-3.792-3.04-.216-.304.022-.284.316-.584.266-.27.352-.302.502-.604.152-.302.076-.566-.022-.768-.1-.202-.684-1.65-.936-2.258-.246-.59-.496-.51-.684-.52-.176-.008-.378-.01-.58-.01-.202 0-.53.076-.808.38-.278.302-1.056 1.034-1.056 2.52s1.082 2.922 1.234 3.124c.152.204 2.128 3.25 5.154 4.556 1.954.842 2.668.908 3.528.76.86-.15 1.786-.73 2.038-1.436.252-.706.252-1.31.176-1.438-.076-.126-.278-.202-.58-.352z"/>
    </svg>
);

const BusTicket = () => {
    const { pnr } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const ticketRef = useRef(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await getBookingByPNR(pnr);
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
        
        // Hide UI buttons during snapshot
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
            
            // Restore styles
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
            pdf.save(`ticket_${pnr}.pdf`);
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
            }, 2000); // 2 seconds delay to ensure everything is rendered
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [booking, searchParams]);

    const handleShareWA = () => {
        const text = `Here is my bus booking ticket for PNR ${pnr}. Link: ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D84E55]"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ticket Not Found</h2>
                <p className="text-gray-500 mb-6">We couldn't find a booking with PNR: {pnr}</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#D84E55] text-white rounded-lg font-bold">Go Home</button>
            </div>
        );
    }

    const {
        passengerName,
        passengerMobile,
        bus,
        boardingPoint,
        droppingPoint,
        travelDate,
        seatNumbers,
        totalFare,
        baseFare,
        gst,
        discount,
        pnrNumber,
        _id
    } = booking;

    // Use actual domain in production, but use local IP for mobile testing
    let hostStr = window.location.host;
    if (hostStr.includes('localhost')) {
        hostStr = hostStr.replace('localhost', '192.168.1.2'); 
    }
    const verificationUrl = `${window.location.protocol}//${hostStr}/ticket/${pnrNumber}?download=true`;
    
    // Parse locations purely
    const fromCity = boardingPoint?.split(',')[0] || 'Origin';
    const toCity = droppingPoint?.split(',')[0] || 'Destination';

    return (
        <div className="min-h-[100vh] bg-[#E5E7EB] py-16 px-4 font-sans text-gray-800 flex justify-center">
            <ToastContainer />
            
            <div className="w-full max-w-[850px]">
                <div className="flex gap-4 items-center mb-6">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[14px] font-bold text-gray-600 hover:text-gray-900 transition flex-shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                        Go Back
                    </button>
                </div>

                {/* The Ticket Container used for PDF */}
                <div ref={ticketRef} className="bg-[#F8F9FA] rounded-[24px] shadow-2xl overflow-hidden border border-[#E5E7EB]">
                    
                    {/* TOP HEADER */}
                    <div className="bg-gradient-to-r from-[#D84E55] via-[#E1674E] to-[#F18F43] px-8 py-5 text-white flex justify-between items-center flex-wrap gap-4">
                        {/* Title Section */}
                        <div className="flex items-center gap-3">
                            <Bus className="w-8 h-8 opacity-90" />
                            <div>
                                <h1 className="text-[26px] font-black leading-tight tracking-wide">E-Ticket</h1>
                                <p className="text-white/80 text-[12px] font-medium flex items-center gap-1 mt-0.5">
                                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Confirmed Booking
                                </p>
                            </div>
                        </div>

                        {/* Verified Star (Desktop only for space context) */}
                        <div className="hidden md:flex items-center gap-1.5 text-[#FFEAAA] font-bold text-[14px]">
                            ⭐ <span className="tracking-wide">Verified Ticket</span>
                        </div>

                        {/* PNR Box */}
                        <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center min-w-[140px] shadow-sm">
                            <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/70 mb-1 border-b border-white/10 pb-1">— PNR NUMBER —</p>
                            <p className="text-[20px] font-black tracking-wider">{pnrNumber}</p>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col md:flex-row gap-8">
                        {/* LEFT PANE - Primary Info */}
                        <div className="flex-1 flex flex-col gap-6">
                            
                            {/* Operator & Order ID */}
                            <div className="flex justify-between items-center text-[#111827]">
                                <div className="flex items-center gap-2">
                                    <Bus className="text-[#D84E55] w-5 h-5 flex-shrink-0" />
                                    <div>
                                        <span className="font-bold text-[18px]">{bus?.name || 'Travel Express'}</span>
                                        <p className="text-[#6B7280] text-[12px] font-medium mt-0.5">Booking ID: <span className="font-bold text-[#374151]">{pnrNumber}</span></p>
                                    </div>
                                </div>
                                <div className="bg-white px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] text-[#4B5563] flex gap-2 items-center shadow-sm">
                                    <span>Order ID: <span className="font-bold text-[#1F2937] uppercase">{_id?.substring(0,10) || 'ABCD123456'}</span></span>
                                    <div className="w-5 h-4 bg-[#F3F4F6] border border-[#D1D5DB] rounded text-[8px] flex items-center justify-center font-bold text-[#9CA3AF]">💳</div>
                                </div>
                            </div>

                            {/* Route Indicator Card */}
                            <div className="bg-white rounded-[16px] p-5 border border-[#E5E7EB] flex items-center justify-between relative shadow-sm">
                                <div className="text-center w-[35%] z-10">
                                    <p className="text-[20px] font-black text-[#1F2937]">{fromCity}</p>
                                    <p className="text-[10px] font-bold text-[#9CA3AF] mt-1 uppercase tracking-widest">Departure</p>
                                </div>
                                
                                <div className="flex-1 border-t-2 border-dashed border-[#D1D5DB] relative mx-2">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 flex flex-col items-center">
                                        <div className="text-[12px] font-bold text-[#4B5563] whitespace-nowrap">{travelDate}</div>
                                        <div className="text-[11px] font-bold text-[#9CA3AF] mt-0.5">{(booking.boarding && booking.boarding.time) || booking.schedule?.departureTime || '--:--'} - {(booking.dropping && booking.dropping.time) || booking.schedule?.arrivalTime || '--:--'}</div>
                                    </div>
                                </div>

                                <div className="text-center w-[35%] z-10">
                                    <p className="text-[20px] font-black text-[#1F2937]">{toCity}</p>
                                    <p className="text-[10px] font-bold text-[#9CA3AF] mt-1 uppercase tracking-widest">Arrival</p>
                                </div>
                            </div>

                            {/* Detailed Info Grid */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                {/* Passenger Block */}
                                <div>
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Passengers</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center border border-[#E5E7EB]">
                                            <User className="text-[#9CA3AF] w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1F2937] text-[15px] leading-tight">{passengerName}</p>
                                            <p className="text-[11px] font-medium text-[#6B7280] mt-0.5">Contact: {passengerMobile}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Seat Block */}
                                <div className="flex items-center">
                                    <div className="bg-[#F3F4F6] px-4 py-2.5 rounded-xl border border-[#E5E7EB]">
                                        <span className="text-[14px] font-black text-[#1F2937]">{seatNumbers?.join(', ') || 'N/A'}</span>
                                        <span className="text-[11px] font-bold text-[#6B7280] ml-2 border-l border-[#D1D5DB] pl-2">Seats</span>
                                    </div>
                                </div>

                                {/* Operator Block */}
                                <div>
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Bus Operator</p>
                                    <p className="font-bold text-[#1F2937] text-[14px]">
                                        {bus?.name || 'Travel Express Office'}
                                        {(booking.boarding && booking.boarding.time) || booking.schedule?.departureTime ? (
                                            <span className="ml-2 text-[12px] font-black w-fit px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">{(booking.boarding && booking.boarding.time) || booking.schedule?.departureTime}</span>
                                        ) : null}
                                    </p>
                                    <p className="text-[11px] text-[#6B7280] mt-1 line-clamp-2">{(booking.boarding && booking.boarding.point) || boardingPoint}</p>
                                </div>

                                {/* Dropping Details */}
                                <div>
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Dropping Details</p>
                                    <p className="font-bold text-[#1F2937] text-[14px]">
                                        Destination Point
                                        {(booking.dropping && booking.dropping.time) || booking.schedule?.arrivalTime ? (
                                            <span className="ml-2 text-[12px] font-black w-fit px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{(booking.dropping && booking.dropping.time) || booking.schedule?.arrivalTime}</span>
                                        ) : null}
                                    </p>
                                    <p className="text-[11px] text-[#6B7280] mt-1 line-clamp-2">{(booking.dropping && booking.dropping.point) || droppingPoint}</p>
                                </div>

                                {/* Bus Type */}
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Bus Type</p>
                                    <p className="font-bold text-[#1F2937] text-[14px]">{bus?.type || 'Express A/C'}</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANE - Divider (Desktop) */}
                        <div className="hidden md:block w-px border-l-2 border-dashed border-[#E5E7EB]"></div>

                        {/* RIGHT PANE - Fare & QR */}
                        <div className="w-full md:w-[240px] flex flex-col gap-6 flex-shrink-0">
                            
                            {/* Fare Breakdown Card */}
                            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm">
                                <h3 className="font-black text-[#1F2937] text-[15px] mb-4">Fare Breakdown</h3>
                                
                                <div className="space-y-2.5 text-[13px] font-medium text-[#4B5563]">
                                    <div className="flex justify-between">
                                        <span>Base Fare</span>
                                        <span className="font-bold text-[#1F2937]">₹{baseFare || (totalFare - (gst || 0))}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxes</span>
                                        <span className="font-bold text-[#1F2937]">₹{gst || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-[#059669]">
                                        <span>Discount</span>
                                        <span className="font-bold">-₹{discount || 0}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-3 mt-1!">
                                        <span className="font-bold text-[#1F2937] text-[14px]">Total Fare</span>
                                        <span className="font-black text-[#059669] text-[22px]">₹{totalFare}</span>
                                    </div>
                                </div>
                            </div>

                            {/* QR Section */}
                            <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm">
                                <QRCodeCanvas value={verificationUrl} size={110} level="H" />
                                <p className="text-[10px] font-bold text-[#9CA3AF] mt-3 tracking-wide text-center">Scan to Verify Ticket</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons & Footer (Within #printable-ticket but we hide buttons during print) */}
                    <div className="bg-[#E5E7EB]/30 px-8 py-5 border-t border-[#E5E7EB]">
                        
                        {/* Action Buttons */}
                        <div id="ticket-actions" className="flex flex-wrap gap-2.5 mb-5 border-b border-[#D1D5DB] pb-5">
                            <button onClick={handleShareWA} className="flex-1 flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white px-4 py-3 rounded-[12px] text-[13px] font-bold transition shadow-sm">
                                <WhatsAppIcon /> Share via WhatsApp
                            </button>
                            <button onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success('Link copied to clipboard!');
                            }} className="flex-1 flex items-center justify-center gap-2 bg-[#374151] hover:bg-[#1F2937] text-white px-4 py-3 rounded-[12px] text-[13px] font-bold transition shadow-sm">
                                <Mail size={16} /> Copy URL
                            </button>
                            <button onClick={handleDownloadPDF} className="flex-1 flex items-center justify-center gap-2 bg-[#111827] hover:bg-[#000000] text-white px-4 py-3 rounded-[12px] text-[13px] font-bold transition shadow-sm">
                                <Download size={16} /> Download PDF
                            </button>
                        </div>

                        {/* Footer Links */}
                        <div className="flex flex-col md:flex-row justify-between text-[11px] font-bold text-[#6B7280] leading-relaxed">
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                <p>Support: <span className="text-[#374151]">+91 98765 43210</span></p>
                                <p>Emergency Contact: <span className="text-[#374151]">+91 98765 43211</span></p>
                                <p>support@goairclass.com</p>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 md:mt-0">
                                <p className="cursor-pointer hover:underline text-[#D84E55]">Cancel Ticket</p>
                            </div>
                        </div>
                        <p className="text-[9px] font-medium text-[#9CA3AF] mt-2">By using this ticket, you agree to our Terms & Conditions.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BusTicket;
