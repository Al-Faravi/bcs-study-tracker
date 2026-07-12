import React, { useState } from 'react';
import { User, Mail, Building, Calendar, ShieldCheck, Camera, Edit3, Save, X, Award, BookOpen } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const ProfilePage = () => {
  const { user } = useAuthStore();
  
  // এডিট মোড স্টেট
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [institution, setInstitution] = useState(user?.institution || 'ঢাকা বিশ্ববিদ্যালয়');
  const [dob, setDob] = useState(user?.dob || '1998-05-14');
  const [gender, setGender] = useState(user?.gender || 'Male');

  // প্রোফাইল ছবি আপডেট স্টেট
  const [profilePic, setProfilePic] = useState(user?.profilePic);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      // পরবর্তীতে এখানে Supabase আপলোড লজিক বসবে
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!');
    // পরবর্তীতে এখানে ব্যাকএন্ড এপিআই কল হবে
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* হেডার ব্যানার */}
      <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          
          {/* প্রোফাইল অ্যাভাটার */}
          <div className="relative group flex-shrink-0">
            <div className="w-28 h-28 rounded-3xl neu-inset p-1.5 flex items-center justify-center overflow-hidden bg-white border border-white shadow-inner">
              <img src={profilePic} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
            </div>
            {isEditing && (
              <label htmlFor="pic-upload" className="absolute bottom-[-6px] right-[-6px] p-2.5 rounded-2xl btn-glow text-white cursor-pointer shadow-lg hover:scale-110 transition-all">
                <Camera className="w-4 h-4" />
                <input id="pic-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* ইউজার বেসিক ইনফো */}
          <div className="space-y-2 text-center sm:text-left flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
              <span className="px-3 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest bg-white/60">
                {user.role === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'শিক্ষার্থী'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>{user.email}</span>
            </p>
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-600" /> ভেরিফাইড মেম্বার</span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4 text-amber-500" /> লেভেল ১ প্রিপারেশন</span>
            </div>
          </div>

          {/* এডিট বাটন */}
          <div className="sm:self-start">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-2xl neu-btn text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-2 transition-all shadow-sm"
              >
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>প্রোফাইল এডিট করুন</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl neu-inset text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all"
              >
                <X className="w-4 h-4 inline mr-1" /> বাতিল
              </button>
            )}
          </div>

        </div>
      </div>

      {/* বিস্তারিত তথ্য সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* বাম পাশ: স্টাডি স্ট্যাটাস (Quick Stats) */}
        <div className="neu-card p-6 rounded-3xl border border-white/80 space-y-6">
          <div className="border-b border-slate-200/60 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>স্টাডি অ্যাক্টিভিটি</span>
            </h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl neu-inset bg-white/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block">যুক্ত থাকা গ্রুপ</span>
              <span className="text-xl font-extrabold text-indigo-600">৩ টি স্টাডি সার্কেল</span>
            </div>
            <div className="p-4 rounded-2xl neu-inset bg-white/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block">সম্পন্ন হওয়া মক টেস্ট</span>
              <span className="text-xl font-extrabold text-emerald-600">১২ টি পরীক্ষা</span>
            </div>
            <div className="p-4 rounded-2xl neu-inset bg-white/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block">ফোরাম কন্ট্রিবিউশন</span>
              <span className="text-xl font-extrabold text-amber-600">৫ টি পোস্ট ও উত্তর</span>
            </div>
          </div>
        </div>

        {/* ডান পাশ: পার্সোনাল ও একাডেমিক ইনফো ফর্ম */}
        <div className="md:col-span-2 neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <div className="border-b border-slate-200/60 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>ব্যক্তিগত ও একাডেমিক তথ্য</span>
            </h3>
            {isEditing && <span className="text-[10px] font-bold text-amber-600 animate-pulse">● এডিট মোড চালু আছে</span>}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* পুরো নাম */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">পূর্ণ নাম</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl neu-inset bg-white/50 border border-white/60 text-sm font-semibold text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              {/* শিক্ষা প্রতিষ্ঠান */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  <span>শিক্ষা প্রতিষ্ঠান / বিশ্ববিদ্যালয়</span>
                </label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl neu-inset bg-white/50 border border-white/60 text-sm font-semibold text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              {/* জন্মতারিখ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>জন্মতারিখ</span>
                </label>
                <input 
                  type="date" 
                  disabled={!isEditing}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl neu-inset bg-white/50 border border-white/60 text-sm font-semibold text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              {/* জেন্ডার */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">লিঙ্গ</label>
                <select 
                  disabled={!isEditing}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl neu-inset bg-white/50 border border-white/60 text-sm font-semibold text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  <option value="Male">পুরুষ (Male)</option>
                  <option value="Female">মহিলা (Female)</option>
                  <option value="Other">অন্যান্য</option>
                </select>
              </div>

            </div>

            {/* সেভ বাটন (শুধুমাত্র এডিট মোডে দেখাবে) */}
            {isEditing && (
              <div className="pt-4 border-t border-slate-200/60 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-2xl btn-glow text-xs font-bold text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>তথ্য সংরক্ষণ করুন</span>
                </button>
              </div>
            )}
          </form>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;