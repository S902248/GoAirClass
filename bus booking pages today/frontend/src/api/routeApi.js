import Axios from './Axios';

export const getAllRoutes = async () => {
    try {
        const response = await Axios.get('/routes/all');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const createRoute = async (routeData) => {
    try {
        const response = await Axios.post('/routes/create', routeData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const deleteRoute = async (routeId) => {
    try {
        const response = await Axios.delete(`/routes/${routeId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
