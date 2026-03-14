import Axios from './Axios';

export const registerUser = async (userData) => {
    try {
        const response = await Axios.post('/users/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getUserProfile = async () => {
    try {
        const response = await Axios.get('/users/profile');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
