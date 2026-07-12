import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Briefcase, MessageSquare, LogIn, UserPlus, Menu, LogOut, User as UserIcon } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Zustand store থেকে ইউজার ডেটা এবং লগআউট ফাংশন নেওয়া হচ্ছে
  const { user, logout } = useAuthStore();

  const navLinks = [
    { name: 'হোম', path: '/', icon: BookOpen },
    { name: 'স্টাডি গ্রুপ', path: '/groups', icon: Users },
    { name: 'জব বোর্ড', path: '/jobs', icon: Briefcase },
    { name: 'অভিজ্ঞতা ফোরাম', path: '/feed', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f0f4f8]/80 backdrop-blur-md border-b border-white/60 transition-all duration-300">
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

          {/* ডানপাশের বাটনসমূহ (ডেস্কটপ ভিউ) */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              /* ================= ইউজার লগইন থাকলে যা দেখাবে ================= */
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 p-1.5 pr-3.5 rounded-2xl neu-btn group transition-all">
                  <div className="w-8 h-8 rounded-xl neu-inset p-0.5 overflow-hidden flex items-center justify-center bg-white/80 border border-white">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                      {user.name?.split(' ')[0] || 'ইউজার'}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">অনলাইন</span>
                  </div>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl neu-btn text-slate-500 hover:text-rose-600 transition-colors"
                  title="লগআউট করুন"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* ================= ইউজার লগইন না থাকলে যা দেখাবে ================= */
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                  <span>লগইন</span>
                </Link>
                <Link 
                  to="/signup" 
                  className="px-5 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>ফ্রি অ্যাকাউন্ট খুলুন</span>
                </Link>
              </>
            )}
          </div>

          {/* মোবাইল মেনু বাটন (Mobile Dropdown with Soft UI) */}
          <div className="md:hidden flex items-center gap-2">
            {/* মোবাইলে ছোট করে ইউজারের ছবি দেখাবে (লগইন থাকলে) */}
            {user && (
              <Link to="/profile" className="w-9 h-9 rounded-xl neu-inset p-0.5 overflow-hidden flex items-center justify-center bg-white/80 border border-white">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <UserIcon className="w-4 h-4 text-indigo-600" />
                )}
              </Link>
            )}

            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="p-2.5 rounded-xl neu-btn text-slate-700 hover:text-indigo-600 focus:outline-none">
                <Menu className="w-5 h-5" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[100] menu p-3 mt-3 shadow-2xl neu-card bg-[#f0f4f8] rounded-2xl w-64 border border-white/80 space-y-1">
                
                {user ? (
                  /* মোবাইল ডাইনামিক হেডার (লগইন থাকলে) */
                  <div className="px-3 py-2.5 border-b border-slate-200/60 mb-1 neu-inset rounded-xl bg-white/40">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">লগইন করা হয়েছে</span>
                    <span className="text-xs font-extrabold text-slate-800 truncate block mt-0.5">{user.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 truncate block">{user.email}</span>
                  </div>
                ) : (
                  <div className="px-3 py-2 border-b border-slate-200/60 mb-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">মেনু নেভিগেশন</span>
                  </div>
                )}

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
                  {user ? (
                    /* মোবাইল লগআউট বাটন */
                    <li>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl neu-btn text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>লগআউট করুন</span>
                      </button>
                    </li>
                  ) : (
                    /* মোবাইল লগইন ও সাইনআপ বাটন */
                    <>
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
                    </>
                  )}
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