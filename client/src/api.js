import axios from 'axios';

// 1. Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  // NOTE: Do NOT set Content-Type globally.
  // For JSON requests, axios sets it automatically.
  // For FormData (file uploads), the browser must set it with the multipart boundary.
  timeout: 10000 // 10 seconds timeout
});

// 2. Request Interceptor: Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return the response
    return response;
  },
  (error) => {
    // If we get a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access. Clearing session.');
      // Clear token and user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      // Using window.location.href works outside of React components
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
