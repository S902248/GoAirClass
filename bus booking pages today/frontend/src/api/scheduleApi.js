import Axios from './Axios';

export const getSchedulesByBus = async (busId) => {
    try {
        const response = await Axios.get(`/schedules/bus/${busId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getAllSchedules = async () => {
    try {
        const response = await Axios.get('/schedules/my-schedules');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const createSchedule = async (scheduleData) => {
    try {
        const response = await Axios.post('/schedules/create', scheduleData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const deleteSchedule = async (scheduleId) => {
    try {
        const response = await Axios.delete(`/schedules/${scheduleId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const searchSchedules = async (searchParams) => {
    try {
        const { from, to, date } = searchParams;
        const response = await Axios.get(`/schedules/search?from=${from}&to=${to}&date=${date}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
