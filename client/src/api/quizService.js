import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ১০০% নির্ভুলভাবে টোকেন বের করার মাস্টার ফাংশন (আগেরটার মতোই)
const getAuthHeaders = () => {
  let token = localStorage.getItem('token');
  if (!token) {
    try {
      const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      token = authStorage?.state?.token || authStorage?.state?.user?.token;
    } catch (e) {}
  }
  if (!token) {
    try {
      const userObj = JSON.parse(localStorage.getItem('user') || '{}');
      token = userObj?.token || userObj?.accessToken;
    } catch (e) {}
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// ১. নতুন কুইজ তৈরি করা
export const createQuiz = async (quizData) => {
  const response = await axios.post(`${API_URL}/quizzes`, quizData, getAuthHeaders());
  return response.data;
};

// ২. নির্দিষ্ট গ্রুপের সব কুইজ লোড করা
export const getGroupQuizzes = async (groupId) => {
  const response = await axios.get(`${API_URL}/quizzes/group/${groupId}`, getAuthHeaders());
  return response.data;
};

// ৩. কুইজ সাবমিট করা এবং রেজাল্ট নেওয়া
export const submitQuiz = async (quizId, answers) => {
  const response = await axios.post(`${API_URL}/quizzes/${quizId}/submit`, { answers }, getAuthHeaders());
  return response.data;
};