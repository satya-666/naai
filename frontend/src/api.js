import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001').replace(/\/$/, '');

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});

export { API_BASE_URL };

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login if not already there
            if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
