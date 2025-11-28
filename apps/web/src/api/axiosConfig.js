import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000'
    }
});

const token = sessionStorage.getItem('Bearer');
if (token) {
    api.defaults.headers.common['Authorization'] = token;
}

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('Bearer');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            
            if (status === 401) {
                sessionStorage.removeItem('Bearer');
                sessionStorage.removeItem('user');
                if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                    window.location.href = '/login';
                }
            }
            
            if (status === 403) {
                console.error('Access forbidden: Insufficient permissions');
            }
        }
        return Promise.reject(error);
    }
);

export default api;