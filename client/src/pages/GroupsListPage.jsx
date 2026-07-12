import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Search, Filter, ShieldCheck, ArrowRight, BookOpen, Lock, Globe, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import useGroupStore from '../store/useGroupStore';
import useAuthStore from '../store/useAuthStore';

const GroupsListPage = () => {
  const { groups, isLoading, error, loadGroups, createGroup, sendJoinRequest } = useGroupStore();
  const { user } = useAuthStore();

  // সার্চ ও ফিল্টার স্টেট
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');

  // নতুন গ্রুপ তৈরির মডাল স্টেট
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetExam, setTargetExam] = useState('BCS Preliminary');
  const [isPrivate, setIsPrivate] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // পেজ লোড হলে গ্রুপ লিস্ট নিয়ে আসবে
  useEffect(() => {
    loadGroups(searchTerm, selectedTarget);
  }, [searchTerm, selectedTarget, loadGroups]);

  // নতুন গ্রুপ সাবমিট হ্যান্ডলার
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!name || !description) {
      setCreateError('অনুগ্রহ করে গ্রুপের নাম এবং বিবরণ প্রদান করুন।');
      return;
    }

    setCreateLoading(true);
    const result = await createGroup({
      name,
      description,
      targetExam,
      isPrivate,
      rules: ['নিয়মিত পড়াশোনার আপডেট দিতে হবে', 'সকল সদস্যকে সম্মান করতে হবে']
    });
    setCreateLoading(false);

    if (result.success) {
      // মডাল বন্ধ করা এবং ফর্ম রিসেট
      document.getElementById('create_group_modal').close();
      setName('');
      setDescription('');
      setIsPrivate(false);
      alert('অভিনন্দন! আপনার স্টাডি গ্রুপটি সফলভাবে তৈরি হয়েছে।');
    } else {
      setCreateError(result.message);
    }
  };

  // জয়েন রিকোয়েস্ট হ্যান্ডলার
  const handleJoin = async (groupId) => {
    const result = await sendJoinRequest(groupId);
    alert(result.message);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* হেডার সেকশন */}
      <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/40 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-bold text-indigo-600 bg-white/50">
            <Users className="w-3.5 h-3.5" />
            <span>পিয়ার-টু-পিয়ার লার্নিং হাব</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            সক্রিয় স্টাডি গ্রুপসমূহ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            আপনার লক্ষ্য অনুযায়ী সমমনা চাকরিপ্রার্থীদের সাথে যুক্ত হোন। একসাথে পড়াশোনার রুটিন তৈরি করুন, কুইজ দিন এবং প্রস্তুতিকে আরও গতিশীল করুন।
          </p>
        </div>

        <button 
          onClick={() => { setCreateError(''); document.getElementById('create_group_modal').showModal(); }}
          className="px-6 py-3.5 rounded-2xl btn-glow font-bold text-sm text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন গ্রুপ খুলুন</span>
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
            placeholder="গ্রুপের নাম দিয়ে খুঁজুন..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="relative flex items-center">
          <Filter className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <select 
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
          >
            <option value="">সকল পরীক্ষার প্রস্তুতি</option>
            <option value="BCS Preliminary">BCS Preliminary</option>
            <option value="Bank Job Preparation">Bank Job Preparation</option>
            <option value="Primary Teachers Exam">Primary Teachers Exam</option>
            <option value="NTRCA & Others">NTRCA & Others</option>
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
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">গ্রুপ লোড করা হচ্ছে...</span>
        </div>
      ) : groups.length === 0 ? (
        <div className="neu-card p-12 text-center rounded-3xl border border-white/80 space-y-4">
          <div className="w-16 h-16 rounded-full neu-inset flex items-center justify-center text-slate-400 mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-slate-800">কোনো স্টাডি গ্রুপ পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">আপনার অনুসন্ধানের সাথে মিলে এমন কোনো গ্রুপ নেই। আপনি চাইলে নিজেই একটি নতুন গ্রুপ খুলে পড়াশোনা শুরু করতে পারেন!</p>
          </div>
        </div>
      ) : (
        /* গ্রুপ কার্ড গ্রিড */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            // ইউজারের সঠিক আইডি বের করা (id অথবা _id যেটাই থাকুক)
            const currentUserId = user?._id || user?.id;

            // নির্ভুলভাবে চেক করা হচ্ছে ইউজার অ্যাডমিন বা মেম্বার কিনা
            const isMember = group.members?.some(m => (m?._id || m).toString() === currentUserId?.toString());
            const isPending = group.joinRequests?.some(req => (req?._id || req).toString() === currentUserId?.toString());
            const isAdmin = (group.admin?._id || group.admin)?.toString() === currentUserId?.toString();

            return (
              <div key={group._id} className="neu-card p-6 rounded-3xl border border-white/80 bg-white/30 flex flex-col justify-between hover:shadow-lg transition-all group">
                <div className="space-y-4">
                  
                  {/* কার্ড হেডার ব্যাজ */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl neu-inset text-[11px] font-extrabold text-indigo-600 bg-white/60">
                      {group.targetExam}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      {group.isPrivate ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Globe className="w-3.5 h-3.5 text-emerald-500" />}
                      <span>{group.isPrivate ? 'প্রাইভেট' : 'পাবলিক'}</span>
                    </div>
                  </div>

                  {/* গ্রুপের নাম ও বিবরণ */}
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {group.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {group.description}
                    </p>
                  </div>

                  {/* অ্যাডমিন ও মেম্বার তথ্য */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full neu-inset p-0.5 overflow-hidden bg-white">
                        {group.admin?.profilePic ? (
                          <img src={group.admin.profilePic} alt="Admin" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                            {group.admin?.name?.charAt(0) || 'A'}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold truncate max-w-[100px]">
                        {group.admin?.name?.split(' ')[0] || 'অ্যাডমিন'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 font-bold">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{group.members.length} সদস্য</span>
                    </div>
                  </div>

                </div>

                {/* কার্ড বাটন অ্যাকশন (এখানে isMember বা isAdmin হলে ড্যাশবোর্ডের বাটন দেখাবে) */}
                <div className="pt-6 mt-2">
                  {isMember || isAdmin ? (
                    <Link
                      to={`/group/${group._id}`}
                      className="w-full py-3 rounded-2xl neu-btn text-xs font-extrabold text-indigo-600 flex items-center justify-center gap-2 hover:bg-white transition-all shadow-sm"
                    >
                      <span>গ্রুপ ড্যাশবোর্ডে যান</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : isPending ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-2xl neu-inset bg-amber-50/50 text-amber-600 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-amber-200/50"
                    >
                      <span>অপেক্ষমাণ (Pending Approval)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(group._id)}
                      className="w-full py-3 rounded-2xl btn-glow text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
                    >
                      <span>গ্রুপে যুক্ত হোন</span>
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: নতুন স্টাডি গ্রুপ তৈরি ================= */}
      <dialog id="create_group_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 sm:p-8 border border-white/80 max-w-lg bg-[#f0f4f8]">
          
          <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4 mb-6">
            <div className="p-3 rounded-2xl neu-inset text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">নতুন স্টাডি গ্রুপ খুলুন</h3>
              <p className="text-xs text-slate-500">সমমনা বন্ধুদের নিয়ে আপনার নিজস্ব স্টাডি সার্কেল তৈরি করুন</p>
            </div>
          </div>

          {createError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{createError}</span>
            </div>
          )}

          <form onSubmit={handleCreateGroup} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block ml-1">গ্রুপের নাম</label>
              <input 
                type="text" 
                placeholder="যেমন: 47th BCS Exclusive Fighters"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block ml-1">টার্গেট পরীক্ষা</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
              >
                <option value="BCS Preliminary">BCS Preliminary</option>
                <option value="Bank Job Preparation">Bank Job Preparation</option>
                <option value="Primary Teachers Exam">Primary Teachers Exam</option>
                <option value="NTRCA & Others">NTRCA & Others</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block ml-1">গ্রুপের বিবরণ ও লক্ষ্য</label>
              <textarea 
                rows="3"
                placeholder="গ্রুপের পড়াশোনার রুটিন বা নিয়মকানুন সম্পর্কে সংক্ষেপে লিখুন..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-between p-3.5 neu-inset rounded-2xl bg-white/30">
              <div className="flex items-center gap-2.5">
                {isPrivate ? <Lock className="w-5 h-5 text-amber-500" /> : <Globe className="w-5 h-5 text-emerald-500" />}
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{isPrivate ? 'প্রাইভেট গ্রুপ' : 'পাবলিক গ্রুপ'}</span>
                  <span className="text-[10px] text-slate-500 block">{isPrivate ? 'শুধু অ্যাডমিনের অনুমোদনে জয়েন করা যাবে' : 'যে কেউ সরাসরি জয়েন করতে পারবে'}</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={isPrivate} 
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="toggle toggle-indigo cursor-pointer" 
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <button 
                type="button" 
                onClick={() => document.getElementById('create_group_modal').close()}
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
                <span>{createLoading ? 'তৈরি হচ্ছে...' : 'গ্রুপ তৈরি করুন'}</span>
              </button>
            </div>
          </form>

        </div>
      </dialog>

    </div>
  );
};

export default GroupsListPage;