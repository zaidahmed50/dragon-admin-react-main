import axios from 'axios';

// Base URL configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
const API_PREFIX = '/api';
const VERSION = '/v1';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: `${BASE_URL}${API_PREFIX}${VERSION}`,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token and other headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add any other custom headers
        config.headers['X-Request-ID'] = generateRequestId();
        
        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
            });
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle responses and errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Response:', {
                status: response.status,
                data: response.data,
            });
        }

        return response;
    },
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                // case 401:
                //     Unauthorized - Clear token and redirect to login
                    // localStorage.removeItem('authToken');
                    // window.location.href = '/login';
                    // break;

                case 403:
                    // Forbidden - User doesn't have permission
                    console.error('Access Denied:', data.message);
                    break;

                case 404:
                    // Not found
                    console.error('Resource not found:', error.config.url);
                    break;

                case 422:
                    // Validation error
                    console.error('Validation Error:', data.errors);
                    break;

                case 500:
                    // Server error
                    console.error('Server Error:', data.message);
                    break;

                default:
                    console.error('API Error:', data.message || 'Something went wrong');
            }

            // Log error in development
            if (process.env.NODE_ENV === 'development') {
                console.error('❌ Response Error:', {
                    status,
                    message: data.message,
                    errors: data.errors,
                });
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error: No response from server');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

// Helper function to generate unique request ID
const generateRequestId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to build query string
export const buildQueryString = (params) => {
    const queryString = Object.keys(params)
        .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '')
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    
    return queryString ? `?${queryString}` : '';
};

// Export axios instance
export default axiosInstance;

// Export base configuration
export const apiConfig = {
    baseURL: BASE_URL,
    apiPrefix: API_PREFIX,
    version: VERSION,
    fullBaseUrl: `${BASE_URL}${API_PREFIX}${VERSION}`,
};
