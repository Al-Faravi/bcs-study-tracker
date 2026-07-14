import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

// LocalStorage থেকে আগের লগইন করা ডেটা লোড করার হেল্পার
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

const getStoredToken = () => {
  return localStorage.getItem('token') || null;
};

const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  isLoading: false,
  error: null,

  // ১. পেজ রিলোড দিলে ইউজার লগইন আছে কিনা চেক করার ফাংশন (যেটা মিসিং ছিল!)
  checkAuth: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ user: null, token: null });
      return;
    }
    try {
      const response = await axiosInstance.get('/auth/profile');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      set({ user: response.data.user });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    }
  },

  // ২. ইউজার রেজিস্ট্রেশন
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      set({ user: response.data.user, token: response.data.token, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে!';
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  // ৩. ইউজার লগইন
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      set({ user: response.data.user, token: response.data.token, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে!';
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  // ৪. প্রোফাইল আপডেট
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put('/auth/profile', userData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      set({ user: response.data.user, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'প্রোফাইল আপডেট ব্যর্থ হয়েছে!';
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  // ৫. লগআউট
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  }
}));

export default useAuthStore;