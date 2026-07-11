import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Building, Calendar, Camera, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();

  // ফর্ম ফিল্ড স্টেট
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // প্রোফাইল ছবি ও প্রিভিউ স্টেট
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // পাসওয়ার্ড টগল ও এরর স্টেট
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না। অনুগ্রহ করে পুনরায় যাচাই করুন।');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('নিরাপদ পাসওয়ার্ড হিসেবে কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    const newUserData = {
      name,
      email,
      gender,
      dob,
      institution,
      profilePicName: profilePic ? profilePic.name : 'Default Avatar'
    };

    console.log("Registering formal user:", newUserData);
    alert("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
    navigate('/groups');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f4f8] flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-2xl neu-card p-6 sm:p-10 border border-white/80 relative overflow-hidden">
        
        {/* ফরমাল হেডার সেকশন */}
        <div className="text-center space-y-1.5 mb-8 border-b border-slate-200/60 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            নতুন শিক্ষার্থী নিবন্ধন
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            বিসিএস ও পেশাগত ক্যারিয়ার প্রস্তুতির এক্সক্লুসিভ স্টাডি পোর্টালে যুক্ত হোন
          </p>
        </div>

        {/* এরর মেসেজ ব্যানার */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-8">
          
          {/* ================= সেকশন ১: ব্যক্তিগত তথ্য ================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">১. ব্যক্তিগত তথ্য (Personal Information)</h3>
            </div>

            {/* প্রোফাইল ছবি আপলোড */}
            <div className="flex items-center gap-5 p-4 neu-inset rounded-2xl bg-white/30 border border-white/60">
              <div className="relative group cursor-pointer flex-shrink-0">
                <div className="w-20 h-20 rounded-full neu-inset p-1 flex items-center justify-center overflow-hidden bg-white/60 border border-white">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                
                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-indigo-700 transition-colors"
                  title="ছবি নির্বাচন করুন"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input 
                    id="profile-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800 block">প্রোফাইল ছবি যুক্ত করুন</span>
                <p className="text-[11px] text-slate-500 leading-normal">পাসপোর্ট সাইজ বা প্রফেশনাল ছবি ব্যবহার করার পরামর্শ দেওয়া হচ্ছে। (ফরম্যাট: JPG, PNG)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* পূর্ণ নাম */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>পূর্ণ নাম (Full Name)</span>
                </label>
                <input 
                  type="text" 
                  placeholder="যেমন: মো. শাকাওয়াত হোসেন" 
                  className="w-full px-4 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              {/* জন্মতারিখ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>জন্মতারিখ (Date of Birth)</span>
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required 
                />
              </div>

              {/* জেন্ডার */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>লিঙ্গ (Gender)</span>
                </label>
                <select 
                  className="w-full px-4 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">পুরুষ (Male)</option>
                  <option value="Female">মহিলা (Female)</option>
                  <option value="Other">অন্যান্য (Other)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= সেকশন ২: একাডেমিক তথ্য ================= */}
          <div className="space-y-4 pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">২. একাডেমিক তথ্য (Academic Background)</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                <span>বিশ্ববিদ্যালয় বা কলেজের নাম</span>
              </label>
              <input 
                type="text" 
                placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় / গ্রিন বিশ্ববিদ্যালয়" 
                className="w-full px-4 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* ================= সেকশন ৩: অ্যাকাউন্ট নিরাপত্তা ================= */}
          <div className="space-y-4 pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">৩. অ্যাকাউন্ট নিরাপত্তা (Account Security)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ইমেইল এড্রেস */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>ইমেইল এড্রেস (Email Address)</span>
                </label>
                <input 
                  type="email" 
                  placeholder="example@domain.com" 
                  className="w-full px-4 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              {/* পাসওয়ার্ড */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>পাসওয়ার্ড নির্ধারণ করুন</span>
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="কমপক্ষে ৬ অক্ষর" 
                    className="w-full pl-4 pr-11 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* কনফার্ম পাসওয়ার্ড */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>পাসওয়ার্ড নিশ্চিত করুন</span>
                  </span>
                  {confirmPassword && (
                    <span className={`text-[10px] font-bold ${password === confirmPassword ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {password === confirmPassword ? '✔ Matched' : '✖ Not Matched'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="পাসওয়ার্ড পুনরায় লিখুন" 
                    className={`w-full pl-4 pr-11 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      confirmPassword && password !== confirmPassword ? 'ring-2 ring-rose-500 bg-rose-50/50' : 'focus:ring-indigo-500/40'
                    }`} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full py-4 rounded-xl btn-glow font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>নিবন্ধন সম্পন্ন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* ফুটার লিংক */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
          <p className="text-xs font-medium text-slate-500">
            ইতিমধ্যেই নিবন্ধিত সদস্য?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              অ্যাকাউন্টে প্রবেশ করুন
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;