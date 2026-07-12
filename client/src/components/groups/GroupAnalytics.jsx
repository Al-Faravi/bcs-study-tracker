import React from 'react';
import { Award, TrendingUp, Clock, CheckCircle, Flame, Trophy, BarChart2 } from 'lucide-react';

const GroupAnalytics = ({ members = [] }) => {
  // ডেমো সাপ্তাহিক পড়াশোনার ঘণ্টা
  const weeklyStudyHours = [
    { day: 'শনি', hours: 5, percentage: '60%' },
    { day: 'রবি', hours: 7, percentage: '85%' },
    { day: 'সোম', hours: 8, percentage: '100%' },
    { day: 'মঙ্গল', hours: 6, percentage: '75%' },
    { day: 'বুধ', hours: 4, percentage: '50%' },
    { day: 'বৃহঃ', hours: 7.5, percentage: '90%' },
    { day: 'শুক্র', hours: 9, percentage: '100%' },
  ];

  // ডেমো লিডারবোর্ড
  const leaderboard = [
    { rank: 1, name: 'শাকাওয়াত হোসেন', targetCompleted: '২৮/৩০', score: '৯৪%', streak: '১২ দিন', badge: '🥇 Top Performer' },
    { rank: 2, name: 'তানিয়া আক্তার', targetCompleted: '২৫/৩০', score: '৮৩%', streak: '৯ দিন', badge: '🥈 Consistent' },
    { rank: 3, name: 'রহিম উদ্দিন', targetCompleted: '২২/৩০', score: '৭৩%', streak: '৫ দিন', badge: '🥉 Rising Star' },
    { rank: 4, name: 'কামরুল হাসান', targetCompleted: '১৮/৩০', score: '৬০%', streak: '৩ দিন', badge: 'Active' },
  ];

  return (
    <div className="space-y-8">
      
      {/* কুইক স্ট্যাটাস কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl neu-card bg-white/40 border border-white/80 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl neu-inset text-indigo-600 bg-indigo-50/50">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">গ্রুপের মোট স্টাডি ঘণ্টা</span>
            <h4 className="text-2xl font-extrabold text-slate-800">৪৬৫ ঘণ্টা</h4>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> গত সপ্তাহের চেয়ে +১২% বেশি
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl neu-card bg-white/40 border border-white/80 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl neu-inset text-emerald-600 bg-emerald-50/50">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">টার্গেট সফলতার হার</span>
            <h4 className="text-2xl font-extrabold text-slate-800">৮৮.৫%</h4>
            <span className="text-[10px] font-bold text-slate-500">গড় সিলেবাস কমপ্লিশন</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl neu-card bg-white/40 border border-white/80 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl neu-inset text-amber-500 bg-amber-50/50">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">সেরা স্টাডি স্ট্রিক</span>
            <h4 className="text-2xl font-extrabold text-slate-800">১২ দিন</h4>
            <span className="text-[10px] font-bold text-amber-600">টানা পড়ার রেকর্ড</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* বাম পাশে: সাপ্তাহিক স্টাডি প্রগ্রেস বার চার্ট */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl neu-card bg-white/40 border border-white/80 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600" />
                <span>সাপ্তাহিক পড়ার গ্রাফ (Daily Study Hours)</span>
              </h3>
              <p className="text-xs text-slate-500">চলতি সপ্তাহের প্রতিদিনের গড় পড়াশোনার সময় ও প্রগ্রেস</p>
            </div>
            <span className="px-3 py-1 rounded-xl neu-inset text-xs font-extrabold text-indigo-600">
              গড়: ৬.৬ ঘণ্টা/দিন
            </span>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-8 px-2">
            {weeklyStudyHours.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[11px] font-extrabold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.hours} ঘণ্টা
                </span>
                <div className="w-full max-w-[40px] bg-slate-200/50 rounded-2xl neu-inset p-1 flex items-end h-full">
                  <div 
                    style={{ height: item.percentage }} 
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-xl shadow-md group-hover:brightness-110 transition-all duration-500"
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-600 mt-1">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ডান পাশে: লিডারবোর্ড */}
        <div className="p-6 sm:p-8 rounded-3xl neu-card bg-white/40 border border-white/80 space-y-6">
          <div className="border-b border-slate-200/60 pb-4">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>সাপ্তাহিক লিডারবোর্ড</span>
            </h3>
            <p className="text-xs text-slate-500">সবচেয়ে বেশি টার্গেট সম্পন্নকারী সদস্যবৃন্দ</p>
          </div>

          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div key={user.rank} className="p-3.5 rounded-2xl neu-inset bg-white/50 border border-white/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl font-extrabold text-xs flex items-center justify-center shadow-sm ${
                    user.rank === 1 ? 'bg-amber-400 text-white' : user.rank === 2 ? 'bg-slate-300 text-slate-800' : 'bg-amber-700 text-white'
                  }`}>
                    #{user.rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">{user.name}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold">টার্গেট: {user.targetCompleted} ({user.streak})</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-indigo-600 px-2.5 py-1 rounded-lg bg-indigo-50">
                  {user.score}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default GroupAnalytics;