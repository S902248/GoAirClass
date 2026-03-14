import axios from 'axios';

const Axios = axios.create({
    baseURL: '/api'
});

// Adding interceptor to handle tokens automatically
Axios.interceptors.request.use(
    (config) => {
        // Read token from localStorage. 
        // We prioritize the standard user 'token'. If not found, fallback to operator/admin.
        // For distinct portals, ideally we should have separate axios instances or pass full auth headers explicitly.
        // For now, prioritize 'token' for the main customer app.
        let token = localStorage.getItem('token');

        // If we are likely in the admin or operator panel (based on URL), we might prefer those tokens.
        // A simple heuristic: check window.location.pathname
        if (typeof window !== 'undefined') {
            if (window.location.pathname.startsWith('/operator') && localStorage.getItem('operatorToken')) {
                token = localStorage.getItem('operatorToken');
            } else if (window.location.pathname.startsWith('/admin') && localStorage.getItem('adminToken')) {
                token = localStorage.getItem('adminToken');
            }
        }

        // Final fallback if token is still empty but others exist
        if (!token) {
            token = localStorage.getItem('operatorToken') || localStorage.getItem('adminToken');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Axios;
