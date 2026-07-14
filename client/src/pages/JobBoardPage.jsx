import React, { useEffect, useState } from 'react';
import { Briefcase, Search, Filter, Plus, Clock, ExternalLink, CheckCircle2, Building, Users, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import useJobStore from '../store/useJobStore';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const JobBoardPage = () => {
  const { jobs, isLoading, error, loadJobs, createJob, toggleApply } = useJobStore();
  const { user } = useAuthStore();

  // সার্চ ও ফিল্টার স্টেট
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // নতুন সার্কুলার পোস্ট করার মডাল স্টেট
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState('BCS');
  const [vacancies, setVacancies] = useState(1);
  const [deadline, setDeadline] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [description, setDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    loadJobs(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, loadJobs]);

  // নতুন সার্কুলার সাবমিট হ্যান্ডলার
  const handleCreateJob = async (e) => {
    e.preventDefault();

    // ফর্ম ভ্যালিডেশন টোস্ট
    if (!title || !organization || !deadline || !applicationLink) {
      toast.error('অনুগ্রহ করে সকল বাধ্যতামূলক তথ্য প্রদান করুন।');
      return;
    }

    setCreateLoading(true);
    const result = await createJob({
      title,
      organization,
      category,
      vacancies,
      deadline,
      applicationLink,
      description
    });
    setCreateLoading(false);

    if (result.success) {
      document.getElementById('create_job_modal').close();
      // ফর্ম রিসেট
      setTitle(''); setOrganization(''); setDeadline(''); setApplicationLink(''); setDescription('');
      toast.success('অভিনন্দন! চাকরির সার্কুলারটি সফলভাবে প্রকাশিত হয়েছে।');
    } else {
      toast.error(result.message || 'সার্কুলার যুক্ত করা যায়নি!');
    }
  };

  // অ্যাপ্লাইড ট্র্যাকার হ্যান্ডলার
  const handleToggleApply = async (jobId) => {
    const result = await toggleApply(jobId);
    if (result.success) {
      toast.success(result.message || 'ট্র্যাকিং আপডেট করা হয়েছে।');
      loadJobs(searchTerm, selectedCategory); // স্টেট সিঙ্ক করার জন্য লিস্ট রিফ্রেশ
    } else {
      toast.error(result.message || 'প্রক্রিয়াটি সম্পন্ন করা যায়নি।');
    }
  };

  // ডেডলাইন কাউন্টডাউন ও স্ট্যাটাস বের করার হেল্পার ফাংশন
  const getDeadlineStatus = (dateString) => {
    const diffTime = new Date(dateString) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'মেয়াদ শেষ', color: 'text-rose-600 bg-rose-50 border-rose-200', expired: true };
    if (diffDays === 0) return { text: 'আজই শেষ দিন!', color: 'text-amber-600 bg-amber-50 border-amber-200 animate-pulse', expired: false };
    if (diffDays <= 5) return { text: `আর মাত্র ${diffDays} দিন বাকি`, color: 'text-amber-600 bg-amber-50 border-amber-200', expired: false };
    return { text: `${diffDays} দিন বাকি`, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', expired: false };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* হেডার ব্যানার */}
      <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/40 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-bold text-indigo-600 bg-white/50">
            <Briefcase className="w-3.5 h-3.5" />
            <span>স্মার্ট জব ট্র্যাকার ও সার্কুলার হাব</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            सरकारी ও বেসরকারি চাকরির বিজ্ঞপ্তি
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            একই স্থানে সকল চাকরির আপডেট দেখুন, শেষ তারিখের কাউন্টডাউন ট্র্যাক করুন এবং আপনার আবেদন করা চাকরিগুলো এক ক্লিকে সংরক্ষণ করুন।
          </p>
        </div>

        <button 
          onClick={() => document.getElementById('create_job_modal').showModal()}
          className="px-6 py-3.5 rounded-2xl btn-glow font-bold text-sm text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিজ্ঞপ্তি পোস্ট করুন</span>
        </button>
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="পদের নাম বা প্রতিষ্ঠান (যেমন: BPSC, বাংলাদেশ ব্যাংক) দিয়ে খুঁজুন..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="relative flex items-center">
          <Filter className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
          >
            <option value="All">সকল চাকরির ক্যাটাগরি</option>
            <option value="BCS">BCS (বিসিএস)</option>
            <option value="Bank Job">Bank Job (ব্যাংক জব)</option>
            <option value="Primary & NTRCA">Primary & NTRCA (শিক্ষক নিয়োগ)</option>
            <option value="Government">Government (অন্যান্য সরকারি)</option>
            <option value="Other">Other (অন্যান্য)</option>
          </select>
        </div>
      </div>

      {/* এরর বা লোডিং স্টেট */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">সার্কুলার লোড করা হচ্ছে...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="neu-card p-12 text-center rounded-3xl border border-white/80 space-y-4">
          <div className="w-16 h-16 rounded-full neu-inset flex items-center justify-center text-slate-400 mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-slate-800">কোনো সার্কুলার পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">আপনার অনুসন্ধানের সাথে মিলে এমন কোনো চাকরির বিজ্ঞপ্তি নেই। আপনি চাইলে নতুন একটি বিজ্ঞপ্তি পোস্ট করতে পারেন!</p>
          </div>
        </div>
      ) : (
        /* জব কার্ড গ্রিড */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const currentUserId = user?._id || user?.id;
            const isApplied = job.appliedUsers?.some(id => (id?._id || id).toString() === currentUserId?.toString());
            const deadlineInfo = getDeadlineStatus(job.deadline);

            return (
              <div key={job._id} className="neu-card p-6 sm:p-7 rounded-3xl border border-white/80 bg-white/30 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all group">
                <div className="space-y-4">
                  
                  {/* কার্ড হেডার: ক্যাটাগরি ও ডেডলাইন ব্যাজ */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-xl neu-inset text-[11px] font-extrabold text-indigo-600 bg-white/60">
                      {job.category}
                    </span>
                    <span className={`px-3 py-1 rounded-xl text-[11px] font-extrabold border flex items-center gap-1.5 ${deadlineInfo.color}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{deadlineInfo.text}</span>
                    </span>
                  </div>

                  {/* পদ ও প্রতিষ্ঠানের নাম */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-600 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{job.organization}</span>
                    </p>
                  </div>

                  {/* বিবরণ ও পদসংখ্যা */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-xl neu-inset">
                      <Users className="w-3.5 h-3.5 text-indigo-600" /> পদসংখ্যা: {job.vacancies} জন
                    </span>
                    <span className="flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-xl neu-inset">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" /> শেষ: {new Date(job.deadline).toLocaleDateString('bn-BD')}
                    </span>
                  </div>

                </div>

                {/* কার্ড বাটন অ্যাকশন (আবেদন লিংক ও ট্র্যাকার টগল) */}
                <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3">
                  <a
                    href={job.applicationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 rounded-2xl neu-btn text-xs font-extrabold text-slate-700 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>সার্কুলার দেখুন / আবেদন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleToggleApply(job._id)}
                    className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isApplied 
                        ? 'neu-inset bg-emerald-50 text-emerald-600 border border-emerald-200/60' 
                        : 'btn-glow text-white shadow-md hover:scale-[1.02]'
                    }`}
                    title={isApplied ? 'আবেদন তালিকা থেকে সরান' : 'আবেদন করেছি হিসেবে মার্ক করুন'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{isApplied ? 'আবেদন করেছি' : 'ট্র্যাক করুন'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: নতুন সার্কুলার পোস্ট ================= */}
      <dialog id="create_job_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 sm:p-8 border border-white/80 max-w-lg bg-[#f0f4f8]">
          
          <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4 mb-6">
            <div className="p-3 rounded-2xl neu-inset text-indigo-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">নতুন চাকরির বিজ্ঞপ্তি পোস্ট করুন</h3>
              <p className="text-xs text-slate-500">অন্যান্য চাকরিপ্রার্থীদের সাথে নতুন সার্কুলারের তথ্য শেয়ার করুন</p>
            </div>
          </div>

          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block ml-1">পদের নাম</label>
                <input 
                  type="text" 
                  placeholder="যেমন: সহকারী পরিচালক বা সহকারী জজ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block ml-1">প্রতিষ্ঠানের নাম</label>
                <input 
                  type="text" 
                  placeholder="যেমন: বাংলাদেশ ব্যাংক বা BPSC"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block ml-1">ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-800 cursor-pointer"
                >
                  <option value="BCS">BCS (বিসিএস)</option>
                  <option value="Bank Job">Bank Job (ব্যাংক জব)</option>
                  <option value="Primary & NTRCA">Primary & NTRCA (শিক্ষক)</option>
                  <option value="Government">Government (অন্যান্য সরকারি)</option>
                  <option value="Other">Other (অন্যান্য)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block ml-1">পদসংখ্যা (Vacancies)</label>
                <input 
                  type="number" 
                  min="1"
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block ml-1">আবেদনের শেষ তারিখ</label>
                <input 
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block ml-1">অফিসিয়াল সার্কুলার লিংক</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={applicationLink}
                  onChange={(e) => setApplicationLink(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block ml-1">সংक्षिप्त বিবরণ ও শিক্ষাগত যোগ্যতা</label>
                <textarea 
                  rows="3"
                  placeholder="শিক্ষাগত যোগ্যতা, বয়সসীমা বা আবেদনের ফি সম্পর্কে সংক্ষেপে লিখুন..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <button 
                type="button" 
                onClick={() => document.getElementById('create_job_modal').close()}
                className="px-5 py-2.5 rounded-xl neu-btn text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button 
                type="submit" 
                disabled={createLoading}
                className="px-6 py-2.5 rounded-xl btn-glow text-xs font-bold text-white flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{createLoading ? 'পোস্ট হচ্ছে...' : 'বিজ্ঞপ্তি প্রকাশ করুন'}</span>
              </button>
            </div>
          </form>

        </div>
      </dialog>

    </div>
  );
};

export default JobBoardPage;