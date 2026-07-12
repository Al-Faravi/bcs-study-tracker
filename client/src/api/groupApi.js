import axiosInstance from './axiosInstance';

// ১. নতুন গ্রুপ তৈরি করা
export const createGroupApi = async (groupData) => {
  const response = await axiosInstance.post('/groups', groupData);
  return response.data;
};

// ২. সকল গ্রুপের তালিকা আনা (সার্চ ও টার্গেট ফিল্টার সহ)
export const fetchGroupsApi = async (search = '', target = '') => {
  const response = await axiosInstance.get(`/groups?search=${search}&target=${target}`);
  return response.data;
};

// ৩. নির্দিষ্ট একটি গ্রুপের বিস্তারিত আনা
export const fetchGroupByIdApi = async (groupId) => {
  const response = await axiosInstance.get(`/groups/${groupId}`);
  return response.data;
};

// ৪. গ্রুপে জয়েন রিকোয়েস্ট পাঠানো
export const requestJoinApi = async (groupId) => {
  const response = await axiosInstance.post(`/groups/${groupId}/join`);
  return response.data;
};

// ৫. অ্যাডমিন কর্তৃক জয়েন রিকোয়েস্ট অ্যাকসেপ্ট বা রিজেক্ট করা
export const handleJoinRequestApi = async (groupId, userId, action) => {
  const response = await axiosInstance.post(`/groups/${groupId}/request`, { userId, action });
  return response.data;
};