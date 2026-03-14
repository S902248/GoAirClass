const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/authMiddleware');
const { getAllHotelBookings, getBookingsByHotel, cancelBooking, createBooking, checkRoomAvailability, getUserHotelBookings, generateInvoice, getHotelBookingById } = require('../../controllers/hotel/bookingController');

router.get('/user', authMiddleware, getUserHotelBookings);
router.get('/details/:id', authMiddleware, getHotelBookingById);
router.get('/:bookingId/invoice', generateInvoice);
router.get('/', getAllHotelBookings);
router.get('/availability', checkRoomAvailability);
router.post('/create', authMiddleware, createBooking);
router.get('/:hotelId', getBookingsByHotel);
router.put('/cancel/:id', authMiddleware, cancelBooking);

module.exports = router;
