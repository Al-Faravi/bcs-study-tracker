import { create } from 'zustand';
import { createPostApi, fetchPostsApi, votePostApi, addCommentApi } from '../api/postApi';
import axiosInstance from '../api/axiosInstance'; // <-- এই পাথটা ঠিক করা হয়েছে (আগে /lib/axios ছিল)

const usePostStore = create((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  // ১. সকল পোস্ট লোড করা
  loadPosts: async (searchTerm = '', category = 'All') => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchPostsApi(searchTerm, category);
      set({ posts: data.posts || [], isLoading: false });
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'পোস্ট লোড করা সম্ভব হয়নি!' 
      });
    }
  },

  // ২. নতুন পোস্ট তৈরি করা
  createPost: async (postData) => {
    try {
      const newPost = await createPostApi(postData);
      set((state) => ({
        posts: [newPost, ...state.posts]
      }));
      return { success: true, post: newPost };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'পোস্ট তৈরি ব্যর্থ হয়েছে!' 
      };
    }
  },

  // ৩. পোস্ট এডিট বা আপডেট করা (১ মিনিটের মধ্যে)
  updatePost: async (postId, updatedData) => {
    try {
      const response = await axiosInstance.put(`/posts/${postId}`, updatedData);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === postId ? response.data.post : p))
      }));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'আপডেট করা যায়নি! হয়তো ১ মিনিট সময় পার হয়ে গেছে।' 
      };
    }
  },

  // ৪. পোস্ট ডিলিট করা
  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== postId)
      }));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'পোস্ট ডিলিট করা যায়নি!' 
      };
    }
  },

  // ৫. পোস্টে ভোট দেওয়া (Upvote / Downvote)
  votePost: async (postId, type) => {
    try {
      const updatedPost = await votePostApi(postId, type);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === postId ? updatedPost : p))
      }));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'ভোট দেওয়া যায়নি!' 
      };
    }
  },

  // ৬. কমেন্ট যুক্ত করা
  addComment: async (postId, text) => {
    try {
      const updatedPost = await addCommentApi(postId, text);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === postId ? updatedPost : p))
      }));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'কমেন্ট করা যায়নি!' 
      };
    }
  }
}));

export default usePostStore;