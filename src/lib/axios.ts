import axios from 'axios'
import config from './config'

// Laravel backend configuration
const api = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    withXSRFToken:true,
    timeout: 15000,
})

// Add request interceptor for CSRF token
// api.interceptors.request.use(async (config) => {
//     // Get CSRF token before making requests
//     if (!document.cookie.includes('XSRF-TOKEN')) {
//         await api.get('/sanctum/csrf-cookie')
//     }
//     return config
// })

// Add response interceptor for error handling
api.interceptors.response.use(
    r => r,
    err => {
        if (err.response?.status === 401 && window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);


export default api
