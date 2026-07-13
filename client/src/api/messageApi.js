import axiosInstance from './axiosInstance';

export const fetchMessagesApi = async (groupId) => {
  const response = await axiosInstance.get(`/messages/${groupId}`);
  return response.data;
};