/**
 * operatorApi.js
 * ─────────────────────────────────────────────────────────────
 * Hotel Operator Panel API calls
 * Token key: 'hotelOperatorToken' in localStorage
 * Base: /api/hotel-operator
 * ─────────────────────────────────────────────────────────────
 */
import axios from 'axios';

// Dedicated Axios instance — always sends hotelOperatorToken
const OpAxios = axios.create({ baseURL: '/api/hotel-operator' });

OpAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('hotelOperatorToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const handle = (err) => { throw err?.response?.data ?? new Error(err?.message ?? 'Network Error'); };

/* ══════════════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════════════ */
/** POST /api/hotel-operator/auth/login */
export const loginHotelOperator = async ({ username, password }) => {
    try { return (await OpAxios.post('/auth/login', { username, password })).data; }
    catch (e) { handle(e); }
};

/** GET /api/hotel-operator/auth/me */
export const getMyProfile = async () => {
    try { return (await OpAxios.get('/auth/me')).data; }
    catch (e) { handle(e); }
};

/* ══════════════════════════════════════════════════════════════
   DASHBOARD STATS
══════════════════════════════════════════════════════════════ */
/** GET /api/hotel-operator/hotels/stats */
export const getDashboardStats = async () => {
    try { return (await OpAxios.get('/hotels/stats')).data; }
    catch (e) { handle(e); }
};

/* ══════════════════════════════════════════════════════════════
   HOTELS
══════════════════════════════════════════════════════════════ */
/** GET /api/hotel-operator/hotels */
export const getMyHotels = async () => {
    try { return (await OpAxios.get('/hotels')).data; }
    catch (e) { handle(e); }
};

/** POST /api/hotel-operator/hotels
 *  @param {FormData} formData — hotel fields + image files appended under "images" key
 */
export const addHotel = async (formData) => {
    try {
        return (await OpAxios.post('/hotels', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })).data;
    } catch (e) { handle(e); }
};

/** PUT /api/hotel-operator/hotels/:id */
export const updateHotel = async (id, data) => {
    try { return (await OpAxios.put(`/hotels/${id}`, data)).data; }
    catch (e) { handle(e); }
};

/** DELETE /api/hotel-operator/hotels/:id */
export const deleteMyHotel = async (id) => {
    try { return (await OpAxios.delete(`/hotels/${id}`)).data; }
    catch (e) { handle(e); }
};

/* ══════════════════════════════════════════════════════════════
   ROOMS
══════════════════════════════════════════════════════════════ */
/** GET /api/hotel-operator/rooms */
export const getMyRooms = async () => {
    try { return (await OpAxios.get('/rooms')).data; }
    catch (e) { handle(e); }
};

/** GET /api/hotel-operator/rooms/my-hotels — for dropdown */
export const getMyHotelsForDropdown = async () => {
    try { return (await OpAxios.get('/rooms/my-hotels')).data; }
    catch (e) { handle(e); }
};

/** POST /api/hotel-operator/rooms */
export const addRoom = async (data) => {
    try { return (await OpAxios.post('/rooms', data)).data; }
    catch (e) { handle(e); }
};

/** PUT /api/hotel-operator/rooms/:id */
export const updateRoom = async (id, data) => {
    try { return (await OpAxios.put(`/rooms/${id}`, data)).data; }
    catch (e) { handle(e); }
};

/**
 * PUT /api/hotel-operator/rooms/update-price — bulk update
 * @param {Array} updates — [{ roomId, newPrice }]
 */
export const updateRoomPricesBulk = async (updates) => {
    try { return (await OpAxios.put('/rooms/update-price', { updates })).data; }
    catch (e) { handle(e); }
};


/** GET /api/hotel-operator/rooms/inventory */
export const getHotelOperatorRoomsInventory = async () => {
    try { return (await OpAxios.get('/rooms/inventory')).data; }
    catch (e) { handle(e); }
};

/** DELETE /api/hotel-operator/rooms/:id */
export const deleteMyRoom = async (id) => {
    try { return (await OpAxios.delete(`/rooms/${id}`)).data; }
    catch (e) { handle(e); }
};

/* ══════════════════════════════════════════════════════════════
   BOOKINGS
══════════════════════════════════════════════════════════════ */
/** GET /api/hotel-operator/bookings */
export const getMyBookings = async () => {
    try { return (await OpAxios.get('/bookings')).data; }
    catch (e) { handle(e); }
};

/** GET /api/hotel-operator/bookings/:id */
export const getBookingById = async (id) => {
    try { return (await OpAxios.get(`/bookings/${id}`)).data; }
    catch (e) { handle(e); }
};

/** PUT /api/hotel-operator/bookings/:id/cancel */
export const cancelMyBooking = async (id) => {
    try { return (await OpAxios.put(`/bookings/${id}/cancel`)).data; }
    catch (e) { handle(e); }
};

/* ══════════════════════════════════════════════════════════════
   COUPONS
══════════════════════════════════════════════════════════════ */
export const getMyHotelCoupons = async (hotelId) => {
    try { return (await axios.get(`/api/hotel-coupons/hotel/${hotelId}`)).data; }
    catch (e) { handle(e); }
};

export const createHotelCoupon = async (data) => {
    try { return (await axios.post('/api/hotel-coupons/create', data)).data; }
    catch (e) { handle(e); }
};

export const updateHotelCouponStatus = async (id, status) => {
    try { return (await axios.put(`/api/hotel-coupons/${id}/status`, { status })).data; }
    catch (e) { handle(e); }
};

export const deleteHotelCoupon = async (id) => {
    try { return (await axios.delete(`/api/hotel-coupons/${id}`)).data; }
    catch (e) { handle(e); }
};

import Axios from './Axios';

/** Super Admin - Get all operators with bus counts */
export const getOperators = async () => {
    try {
        // Use the authenticated Axios instance
        const res = await Axios.get('/operators');
        return res.data;
    } catch (e) {
        // Fallback or handle error
        throw e;
    }
};

