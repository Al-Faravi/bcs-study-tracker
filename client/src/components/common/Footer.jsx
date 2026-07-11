import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ArrowUpRight, Globe, Mail, Sparkles } from 'lucide-react';
import { FaLinkedin, FaFacebook, FaGithub } from 'react-icons/fa'; // এখান থেকে সোশ্যাল আইকন নিচ্ছি

const Footer = () => {
  return (
    <footer className="bg-[#f0f4f8] border-t border-white/80 pt-16 pb-10 text-slate-600 mt-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/60">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-xl neu-inset p-1.5 flex items-center justify-center bg-white/60 border border-white shadow-sm">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-1">
                  BCS Tracker <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Study & Analytics</span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              বাংলাদেশের চাকরিপ্রার্থীদের জন্য তৈরি প্রথম পিয়ার-টু-পিয়ার স্টাডি ট্র্যাকিং প্ল্যাটফর্ম।
            </p>
          </div>

          {/* মেনু লিংকস */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">প্ল্যাটফর্ম</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li><Link to="/" className="hover:text-indigo-600">হোমপেজ</Link></li>
              <li><Link to="/groups" className="hover:text-indigo-600">স্টাডি গ্রুপ</Link></li>
              <li><Link to="/jobs" className="hover:text-indigo-600">জব বোর্ড</Link></li>
              <li><Link to="/feed" className="hover:text-indigo-600">ফোরাম</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">রিসোর্স</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li><a href="#" className="hover:text-indigo-600">সিলেবাস গাইড</a></li>
              <li><a href="#" className="hover:text-indigo-600">বিগত প্রশ্ন</a></li>
              <li><a href="#" className="hover:text-indigo-600">মডেল টেস্ট</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">স্ট্যাটাস</h4>
            <div className="neu-inset p-4 rounded-2xl bg-white/20">
              <span className="text-xs font-bold text-emerald-600">সার্ভার অনলাইন</span>
            </div>
          </div>
        </div>

        {/* সিগনেচার */}
        <div className="pt-8 flex flex-col lg:flex-row justify-between items-center gap-6 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>কপিরাইট © ২০২৬ BCS Tracker.</span>
          </div>
          
          <div className="neu-card px-5 py-3 rounded-2xl border border-white/80 bg-white/40 flex flex-wrap items-center justify-center gap-4 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Designed by </span>
              <a href="https://www.linkedin.com/in/md-shakawat-hossain-faravi/" className="text-indigo-600 underline">MD. Shakawat Hossain Faravi</a>
            </div>
            <div className="flex items-center gap-3 border-l border-slate-300/60 pl-3">
              <a href="https://www.linkedin.com/in/md-shakawat-hossain-faravi/" className="text-slate-600 hover:text-[#0a66c2] text-lg"><FaLinkedin /></a>
              <a href="https://github.com/Al-Faravi" className="text-slate-600 hover:text-slate-950 text-lg"><FaGithub /></a>
              <a href="https://www.facebook.com/faravi.hossain/" className="text-slate-600 hover:text-[#0866ff] text-lg"><FaFacebook /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;