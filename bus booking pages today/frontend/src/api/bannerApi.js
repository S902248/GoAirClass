import Axios from './Axios';

export const getActiveBanners = async () => {
    return await Axios.get('/banner');
};

export const getAllBannersAdmin = async () => {
    return await Axios.get('/banner/admin');
};

export const createBanner = async (formData) => {
    return await Axios.post('/banner', formData);
};

export const updateBanner = async (id, formData) => {
    return await Axios.put(`/banner/${id}`, formData);
};

export const deleteBanner = async (id) => {
    return await Axios.delete(`/banner/${id}`);
};

export const toggleBannerActive = async (id) => {
    return await Axios.patch(`/banner/${id}/toggle`);
};

export const recordImpression = async (id) => {
    return await Axios.post(`/banner/${id}/impression`);
};

export const recordClick = async (id) => {
    return await Axios.post(`/banner/${id}/click`);
};
