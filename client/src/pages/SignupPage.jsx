import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, BookOpen, AlertCircle, Loader2, Calendar, Users, Camera } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast'; // <-- ইতিমধ্যে ইম্পোর্ট করা আছে

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('पुरुष (Male)');
  const [education, setEducation] = useState('');
  const [profilePic, setProfilePic] = useState('');
  
  const [passwordError, setPasswordError] = useState('');
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  // ছবি সিলেক্ট করে Base64 এ রূপান্তর
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // ছবির সাইজ ২ মেগাবাইটের বেশি হলে টোস্ট এরর দেখাবে
    if (file.size > 2 * 1024 * 1024) {
      toast.error('ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট হতে পারবে!'); // <-- alert বাদ দিয়ে toast ব্যবহার করা হলো
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // পাসওয়ার্ড না মিললে টোস্ট এরর দেখাবে
    if (password !== confirmPassword) {
      setPasswordError('পাসওয়ার্ড দুটি মিলছে না!');
      toast.error('পাসওয়ার্ড দুটি মিলছে না!'); // <-- টোস্ট নোটিফিকেশন
      return;
    }

    // ব্যাকএন্ডে সব ডেটা পাঠানো হচ্ছে
    const result = await register({
      name,
      email,
      password,
      dateOfBirth,
      gender,
      education,
      profilePic
    });

    if (result.success) {
      toast.success('অভিনন্দন! আপনার নিবন্ধন সফল হয়েছে।'); // <-- সফল নিবন্ধনে সাকসেস টোস্ট
      navigate('/groups'); // সাইন-আপ সফল হলে ড্যাশবোর্ডে নিয়ে যাবে
    } else {
      toast.error(result.message || 'নিবন্ধন ব্যর্থ হয়েছে!'); // <-- ব্যর্থ হলে এরর টোস্ট
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="neu-card max-w-xl w-full p-8 sm:p-10 rounded-3xl space-y-6 border border-white/80 bg-white/40">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl neu-inset mx-auto flex items-center justify-center text-indigo-600 bg-indigo-50/50">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">নতুন শিক্ষার্থী নিবন্ধন</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">বিসিএস ও পেশাগত ক্যারিয়ার প্রস্তুতির এক্সক্লুসিভ স্টাডি পোর্টালে যুক্ত হোন</p>
        </div>

        {(error || passwordError) && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{passwordError || error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* ১. ব্যক্তিগত তথ্য */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 pb-1">১. ব্যক্তিগত তথ্য (Personal Information)</h3>
            
            {/* ছবি আপলোড */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-16 h-16 rounded-2xl neu-inset p-1 overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                {profilePic ? (
                  <img src={profilePic} alt="Profile Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">প্রোফাইল ছবি যুক্ত করুন</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                <p className="text-[10px] text-slate-400">পাসপোর্ট সাইজ বা প্রফেশনাল ছবি ব্যবহার করার পরামর্শ দেওয়া হচ্ছে। (ফরম্যাট: JPG, PNG)</p>
              </div>
            </div>

            {/* নাম */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block ml-1">পূর্ণ নাম (Full Name)</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার পূর্ণ নাম লিখুন" className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              </div>
            </div>

            {/* জন্মতারিখ ও লিঙ্গ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block ml-1">জন্মতারিখ (Date of Birth)</label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block ml-1">লিঙ্গ (Gender)</label>
                <div className="relative flex items-center">
                  <Users className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                    <option value="পুরুষ (Male)">পুরুষ (Male)</option>
                    <option value="মহিলা (Female)">মহিলা (Female)</option>
                    <option value="অন্যান্য (Other)">অন্যান্য (Other)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ২. একাডেমিক তথ্য */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 pb-1">২. একাডেমিক তথ্য (Academic Background)</h3>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block ml-1">বিশ্ববিদ্যালয় বা কলেজের নাম</label>
              <div className="relative flex items-center">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় বা ঢাকা কলেজ" className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              </div>
            </div>
          </div>

          {/* ৩. অ্যাকাউন্ট নিরাপত্তা */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 pb-1">৩. অ্যাকাউন্ট নিরাপত্তা (Account Security)</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block ml-1">ইমেইল এড্রেস (Email Address)</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block ml-1">পাসওয়ার্ড নির্ধারণ করুন</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input type="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block ml-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input type="password" required minLength="6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="পাসওয়ার্ডটি আবার লিখুন" className="w-full pl-11 pr-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl btn-glow text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>নিবন্ধন সম্পন্ন করুন</span>}
          </button>

        </form>

        <div className="text-center pt-2 border-t border-slate-200/60">
          <p className="text-xs font-bold text-slate-500">
            ইতোমধ্যে অ্যাকাউন্ট রয়েছে?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-extrabold underline decoration-2 underline-offset-4">
              এখানে লগইন করুন
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;