import Axios from './Axios';

const flightApi = {
    // Airports & Airlines
    getAirports: async () => {
        const res = await Axios.get('/airports');
        return res.data;
    },
    getAirlines: async () => {
        const res = await Axios.get('/airlines');
        return res.data;
    },

    // Dashboard Stats
    getDashboardStats: async () => {
        const res = await Axios.get('/flights/dashboard');
        return res.data;
    },
    getRecentBookings: async () => {
        const res = await Axios.get('/flights/dashboard/recent-bookings');
        return res.data;
    },
    getBookingTrend: async () => {
        const res = await Axios.get('/flights/dashboard/trend');
        return res.data;
    },

    // Flights
    searchFlights: async (params) => {
        const queryParams = new URLSearchParams(params).toString();
        const res = await Axios.get(`/flights/search?${queryParams}`);
        return res.data;
    },
    getAllFlights: async () => {
        const res = await Axios.get('/flights');
        return res.data;
    },
    createFlight: async (flightData) => {
        const res = await Axios.post('/flights', flightData);
        return res.data;
    },
    updateFlightStatus: async (flightId, status) => {
        const res = await Axios.put(`/flights/${flightId}`, { status });
        return res.data;
    },
    deleteFlight: async (flightId) => {
        const res = await Axios.delete(`/flights/${flightId}`);
        return res.data;
    },

    // Bookings
    getAllBookings: async () => {
        const res = await Axios.get('/flight-bookings');
        return res.data;
    },
    updateBookingStatus: async (bookingId, bookingStatus) => {
        const res = await Axios.put(`/flight-bookings/${bookingId}/status`, { bookingStatus });
        return res.data;
    },
    getUserBookings: async () => {
        const res = await Axios.get('/flight-bookings/user');
        return res.data;
    },

    // Passengers
    getAllPassengers: async () => {
        const res = await Axios.get('/passengers');
        return res.data;
    }
};

export default flightApi;
