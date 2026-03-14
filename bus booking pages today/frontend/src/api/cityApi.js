import Axios from './Axios';

/**
 * Search cities based on a query string
 * @param {string} query - The search term
 * @returns {Promise<Array>} - List of matching cities
 */
export const searchCities = async (query) => {
    try {
        const response = await Axios.get(`/cities/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error searching cities:', error);
        throw error;
    }
};
