import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3045/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('user');

          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          console.error('Access forbidden:', error.response.data);
          break;

        case 404:
          console.error('Resource not found:', error.response.data);
          break;

        case 500:
          console.error('Server error:', error.response.data);
          break;

        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('No response from server:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
