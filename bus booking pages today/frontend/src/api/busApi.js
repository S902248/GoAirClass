import Axios from './Axios';

/**
 * Search for buses based on criteria
 * @param {Object} searchParams - { from, to, date }
 */
export const searchBuses = async (searchParams) => {
    try {
        const response = await Axios.get('/bus/search', { params: searchParams });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

/**
 * Get details of a specific bus
 * @param {string} busId 
 */
export const getBusDetails = async (busId) => {
    try {
        const response = await Axios.get(`/bus/${busId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

/**
 * Get all available buses (Admin/Operator view)
 */
export const getAllBuses = async () => {
    try {
        const response = await Axios.get('/bus/all');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// --- Operator Bus Management ---
export const getOperatorBuses = async () => {
    try {
        const response = await Axios.get('/buses/my-buses');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const createBus = async (busData) => {
    try {
        const response = await Axios.post('/buses/create', busData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const deleteBus = async (busId) => {
    try {
        const response = await Axios.delete(`/buses/${busId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
