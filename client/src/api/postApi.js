import axiosInstance from './axiosInstance';

export const createPostApi = async (postData) => {
  const response = await axiosInstance.post('/posts', postData);
  return response.data;
};

export const fetchPostsApi = async (search = '', category = 'All') => {
  const response = await axiosInstance.get(`/posts?search=${search}&category=${category}`);
  return response.data;
};

export const votePostApi = async (postId, type) => {
  const response = await axiosInstance.post(`/posts/${postId}/vote`, { type });
  return response.data;
};

export const addCommentApi = async (postId, text) => {
  const response = await axiosInstance.post(`/posts/${postId}/comment`, { text });
  return response.data;
};