import axios from 'axios';

// API URL সেট করা হচ্ছে (Vercel ও লোকাল দুটোতেই কাজ করবে)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 🔍 একদম ১০০% নির্ভুলভাবে টোকেন বের করার মাস্টার ফাংশন
const getAuthHeaders = () => {
  let token = null;

  // ১. সরাসরি 'token' নামে আছে কিনা দেখা
  token = localStorage.getItem('token');

  // ২. 'auth-storage' (Zustand store) এর ভেতর আছে কিনা দেখা
  if (!token) {
    try {
      const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      token = authStorage?.state?.token || authStorage?.state?.user?.token;
    } catch (e) {
      console.log('Error parsing auth-storage');
    }
  }

  // ৩. 'user' অবজেক্টের ভেতর আছে কিনা দেখা
  if (!token) {
    try {
      const userObj = JSON.parse(localStorage.getItem('user') || '{}');
      token = userObj?.token || userObj?.accessToken;
    } catch (e) {
      console.log('Error parsing user object');
    }
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// ১. সব টার্গেট লোড করা (অবশ্যই export থাকতে হবে)
export const getTargets = async () => {
  const response = await axios.get(`${API_URL}/targets`, getAuthHeaders());
  return response.data;
};

// ২. নতুন টার্গেট তৈরি করা (অবশ্যই export থাকতে হবে)
export const createTarget = async (targetData) => {
  const response = await axios.post(`${API_URL}/targets`, targetData, getAuthHeaders());
  return response.data;
};

// ৩. টার্গেট কমপ্লিট বা আনচেক করা (অবশ্যই export থাকতে হবে)
export const toggleTarget = async (targetId) => {
  const response = await axios.put(`${API_URL}/targets/${targetId}/toggle`, {}, getAuthHeaders());
  return response.data;
};