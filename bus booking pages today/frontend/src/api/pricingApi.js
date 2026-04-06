import Axios from './Axios';

const pricingApi = {
    simulate: async (data) => {
        const response = await Axios.post('/pricing/simulate', data);
        return response.data;
    },
    // Add other helpers for managing new models if needed
    getBoardingPoints: async (busId) => {
        const response = await Axios.get(`/bus-booking/boarding-points?busId=${busId}`);
        return response.data;
    }
};

export default pricingApi;
