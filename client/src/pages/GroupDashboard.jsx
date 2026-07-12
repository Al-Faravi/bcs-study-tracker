// একদম সঠিক এবং নিরাপদ ইম্পোর্ট লিস্ট:
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, BookOpen, CheckCircle2, Circle, Clock, ShieldCheck, 
  UserCheck, UserX, AlertCircle, Loader2, ArrowLeft, MessageSquare, 
  Target, Award, Lock, Globe, FileText, BarChart2 
} from 'lucide-react';
import useGroupStore from '../store/useGroupStore';
import useAuthStore from '../store/useAuthStore';
import ResourceHub from '../components/groups/ResourceHub';
import GroupAnalytics from '../components/groups/GroupAnalytics';

const GroupDashboard = () => {
  const { groupId } = useParams();
  const { currentGroup, isLoading, error, loadGroupById, handleMemberRequest } = useGroupStore();
  const { user } = useAuthStore();

  // ট্যাব নেভিগেশন স্টেট
  const [activeTab, setActiveTab] = useState('overview');

  // ডেমো স্টাডি টার্গেট (পরবর্তীতে ব্যাকএন্ড থেকে আসবে)
  const [targets, setTargets] = useState([
    { id: 1, title: 'বাংলা সাহিত্য: প্রাচীন ও মধ্যযুগ রিভিশন', completed: true },
    { id: 2, title: 'ইংরেজি ব্যাকরণ: Subject-Verb Agreement প্র্যাকটিস', completed: false },
    { id: 3, title: 'গণিত: শতকরা ও লাভ-ক্ষতি বিগত সালের প্রশ্ন সমাধান', completed: false },
    { id: 4, title: 'দৈনিক সাধারণ জ্ঞান (সাম্প্রতিক বিষয়াবলী) পড়া', completed: true },
  ]);

  useEffect(() => {
    if (groupId) {
      loadGroupById(groupId);
    }
  }, [groupId, loadGroupById]);

  // টার্গেট কমপ্লিট টগল করার ফাংশন
  const toggleTarget = (id) => {
    setTargets(targets.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // মেম্বার রিকোয়েস্ট অ্যাকসেপ্ট/রিজেক্ট হ্যান্ডলার
  const onHandleRequest = async (userId, action) => {
    const result = await handleMemberRequest(groupId, userId, action);
    alert(result.message);
  };

  // ১. যতক্ষণ ডেটা লোড হচ্ছে অথবা currentGroup খালি আছে, ততক্ষণ লোডার দেখাবে
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

  // ২. নির্ভুল অ্যাডমিন চেক (id এবং _id উভয়ই সাপোর্ট করবে)
  const currentUserId = user?._id || user?.id;
  const adminId = currentGroup.admin?._id || currentGroup.admin;
  const isAdmin = adminId?.toString() === currentUserId?.toString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
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

        {/* চ্যাট ও ডিসকাশন বাটন (ফিউচার ফিচার) */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => alert('লাইভ গ্রুপ চ্যাট এবং ভয়েস রুম ফিচারটি খুব শীঘ্রই আসছে!')}
            className="px-6 py-3.5 rounded-2xl btn-glow font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>গ্রুপ চ্যাট রুম</span>
          </button>
        </div>
      </div>

      {/* ট্যাব মেনু (Neumorphic Pills) */}
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
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'syllabus' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5 inline mr-1.5" />
          <span>দৈনিক টার্গেট ও সিলেবাস</span>
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

        {/* নতুন রিসোর্স ও বই ট্যাব */}
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'resources' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1.5" />
          <span>রিসোর্স ও বই (Books & YouTube)</span>
        </button>

        {/* নতুন অ্যানালিটিক্স ও চার্ট ট্যাব */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 inline mr-1.5" />
          <span>অ্যানালিটিক্স ও চার্ট (Analytics)</span>
        </button>

        {/* অ্যাডমিন প্যানেল ট্যাব (শুধুমাত্র অ্যাডমিন দেখতে পাবে) */}
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
                <span className="font-extrabold text-indigo-600">২৪ টি টপিক</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl neu-inset bg-white/40">
                <span>গড় উপস্থিতি:</span>
                <span className="font-extrabold text-emerald-600">৯২%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ২. দৈনিক টার্গেট ও সিলেবাস ট্যাব */}
      {activeTab === 'syllabus' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">আজকের পড়ার টার্গেট (Daily Checklists)</h3>
              <p className="text-xs text-slate-500">আপনার সম্পন্ন হওয়া টপিকগুলোতে টিক দিন এবং প্রস্তুতি এগিয়ে নিন</p>
            </div>
            <span className="px-3 py-1 rounded-full neu-inset text-xs font-extrabold text-indigo-600">
              {targets.filter(t => t.completed).length} / {targets.length} সম্পন্ন
            </span>
          </div>

          <div className="space-y-3">
            {targets.map((target) => (
              <div 
                key={target.id}
                onClick={() => toggleTarget(target.id)}
                className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                  target.completed 
                    ? 'neu-inset bg-emerald-50/40 border-emerald-200/60 text-slate-500 line-through' 
                    : 'neu-card bg-white/40 border-white/80 text-slate-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {target.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-bold">{target.title}</span>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                  target.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {target.completed ? 'সম্পন্ন' : 'চলমান'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ৩. সদস্য তালিকা ট্যাব */}
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

      {/* ৪. জয়েন রিকোয়েস্ট ট্যাব (শুধুমাত্র অ্যাডমিনের জন্য) */}
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

                  {/* অ্যাকশন বাটনসমূহ */}
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

      {/* ৫. রিসোর্স ও বই ট্যাব */}
      {activeTab === 'resources' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <ResourceHub isAdmin={isAdmin} currentUserId={user?._id || user?.id} />
        </div>
      )}

      {/* ৬. অ্যানালিটিক্স ও চার্ট ট্যাব */}
      {activeTab === 'analytics' && (
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <GroupAnalytics members={currentGroup.members} />
        </div>
      )}

    </div>
  );
};

export default GroupDashboard;