import { create } from 'zustand';
import { createPostApi, fetchPostsApi, votePostApi, addCommentApi } from '../api/postApi';

const usePostStore = create((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  loadPosts: async (search = '', category = 'All') => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchPostsApi(search, category);
      set({ posts: data.posts, isLoading: false });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'পোস্ট লোড করতে সমস্যা হয়েছে!';
      set({ isLoading: false, error: errorMsg });
    }
  },

  createPost: async (postData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await createPostApi(postData);
      set((state) => ({ posts: [data.post, ...state.posts], isLoading: false }));
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'পোস্ট প্রকাশ ব্যর্থ হয়েছে!';
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  votePost: async (postId, type) => {
    try {
      const data = await votePostApi(postId, type);
      set((state) => ({
        posts: state.posts.map((post) => 
          post._id === postId ? { ...post, upvotes: data.upvotes, downvotes: data.downvotes } : post
        )
      }));
    } catch (err) {
      console.error('Vote error:', err);
    }
  },

  addComment: async (postId, text) => {
    try {
      const data = await addCommentApi(postId, text);
      set((state) => ({
        posts: state.posts.map((post) => post._id === postId ? data.post : post)
      }));
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'কমেন্ট করতে সমস্যা হয়েছে!';
      return { success: false, message: errorMsg };
    }
  }
}));

export default usePostStore;