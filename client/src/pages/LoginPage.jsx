import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, KeyRound, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Forgot Password Modal States
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('দয়া করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    console.log("Logging in with:", { email, password });
    navigate('/groups');
  };

  // পাসওয়ার্ড রিসেট রিকোয়েস্ট লজিক
  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setResetLoading(true);
    // ব্যাকএন্ড API সিমুলেশন (১ সেকেন্ড পর সাকসেস দেখাবে)
    setTimeout(() => {
      setResetLoading(false);
      setIsResetSent(true);
    }, 1000);
  };

  const closeResetModal = () => {
    document.getElementById('forgot_password_modal').close();
    // মডাল বন্ধ হলে স্টেট রিসেট হবে
    setTimeout(() => {
      setIsResetSent(false);
      setResetEmail('');
    }, 300);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f4f8] flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md neu-card p-8 sm:p-10 border border-white/80 relative overflow-hidden">
        
        {/* ফরমাল হেডার সেকশন */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-2xl neu-inset flex items-center justify-center text-indigo-600 mx-auto mb-4 border border-white/60">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            অ্যাকাউন্টে প্রবেশ করুন
          </h1>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            বিসিএস ও ক্যারিয়ার প্রস্তুতির স্মার্ট প্ল্যাটফর্মে আপনাকে স্বাগতম। আপনার নিবন্ধিত ক্রেডেনশিয়াল প্রদান করুন।
          </p>
        </div>

        {/* এরর মেসেজ ব্যানার */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* লগইন ফর্ম */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>ইমেইল এড্রেস</span>
            </label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full px-4 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>পাসওয়ার্ড</span>
              </label>
              
              {/* Forgot Password Button (Triggers Modal) */}
              <button 
                type="button"
                onClick={() => { setIsResetSent(false); setResetEmail(''); document.getElementById('forgot_password_modal').showModal(); }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-4 pr-11 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" 
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

          <button 
            type="submit" 
            className="w-full py-3.5 rounded-xl btn-glow font-bold text-sm flex items-center justify-center gap-2 shadow-md mt-2 cursor-pointer"
          >
            <span>নিরাপদ লগইন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* সিকিউরিটি ফুটার */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>২৫৬-বিট এনক্রিপ্টেড ও সুরক্ষিত সেশন</span>
        </div>

        <p className="text-center text-xs font-medium text-slate-500 mt-4">
          প্ল্যাটফর্মে নতুন?{' '}
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            নতুন অ্যাকাউন্ট নিবন্ধন করুন
          </Link>
        </p>

      </div>

      {/* ================= MODAL: FORGOT PASSWORD ================= */}
      <dialog id="forgot_password_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 sm:p-8 border border-white/80 max-w-md bg-[#f0f4f8]">
          
          <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4 mb-4">
            <div className="p-2.5 rounded-xl neu-inset text-indigo-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">পাসওয়ার্ড পুনরুদ্ধার</h3>
              <p className="text-xs text-slate-500">অ্যাকাউন্ট ভেরিফিকেশন ও পাসওয়ার্ড রিসেট</p>
            </div>
          </div>

          {!isResetSent ? (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                আপনার অ্যাকাউন্টের সাথে যুক্ত নিবন্ধিত ইমেইল এড্রেসটি নিচে প্রদান করুন। আমরা আপনার ইমেইলে পাসওয়ার্ড রিসেট করার একটি নিরাপদ লিংক প্রেরণ করব।
              </p>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 block">নিবন্ধিত ইমেইল এড্রেস</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full px-4 py-3 neu-inset rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
                <button 
                  type="button" 
                  className="px-5 py-2.5 rounded-xl neu-btn text-xs font-semibold text-slate-600" 
                  onClick={closeResetModal}
                >
                  বাতিল করুন
                </button>
                <button 
                  type="submit" 
                  disabled={resetLoading}
                  className="px-6 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {resetLoading ? (
                    <span>প্রেরণ করা হচ্ছে...</span>
                  ) : (
                    <>
                      <span>রিসেট লিংক পাঠান</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ইমেইল পাঠানোর পর কনফার্মেশন স্ক্রিন */
            <div className="py-4 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-slate-900">ইমেইল প্রেরণ সম্পন্ন হয়েছে</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  আমরা <strong className="text-slate-800 font-semibold">{resetEmail}</strong> ঠিকানায় একটি পাসওয়ার্ড রিসেট নির্দেশিকা পাঠিয়েছি। অনুগ্রহ করে আপনার ইনবক্স (এবং স্প্যাম ফোল্ডার) চেক করুন।
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-200/60">
                <button 
                  type="button" 
                  onClick={closeResetModal}
                  className="w-full py-3 rounded-xl btn-glow text-xs font-bold"
                >
                  লগইন পেজে ফিরে যান
                </button>
              </div>
            </div>
          )}

        </div>
      </dialog>

    </div>
  );
};

export default LoginPage;