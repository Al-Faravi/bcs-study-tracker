import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, Briefcase, MessageSquare, LogIn, UserPlus, Menu } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'হোম', path: '/', icon: BookOpen },
    { name: 'স্টাডি গ্রুপ', path: '/groups', icon: Users },
    { name: 'জব বোর্ড', path: '/jobs', icon: Briefcase },
    { name: 'অভিজ্ঞতা ফোরাম', path: '/feed', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#f0f4f8]/80 backdrop-blur-md border-b border-white/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* লোগো ও ব্র্যান্ড নেম (SaaS-Grade Glow Badge) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-none text-slate-900 tracking-tight flex items-center gap-1">
                BCS Tracker
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">
                Study & Analytics
              </span>
            </div>
          </Link>

          {/* ডেস্কটপ মেনু (SaaS-Grade Neumorphic Pill Container) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 neu-inset rounded-full border border-white/40">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-[1.02]' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ডানপাশের বাটনসমূহ (Neumorphic & Glow Buttons) */}
          <div className="hidden sm:flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              <span>লগইন</span>
            </Link>
            <Link 
              to="/signup" 
              className="px-5 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>ফ্রি অ্যাকাউন্ট খুলুন</span>
            </Link>
          </div>

          {/* মোবাইল মেনু বাটন (Mobile Dropdown with Soft UI) */}
          <div className="md:hidden flex items-center">
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="p-2.5 rounded-xl neu-btn text-slate-700 hover:text-indigo-600 focus:outline-none">
                <Menu className="w-5 h-5" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[100] menu p-3 mt-3 shadow-2xl neu-card bg-[#f0f4f8] rounded-2xl w-64 border border-white/80 space-y-1">
                <div className="px-3 py-2 border-b border-slate-200/60 mb-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">মেনু নেভিগেশন</span>
                </div>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.path}>
                      <Link 
                        to={link.path} 
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                          isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/60'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <div className="border-t border-slate-200/60 my-2 pt-2 space-y-2">
                  <li>
                    <Link to="/login" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl neu-btn text-xs font-bold text-slate-700 text-center">
                      <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                      <span>লগইন করুন</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl btn-glow text-xs font-bold text-white text-center shadow-md">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>ফ্রি অ্যাকাউন্ট খুলুন</span>
                    </Link>
                  </li>
                </div>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;