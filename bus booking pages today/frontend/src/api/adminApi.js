import Axios from './Axios';

export const adminRequest = async (requestData) => {
    try {
        const response = await Axios.post('/auth/admin-request', requestData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDashboardStats = async () => {
    try {
        const response = await Axios.get('/admin/stats');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Get bookings scoped to the logged-in admin's buses
export const getScopedBookings = async () => {
    try {
        const response = await Axios.get('/admin/my-bookings');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Get operators scoped to the logged-in admin
export const getScopedOperators = async () => {
    try {
        const response = await Axios.get('/admin/my-operators');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAdminRequests = async () => {
    try {
        const response = await Axios.get('/auth/admin-requests');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAdminNotifications = async () => {
    try {
        const response = await Axios.get('/auth/admin-notifications');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const updateAdminRequestStatus = async (requestId, status, permissions) => {
    try {
        const response = await Axios.put('/auth/update-request-status', { requestId, status, permissions });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAllAdmins = async () => {
    try {
        const response = await Axios.get('/auth/admins');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAllOperators = async () => {
    try {
        const response = await Axios.get('/operators/all');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const createOperator = async (operatorData) => {
    try {
        const response = await Axios.post('/operators/create', operatorData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const deleteOperator = async (operatorId) => {
    try {
        const response = await Axios.delete(`/operators/${operatorId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAllRoutes = async () => {
    try {
        const response = await Axios.get('/routes/all');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAllBuses = async () => {
    try {
        const response = await Axios.get('/buses/all');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAllSchedules = async () => {
    try {
        const response = await Axios.get('/schedules/all');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAllUsers = async () => {
    try {
        const response = await Axios.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAllBookings = async () => {
    try {
        const response = await Axios.get('/bookings');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// ⚠️ Hotel functions have been moved to src/api/hotelApi.js
// Import them from there: import { getAllHotels, ... } from './hotelApi';
