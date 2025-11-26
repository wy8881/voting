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

export default api;