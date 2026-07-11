import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const Loader = ({ size = "md", text = "ডেটা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." }) => {
  
  // সাইজ নির্ধারণ
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[200px] w-full">
      
      {/* ৩ডি গ্লোয়িং লোডার কন্টেইনার */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse"></div>
        
        <div className="p-4 rounded-2xl neu-card border border-white/80 relative z-10 flex items-center justify-center shadow-lg">
          <Loader2 className={`${sizeClasses[size]} text-indigo-600 animate-spin`} />
        </div>
      </div>

      {/* লোডিং টেক্সট */}
      {text && (
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{text}</span>
        </div>
      )}

    </div>
  );
};

export default Loader;