import axios from 'axios';

// ব্যাকএন্ডের মূল URL (লোকাল ডেভেলপমেন্টের জন্য পোর্ট 5000)
const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: প্রতিটি রিকোয়েস্টের সাথে স্বয়ংক্রিয়ভাবে টোকেন পাঠানোর জন্য
axiosInstance.interceptors.request.use(
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

export default axiosInstance;