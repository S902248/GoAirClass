import Axios from './Axios';

// --- User Authentication ---
export const getOtp = async (mobileNumber) => {
    try {
        const response = await Axios.post('/auth/get-otp', { mobileNumber });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const verifyOtp = async (mobileNumber, otp) => {
    try {
        const response = await Axios.post('/auth/verify-otp', { mobileNumber, otp });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const loginRequestOtp = async (mobileNumber) => {
    try {
        const response = await Axios.post('/auth/login', { mobileNumber });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const verifyLoginOtp = async (mobileNumber, otp) => {
    try {
        const response = await Axios.post('/auth/verify-login-otp', { mobileNumber, otp });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// --- Registration ---
export const sendRegistrationOtp = async (data) => {
    try {
        const response = await Axios.post('/auth/send-registration-otp', data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const verifyRegistrationOtp = async (data) => {
    try {
        const response = await Axios.post('/auth/verify-registration-otp', data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// --- Admin Authentication ---
export const adminLogin = async (credentials) => {
    try {
        const response = await Axios.post('/auth/admin-login', credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// --- Operator Authentication ---
export const loginOperator = async (credentials) => {
    try {
        const response = await Axios.post('/operators/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
