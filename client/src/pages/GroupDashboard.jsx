import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, BookOpen, CheckCircle2, Circle, Clock, ShieldCheck, 
  UserCheck, UserX, AlertCircle, Loader2, ArrowLeft, MessageSquare, 
  Target, Award, Lock, Globe, FileText, BarChart2, X, Minimize2, Maximize2, Sparkles, Plus, Calendar
} from 'lucide-react';
import useGroupStore from '../store/useGroupStore';
import useAuthStore from '../store/useAuthStore';
import ResourceHub from '../components/groups/ResourceHub';
import GroupAnalytics from '../components/groups/GroupAnalytics';
import GroupChatRoom from '../components/groups/GroupChatRoom';
import toast from 'react-hot-toast';

// ✅ আমাদের তৈরি করা লাইভ API সার্ভিস ইম্পোর্ট
// ✅ ফোল্ডারের নাম services থেকে বদলে api করা হয়েছে
import { getTargets, createTarget, toggleTarget } from "../api/targetService";

const GroupDashboard = () => {
  const { groupId } = useParams();
  const { currentGroup, isLoading, error, loadGroupById, handleMemberRequest } = useGroupStore();
  const { user } = useAuthStore();

  // ট্যাব নেভিগেশন স্টেট
  const [activeTab, setActiveTab] = useState('overview');

  // স্মার্ট চ্যাট উইজেট স্টেট
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  // ✅ লাইভ টার্গেট স্টেট (ডামি ডেটা বাদ!)
  const [targets, setTargets] = useState([]);
  const [loadingTargets, setLoadingTargets] = useState(false);

  // ✅ নতুন টার্গেট তৈরির ফর্ম স্টেট
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('বাংলা');
  const [newTopics, setNewTopics] = useState('');
  const [creatingTarget, setCreatingTarget] = useState(false);

  // পেজ লোড হলে গ্রুপ এবং টার্গেট ডেটা নিয়ে আসবে
  useEffect(() => {
    if (groupId) {
      loadGroupById(groupId);
      fetchLiveTargets();
    }
  }, [groupId, loadGroupById]);

  // ✅ ব্যাকএন্ড থেকে লাইভ টার্গেট লোড করার ফাংশন
  const fetchLiveTargets = async () => {
    try {
      setLoadingTargets(true);
      const data = await getTargets();
      setTargets(data);
    } catch (err) {
      console.error('টার্গেট লোড করা যায়নি:', err);
      toast.error('পড়ার টার্গেট লোড করতে সমস্যা হয়েছে!');
    } finally {
      setLoadingTargets(false);
    }
  };

  // ✅ নতুন টার্গেট তৈরি করার ফাংশন (অ্যাডমিন বা লিডারের জন্য)
  const handleCreateTarget = async (e) => {
    e.preventDefault();
    if (!newTitle || !newTopics) {
      toast.error('টাইটেল এবং টপিক অবশ্যই দিতে হবে!');
      return;
    }

    try {
      setCreatingTarget(true);
      const topicsArray = newTopics.split(',').map(t => t.trim()).filter(Boolean);
      
      const newTargetData = await createTarget({
        title: newTitle,
        subject: newSubject,
        topics: topicsArray,
        date: new Date()
      });

      // নতুন টার্গেট লিস্টের শুরুতে যোগ করে দেওয়া
      setTargets([newTargetData, ...targets]);
      toast.success('আজকের নতুন টার্গেট সেট করা হয়েছে! 🎯');
      
      // ফর্ম রিসেট ও মডাল বন্ধ করা
      setNewTitle('');
      setNewTopics('');
      document.getElementById('create_target_modal').close();
    } catch (err) {
      toast.error('টার্গেট তৈরি করা যায়নি!');
    } finally {
      setCreatingTarget(false);
    }
  };

  // ✅ পড়া শেষ হলে প্রগ্রেস আপডেট (Toggle Completion)
  const handleToggleTarget = async (id) => {
    try {
      const updatedTarget = await toggleTarget(id);
      // স্টেট আপডেট করে নতুন ডেটা বসানো
      setTargets(targets.map(t => t._id === id ? updatedTarget : t));
      
      const currentUserId = user?._id || user?.id;
      const isNowCompleted = updatedTarget.completedBy?.some(u => (u._id || u).toString() === currentUserId?.toString());
      
      if (isNowCompleted) {
        toast.success('অভিনন্দন! আপনার টার্গেট সম্পন্ন হয়েছে! 🎉');
      } else {
        toast('টার্গেট আনচেক করা হয়েছে।', { icon: 'ℹ️' });
      }
    } catch (err) {
      toast.error('প্রগ্রেস আপডেট করা যায়নি!');
    }
  };

  const onHandleRequest = async (userId, action) => {
    const result = await handleMemberRequest(groupId, userId, action);
    if (result.success) {
      toast.success(result.message || 'রিকোয়েস্ট সফলভাবে আপডেট হয়েছে!');
    } else {
      toast.error(result.message || 'রিকোয়েস্ট প্রসেস করা যায়নি!');
    }
  };

  if (isLoading || !currentGroup) {
    if (error) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="neu-card p-8 rounded-3xl border border-white/80 space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="font-extrabold text-lg text-slate-800">{error}</h3>
            <Link to="/groups" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl neu-btn text-xs font-bold text-indigo-600">
              <ArrowLeft className="w-4 h-4" />
              <span>গ্রুপ লিস্টে ফিরে যান</span>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">গ্রুপ ড্যাশবোর্ড লোড হচ্ছে...</span>
      </div>
    );
  }

  const currentUserId = user?._id || user?.id;
  const adminId = currentGroup.admin?._id || currentGroup.admin;
  const isAdmin = adminId?.toString() === currentUserId?.toString();

  // ইউজার কতগুলো টার্গেট কমপ্লিট করেছে তার হিসাব
  const myCompletedCount = targets.filter(t => 
    t.completedBy?.some(u => (u._id || u).toString() === currentUserId?.toString())
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      
      {/* টপ নেভিগেশন ও ব্যাক বাটন */}
      <div className="flex items-center justify-between">
        <Link to="/groups" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl neu-btn text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all">
          <ArrowLeft className="w-4 h-4" />
          <span>সকল স্টাডি গ্রুপ</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl neu-inset text-xs font-extrabold text-indigo-600 bg-white/60">
            {currentGroup.targetExam}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-xl neu-inset text-xs font-bold text-slate-500 bg-white/60">
            {currentGroup.isPrivate ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Globe className="w-3.5 h-3.5 text-emerald-500" />}
            <span>{currentGroup.isPrivate ? 'প্রাইভেট' : 'পাবলিক'}</span>
          </span>
        </div>
      </div>

      {/* গ্রুপ হেডার ব্যানার */}
      <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/40 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>সক্রিয় স্টাডি সেশন চলছে</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{currentGroup.name}</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">{currentGroup.description}</p>
          
          <div className="pt-2 flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-600" /> {currentGroup.members?.length || 1} জন সদস্য</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> অ্যাডমিন: {currentGroup.admin?.name || 'আপনি'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => { setIsChatOpen(true); setIsChatMinimized(false); }}
            className="px-6 py-3.5 rounded-2xl btn-glow font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all relative group"
          >
            <MessageSquare className="w-4 h-4" />
            <span>গ্রুপ চ্যাট খুলুন</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </button>
        </div>
      </div>

      {/* ট্যাব মেনু */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 neu-inset rounded-2xl bg-white/40 border border-white/60 max-w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
          <span>ওভারভিউ ও নিয়মাবলী</span>
        </button>
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'syllabus' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5 inline mr-1.5" />
          <span>দৈনিক টার্গেট ও সিলেবাস</span>
          {targets.length > 0 && (
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'syllabus' ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {targets.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'resources' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1.5" />
          <span>রিসোর্স ও বই (Books & YouTube)</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 inline mr-1.5" />
          <span>অ্যানালিটিক্স ও চার্ট</span>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'members' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1.5" />
          <span>সদস্যবৃন্দ ({currentGroup.members?.length || 0})</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'requests' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5 inline mr-1.5" />
            <span>জয়েন রিকোয়েস্ট</span>
            {currentGroup.joinRequests?.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-bounce">
                {currentGroup.joinRequests.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ================= ট্যাব কন্টেন্ট এরিয়া ================= */}
      
      {/* ১. ওভারভিউ ট্যাব */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
            <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-200/60 pb-3">গ্রুপের লক্ষ্য ও গাইডলাইন</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              এই স্টাডি গ্রুপটি তৈরি করা হয়েছে নিয়মিত পড়াশোনা ট্র্যাক করার জন্য। প্রতিদিন সকালে আমাদের টার্গেট সেট করা হবে এবং রাতে প্রত্যেকে নিজের অগ্রগতি শেয়ার করব।
            </p>
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">গ্রুপের নিয়মাবলী:</h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                {currentGroup.rules && currentGroup.rules.length > 0 ? (
                  currentGroup.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> প্রতিদিন অন্তত ৪ ঘণ্টা পড়াশোনা নিশ্চিত করা।</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> কুইজ ও মক টেস্টে সক্রিয় অংশগ্রহণ করা।</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> কোনো সদস্যকে ব্যক্তিগত আক্রমণ বা স্প্যামিং না করা।</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="neu-card p-6 rounded-3xl border border-white/80 space-y-4 h-fit">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-200/60 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>গ্রুপ স্ট্যাটাস</span>
            </h3>
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex justify-between p-3 rounded-xl neu-inset bg-white/40">
                <span>গ্রুপ তৈরি হয়েছে:</span>
                <span className="font-extrabold text-slate-800">{new Date(currentGroup.createdAt).toLocaleDateString('bn-BD')}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl neu-inset bg-white/40">
                <span>মোট পড়ার টার্গেট:</span>
                <span className="font-extrabold text-indigo-600">{targets.length} টি টপিক</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl neu-inset bg-white/40">
                <span>আমার সম্পন্ন:</span>
                <span className="font-extrabold text-emerald-600">{myCompletedCount} টি ({targets.length > 0 ? Math.round((myCompletedCount / targets.length) * 100) : 0}%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ২. দৈনিক টার্গেট ও সিলেবাস ট্যাব (✅ সম্পূর্ণ লাইভ ডেটা দিয়ে আপডেট করা হয়েছে) */}
      {activeTab === 'syllabus' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-200/60 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
                <span>আজকের পড়ার টার্গেট (Live Checklists)</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">Phase 2 Active 🚀</span>
              </h3>
              <p className="text-xs text-slate-500">আপনার সম্পন্ন হওয়া টপিকগুলোতে টিক দিন এবং প্রস্তুতি এগিয়ে নিন</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl neu-inset text-xs font-extrabold text-indigo-600 bg-white/50">
                {myCompletedCount} / {targets.length} আমার সম্পন্ন
              </span>
              
              {/* নতুন টার্গেট সেট করার বাটন */}
              <button
                onClick={() => document.getElementById('create_target_modal').showModal()}
                className="px-4 py-2 rounded-xl btn-glow text-xs font-bold text-white flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন টার্গেট সেট করুন</span>
              </button>
            </div>
          </div>

          {/* লোডিং বা খালি অবস্থা */}
          {loadingTargets ? (
            <div className="py-12 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500">লাইভ টার্গেট লোড হচ্ছে...</p>
            </div>
          ) : targets.length === 0 ? (
            <div className="py-12 text-center neu-inset rounded-2xl p-6 bg-white/30 space-y-3">
              <Target className="w-10 h-10 text-slate-400 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-700">এখনো কোনো টার্গেট সেট করা হয়নি!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">উপরের "নতুন টার্গেট সেট করুন" বাটনে ক্লিক করে আজকের পড়ার সিলেবাস ও টপিক যুক্ত করুন।</p>
              </div>
            </div>
          ) : (
            /* লাইভ টার্গেট লিস্ট */
            <div className="space-y-3">
              {targets.map((target) => {
                const isCompletedByMe = target.completedBy?.some(u => (u._id || u).toString() === currentUserId?.toString());

                return (
                  <div 
                    key={target._id}
                    onClick={() => handleToggleTarget(target._id)}
                    className={`p-4 sm:p-5 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${
                      isCompletedByMe 
                        ? 'neu-inset bg-emerald-50/50 border-emerald-300/80 text-slate-600' 
                        : 'neu-card bg-white/60 border-white/90 text-slate-800 hover:border-indigo-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {isCompletedByMe ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5 hover:text-indigo-600 transition-colors" />
                      )}
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {target.subject}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3" />
                            {new Date(target.date).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                        
                        <h4 className={`text-sm sm:text-base font-extrabold ${isCompletedByMe ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {target.title}
                        </h4>
                        
                        {/* টপিক ট্যাগসমূহ */}
                        {target.topics && target.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {target.topics.map((topic, idx) => (
                              <span key={idx} className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-slate-600 border border-slate-200/60 shadow-2xs">
                                # {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
                      {/* কারা কমপ্লিট করেছে তাদের ছোট্ট অ্যাভাটার লিস্ট */}
                      <div className="flex items-center -space-x-2 overflow-hidden" title="সম্পন্নকারী সদস্যগণ">
                        {target.completedBy?.slice(0, 4).map((user, i) => (
                          <div key={i} className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-indigo-100 text-indigo-600 font-extrabold text-[10px] flex items-center justify-center overflow-hidden">
                            {user.profilePic ? <img src={user.profilePic} alt="" className="w-full h-full object-cover" /> : user.name?.charAt(0) || 'U'}
                          </div>
                        ))}
                        {target.completedBy?.length > 4 && (
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 text-[9px] font-bold">
                            +{target.completedBy.length - 4}
                          </span>
                        )}
                      </div>

                      <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all ${
                        isCompletedByMe ? 'bg-emerald-500 text-white shadow-sm' : 'neu-inset bg-white/80 text-slate-600 hover:text-indigo-600'
                      }`}>
                        {isCompletedByMe ? '✔ পড়া সম্পন্ন' : 'টিক দিন ⭕'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ৩. রিসোর্স ও বই ট্যাব */}
      {activeTab === 'resources' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <ResourceHub isAdmin={isAdmin} currentUserId={currentUserId} />
        </div>
      )}

      {/* ৪. অ্যানালিটিক্স ও চার্ট ট্যাব */}
      {activeTab === 'analytics' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <GroupAnalytics members={currentGroup.members} />
        </div>
      )}

      {/* ৫. সদস্য তালিকা ট্যাব */}
      {activeTab === 'members' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <h3 className="font-extrabold text-lg text-slate-800 border-b border-slate-200/60 pb-4">
            গ্রুপের সকল সদস্য ({currentGroup.members?.length || 0})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentGroup.members?.map((member) => (
              <div key={member._id} className="p-4 rounded-2xl neu-inset bg-white/40 flex items-center gap-3 border border-white/60">
                <div className="w-12 h-12 rounded-xl neu-card p-0.5 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                  {member.profilePic ? (
                    <img src={member.profilePic} alt={member.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="font-bold text-indigo-600">{member.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">{member.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{member.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600">
                    {currentGroup.admin?._id === member._id ? 'অ্যাডমিন' : 'মেম্বার'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ৬. জয়েন রিকোয়েস্ট ট্যাব (শুধুমাত্র অ্যাডমিনের জন্য) */}
      {activeTab === 'requests' && isAdmin && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <div className="border-b border-slate-200/60 pb-4">
            <h3 className="font-extrabold text-lg text-slate-800">অপেক্ষমাণ সদস্য রিকোয়েস্ট</h3>
            <p className="text-xs text-slate-500">যে সকল শিক্ষার্থীরা আপনার গ্রুপে যুক্ত হওয়ার জন্য আবেদন করেছে</p>
          </div>

          {currentGroup.joinRequests?.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">এই মুহূর্তে কোনো অপেক্ষমাণ জয়েন রিকোয়েস্ট নেই।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentGroup.joinRequests?.map((reqUser) => (
                <div key={reqUser._id} className="p-4 rounded-2xl neu-card bg-white/40 border border-white/80 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-xl neu-inset p-0.5 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                      {reqUser.profilePic ? (
                        <img src={reqUser.profilePic} alt={reqUser.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="font-bold text-indigo-600">{reqUser.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">{reqUser.name}</h4>
                      <p className="text-xs text-slate-500">{reqUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => onHandleRequest(reqUser._id, 'accept')}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl btn-glow bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-700 transition-all"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>অনুমোদন দিন</span>
                    </button>
                    <button
                      onClick={() => onHandleRequest(reqUser._id, 'reject')}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl neu-inset text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-rose-50 transition-all"
                    >
                      <UserX className="w-4 h-4" />
                      <span>বাতিল করুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: নতুন পড়ার টার্গেট তৈরি (Phase 2 Add-on) ================= */}
      <dialog id="create_target_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 sm:p-8 border border-white/80 max-w-lg bg-[#f0f4f8]">
          <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4 mb-6">
            <div className="p-3 rounded-2xl neu-inset text-indigo-600">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">নতুন পড়ার টার্গেট সেট করুন</h3>
              <p className="text-xs text-slate-500">আজকের জন্য গ্রুপের সকল সদস্যদের পড়ার বিষয় ও টপিক নির্ধারণ করুন</p>
            </div>
          </div>

          <form onSubmit={handleCreateTarget} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block ml-1">বিষয় (Subject)</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
              >
                <option value="বাংলা">বাংলা সাহিত্য ও ব্যাকরণ</option>
                <option value="ইংরেজি">ইংরেজি (English Language & Literature)</option>
                <option value="গণিত">গাণিতিক যুক্তি ও মানসিক দক্ষতা</option>
                <option value="বাংলাদেশ বিষয়াবলী">বাংলাদেশ বিষয়াবলী</option>
                <option value="আন্তর্জাতিক বিষয়াবলী">আন্তর্জাতিক বিষয়াবলী</option>
                <option value="বিজ্ঞান ও আইসিটি">সাধারণ বিজ্ঞান ও আইসিটি</option>
                <option value="অন্যান্য">অন্যান্য / রিভিশন</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block ml-1">টার্গেটের শিরোনাম (Title)</label>
              <input 
                type="text" 
                placeholder="যেমন: বাংলা সাহিত্য: প্রাচীন ও মধ্যযুগ রিভিশন"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block ml-1">টপিকসমূহ (কমা দিয়ে আলাদা করুন)</label>
              <textarea 
                rows="3"
                placeholder="যেমন: চর্যাপদ, শ্রীকৃষ্ণকীর্তন, বৈষ্ণব পদাবলী, মঙ্গলকাব্য..."
                value={newTopics}
                onChange={(e) => setNewTopics(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
              ></textarea>
              <span className="text-[10px] text-slate-400 block ml-1">💡 টিপস: একাধিক টপিক লেখার সময় কমা ( , ) ব্যবহার করুন।</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <button 
                type="button" 
                onClick={() => document.getElementById('create_target_modal').close()}
                className="px-5 py-2.5 rounded-xl neu-btn text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button 
                type="submit" 
                disabled={creatingTarget}
                className="px-6 py-2.5 rounded-xl btn-glow text-xs font-bold text-white flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {creatingTarget ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{creatingTarget ? 'সেভ হচ্ছে...' : 'টার্গেট সেট করুন'}</span>
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* ================= SMART FLOATING CHAT WIDGET ================= */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-4 sm:px-6 sm:py-4 rounded-full btn-glow text-white shadow-2xl flex items-center gap-2.5 hover:scale-110 transition-all duration-300 group"
            title="লাইভ স্টাডি চ্যাট রুম খুলুন"
          >
            <MessageSquare className="w-6 h-6 animate-bounce" />
            <span className="font-extrabold text-sm hidden sm:inline">গ্রুপ চ্যাট</span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-white absolute top-1 right-1 sm:top-2 sm:right-2 animate-ping"></span>
          </button>
        </div>
      )}

      {isChatOpen && (
        <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] z-50 transition-all duration-300 shadow-2xl ${
          isChatMinimized ? 'h-14 sm:rounded-2xl overflow-hidden' : 'h-[100vh] sm:h-[620px] sm:rounded-3xl'
        } neu-card border border-white/90 bg-white/80 backdrop-blur-xl flex flex-col`}>
          
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between shadow-md cursor-pointer select-none"
               onClick={() => setIsChatMinimized(!isChatMinimized)}>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                  <span>লাইভ স্টাডি চ্যাট</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h4>
                <span className="text-[10px] text-indigo-100 font-medium block leading-none">
                  {currentGroup.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setIsChatMinimized(!isChatMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-all"
                title={isChatMinimized ? "বড় করুন" : "ছোট করুন"}
              >
                {isChatMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-lg hover:bg-rose-500 text-white transition-all"
                title="চ্যাট বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isChatMinimized && (
            <div className="flex-grow overflow-hidden flex flex-col bg-[#f8fafc]/90">
              <GroupChatRoom groupId={groupId} currentUser={user} />
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default GroupDashboard;