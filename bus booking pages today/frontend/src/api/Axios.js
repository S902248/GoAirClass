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

        // Heuristic: check window.location.pathname to prioritize the right token
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            if (path.startsWith('/operator')) {
                token = localStorage.getItem('operatorToken') || localStorage.getItem('token');
            } else if (path.startsWith('/admin') || path.startsWith('/admine')) {
                token = localStorage.getItem('adminToken') || localStorage.getItem('token');
            }
        }

        // Final fallback if no specific token found
        if (!token) {
            token = localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('operatorToken');
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
