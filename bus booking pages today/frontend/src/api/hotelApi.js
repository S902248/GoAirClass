/**
 * hotelApi.js
 * ─────────────────────────────────────────────────────────────
 * All Hotel-module API calls, grouped by domain:
 *   • Hotels
 *   • Hotel Rooms
 *   • Hotel Bookings
 *   • Hotel Offers
 *   • Hotel Operators
 *
 * Every call uses the shared Axios instance so the admin auth
 * token is automatically attached via the request interceptor.
 * ─────────────────────────────────────────────────────────────
 */
import Axios from './Axios';

// ─── helper: unwrap thrown errors cleanly ─────────────────────
const handle = (err) => {
    throw err?.response?.data ?? new Error(err?.message ?? 'Network Error');
};

/* ══════════════════════════════════════════════════════════════
   1. HOTELS
   Base: /api/hotels
══════════════════════════════════════════════════════════════ */

/** GET /api/hotels — All hotels (paginated, all statuses) */
export const getAllHotels = async () => {
    try { return (await Axios.get('/hotels')).data; }
    catch (e) { handle(e); }
};

/** GET /api/hotels/pending */
export const getPendingHotels = async () => {
    try { return (await Axios.get('/hotels/pending')).data; }
    catch (e) { handle(e); }
};

/** GET /api/hotels/approved */
export const getApprovedHotels = async (destination = '') => {
    try {
        const url = destination ? `/hotels/approved?destination=${encodeURIComponent(destination)}` : '/hotels/approved';
        return (await Axios.get(url)).data;
    }
    catch (e) { handle(e); }
};

/** GET /api/hotels/:id */
export const getHotelById = async (id) => {
    try { return (await Axios.get(`/hotels/${id}`)).data; }
    catch (e) { handle(e); }
};

/** GET /api/hotels/rejected */
export const getRejectedHotels = async () => {
    try { return (await Axios.get('/hotels/rejected')).data; }
    catch (e) { handle(e); }
};

/**
 * POST /api/hotels — Create hotel
 * @param {Object} data — { hotelName, city, address, description, images[], operatorId, status }
 */
export const createHotel = async (data) => {
    try { return (await Axios.post('/hotels', data)).data; }
    catch (e) { handle(e); }
};

/** PUT /api/hotels/:id/approve */
export const approveHotel = async (id) => {
    try { return (await Axios.put(`/hotels/${id}/approve`)).data; }
    catch (e) { handle(e); }
};

/**
 * PUT /api/hotels/:id/reject
 * @param {string} id
 * @param {string} reason — rejection reason text
 */
export const rejectHotel = async (id, reason) => {
    try { return (await Axios.put(`/hotels/${id}/reject`, { reason })).data; }
    catch (e) { handle(e); }
};

/** PUT /api/hotels/:id/block */
export const blockHotel = async (id) => {
    try { return (await Axios.put(`/hotels/${id}/block`)).data; }
    catch (e) { handle(e); }
};

/** PUT /api/hotels/:id/unblock */
export const unblockHotel = async (id) => {
    try { return (await Axios.put(`/hotels/${id}/unblock`)).data; }
    catch (e) { handle(e); }
};

/** DELETE /api/hotels/:id */
export const deleteHotel = async (id) => {
    try { return (await Axios.delete(`/hotels/${id}`)).data; }
    catch (e) { handle(e); }
};

/* ══════════════════════════════════════════════════════════════
   2. HOTEL ROOMS
   Base: /api/hotel-rooms
══════════════════════════════════════════════════════════════ */

/** GET /api/hotel-rooms — All rooms across all hotels */
export const getAllRooms = async () => {
    try { return (await Axios.get('/hotel-rooms')).data; }
    catch (e) { handle(e); }
};

/**
 * GET /api/hotel-rooms/hotel/:hotelId — Rooms for one hotel
 * @param {string} hotelId
 */
export const getRoomsByHotel = async (hotelId) => {
    try { return (await Axios.get(`/hotel-rooms/hotel/${hotelId}`)).data; }
    catch (e) { handle(e); }
};

/**
 * POST /api/hotel-rooms — Add a room
 * @param {Object} data — { hotelId, roomType, pricePerNight, capacity, totalRooms, status }
 */
export const createRoom = async (data) => {
    try { return (await Axios.post('/hotel-rooms', data)).data; }
    catch (e) { handle(e); }
};

/**
 * PUT /api/hotel-rooms/:id — Update a room
 * @param {string} id
 * @param {Object} data
 */
export const updateRoom = async (id, data) => {
    try { return (await Axios.put(`/hotel-rooms/${id}`, data)).data; }
    catch (e) { handle(e); }
};

/** DELETE /api/hotel-rooms/:id */
export const deleteRoom = async (id) => {
    try { return (await Axios.delete(`/hotel-rooms/${id}`)).data; }
    catch (e) { handle(e); }
};

/** GET /api/hotel-rooms/availability?roomId=... */
export const getRoomAvailability = async (roomId) => {
    try { return (await Axios.get('/hotel-rooms/availability', { params: { roomId } })).data; }
    catch (e) { handle(e); }
};


/* ══════════════════════════════════════════════════════════════
   3. HOTEL BOOKINGS
   Base: /api/hotel-bookings
══════════════════════════════════════════════════════════════ */

/** GET /api/hotel-bookings/user — Current user's bookings */
export const getUserHotelBookings = async () => {
    try { return (await Axios.get('/hotel-bookings/user')).data; }
    catch (e) { handle(e); }
};

/** GET /api/hotel-bookings — All bookings */
export const getAllHotelBookings = async () => {
    try { return (await Axios.get('/hotel-bookings')).data; }
    catch (e) { handle(e); }
};

/**
 * GET /api/hotel-bookings/:hotelId — Bookings for a specific hotel
 * @param {string} hotelId
 */
export const getBookingsByHotel = async (hotelId) => {
    try { return (await Axios.get(`/hotel-bookings/${hotelId}`)).data; }
    catch (e) { handle(e); }
};

/**
 * GET /api/hotel-bookings/details/:id — Fetch single booking details
 * @param {string} id
 */
export const getHotelBookingById = async (id) => {
    try { return (await Axios.get(`/hotel-bookings/details/${id}`)).data; }
    catch (e) { handle(e); }
};

/**
 * PUT /api/hotel-bookings/cancel/:id — Cancel a booking
 * @param {string} id
 */
export const cancelHotelBooking = async (id, cancellationReason = '') => {
    try { return (await Axios.put(`/hotel-bookings/cancel/${id}`, { cancellationReason })).data; }
    catch (e) { handle(e); }
};

/** POST /api/hotel-bookings/create — Create a new hotel booking */
export const createHotelBooking = async (data) => {
    try { return (await Axios.post('/hotel-bookings/create', data)).data; }
    catch (e) { handle(e); }
};

/** POST /api/hotel-coupons/validate — Validate a hotel coupon */
export const validateHotelCoupon = async (data) => {
    try { return (await Axios.post(`/hotel-coupons/validate`, data)).data; }
    catch (e) { handle(e); }
};

/** GET /api/hotel-bookings/:id/invoice — Download invoice */
export const downloadInvoice = async (bookingId) => {
    try {
        const res = await Axios.get(`/hotel-bookings/${bookingId}/invoice`, {
            responseType: 'blob'
        });
        return res.data;
    } catch (e) { handle(e); }
};

/** GET /api/hotel-coupons/available — Get available coupons for a booking */
export const getAvailableHotelCoupons = async (hotelId, amount) => {
    try {
        return (await Axios.get(`/hotel-coupons/available`, {
            params: { hotelId, amount }
        })).data;
    } catch (e) { handle(e); }
};

/** GET /api/hotel-bookings/availability — Check room availability */
export const checkRoomAvailability = async (roomId, checkInDate, checkOutDate) => {
    try {
        return (await Axios.get('/hotel-bookings/availability', {
            params: { roomId, checkInDate, checkOutDate }
        })).data;
    }
    catch (e) { handle(e); }
};


/* ══════════════════════════════════════════════════════════════
   4. HOTEL OFFERS
   Base: /api/hotel-offers
══════════════════════════════════════════════════════════════ */

/** GET /api/hotel-offers — All offers */
export const getAllHotelOffers = async () => {
    try { return (await Axios.get('/hotel-offers')).data; }
    catch (e) { handle(e); }
};

/**
 * POST /api/hotel-offers — Create offer
 * @param {Object} data — { offerName, hotelId, discountPercentage, startDate, endDate, status }
 */
export const createHotelOffer = async (data) => {
    try { return (await Axios.post('/hotel-offers', data)).data; }
    catch (e) { handle(e); }
};

/**
 * PUT /api/hotel-offers/:id — Update offer
 * @param {string} id
 * @param {Object} data
 */
export const updateHotelOffer = async (id, data) => {
    try { return (await Axios.put(`/hotel-offers/${id}`, data)).data; }
    catch (e) { handle(e); }
};

/** DELETE /api/hotel-offers/:id */
export const deleteHotelOffer = async (id) => {
    try { return (await Axios.delete(`/hotel-offers/${id}`)).data; }
    catch (e) { handle(e); }
};

/* ══════════════════════════════════════════════════════════════
   5. HOTEL OPERATORS
   Base: /api/hotel-operators
══════════════════════════════════════════════════════════════ */

/** GET /api/hotel-operators — All operators */
export const getAllHotelOperators = async () => {
    try { return (await Axios.get('/hotel-operators')).data; }
    catch (e) { handle(e); }
};

/**
 * POST /api/hotel-operators — Create operator
 * @param {Object} data — { name, phone, email, companyName, city, address,
 *                          username, password, role, permissions, status }
 */
export const createHotelOperator = async (data) => {
    try { return (await Axios.post('/hotel-operators', data)).data; }
    catch (e) { handle(e); }
};

/** DELETE /api/hotel-operators/:id */
export const deleteHotelOperator = async (id) => {
    try { return (await Axios.delete(`/hotel-operators/${id}`)).data; }
    catch (e) { handle(e); }
};

/**
 * PUT /api/hotel-operators/:id/status — Toggle Active/Inactive
 * @param {string} id
 * @param {string} status — 'Active' | 'Inactive'
 */
export const updateHotelOperatorStatus = async (id, status) => {
    try { return (await Axios.put(`/hotel-operators/${id}/status`, { status })).data; }
    catch (e) { handle(e); }
};
