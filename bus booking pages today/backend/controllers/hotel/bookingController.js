const mongoose = require('mongoose');
const HotelBooking = require('../../models/hotel/HotelBooking');
const Room = require('../../models/hotel/Room');
const Hotel = require('../../models/hotel/Hotel');
const HotelCoupon = require('../../models/hotel/HotelCoupon');
const RoomInventory = require('../../models/hotel/RoomInventory');
const PDFDocument = require('pdfkit');

const getAllHotelBookings = async (req, res) => {
    try {
        const bookings = await HotelBooking.find()
            .populate('hotelId', 'hotelName city')
            .populate('roomId', 'roomType price')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getBookingsByHotel = async (req, res) => {
    try {
        const bookings = await HotelBooking.find({ hotelId: req.params.hotelId })
            .populate('roomId', 'roomType price')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getUserHotelBookings = async (req, res) => {
    try {
        const bookings = await HotelBooking.find({ userId: req.user.id })
            .populate('hotelId', 'hotelName city address images')
            .populate('roomId', 'roomType price')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getHotelBookingById = async (req, res) => {
    try {
        const booking = await HotelBooking.findById(req.params.id)
            .populate('hotelId', 'hotelName city address images')
            .populate('roomId', 'roomType price totalRooms');
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await HotelBooking.findById(req.params.id).populate('hotelId', 'hotelName city');
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
        }

        // --- CANCELLATION POLICY LOGIC ---
        const checkInTime = new Date(booking.checkInDate).getTime();
        const currentTime = new Date().getTime();
        const hoursUntilCheckIn = (checkInTime - currentTime) / (1000 * 60 * 60);

        let cancellationCharge = 0;
        let refundAmount = booking.totalPrice;
        const serviceFee = 0; // Platform service fee (₹0 for now)

        if (hoursUntilCheckIn < 24) {
            cancellationCharge = Math.round(booking.totalPrice * 0.5);
            refundAmount = booking.totalPrice - cancellationCharge - serviceFee;
        }

        // Accept cancellation reason from frontend for analytics
        const { cancellationReason } = req.body;

        booking.status = 'cancelled';
        booking.paymentStatus = 'Cancelled';
        booking.cancellationReason = cancellationReason || 'Not specified';
        booking.cancellationDetails = {
            cancelledAt: new Date(),
            cancellationCharge,
            serviceFee,
            refundAmount,
            refundStatus: refundAmount > 0 ? 'Processing' : 'N/A'
        };

        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            refundDetails: {
                totalPaid: booking.totalPrice,
                cancellationCharge,
                serviceFee,
                refundAmount,
                refundStatus: refundAmount > 0 ? 'Processing' : 'N/A',
                policyNote: hoursUntilCheckIn >= 24 ? 'Free cancellation applied' : 'Late cancellation charges applied',
                hotelName: booking.hotelId?.hotelName || '',
                roomType: booking.roomType || '',
                assignedRoomNumber: booking.assignedRoomNumber || '',
                guestName: booking.guestName || '',
                guestEmail: booking.guestEmail || '',
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

async function createBooking(req, res) {
    try {
        const {
            hotelId, roomId, checkInDate, checkOutDate, guests,
            guestTitle, guestName, guestLastName, guestEmail, guestPhone,
            roomPrice, taxes, totalAmount, couponCode, couponDiscount,
            billingAddress, pincode, state, gstNumber, roomType,
            razorpayPaymentId, razorpayOrderId, razorpaySignature,
        } = req.body;

        if (!hotelId || !roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ success: false, message: 'Missing required booking fields' });
        }

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

        // Availability check
        const confirmedBookings = await HotelBooking.countDocuments({
            roomId,
            status: 'confirmed'
        });

        if (confirmedBookings >= room.totalRooms) {
            return res.status(400).json({ success: false, message: 'Room Sold Out' });
        }

        const conflicting = await HotelBooking.countDocuments({
            roomId,
            status: { $in: ['confirmed', 'pending'] },
            $or: [{ checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }]
        });

        if (conflicting >= room.totalRooms) {
            return res.status(400).json({ success: false, message: 'No rooms available for the selected dates' });
        }

        // ── ROOM ALLOCATION LOGIC ───────────────────────────────────────────
        // 1. Get all individual rooms for this room type
        const allInventory = await RoomInventory.find({ roomTypeId: roomId });
        
        // 2. Get bookings that overlap with these dates
        const activeBookings = await HotelBooking.find({
            roomId,
            status: { $in: ['confirmed', 'pending'] },
            $or: [{ checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }]
        }).select('inventoryRoomId');

        const bookedInventoryIds = activeBookings.map(b => b.inventoryRoomId?.toString()).filter(Boolean);

        // 3. Find first available room not in bookedInventoryIds
        const availableRoomEntry = allInventory.find(inv => !bookedInventoryIds.includes(inv._id.toString()));

        if (!availableRoomEntry) {
            // This shouldn't happen if the count check passed, but safety first
            return res.status(400).json({ success: false, message: 'Allocation failed: All individual rooms are busy.' });
        }

        // Determine payment status based on razorpay data
        const isPaid = !!(razorpayPaymentId && razorpayOrderId);

        const booking = new HotelBooking({
            hotelId,
            roomId,
            userId: req.user.id,
            inventoryRoomId: availableRoomEntry._id,
            assignedRoomNumber: availableRoomEntry.roomNumber,
            roomType: roomType || room.roomType || '',
            guestTitle: guestTitle || 'Mr',
            guestName: `${guestTitle || ''} ${guestName || ''} ${guestLastName || ''}`.trim() || 'Guest',
            guestEmail: guestEmail || '',
            guestPhone: guestPhone || '',
            checkInDate,
            checkOutDate,
            guests: guests || 1,
            totalPrice: totalAmount || roomPrice || room.price,
            couponCode: couponCode || '',
            couponDiscount: couponDiscount || 0,
            taxes: taxes || 0,
            billingAddress: billingAddress || '',
            pincode: pincode || '',
            state: state || '',
            gstNumber: gstNumber || '',
            status: isPaid ? 'confirmed' : 'pending',
            paymentStatus: isPaid ? 'Completed' : 'Pending',
            razorpayPaymentId: razorpayPaymentId || '',
            razorpayOrderId: razorpayOrderId || '',
            razorpaySignature: razorpaySignature || '',
        });

        await booking.save();

        if (couponCode) {

            try {
                await HotelCoupon.findOneAndUpdate(
                    { hotelId: new mongoose.Types.ObjectId(hotelId), couponCode: couponCode.toUpperCase() },
                    { $inc: { timesUsed: 1 } }
                );
            } catch (err) {
                console.error("Failed to increment coupon usage:", err);
            }
        }

        res.status(201).json({ success: true, booking, message: 'Booking created successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

async function checkRoomAvailability(req, res) {
    try {
        const { roomId, checkInDate, checkOutDate } = req.query;
        if (!roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ success: false, message: 'roomId, checkInDate, checkOutDate required' });
        }

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        const bookedCount = await HotelBooking.countDocuments({
            roomId,
            status: { $in: ['confirmed', 'pending'] },
            $or: [
                { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
            ]
        });

        const availableRooms = Math.min(room.availableRooms, Math.max(0, (room.totalRooms || 0) - bookedCount));
        res.json({ success: true, availableRooms, totalRooms: room.totalRooms, status: room.status });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

async function generateInvoice(req, res) {
    try {
        const { bookingId } = req.params;
        const booking = await HotelBooking.findById(bookingId)
            .populate('hotelId')
            .populate('roomId');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const doc = new PDFDocument({ margin: 50 });
        const filename = `Invoice_${booking._id}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        doc.pipe(res);

        // Header
        doc.fillColor('#006ce4').fontSize(24).text('GOAIRCLASS', { align: 'left' });
        doc.fillColor('#444444').fontSize(10).text('www.goairclass.com', { align: 'left' });
        doc.moveDown();

        doc.fillColor('#000000').fontSize(20).text('INVOICE', { align: 'right' });
        doc.fontSize(10).text(`Invoice Number: INV-${booking._id.toString().substring(0, 8).toUpperCase()}`, { align: 'right' });
        doc.text(`Booking ID: ${booking._id}`, { align: 'right' });
        doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown(2);

        // Customer & Hotel Details
        const startY = 150;
        doc.fontSize(12).fillColor('#000').text('Customer Details', 50, startY, { underline: true });
        doc.fontSize(10).text(`Name: ${booking.guestName}`, 50, startY + 20);
        doc.text(`Email: ${booking.guestEmail}`, 50, startY + 35);
        doc.text(`Phone: ${booking.guestPhone}`, 50, startY + 50);

        doc.fontSize(12).text('Hotel Details', 300, startY, { underline: true });
        doc.fontSize(10).text(`Hotel: ${booking.hotelId.hotelName}`, 300, startY + 20);
        doc.text(`Address: ${booking.hotelId.address}`, 300, startY + 35);
        doc.text(`City: ${booking.hotelId.city}`, 300, startY + 50);
        doc.text(`Room Type: ${booking.roomType}`, 300, startY + 65);
        doc.text(`Room No: ${booking.assignedRoomNumber || 'N/A'}`, 300, startY + 80);
        doc.moveDown(4);

        // Booking Summary Table
        const tableTop = 270;
        doc.fontSize(12).text('Booking Summary', 50, tableTop, { underline: true });
        
        const headerY = tableTop + 25;
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Description', 50, headerY);
        doc.text('Check-in', 150, headerY);
        doc.text('Check-out', 250, headerY);
        doc.text('Guests', 350, headerY);
        doc.text('Nights', 450, headerY);

        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);
        const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));

        doc.font('Helvetica');
        const itemY = headerY + 20;
        doc.text(booking.roomType, 50, itemY);
        doc.text(booking.checkInDate, 150, itemY);
        doc.text(booking.checkOutDate, 250, itemY);
        doc.text(booking.guests.toString(), 350, itemY);
        doc.text(nights.toString(), 450, itemY);

        doc.moveTo(50, itemY + 15).lineTo(550, itemY + 15).stroke();

        // Payment Details
        const paymentY = itemY + 50;
        doc.fontSize(12).font('Helvetica-Bold').text('Payment Summary', 300, paymentY, { underline: true });
        
        const priceY = paymentY + 25;
        doc.fontSize(10).font('Helvetica').text('Base Price:', 300, priceY);
        doc.text(`INR ${booking.totalPrice - (booking.taxes || 0)}`, 450, priceY, { align: 'right' });

        doc.text('Taxes & Fees:', 300, priceY + 15);
        doc.text(`INR ${booking.taxes || 0}`, 450, priceY + 15, { align: 'right' });

        doc.moveTo(300, priceY + 30).lineTo(550, priceY + 30).stroke();

        doc.fontSize(12).font('Helvetica-Bold').text('Total Amount Paid:', 300, priceY + 40);
        doc.text(`INR ${booking.totalPrice}`, 450, priceY + 40, { align: 'right' });

        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica').text(`Payment Status: ${booking.paymentStatus}`, 300, doc.y, { align: 'left' });

        // Footer
        doc.fontSize(10).fillColor('#888').text('This is a computer-generated invoice. No signature required.', 50, 700, { align: 'center' });
        doc.text('For support, contact support@goairclass.com or call +91-1234567890.', { align: 'center' });

        doc.end();

    } catch (err) {
        console.error('Invoice Generation Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = { getAllHotelBookings, getBookingsByHotel, cancelBooking, createBooking, checkRoomAvailability, getUserHotelBookings, generateInvoice, getHotelBookingById };
