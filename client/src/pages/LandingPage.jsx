import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, TrendingUp, Users, Target, ShieldCheck, 
  ArrowRight, CheckCircle2, BarChart3, Clock, Award 
} from 'lucide-react';
import toast from 'react-hot-toast';

const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f4f8] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[60vh]">
          
          {/* বাম পাশ: টেক্সট ও কল-টু-অ্যাকশন */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            
            {/* ফ্লোটিং ব্যাজ */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neu-inset text-indigo-600 font-medium text-xs md:text-sm animate-float-fast">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="tracking-wide">বাংলাদেশের প্রথম পিয়ার-টু-পিয়ার স্টাডি ট্র্যাকার</span>
            </div>

            {/* মেইন শিরোনাম */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              বিসিএস ও চাকরির প্রস্তুতিতে <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600">
                স্মার্ট রুটিন ও লাইভ ট্র্যাকিং
              </span>
            </h1>

            {/* সাব-টাইটেল */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              অগোছালো প্রস্তুতিকে বিদায় জানান। বন্ধুদের সাথে এক্সক্লুসিভ স্টাডি গ্রুপ তৈরি করুন, রিয়েল-টাইম সিলেবাস অগ্রগতি ট্র্যাক করুন এবং মক টেস্টের ডেটা ভিজ্যুয়ালাইজেশনের মাধ্যমে নিজের অবস্থান যাচাই করুন।
            </p>

            {/* অ্যাকশন বাটনসমূহ */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link 
                to="/signup" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl btn-glow flex items-center justify-center gap-3 font-semibold text-base"
              >
                <span>গ্রুপ তৈরি করুন বা যুক্ত হোন</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link 
                to="/groups" 
                className="w-full sm:w-auto px-8 py-4 neu-btn text-slate-700 hover:text-indigo-600 flex items-center justify-center gap-2 text-base"
              >
                <Users className="w-5 h-5 text-indigo-600" />
                <span>গ্রুপসমূহ এক্সপ্লোর করুন</span>
              </Link>
            </div>

            {/* ছোট ফিচার হাইলাইট */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/60 max-w-lg mx-auto lg:mx-0 text-slate-600">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>১০০% ফ্রি প্ল্যাটফর্ম</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>রিয়েল-টাইম ডেটা</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>প্রাইভেট স্পেস</span>
              </div>
            </div>

          </div>

          {/* ডান পাশ: ফ্লোটিং অ্যানিমেটেড UI কার্ড (Neumorphism Simulation) */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">
            
            {/* মূল ব্যাকগ্রাউন্ড কার্ড */}
            <div className="w-full max-w-md neu-card p-6 space-y-6 relative z-10 border border-white/40">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Analytics</span>
              </div>

              {/* প্রোগ্রেস সিমুলেশন */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    মাস্টার সিলেবাস ট্র্যাকার
                  </span>
                  <span className="text-indigo-600 font-bold">৭৪%</span>
                </div>
                <div className="w-full h-3 neu-inset p-0.5">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full w-[74%] transition-all duration-1000"></div>
                </div>
              </div>

              {/* মিনি স্ট্যাটস গ্রিড */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="neu-inset p-4 text-center">
                  <span className="text-xs text-slate-500 font-medium block mb-1">মোট প্রশ্ন সমাধান</span>
                  <span className="text-2xl font-black text-slate-800">১,৪৫০+</span>
                </div>
                <div className="neu-inset p-4 text-center">
                  <span className="text-xs text-slate-500 font-medium block mb-1">সাপ্তাহিক মক টেস্ট</span>
                  <span className="text-2xl font-black text-indigo-600">০৪ টি</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  ১২ জন মেম্বার অনলাইনে
                </span>
                <span>আপডেট: এইমাত্র</span>
              </div>
            </div>

            {/* ফ্লোটিং ব্যাজ ১ (উপরের ডানদিকে) */}
            <div className="absolute -top-4 -right-2 sm:-right-6 neu-card p-3.5 flex items-center gap-3 z-20 animate-float-slow border border-white/60 shadow-xl">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">লিডারবোর্ড অবস্থান</span>
                <span className="text-sm font-bold text-slate-800">টপ ৩% পারফর্মার</span>
              </div>
            </div>

            {/* ফ্লোটিং ব্যাজ ২ (নিচের বামদিকে) */}
            <div className="absolute -bottom-6 -left-2 sm:-left-6 neu-card p-3.5 flex items-center gap-3 z-20 animate-float-fast border border-white/60 shadow-xl" style={{ animationDelay: '1.5s' }}>
              <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">ডেইলি স্প্রিন্ট</span>
                <span className="text-sm font-bold text-slate-800">আজকের লক্ষ্য সম্পন্ন</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ================= FEATURES SECTION (Neumorphism Cards) ================= */}
      <div className="max-w-7xl mx-auto py-20 mt-12 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            কেন আমাদের প্ল্যাটফর্ম সেরা
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            প্রস্তুতিকে গতিশীল করতে প্রয়োজনীয় সকল টুলস এক জায়গায়
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* কার্ড ১ */}
          <div className="neu-card p-8 space-y-4 border border-white/50">
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-indigo-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">সিলেবাস ও প্রোগ্রেস বার</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              বিসিএস ও অন্যান্য সরকারি চাকরির বিশাল সিলেবাস টপিক অনুযায়ী বিভক্ত। পড়ার অগ্রগতি লাইভ গ্রাফে ট্র্যাক করুন এবং নিজের দুর্বলতা চিহ্নিত করুন।
            </p>
          </div>

          {/* কার্ড ২ */}
          <div className="neu-card p-8 space-y-4 border border-white/50">
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-violet-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">এক্সক্লুসিভ স্টাডি গ্রুপ</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ইউনিক ইনভাইট কোড দিয়ে বন্ধুদের সাথে প্রাইভেট গ্রুপ তৈরি করুন। মক টেস্টের নম্বরের ভিত্তিতে লিডারবোর্ডে সুস্থ প্রতিযোগিতার পরিবেশ তৈরি করুন।
            </p>
          </div>

          {/* কার্ড ৩ */}
          <div className="neu-card p-8 space-y-4 border border-white/50">
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-emerald-600">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">জব বোর্ড ও কাউন্টডাউন</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              সকল সার্কুলারের আপডেট ও আবেদনের শেষ তারিখের লাইভ কাউন্টডাউন এক জায়গায় পাবেন। আবেদন সম্পন্ন করা চাকরিগুলো আলাদাভাবে ট্র্যাক করুন।
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LandingPage;