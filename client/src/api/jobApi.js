import axiosInstance from './axiosInstance';

// ১. নতুন চাকরির বিজ্ঞপ্তি পোস্ট করা
export const createJobApi = async (jobData) => {
  const response = await axiosInstance.post('/jobs', jobData);
  return response.data;
};

// ২. সকল সার্কুলার লোড করা (সার্চ ও ফিল্টার সহ)
export const fetchJobsApi = async (search = '', category = 'All') => {
  const response = await axiosInstance.get(`/jobs?search=${search}&category=${category}`);
  return response.data;
};

// ৩. চাকরিতে আবেদন করেছি (Applied) হিসেবে মার্ক বা আনমার্ক করা
export const toggleApplyJobApi = async (jobId) => {
  const response = await axiosInstance.post(`/jobs/${jobId}/apply`);
  return response.data;
};