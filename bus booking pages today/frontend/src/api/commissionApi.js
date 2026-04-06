import Axios from './Axios';

const commissionApi = {
  getRules: async () => {
    const response = await Axios.get('/commission');
    return response.data;
  },
  createRule: async (ruleData) => {
    const response = await Axios.post('/commission', ruleData);
    return response.data;
  },
  updateRule: async (id, ruleData) => {
    const response = await Axios.put(`/commission/${id}`, ruleData);
    return response.data;
  },
  deleteRule: async (id) => {
    const response = await Axios.delete(`/commission/${id}`);
    return response.data;
  },
  calculate: async (category, params) => {
    const response = await Axios.post('/commission/calculate', { category, params });
    return response.data;
  }
};

export default commissionApi;
