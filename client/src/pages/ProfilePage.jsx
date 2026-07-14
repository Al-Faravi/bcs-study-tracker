import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, BookOpen, Target, Edit3, Save, Camera, ShieldCheck, AlertCircle, Loader2, CheckCircle2, Award, Calendar, Users } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const ProfilePage = () => {
  const { user, updateProfile, isLoading, error } = useAuthStore();

  // এডিট মোড টগল স্টেট
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // ফর্ম ফিল্ড স্টেট
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [education, setEducation] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const fileInputRef = useRef(null);

  // ইউজার ডেটা লোড হলে ফর্মে সেট করা
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || 'বিসিএস ও সরকারি চাকরির প্রস্তুতি নিচ্ছি।');
      setPhone(user.phone || '');
      setDateOfBirth(user.dateOfBirth || '');
      setGender(user.gender || '');
      setTargetExam(user.targetExam || 'BCS Preliminary');
      setEducation(user.education || '');
      setProfilePic(user.profilePic || '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট হতে পারবে!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    const result = await updateProfile({
      name,
      bio,
      phone,
      dateOfBirth,
      gender,
      targetExam,
      education,
      profilePic
    });

    if (result.success) {
      setIsEditing(false);
      setSuccessMsg('আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  if (!user) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="text-xs font-bold text-slate-500 uppercase">প্রোফাইল লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* হেডার ব্যানার ও নোটিফিকেশন */}
      <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/40 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl neu-inset text-indigo-600 bg-indigo-50/50 flex-shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">আমার প্রোফাইল</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">আপনার ব্যক্তিগত তথ্য ও প্রস্তুতির লক্ষ্য পরিচালনা করুন</p>
          </div>
        </div>

        <button
          onClick={() => { setIsEditing(!isEditing); setSuccessMsg(''); }}
          className={`px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
            isEditing ? 'neu-inset text-rose-600 bg-rose-50 border border-rose-200' : 'btn-glow text-white hover:scale-105'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'এডিট মোড বন্ধ করুন' : 'প্রোফাইল এডিট করুন'}</span>
        </button>
      </div>

      {/* সাকসেস বা এরর মেসেজ */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* মূল প্রোফাইল গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* বাম পাশে: ছবি ও সংক্ষিপ্ত কার্ড */}
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6 flex flex-col items-center text-center h-fit bg-white/30">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl neu-inset p-1.5 overflow-hidden bg-white flex items-center justify-center">
              {profilePic ? (
                <img src={profilePic} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-4xl font-extrabold text-indigo-600">{user.name?.charAt(0)}</span>
              )}
            </div>

            {isEditing && (
              <>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2.5 rounded-xl btn-glow text-white shadow-lg hover:scale-110 transition-all"
                  title="প্রোফাইল ছবি পরিবর্তন করুন"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="space-y-1 w-full">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-1.5 truncate">
              <span>{user.name}</span>
              {user.role === 'admin' && <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" title="Admin User" />}
            </h2>
            <span className="inline-block px-3 py-1 rounded-xl neu-inset text-[11px] font-extrabold text-indigo-600 bg-white/60">
              {user.targetExam || 'BCS Preliminary'}
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs">
            {bio || 'কোনো বায়ো যোগ করা হয়নি।'}
          </p>

          <div className="w-full pt-4 border-t border-slate-200/60 space-y-2.5 text-left text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl neu-inset bg-white/40">
              <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl neu-inset bg-white/40">
              <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{phone || 'ফোন নম্বর নেই'}</span>
            </div>
            {dateOfBirth && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl neu-inset bg-white/40">
                <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>জন্মতারিখ: {dateOfBirth}</span>
              </div>
            )}
            {gender && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl neu-inset bg-white/40">
                <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>লিঙ্গ: {gender}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl neu-inset bg-white/40">
              <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>ভূমিকা: <strong className="uppercase text-slate-800">{user.role}</strong></span>
            </div>
          </div>
        </div>

        {/* ডান পাশে: বিস্তারিত তথ্য ও এডিট ফর্ম */}
        <div className="md:col-span-2 neu-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/30 space-y-6">
          <div className="border-b border-slate-200/60 pb-4">
            <h3 className="font-extrabold text-lg text-slate-900">ব্যক্তিগত ও শিক্ষাগত তথ্য</h3>
            <p className="text-xs text-slate-500">আপনার সঠিক তথ্য দিয়ে প্রোফাইল সম্পূর্ণ রাখুন</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* নাম */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block ml-1">পূর্ণ নাম</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              {/* ইমেইল */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block ml-1">ইমেইল অ্যাড্রেস (অপরিবর্তনযোগ্য)</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-slate-100/80 border border-slate-200 text-sm font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* ফোন নম্বর */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block ml-1">ফোন নম্বর</label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="যেমন: 017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              {/* জন্মতারিখ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block ml-1">জন্মতারিখ (Date of Birth)</label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              {/* লিঙ্গ (Gender) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block ml-1">লিঙ্গ (Gender)</label>
                <div className="relative flex items-center">
                  <Users className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="পুরুষ (Male)">পুরুষ (Male)</option>
                    <option value="মহিলা (Female)">মহিলা (Female)</option>
                    <option value="অন্যান্য (Other)">অন্যান্য (Other)</option>
                  </select>
                </div>
              </div>

              {/* টার্গেট পরীক্ষা */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block ml-1">প্রধান টার্গেট পরীক্ষা</label>
                <div className="relative flex items-center">
                  <Target className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                  >
                    <option value="BCS Preliminary">BCS Preliminary</option>
                    <option value="BCS Written">BCS Written</option>
                    <option value="Bank Job Preparation">Bank Job Preparation</option>
                    <option value="Primary & Teacher Recruitment">Primary & Teacher Recruitment</option>
                    <option value="Other Government Jobs">Other Government Jobs</option>
                  </select>
                </div>
              </div>

              {/* শিক্ষাগত যোগ্যতা */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block ml-1">বিশ্ববিদ্যালয় বা কলেজের নাম (Academic Background)</label>
                <div className="relative flex items-center">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় বা ঢাকা কলেজ"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              {/* সংক্ষিপ্ত বায়ো */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block ml-1">নিজের সম্পর্কে সংক্ষিপ্ত বায়ো (Bio)</label>
                <textarea
                  rows="3"
                  placeholder="আপনার লক্ষ্য বা প্রস্তুতি সম্পর্কে সংক্ষেপে লিখুন..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                ></textarea>
              </div>

            </div>

            {/* সেভ বাটন */}
            {isEditing && (
              <div className="pt-4 border-t border-slate-200/60 flex justify-end gap-3 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl neu-btn text-xs font-bold text-slate-600"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl btn-glow text-xs font-bold text-white flex items-center gap-2 shadow-md disabled:opacity-50 hover:scale-105 transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
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