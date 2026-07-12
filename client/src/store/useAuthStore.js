import { create } from 'zustand';
import { registerUser, loginUser, getCurrentUser } from '../api/authApi';

// লগইন বা চেক-অথ এর সময় ইউজারের ছবি না থাকলে অটোমেটিক তৈরি হবে
const processUser = (userData) => {
  if (!userData) return null; // সেফটি চেক
  return {
    ...userData,
    profilePic:
      userData.profilePic ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.name || 'User'
      )}&background=6366f1&color=fff&bold=true&size=128`,
  };
};

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // ১. সাইনআপ অ্যাকশন
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerUser({ name, email, password });
      set({ isLoading: false });
      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে!';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // ২. লগইন অ্যাকশন
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser({ email, password });
      // লোকাল স্টোরেজে টোকেন সেভ করা হচ্ছে
      localStorage.setItem('token', data.token);
      
      // processUser কল করে user স্টেট আপডেট করা হলো
      set({ user: processUser(data.user), token: data.token, isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে!';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // ৩. প্রোফাইল লোড করার অ্যাকশন (অ্যাপ রিলোড দিলে যেন ইউজার লগইন থাকে)
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null });
      return;
    }
    set({ isLoading: true });
    try {
      const userData = await getCurrentUser();
      
      // processUser কল করে user স্টেট আপডেট করা হলো
      set({ user: processUser(userData), isLoading: false });
    } catch (err) {
      console.error('টোকেন ভ্যালিড নয় বা মেয়াদ শেষ:', err);
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  // ৪. লগআউট অ্যাকশন
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;