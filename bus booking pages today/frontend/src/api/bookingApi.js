import Axios from './Axios';

/**
 * Create a new bus booking
 * @param {Object} bookingData - { busId, seats, boardingPoint, droppingPoint, passengers, totalFare }
 */
export const createBooking = async (bookingData) => {
    try {
        const response = await Axios.post('/bookings/create', bookingData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

/**
 * Fetch booked seats for a bus on a specific date.
 */
export const getBookedSeats = async (busId, date) => {
    try {
        const response = await Axios.get(`/bookings/booked-seats`, {
            params: { busId, date }
        });
        return response.data.bookedSeats || [];
    } catch (error) {
        console.error('Error fetching booked seats:', error);
        return [];
    }
};

/**
 * Alias for createBooking to maintain backward compatibility in some components
 */
export const saveBooking = createBooking;

/**
 * Get booking history for current user
 */
export const getUserBookings = async () => {
    try {
        const response = await Axios.get('/bookings/user');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

/**
 * Get specific booking details
 * @param {string} bookingId 
 */
export const getBookingDetails = async (bookingId) => {
    try {
        const response = await Axios.get(`/bookings/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

/**
 * Get specific booking details by PNR
 * @param {string} pnr 
 */
export const getBookingByPNR = async (pnr) => {
    try {
        const response = await Axios.get(`/bookings/pnr/${pnr}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

/**
 * Cancel a booking
 * @param {Object} bookingData - { bookingId, seatNumbers }
 */
export const cancelBooking = async (bookingData) => {
    try {
        const response = await Axios.post(`/bookings/cancel-ticket`, bookingData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// --- Operator Booking Management ---
export const getOperatorBookings = async () => {
    try {
        const response = await Axios.get('/bookings/my-bookings');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// --- Admin Booking Management ---
export const getAllBookings = async () => {
    try {
        const response = await Axios.get('/bookings');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
