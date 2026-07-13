import { create } from 'zustand';
import { createJobApi, fetchJobsApi, toggleApplyJobApi } from '../api/jobApi';

const useJobStore = create((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,

  // ১. সার্কুলার লিস্ট লোড করা
  loadJobs: async (search = '', category = 'All') => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchJobsApi(search, category);
      set({ jobs: data.jobs, isLoading: false });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'বিজ্ঞপ্তি লোড করতে সমস্যা হয়েছে!';
      set({ isLoading: false, error: errorMsg });
    }
  },

  // ২. নতুন বিজ্ঞপ্তি তৈরি করা
  createJob: async (jobData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await createJobApi(jobData);
      await get().loadJobs(); // নতুন সার্কুলার লোড করে লিস্ট রিফ্রেশ করবে
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'বিজ্ঞপ্তি প্রকাশ ব্যর্থ হয়েছে!';
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  // ৩. অ্যাপ্লাইড স্ট্যাটাস টগল করা
  toggleApply: async (jobId) => {
    try {
      const data = await toggleApplyJobApi(jobId);
      // রিয়েল-টাইম লিস্ট আপডেট করা হচ্ছে
      set((state) => ({
        jobs: state.jobs.map((job) => {
          if (job._id === jobId) {
            const currentUserId = JSON.parse(localStorage.getItem('user'))?._id || JSON.parse(localStorage.getItem('user'))?.id;
            const updatedApplied = data.isApplied
              ? [...job.appliedUsers, currentUserId]
              : job.appliedUsers.filter(id => (id?._id || id).toString() !== currentUserId?.toString());
            return { ...job, appliedUsers: updatedApplied };
          }
          return job;
        })
      }));
      return { success: true, isApplied: data.isApplied, message: data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'স্ট্যাটাস পরিবর্তন করা যায়নি!';
      return { success: false, message: errorMsg };
    }
  }
}));

export default useJobStore;