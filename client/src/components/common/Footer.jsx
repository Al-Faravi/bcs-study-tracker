import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { FaLinkedin, FaFacebook, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-20 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-base-300">
          
          {/* ক্লিন ব্র্যান্ড সেকশন */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img 
                src="/logo.png" 
                alt="BCS Tracker Logo" 
                className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight text-primary">BCS Tracker</h2>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-base-content/60">
                  Study & Analytics Portal
                </p>
              </div>
            </Link>
            
            <p className="text-sm text-base-content/70 leading-relaxed max-w-sm">
              বাংলাদেশের চাকরিপ্রার্থীদের জন্য তৈরি প্রথম পিয়ার-টু-পিয়ার স্টাডি ট্র্যাকিং প্ল্যাটফর্ম। একসাথে শিখুন, নিজেকে ছাড়িয়ে যান।
            </p>

            {/* সোশ্যাল লিংকস */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.linkedin.com/in/md-shakawat-hossain-faravi/" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-circle btn-sm btn-ghost hover:bg-[#0a66c2] hover:text-white transition-colors"
              >
                <FaLinkedin size={18} />
              </a>
              <a 
                href="https://github.com/Al-Faravi" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-circle btn-sm btn-ghost hover:bg-neutral hover:text-neutral-content transition-colors"
              >
                <FaGithub size={18} />
              </a>
              <a 
                href="https://www.facebook.com/faravi.hossain/" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-circle btn-sm btn-ghost hover:bg-[#0866ff] hover:text-white transition-colors"
              >
                <FaFacebook size={18} />
              </a>
            </div>
          </div>

          {/* মেনু লিংকস */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-base-content">প্ল্যাটফর্ম</h4>
            <ul className="space-y-3 text-sm text-base-content/70">
              <li><Link to="/" className="hover:text-primary transition-colors">হোমপেজ</Link></li>
              <li><Link to="/groups" className="hover:text-primary transition-colors">স্টাডি গ্রুপ</Link></li>
              <li><Link to="/jobs" className="hover:text-primary transition-colors">জব বোর্ড</Link></li>
              <li><Link to="/feed" className="hover:text-primary transition-colors">ফোরাম</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-base-content">রিসোর্স</h4>
            <ul className="space-y-3 text-sm text-base-content/70">
              <li><a href="#" className="hover:text-primary transition-colors">সিলেবাস গাইড</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">বিগত প্রশ্ন</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">মডেল টেস্ট</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-base-content">স্ট্যাটাস</h4>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
              </span>
              <span className="text-xs font-semibold text-success">সার্ভার অনলাইন</span>
            </div>
          </div>
        </div>

        {/* বটম কপিরাইট ও সিগনেচার সেকশন */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-base-content/70">
          <div>
            &copy; {new Date().getFullYear()} BCS Tracker. All rights reserved.
          </div>
          
          <div className="flex items-center gap-1.5">
            <span>Designed & Developed with</span>
            <Heart className="w-4 h-4 text-error fill-current animate-pulse" />
            <span>by</span>
            <a 
              href="https://www.linkedin.com/in/md-shakawat-hossain-faravi/" 
              target="_blank" 
              rel="noreferrer" 
              className="font-bold text-primary hover:underline"
            >
              MD. Shakawat Hossain Faravi
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;