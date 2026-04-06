import Axios from './Axios';

// Unified & Role-Based Methods
export const createCoupon = async (couponData) => {
    try {
        const response = await Axios.post('/coupons/create', couponData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const listAdminCoupons = async (filters = {}) => {
    try {
        const response = await Axios.get('/coupons/admin/list', { params: filters });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const listOperatorCoupons = async (filters = {}) => {
    try {
        const response = await Axios.get('/coupons/operator/list', { params: filters });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const updateCoupon = async (id, couponData) => {
    try {
        const response = await Axios.put(`/coupons/update/${id}`, couponData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const deleteCoupon = async (id) => {
    try {
        const response = await Axios.delete(`/coupons/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Aliases for compatibility
export const createAdminCoupon = createCoupon;
export const updateAdminCoupon = updateCoupon;
export const deleteAdminCoupon = deleteCoupon;

export const getOperatorCoupons = async () => {
    const response = await listOperatorCoupons();
    return response.coupons || response;
};

export const getBusCoupons = async (busId) => {
    try {
        const response = await Axios.get(`/coupons/bus/${busId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getPaymentCoupons = async (busId) => {
    try {
        const response = await Axios.get(`/coupons/payment/${busId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};


// Booking Methods
export const applyCoupon = async (code, bookingDetails, userId) => {
    try {
        const response = await Axios.post('/coupons/booking/apply-coupon', { code, bookingDetails, userId });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Legacy/Compatibility if needed (Now public global)
export const getActiveCoupons = async () => {
    try {
        const response = await Axios.get('/coupons/public/list');
        return response.data || [];
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const validateCoupon = async (code, baseFare, userId, extraDetails = {}) => {
    return applyCoupon(code, { baseFare, ...extraDetails }, userId);
};
