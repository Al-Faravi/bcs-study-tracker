import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

const CountdownTimer = ({ targetDate = "2026-08-15T00:00:00", title = "পরবর্তী টার্গেট ডেডলাইন" }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="neu-card p-4 border border-rose-300/60 bg-rose-50/40 flex items-center justify-center gap-2 text-rose-700 text-xs sm:text-sm font-bold">
        <AlertCircle className="w-4 h-4 text-rose-600" />
        <span>নির্ধারিত সময়সীমা (Deadline) সমাপ্ত হয়েছে</span>
      </div>
    );
  }

  return (
    <div className="neu-card p-5 sm:p-6 border border-white/60 space-y-4">
      
      {/* টাইমার হেডার */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl neu-inset text-indigo-600">
            <Clock className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">{title}</span>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset text-[11px] font-semibold text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>{new Date(targetDate).toLocaleDateString('bn-BD')}</span>
        </div>
      </div>

      {/* ৩ডি ইনসেট কাউন্টডাউন বক্স */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        
        {/* দিন */}
        <div className="neu-inset p-3 sm:p-4 rounded-2xl border border-white/40">
          <span className="text-xl sm:text-3xl font-black text-indigo-600 block leading-none">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1.5 block">
            দিন
          </span>
        </div>

        {/* ঘণ্টা */}
        <div className="neu-inset p-3 sm:p-4 rounded-2xl border border-white/40">
          <span className="text-xl sm:text-3xl font-black text-slate-800 block leading-none">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1.5 block">
            ঘণ্টা
          </span>
        </div>

        {/* মিনিট */}
        <div className="neu-inset p-3 sm:p-4 rounded-2xl border border-white/40">
          <span className="text-xl sm:text-3xl font-black text-slate-800 block leading-none">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1.5 block">
            মিনিট
          </span>
        </div>

        {/* সেকেন্ড */}
        <div className="neu-inset p-3 sm:p-4 rounded-2xl border border-white/40">
          <span className="text-xl sm:text-3xl font-black text-indigo-600 block leading-none">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1.5 block">
            সেকেন্ড
          </span>
        </div>

      </div>

    </div>
  );
};

export default CountdownTimer;