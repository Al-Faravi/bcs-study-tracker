import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BarChart2, Target, BookOpen, TrendingUp, MessageSquare, 
  Users, ShieldCheck, Activity, ChevronRight 
} from 'lucide-react';

import SyllabusTracker from '../components/dashboard/SyllabusTracker';
import DailyTarget from '../components/dashboard/DailyTarget';
import ResourceHub from '../components/groups/ResourceHub';
import ResultEntryForm from '../components/mockTest/ResultEntryForm';
import PersonalChart from '../components/mockTest/PersonalChart';
import GroupChat from '../components/chat/GroupChat';

// প্রাথমিক মক টেস্ট হিস্ট্রি (ডামি ডেটা)
const initialHistory = [
  { id: 1, date: '01/07', examName: 'মডেল টেস্ট-১', subject: 'পূর্ণাঙ্গ মডেল টেস্ট', totalMarks: 200, attempted: 160, obtained: 115 },
  { id: 2, date: '03/07', examName: 'মডেল টেস্ট-২', subject: 'পূর্ণাঙ্গ মডেল টেস্ট', totalMarks: 200, attempted: 170, obtained: 124 },
  { id: 3, date: '05/07', examName: 'মডেল টেস্ট-৩', subject: 'পূর্ণাঙ্গ মডেল টেস্ট', totalMarks: 200, attempted: 165, obtained: 118 },
  { id: 4, date: '08/07', examName: 'মডেল টেস্ট-৪', subject: 'পূর্ণাঙ্গ মডেল টেস্ট', totalMarks: 200, attempted: 180, obtained: 135 },
];

const GroupDashboard = () => {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('syllabus');
  const [mockHistory, setMockHistory] = useState(initialHistory);

  const handleAddResult = (newResult) => {
    setMockHistory([...mockHistory, newResult]);
  };

  // ট্যাব কনফিগারেশন (ইমুজি ছাড়া, ভেক্টর আইকনে)
  const tabs = [
    { id: 'syllabus', name: 'সিলেবাস ট্র্যাকার', icon: BarChart2 },
    { id: 'target', name: 'ডেইলি স্প্রিন্ট', icon: Target },
    { id: 'library', name: 'রিসোর্স ও ক্লাস হাব', icon: BookOpen },
    { id: 'mock', name: 'মক টেস্ট অ্যানালিটিক্স', icon: TrendingUp },
    { id: 'chat', name: 'গ্রুপ ডিসকাশন', icon: MessageSquare },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f4f8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= TOP BANNER (Neumorphic Card) ================= */}
        <div className="neu-card p-6 border border-white/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                ৪৬তম বিসিএস প্রিলি ফাইটার্স
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                সক্রিয় গ্রুপ
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                গ্রুপ আইডি: #{groupId || '101'}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                ১২ জন সক্রিয় মেম্বার
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" />
                এডমিন: Faravi
              </span>
            </div>
          </div>

          {/* ডানপাশ: কুইক অ্যাকশন বা নোটিফিকেশন ব্যাজ */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 neu-inset px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-600">আজকের স্প্রিন্ট টার্গেট:</span>
            <span className="text-xs font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-lg shadow-sm">
              ৮০% সম্পন্ন
            </span>
          </div>
        </div>

        {/* ================= NEUMORPHIC TAB SWITCHER ================= */}
        <div className="neu-inset p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                <span className="truncate">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* ================= DYNAMIC TAB CONTENT ================= */}
        <div className="transition-opacity duration-300">
          {activeTab === 'syllabus' && <SyllabusTracker />}
          
          {activeTab === 'target' && <DailyTarget />}

          {activeTab === 'library' && <ResourceHub />}

          {activeTab === 'mock' && (
            <div className="space-y-8">
              <ResultEntryForm onAddResult={handleAddResult} />
              <PersonalChart myHistory={mockHistory} />
              
              {/* সাম্প্রতিক রেজাল্ট টেবিল (Modern Clean Style) */}
              <div className="neu-card p-6 border border-white/50">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>সাম্প্রতিক মক টেস্টের ফলাফল</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        <th className="pb-3">তারিখ</th>
                        <th className="pb-3">পরীক্ষার নাম</th>
                        <th className="pb-3">বিষয়</th>
                        <th className="pb-3 text-center">মোট নম্বর</th>
                        <th className="pb-3 text-center">উত্তর করেছেন</th>
                        <th className="pb-3 text-right">প্রাপ্ত নম্বর</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 text-sm font-medium text-slate-700">
                      {mockHistory.map((row) => (
                        <tr key={row.id} className="hover:bg-white/40 transition-colors">
                          <td className="py-3.5 text-slate-500 text-xs">{row.date}</td>
                          <td className="py-3.5 font-bold text-slate-900">{row.examName}</td>
                          <td className="py-3.5">
                            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-200/70 text-slate-700">
                              {row.subject}
                            </span>
                          </td>
                          <td className="py-3.5 text-center text-slate-600">{row.totalMarks}</td>
                          <td className="py-3.5 text-center text-slate-600">{row.attempted}</td>
                          <td className="py-3.5 text-right font-black text-indigo-600 text-base">{row.obtained}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && <GroupChat />}
        </div>

      </div>
    </div>
  );
};

export default GroupDashboard;