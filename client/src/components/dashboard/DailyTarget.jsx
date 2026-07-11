import React, { useState } from 'react';
import { Target, Clock, BookOpen, TrendingUp, CheckCircle2, Circle, Plus, Calendar, Check, AlertCircle } from 'lucide-react';

const initialTargets = [
  {
    id: 1,
    title: "আজকের স্প্রিন্ট - বাংলা সাহিত্য ও বিজ্ঞান রিভিশন",
    duration: "1 Day",
    date: "আজকে রাত ১১টার মধ্যে সমাপ্ত করতে হবে",
    book: "এমপিথ্রি (MP3) - বাংলাদেশ বিষয়াবলি",
    mockPlan: "১টি লাইভ মডেল টেস্ট (১০০ মার্কস)",
    details: "বিগত ১০ বছরের বিসিএস প্রিলিমিনারি প্রশ্নের ব্যাখ্যাসহ সমাধান করতে হবে।",
    topics: [
      { id: 101, name: "রবীন্দ্রনাথ ঠাকুর ও কাজী নজরুল ইসলামের সাহিত্যকর্ম", completed: true },
      { id: 102, name: "আলোর প্রকৃতি, লেন্স ও দর্পণ সম্পর্কিত গাণিতিক সমস্যা", completed: true },
      { id: 103, name: "ইংরেজি Idioms & Phrases (A to D পর্যন্ত মুখস্থ)", completed: false },
    ]
  },
  {
    id: 2,
    title: "সাপ্তাহিক টার্গেট - গণিত ও মানসিক দক্ষতা বুস্ট",
    duration: "7 Days",
    date: "এই সপ্তাহের জন্য নির্ধারিত",
    book: "এসুরেন্স (Assurance) ডাইজেস্ট",
    mockPlan: "৩টি বিষয়ভিত্তিক মডেল টেস্ট",
    details: "গণিতের পাটিগণিত অংশ সম্পূর্ণ শেষ করা এবং মানসিক দক্ষতার চিত্র সমস্যা সমাধান।",
    topics: [
      { id: 201, name: "শতকরা, লাভ-ক্ষতি ও সুদের হারের শর্টকাট টেকনিক", completed: true },
      { id: 202, name: "বীজগাণিতিক সূত্রাবলি ও উৎপাদকে বিশ্লেষণ", completed: false },
      { id: 203, name: "মানসিক দক্ষতা: ঘড়ির কাঁটা ও ক্যালেন্ডার সংক্রান্ত সমস্যা", completed: false },
      { id: 204, name: "ইংরেজি Literature-এর Romantic Period রিভিশন", completed: false },
    ]
  }
];

const DailyTarget = () => {
  const [targets, setTargets] = useState(initialTargets);
  const [selectedDuration, setSelectedDuration] = useState('All');

  // নতুন টার্গেট ফর্ম স্টেট
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('1 Day');
  const [newBook, setNewBook] = useState('এমপিথ্রি (MP3) সিরিজ');
  const [newMockPlan, setNewMockPlan] = useState('১টি মডেল টেস্ট');
  const [newDetails, setNewDetails] = useState('');
  const [newTopicsInput, setNewTopicsInput] = useState('');

  const handleTopicToggle = (targetId, topicId) => {
    const updatedTargets = targets.map((t) => {
      if (t.id === targetId) {
        return {
          ...t,
          topics: t.topics.map((top) => 
            top.id === topicId ? { ...top, completed: !top.completed } : top
          )
        };
      }
      return t;
    });
    setTargets(updatedTargets);
  };

  const handleCreateTarget = (e) => {
    e.preventDefault();
    const topicArray = newTopicsInput.split(',').map((item, idx) => ({
      id: Date.now() + idx,
      name: item.trim(),
      completed: false
    })).filter(item => item.name !== '');

    if (topicArray.length === 0) {
      alert("কমপক্ষে ১টি পড়ার টপিক প্রদান করুন (কমা দিয়ে আলাদা করুন)!");
      return;
    }

    const newTargetObj = {
      id: Date.now(),
      title: newTitle,
      duration: newDuration,
      date: newDuration === '1 Day' ? 'আজকের জন্য' : `আগামী ${newDuration} এর জন্য`,
      book: newBook,
      mockPlan: newMockPlan,
      details: newDetails,
      topics: topicArray
    };

    setTargets([newTargetObj, ...targets]);
    setNewTitle('');
    setNewDetails('');
    setNewTopicsInput('');
    document.getElementById('add_target_modal').close();
  };

  const filteredTargets = selectedDuration === 'All' 
    ? targets 
    : targets.filter(t => t.duration === selectedDuration);

  return (
    <div className="space-y-8">
      
      {/* ================= HEADER & TIMEFRAME FILTER ================= */}
      <div className="neu-card p-4 sm:p-6 border border-white/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="font-bold text-xs sm:text-sm text-slate-500 mr-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            টাইমফ্রেম ফিল্টার:
          </span>
          {['All', '1 Day', '7 Days', '15 Days', '30 Days'].map((dur) => (
            <button
              key={dur}
              onClick={() => setSelectedDuration(dur)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDuration === dur 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                  : 'neu-btn text-slate-600 hover:text-indigo-600'
              }`}
            >
              {dur === 'All' ? 'সকল টার্গেট' : dur === '1 Day' ? '১ দিন (Daily Sprint)' : dur}
            </button>
          ))}
        </div>

        <button 
          onClick={() => document.getElementById('add_target_modal').showModal()}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl btn-glow flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন টার্গেট সেট করুন</span>
        </button>
      </div>

      {/* ================= TARGET CARDS GRID ================= */}
      {filteredTargets.length === 0 ? (
        <div className="neu-card p-16 text-center text-slate-400 border border-white/50 space-y-2">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-base">এই টাইমফ্রেমের জন্য কোনো টার্গেট সেট করা হয়নি।</p>
          <p className="text-xs">উপরের বাটন থেকে নতুন টার্গেট সেট করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTargets.map((target) => {
            const totalTopics = target.topics.length;
            const completedTopics = target.topics.filter(t => t.completed).length;
            const progress = Math.round((completedTopics / totalTopics) * 100) || 0;
            const isAllDone = progress === 100;

            return (
              <div 
                key={target.id} 
                className={`neu-card p-6 border transition-all duration-300 flex flex-col justify-between ${
                  isAllDone ? 'border-emerald-500/40 bg-gradient-to-br from-[#f0f4f8] to-emerald-50/30' : 'border-white/50'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Card Header & Badge */}
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-3 py-1 rounded-full neu-inset text-indigo-600 font-bold text-[11px] uppercase tracking-wider">
                      {target.duration} Sprint
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {target.date}
                    </span>
                  </div>

                  {/* Title & Details */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{target.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 bg-white/40 p-2.5 rounded-xl border border-white/60 leading-relaxed italic">
                      "{target.details}"
                    </p>
                  </div>

                  {/* Meta Info Box */}
                  <div className="grid grid-cols-2 gap-3 text-xs neu-inset p-3 border border-white/30">
                    <div>
                      <span className="text-slate-400 font-semibold flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        নির্ধারিত বই:
                      </span>
                      <p className="font-bold text-slate-800 truncate mt-0.5">{target.book}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                        মক টেস্ট প্ল্যান:
                      </span>
                      <p className="font-bold text-slate-800 truncate mt-0.5">{target.mockPlan}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className={isAllDone ? 'text-emerald-600' : 'text-slate-500'}>
                        {isAllDone ? 'স্প্রিন্ট সম্পন্ন হয়েছে' : 'অগ্রগতি (Progress):'}
                      </span>
                      <span className="text-slate-800">{completedTopics}/{totalTopics} সমাপ্ত ({progress}%)</span>
                    </div>
                    <div className="w-full h-2 neu-inset p-0.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isAllDone ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      চেকলিস্ট (পড়া শেষ হলে টিক দিন):
                    </span>
                    <div className="space-y-1.5">
                      {target.topics.map((top) => (
                        <div 
                          key={top.id}
                          onClick={() => handleTopicToggle(target.id, top.id)}
                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                            top.completed ? 'bg-emerald-50/60 text-slate-400' : 'hover:bg-white/50 text-slate-700 font-medium'
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {top.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 hover:text-indigo-600" />
                            )}
                          </div>
                          <span className={`text-xs sm:text-sm leading-snug ${top.completed ? 'line-through font-normal' : ''}`}>
                            {top.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: ADD NEW TARGET ================= */}
      <dialog id="add_target_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 border border-white/80 max-w-lg bg-[#f0f4f8]">
          <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>নতুন স্টাডি টার্গেট সেট করুন</span>
          </h3>
          
          <form onSubmit={handleCreateTarget} className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">টার্গেটের শিরোনাম / উদ্দেশ্য</label>
              <input type="text" placeholder="যেমন: আজকের বাংলা ও বিজ্ঞান স্প্রিন্ট" className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">সময়সীমা (Duration)</label>
                <select className="w-full px-3 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newDuration} onChange={(e)=>setNewDuration(e.target.value)}>
                  <option value="1 Day">1 Day (Daily Sprint)</option>
                  <option value="7 Days">7 Days (Weekly)</option>
                  <option value="15 Days">15 Days (Bi-weekly)</option>
                  <option value="30 Days">30 Days (Monthly)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">মক টেস্ট প্ল্যান</label>
                <input type="text" placeholder="যেমন: ২টি লাইভ টেস্ট" className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newMockPlan} onChange={(e)=>setNewMockPlan(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">নির্ধারিত বই বা রিসোর্স</label>
              <select className="w-full px-3 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newBook} onChange={(e)=>setNewBook(e.target.value)}>
                <option>এমপিথ্রি (MP3) - বাংলাদেশ বিষয়াবলি</option>
                <option>এসুরেন্স (Assurance) ডাইজেস্ট</option>
                <option>ইংলিশ ফর কমপিটিটিভ এক্সামস</option>
                <option>অন্যান্য / নিজের নোটবুক</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">পড়ার টপিকসমূহ (কমা [,] দিয়ে আলাদা করুন)</label>
              <textarea 
                placeholder="যেমন: রবীন্দ্রনাথ ঠাকুর, আলোর প্রকৃতি, পার্টস অফ স্পিচ" 
                className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm h-20 focus:outline-none"
                value={newTopicsInput}
                onChange={(e)=>setNewTopicsInput(e.target.value)}
                required
              ></textarea>
              <span className="text-[11px] text-slate-400 mt-0.5 block">টিপস: প্রতিটি কমা (,) একটি নতুন চেকলিস্ট আইটেম তৈরি করবে।</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">বিস্তারিত নোট বা স্ট্র্যাটেজি</label>
              <input type="text" placeholder="যেমন: রাত ১০টার মধ্যে শেষ করে মক টেস্ট দিতে হবে" className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newDetails} onChange={(e)=>setNewDetails(e.target.value)} />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/60">
              <button type="button" className="px-5 py-2 rounded-xl neu-btn text-xs font-semibold text-slate-600" onClick={()=>document.getElementById('add_target_modal').close()}>Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl btn-glow text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Save Target</span>
              </button>
            </div>
          </form>
        </div>
      </dialog>

    </div>
  );
};

export default DailyTarget;