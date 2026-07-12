import axiosInstance from './axiosInstance';

// ১. রেজিস্ট্রেশন API কল
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// ২. লগইন API কল
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

// ৩. লগইন করা ইউজারের প্রোফাইল ফেচ করার API কল
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};