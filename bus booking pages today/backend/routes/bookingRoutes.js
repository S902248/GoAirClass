const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const { operatorAuthMiddleware } = require('../middleware/operatorAuthMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/User');

const formatDateToYYYYMMDD = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split(/[-\/]/);
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d)) return d.toISOString().split('T')[0];
    return dateStr;
};
/**
 * POST /api/bookings/create
 * Called by frontend after a successful Razorpay payment.
 * Body: {
 *   razorpayPaymentId, razorpayOrderId, razorpaySignature
 * }
 */

// Create a new booking (authMiddleware makes req.user available)
router.post('/create', authMiddleware, async (req, res) => {
    try {
        console.log('--- Booking Create Requested ---');
        console.log('Payload:', JSON.stringify(req.body, null, 2));

        const {
            bookingId, userId, busId, journeyDate, selectedSeats, contactDetails, totalAmount,
            // Fallback for previous checkout flows
            passengerName, passengerEmail, passengerMobile, passengers,
            routeId, scheduleId, travelDate, boardingPoint, droppingPoint,
            seatNumbers, seatDetails, baseFare, gst, discount, totalFare, couponCode,
            razorpayPaymentId, razorpayOrderId, razorpaySignature,
        } = req.body;

        const effectiveName = passengerName || (passengers && passengers[0]?.name) || 'Guest';
        const effectiveEmail = passengerEmail || contactDetails?.email || 'N/A';
        const effectivePhone = passengerMobile || contactDetails?.phone || '0000000000';

        if (!effectiveName || !effectiveEmail || !effectivePhone) {
            console.log('Validation Failed: Missing passenger details');
            return res.status(400).json({ success: false, message: 'Passenger details are required.' });
        }

        if (bookingId) {
            const existingBooking = await Booking.findById(bookingId);
            // Also update userId on the existing booking when updating (in case it was saved without userId)
            if (existingBooking) {
                // Server-side validation for ladies seats
                const bus = await Bus.findById(existingBooking.bus || busId);
                if (bus && bus.seatLayout) {
                    for (const seatNo of (existingBooking.seatNumbers || [])) {
                        const seatDef = bus.seatLayout.find(s => s.seatNo === seatNo);
                        if (seatDef && (seatDef.type === 'ladies' || seatDef.type === 'ladies-sleeper')) {
                            // Check if all passengers for these seats are female
                            const passenger = (existingBooking.passengers || []).find(p => p.seatNumber === seatNo);
                            if (passenger && passenger.gender !== 'Female') {
                                return res.status(400).json({ success: false, message: `Seat ${seatNo} is reserved for ladies.` });
                            }
                        }
                    }
                }

                if (!existingBooking.userId && req.user?.id) {
                    existingBooking.userId = req.user.id;
                }
                existingBooking.paymentStatus = razorpayPaymentId ? 'Completed' : 'Pending';
                existingBooking.razorpayPaymentId = razorpayPaymentId;
                existingBooking.razorpayOrderId = razorpayOrderId;
                existingBooking.razorpaySignature = razorpaySignature;

                // Also update fare breakdown (coupon applied on payment page)
                if (couponCode !== undefined) existingBooking.couponCode = couponCode;
                if (discount !== undefined) existingBooking.discount = discount;
                if (baseFare !== undefined) existingBooking.baseFare = baseFare;
                if (gst !== undefined) existingBooking.gst = gst;
                if (totalFare !== undefined) existingBooking.totalFare = totalFare;

                await existingBooking.save();
                console.log('✅ Booking Updated Successfully:', existingBooking._id);
                return res.status(200).json({ success: true, booking: existingBooking, bookingId: existingBooking._id });
            }
        }

        const booking = new Booking({
            userId: req.user?.id || userId || undefined,
            passengerName: effectiveName,
            passengerEmail: effectiveEmail,
            passengerMobile: effectivePhone,
            contactDetails: contactDetails || { phone: effectivePhone, email: effectiveEmail, state: '' },
            passengers: passengers || [],
            bus: busId || undefined,
            route: routeId || undefined,
            schedule: scheduleId || undefined,
            travelDate: formatDateToYYYYMMDD(travelDate || journeyDate || ''),
            boardingPoint,
            droppingPoint,
            seatNumbers: seatNumbers || selectedSeats || [],
            seatDetails: seatDetails || [],
            seatNumber: Array.isArray(seatNumbers || selectedSeats) ? (seatNumbers || selectedSeats).join(', ') : ((seatNumbers || selectedSeats) || ''),
            baseFare: baseFare || 0,
            gst: gst || 0,
            discount: discount || 0,
            totalFare: totalFare || totalAmount || 0,
            couponCode: couponCode || '',
            paymentStatus: razorpayPaymentId ? 'Completed' : 'Pending',
            paymentMethod: 'razorpay',
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        });

        await booking.save();
        console.log('✅ Booking Saved Successfully:', booking._id);
        res.status(201).json({ success: true, booking, bookingId: booking._id });
    } catch (err) {
        console.error('❌ Booking creation error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/bookings/booked-seats
 * Returns all booked seat numbers for a specific bus and travel date.
 */
router.get('/booked-seats', async (req, res) => {
    try {
        const { busId, date, travelDate } = req.query;
        const journeyDate = date || travelDate;

        if (!busId || !journeyDate) {
            return res.status(400).json({ success: false, message: 'busId and journeyDate are required.' });
        }

        const normalizedDate = formatDateToYYYYMMDD(journeyDate);

        console.log(`[DEBUG] getBookedSeats called -> busId: ${busId}, rawDate: ${journeyDate}, normalizedDate: ${normalizedDate}`);

        const bookings = await Booking.find({
            bus: busId,
            travelDate: normalizedDate,
            paymentStatus: "Completed"
        });

        console.log(`[DEBUG] Found ${bookings.length} completed bookings for this bus & date`);

        // Create a map of seat number to first passenger gender in that booking
        // (Assuming most bookings for a specific seat are for one gender)
        const seatInfo = [];
        bookings.forEach(booking => {
            if (booking.seatNumbers && Array.isArray(booking.seatNumbers)) {
                booking.seatNumbers.forEach(seatNo => {
                    // Try to find the gender for this specific seat from the passengers array
                    const passenger = booking.passengers?.find(p => p.seatNumber === seatNo);
                    const gender = passenger?.gender || 'Male'; // default to Male if not specified
                    seatInfo.push({ seatNo, gender });
                });
            }
        });

        res.json({ success: true, bookedSeats: seatInfo });
    } catch (err) {
        console.error('Error fetching booked seats:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/bookings/user
 * Returns bookings for the logged-in user.
 */
router.get('/user', authMiddleware, async (req, res) => {
    try {
        console.log('--- User Bookings Requested ---');
        console.log('User ID:', req.user.id);

        // Since the token only contains { id, role }, we need to fetch the user details to get mobile/email
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let query = {
            $or: [
                { userId: req.user.id }
            ]
        };

        // Also find guest bookings matching the user's email or mobile
        if (user.email) {
            query.$or.push({ passengerEmail: user.email });
        }
        if (user.mobileNumber) {
            query.$or.push({ passengerMobile: user.mobileNumber });
        }

        const bookings = await Booking.find({ userId: req.user.id })
            .populate('bus route schedule')
            .sort({ createdAt: -1 });

        console.log('Found User Bookings Count:', bookings.length);

        res.json(bookings);
    } catch (err) {
        console.error('❌ User Bookings Error:', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/bookings/my-bookings
 * Returns bookings for the logged-in operator's buses.
 */
router.get('/my-bookings', operatorAuthMiddleware, async (req, res) => {
    try {
        console.log('--- My Bookings Requested ---');
        console.log('Operator ID:', req.operator.id);

        const buses = await Bus.find({ operator: req.operator.id });
        const busIds = buses.map(b => b._id);

        console.log('Operator Bus IDs:', busIds);

        const bookings = await Booking.find({ bus: { $in: busIds } })
            .populate('bus route schedule')
            .sort({ createdAt: -1 });

        console.log('Found Bookings Count:', bookings.length);

        res.json(bookings);
    } catch (err) {
        console.error('❌ My Bookings Error:', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/bookings (admin: all bookings)
 */
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('bus route schedule')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/bookings/:id
 * Fetch single booking details
 */
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('bus route schedule');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, booking });
    } catch (err) {
        console.error('Error fetching booking details:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/bookings/cancel-ticket
 * Cancels a ticket and calculates refund based on time left to departure
 */
router.post('/cancel-ticket', authMiddleware, async (req, res) => {
    try {
        const { bookingId, seatNumbers } = req.body;

        if (!bookingId) {
            return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        const booking = await Booking.findById(bookingId).populate('schedule');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Validate Status
        if (booking.paymentStatus === 'Cancelled' || booking.status === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
        }
        if (booking.paymentStatus !== 'Completed') {
            return res.status(400).json({ success: false, message: 'Cannot cancel an unconfirmed booking' });
        }

        // Calculate Time Difference
        const now = new Date();
        // Assuming journey date is travelDate and departure time comes from schedule or boardingPoint
        const travelParts = booking.travelDate.split('-');
        const year = parseInt(travelParts[0]);
        const month = parseInt(travelParts[1]) - 1;
        const day = parseInt(travelParts[2]);

        // Extract time from boardingPoint or schedule
        let hour = 10, minute = 0; // fallback Default 10:00 AM
        if (booking.schedule && booking.schedule.departureTime) {
            const timeParts = booking.schedule.departureTime.split(':');
            hour = parseInt(timeParts[0]);
            minute = parseInt(timeParts[1]);
        } else if (booking.boardingPoint) {
            // attempt finding HH:MM
            const match = booking.boardingPoint.match(/(\d{2}):(\d{2})/);
            if (match) {
                hour = parseInt(match[1]);
                minute = parseInt(match[2]);
            }
        }

        const departureDate = new Date(year, month, day, hour, minute, 0);
        const hoursUntilDeparture = (departureDate - now) / (1000 * 60 * 60);

        if (hoursUntilDeparture <= 0) {
            return res.status(400).json({ success: false, message: 'Cannot cancel ticket after journey has started.' });
        }

        // Calculate Refund
        let refundPercentage = 0;
        if (hoursUntilDeparture > 24) {
            refundPercentage = 0.90;
        } else if (hoursUntilDeparture > 12) {
            refundPercentage = 0.70;
        } else if (hoursUntilDeparture > 6) {
            refundPercentage = 0.50;
        } else {
            refundPercentage = 0;
        }

        const totalFare = booking.totalFare || 0;
        const refundAmount = Math.round(totalFare * refundPercentage);
        const cancellationCharges = totalFare - refundAmount;

        // Perform Cancellation
        booking.paymentStatus = 'Cancelled';
        booking.status = 'Cancelled';
        // Clear seat numbers so they become available to others
        booking.seatNumbers = [];
        booking.seatNumber = '';

        await booking.save();

        res.json({
            success: true,
            message: 'Ticket cancelled successfully',
            refundDetails: {
                totalFare,
                refundPercentage: refundPercentage * 100,
                refundAmount,
                cancellationCharges
            }
        });

    } catch (err) {
        console.error('Error cancelling ticket:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
