import Axios from './Axios';

const trainApi = {
    // Train Management
    getAllTrains: async () => {
        const response = await Axios.get('/trains');
        return response.data;
    },
    createTrain: async (trainData) => {
        const response = await Axios.post('/trains', trainData);
        return response.data;
    },
    updateTrain: async (id, trainData) => {
        const response = await Axios.put(`/trains/${id}`, trainData);
        return response.data;
    },
    deleteTrain: async (id) => {
        const response = await Axios.delete(`/trains/${id}`);
        return response.data;
    },
    getDashboardStats: async () => {
        const response = await Axios.get('/trains/stats');
        return response.data;
    },

    // Booking Management
    getAllBookings: async () => {
        const response = await Axios.get('/trains/bookings');
        return response.data;
    },
    bookTrain: async (bookingData) => {
        const response = await Axios.post('/trains/book', bookingData);
        return response.data;
    },
    createTrainPaymentOrder: async (paymentData) => {
        const response = await Axios.post('/trains/payment/create-order', paymentData);
        return response.data;
    },
    verifyTrainPayment: async (verificationData) => {
        const response = await Axios.post('/trains/payment/verify', verificationData);
        return response.data;
    },
    lockTrainSeats: async (lockData) => {
        const response = await Axios.post('/trains/lock-seats', lockData);
        return response.data;
    },
    confirmTrainBooking: async (confirmData) => {
        const response = await Axios.post('/trains/confirm-booking', confirmData);
        return response.data;
    },
    getUserBookings: async () => {
        const response = await Axios.get('/trains/user-bookings');
        return response.data;
    },
    cancelTrainBooking: async (bookingId) => {
        const response = await Axios.post('/trains/cancel-booking', { bookingId });
        return response.data;
    },

    // PNR Management
    getBookingByPNR: async (pnr) => {
        const response = await Axios.get(`/trains/pnr/${pnr}`);
        return response.data;
    },

    // Quota & Availability
    getAvailability: async (trainId, date) => {
        const response = await Axios.get(`/trains/availability?trainId=${trainId}&date=${date}`);
        return response.data;
    },

    // Station Management
    getAllStations: async () => {
        const response = await Axios.get('/trains/stations');
        return response.data;
    },
    createStation: async (stationData) => {
        const response = await Axios.post('/trains/stations', stationData);
        return response.data;
    },
    addAdminStation: async (stationData) => {
        // Secure superadmin endpoint
        const response = await Axios.post('/admin/stations', stationData);
        return response.data;
    },

    // Additional Features (Routes, Coaches, Fares, Reports, Settings)
    getTrainReports: async () => {
        const response = await Axios.get('/trains/reports');
        return response.data;
    },
    updateApiSettings: async (settings) => {
        const response = await Axios.post('/trains/settings', settings);
        return response.data;
    },
    saveCoachConfig: async (data) => {
        const response = await Axios.post('/trains/coaches', data);
        return response.data;
    },
    getCoachConfig: async (trainId = '000000000000000000000000') => {
        const response = await Axios.get(`/trains/coaches/${trainId}`);
        return response.data;
    },
    saveFareRules: async (data) => {
        const response = await Axios.post('/trains/fares', data);
        return response.data;
    },
    getFareRules: async (trainId = '000000000000000000000000') => {
        const response = await Axios.get(`/trains/fares/${trainId}`);
        return response.data;
    },
    getFareManagement: async () => {
        const response = await Axios.get('/trains/fares');
        return response.data;
    },
    getQuotaManagement: async () => {
        const response = await Axios.get('/trains/quotas');
        return response.data;
    },

    // Route Management
    getTrainRoute: async (trainId) => {
        const response = await Axios.get(`/trains/route/${trainId}`);
        return response.data;
    },
    updateTrainRoute: async (trainId, routeData) => {
        const response = await Axios.post(`/trains/route/${trainId}`, routeData);
        return response.data;
    },
    searchTrains: async (params) => {
        const response = await Axios.get('/trains/search', { params });
        return response.data;
    },

    // ─── Per-Train Coach Management (New System) ─────────────────────────────
    getCoachTypes: async () => {
        const response = await Axios.get('/coach-types');
        return response.data;
    },
    createCoachType: async (data) => {
        const response = await Axios.post('/coach-types', data);
        return response.data;
    },
    getTrainCoaches: async (trainId) => {
        const response = await Axios.get(`/train/${trainId}/coaches`);
        return response.data;
    },
    saveTrainCoaches: async (trainId, coaches) => {
        const response = await Axios.post(`/train/${trainId}/coaches`, { coaches });
        return response.data;
    },
    deleteTrainCoach: async (trainId, coachId) => {
        const response = await Axios.delete(`/train/${trainId}/coaches/${coachId}`);
        return response.data;
    },
    getTrainAvailability: async (trainId, date) => {
        const params = date ? { date } : {};
        const response = await Axios.get(`/train/${trainId}/availability`, { params });
        return response.data;
    },
    getBookingDetails: async (id) => {
        const response = await Axios.get(`/trains/booking/${id}`);
        return response.data;
    },
    getTicketPDFURL: (id) => {
        return `${Axios.defaults.baseURL}/trains/booking/${id}/pdf`;
    },
    verifyTicket: async (pnr, token) => {
        const response = await Axios.get(`/trains/ticket/verify/${pnr}?token=${token}`);
        return response.data;
    }
};

export default trainApi;
