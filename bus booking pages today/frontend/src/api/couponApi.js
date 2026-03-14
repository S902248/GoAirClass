import Axios from './Axios';

export const getOperatorCoupons = async () => {
    try {
        const response = await Axios.get('/coupons/my-coupons');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getActiveCoupons = async () => {
    try {
        const response = await Axios.get('/coupons/active');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const createCoupon = async (couponData) => {
    try {
        const response = await Axios.post('/coupons/create', couponData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const validateCoupon = async (code, amount) => {
    try {
        const response = await Axios.post('/coupons/validate', { code, totalAmount: amount });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
