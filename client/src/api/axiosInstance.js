import axios from 'axios';

// ✅ ডিপ্লয়ের জন্য ডায়নামিক API URL কনফিগারেশন (Vite Environment Variable ব্যবহার করে)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ CORS এর মাধ্যমে কুকি/টোকেন আদান-প্রদানের জন্য এটি অত্যন্ত গুরুত্বপূর্ণ
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