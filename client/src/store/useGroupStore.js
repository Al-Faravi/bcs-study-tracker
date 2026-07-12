import { create } from 'zustand';
import { 
  createGroupApi, 
  fetchGroupsApi, 
  fetchGroupByIdApi, 
  requestJoinApi, 
  handleJoinRequestApi 
} from '../api/groupApi';

const useGroupStore = create((set, get) => ({
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,

  // ১. গ্রুপ লিস্ট লোড করা
  loadGroups: async (search = '', target = '') => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchGroupsApi(search, target);
      set({ groups: data.groups, isLoading: false });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'গ্রুপ লোড করতে সমস্যা হয়েছে!';
      set({ isLoading: false, error: errorMsg });
    }
  },

  // ২. নতুন গ্রুপ তৈরি করা (আপডেটেড)
  createGroup: async (groupData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await createGroupApi(groupData);
      // গ্রুপ তৈরি হওয়ার পর সাথে সাথে ডেটাবেস থেকে রিয়েল-টাইম লিস্ট লোড করা হবে
      await get().loadGroups(); 
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'গ্রুপ তৈরি ব্যর্থ হয়েছে!';
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  // ৩. সিঙ্গেল গ্রুপ লোড করা
  loadGroupById: async (groupId) => {
    set({ isLoading: true, error: null, currentGroup: null });
    try {
      const data = await fetchGroupByIdApi(groupId);
      set({ currentGroup: data.group, isLoading: false });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'গ্রুপের তথ্য পাওয়া যায়নি!';
      set({ isLoading: false, error: errorMsg });
    }
  },

  // ৪. জয়েন রিকোয়েস্ট পাঠানো
  sendJoinRequest: async (groupId) => {
    try {
      const data = await requestJoinApi(groupId);
      // রিকোয়েস্ট পাঠানোর পর লিস্ট রিফ্রেশ করা
      await get().loadGroups();
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'রিকোয়েস্ট পাঠানো যায়নি!';
      return { success: false, message: errorMsg };
    }
  },

  // ৫. মেম্বার রিকোয়েস্ট হ্যান্ডেল করা (অ্যাডমিন)
  handleMemberRequest: async (groupId, userId, action) => {
    try {
      const data = await handleJoinRequestApi(groupId, userId, action);
      // অ্যাকশন নেওয়ার পর কারেন্ট গ্রুপ রিফ্রেশ করা
      await get().loadGroupById(groupId);
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'অ্যাকশন সম্পন্ন হয়নি!';
      return { success: false, message: errorMsg };
    }
  }
}));

export default useGroupStore;