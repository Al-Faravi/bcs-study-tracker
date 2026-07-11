import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Layers, Award, BookOpen, ChevronDown } from 'lucide-react';

const bcsSyllabusData = [
  {
    id: 1,
    subject: "১. বাংলা ভাষা ও সাহিত্য (মান: ৩৫)",
    topics: [
      { id: 101, name: "প্রাচীন ও মধ্যযুগ (চর্যাপদ, শ্রীকৃষ্ণকীর্তন, মঙ্গলকাব্য)", completed: true },
      { id: 102, name: "আধুনিক যুগ (রবীন্দ্রনাথ ঠাকুর, কাজী নজরুল ইসলাম)", completed: true },
      { id: 103, name: "বাংলা ব্যাকরণ (ধ্বনি, শব্দ, বাক্য, সমাস, কারক)", completed: false },
      { id: 104, name: "পারিভাষিক শব্দ, বাগধারা ও প্রবাদ-প্রবচন", completed: false },
    ]
  },
  {
    id: 2,
    subject: "২. ইংরেজি ভাষা ও সাহিত্য (মান: ৩৫)",
    topics: [
      { id: 201, name: "Parts of Speech, Tense, Voice & Narration", completed: true },
      { id: 202, name: "Idioms & Phrases, Synonyms & Antonyms", completed: false },
      { id: 203, name: "English Literature: Romantic & Victorian Period", completed: true },
      { id: 204, name: "English Literature: Modern Period & William Shakespeare", completed: false },
    ]
  },
  {
    id: 3,
    subject: "৩. বাংলাদেশ বিষয়াবলি (মান: ৩০)",
    topics: [
      { id: 301, name: "বাংলাদেশের ভূপ্রকৃতি ও ইতিহাস (১৯৪৭-১৯৭১)", completed: true },
      { id: 302, name: "মুক্তিযুদ্ধ ও জাতির পিতা বঙ্গবন্ধু শেখ মুজিবুর রহমান", completed: true },
      { id: 303, name: "বাংলাদেশের সংবিধান ও প্রশাসনিক কাঠামো", completed: false },
      { id: 304, name: "বাংলাদেশের অর্থনীতি, কৃষি ও সম্পদ", completed: false },
    ]
  },
  {
    id: 4,
    subject: "৪. আন্তর্জাতিক বিষয়াবলি (মান: ২০)",
    topics: [
      { id: 401, name: "বৈশ্বিক ইতিহাস, ভূ-রাজনীতি ও আন্তর্জাতিক সম্পর্ক", completed: false },
      { id: 402, name: "জাতিসংঘ ও বিভিন্ন আন্তর্জাতিক সংস্থা/সংগঠন", completed: true },
      { id: 403, name: "আন্তর্জাতিক চুক্তি, সম্মেলন ও পরিবেশগত ইস্যু", completed: false },
    ]
  }
];

const SyllabusTracker = () => {
  const [syllabus, setSyllabus] = useState(bcsSyllabusData);
  const [openSubject, setOpenSubject] = useState(1); // ডিফল্টভাবে ১ নম্বর বিষয় ওপেন থাকবে

  const handleCheckboxChange = (subjectId, topicId) => {
    const updatedSyllabus = syllabus.map((sub) => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          topics: sub.topics.map((t) => 
            t.id === topicId ? { ...t, completed: !t.completed } : t
          )
        };
      }
      return sub;
    });
    setSyllabus(updatedSyllabus);
  };

  const totalTopics = syllabus.reduce((acc, curr) => acc + curr.topics.length, 0);
  const completedTopics = syllabus.reduce((acc, curr) => 
    acc + curr.topics.filter(t => t.completed).length, 0
  );
  const progressPercentage = Math.round((completedTopics / totalTopics) * 100) || 0;

  return (
    <div className="space-y-8">
      
      {/* ================= HERO PROGRESS CARD ================= */}
      <div className="neu-card p-6 sm:p-8 border border-white/60 relative overflow-hidden bg-gradient-to-br from-[#f0f4f8] to-[#e2e8f0]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-indigo-600 font-semibold text-xs">
              <Target className="w-3.5 h-3.5" />
              <span>মাস্টার সিলেবাস ট্র্যাকার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              আপনার পড়ার সার্বিক অগ্রগতি
            </h2>
            <p className="text-sm text-slate-600">
              প্রতিটি টপিক শেষ হলে চেকবক্সে টিক দিন এবং লাইভ প্রোগ্রেস ভিজ্যুয়ালাইজ করুন।
            </p>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-4 neu-inset px-6 py-4 border border-white/40">
            <Award className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div className="text-right sm:text-center">
              <span className="text-3xl font-black text-slate-900 block leading-none">{progressPercentage}%</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">সম্পন্ন হয়েছে</span>
            </div>
          </div>
        </div>

        {/* Soft UI Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="w-full h-3.5 neu-inset p-0.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1">
            <span>শুরু (০%)</span>
            <span>মোট টপিক: {totalTopics} টি | সমাপ্ত: {completedTopics} টি</span>
            <span>লক্ষ্য (১০০%)</span>
          </div>
        </div>
      </div>

      {/* ================= SYLLABUS ACCORDION LIST ================= */}
      <div className="space-y-4">
        {syllabus.map((sub) => {
          const subTotal = sub.topics.length;
          const subCompleted = sub.topics.filter(t => t.completed).length;
          const subProgress = Math.round((subCompleted / subTotal) * 100) || 0;
          const isOpen = openSubject === sub.id;

          return (
            <div key={sub.id} className="neu-card overflow-hidden border border-white/50 transition-all duration-200">
              
              {/* Accordion Header */}
              <button
                onClick={() => setOpenSubject(isOpen ? null : sub.id)}
                className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl neu-inset text-indigo-600 flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">{sub.subject}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                      <span>{subCompleted} / {subTotal} টপিক সমাপ্ত</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-indigo-600 font-semibold">{subProgress}% অগ্রগতি</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block w-24 h-2 neu-inset p-0.5 rounded-full">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${subProgress}%` }}></div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </div>
              </button>

              {/* Accordion Body (Topics Checklist) */}
              {isOpen && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-200/50 space-y-2">
                  {sub.topics.map((topic) => (
                    <div 
                      key={topic.id}
                      onClick={() => handleCheckboxChange(sub.id, topic.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${
                        topic.completed 
                          ? 'bg-emerald-50/50 border border-emerald-200/50 text-slate-400' 
                          : 'hover:bg-white/60 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {topic.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-600" />
                        )}
                      </div>
                      <span className={`text-sm sm:text-base leading-snug ${topic.completed ? 'line-through font-normal' : ''}`}>
                        {topic.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SyllabusTracker;