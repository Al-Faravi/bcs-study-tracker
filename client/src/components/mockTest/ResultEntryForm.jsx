import React, { useState } from 'react';

const subjects = [
  "১১. পূর্ণাঙ্গ মডেল টেস্ট (Complete Syllabus - 200 Marks)",
  "১. বাংলা ভাষা ও সাহিত্য (৩৫)",
  "২. ইংরেজি ভাষা ও সাহিত্য (৩৫)",
  "৩. বাংলাদেশ বিষয়াবলি (৩০)",
  "৪. আন্তর্জাতিক বিষয়াবলি (২০)",
  "৫. ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা (১০)",
  "৬. সাধারণ বিজ্ঞান (১৫)",
  "৭. কম্পিউটার ও তথ্যপ্রযুক্তি (১৫)",
  "৮. গাণিতিক যুক্তি (১৫)",
  "৯. মানসিক দক্ষতা (১৫)",
  "১০. নৈতিকতা, মূল্যবোধ ও সুশাসন (১০)"
];

const ResultEntryForm = ({ onAddResult }) => {
  const [examName, setExamName] = useState('');
  const [subject, setSubject] = useState(subjects[0]);
  const [totalMarks, setTotalMarks] = useState('200');
  const [attempted, setAttempted] = useState('');
  const [obtained, setObtained] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('bn-BD'),
      examName,
      subject: subject.split(' (')[0],
      totalMarks: Number(totalMarks),
      attempted: Number(attempted),
      obtained: Number(obtained)
    };
    
    onAddResult(newEntry);
    alert("✅ মক টেস্টের মার্কস সফলভাবে যুক্ত হয়েছে! নিচের গ্রাফে আপডেট দেখুন।");
    setExamName('');
    setAttempted('');
    setObtained('');
  };

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-primary border-b pb-2">📝 নতুন মক টেস্টের নম্বর যুক্ত করুন</h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">পরীক্ষার নাম/নম্বর</span></label>
            <input 
              type="text" 
              placeholder="যেমন: অগ্রদূত লাইভ টেস্ট-৫" 
              className="input input-bordered input-sm w-full"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              required 
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">বিষয় সিলেক্ট করুন</span></label>
            <select 
              className="select select-bordered select-sm w-full"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                // পূর্ণাঙ্গ মডেল টেস্ট হলে ডিফল্ট ২০০ মার্কস, অন্যথায় ১০০
                setTotalMarks(e.target.value.includes('200') ? '200' : '50');
              }}
            >
              {subjects.map((sub, idx) => (
                <option key={idx} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">মোট নম্বর (Total Marks)</span></label>
            <input 
              type="number" 
              className="input input-bordered input-sm w-full"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              required 
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">উত্তর করেছেন (Attempted)</span></label>
            <input 
              type="number" 
              placeholder="যেমন: ১৭৫" 
              className="input input-bordered input-sm w-full"
              value={attempted}
              onChange={(e) => setAttempted(e.target.value)}
              required 
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">প্রাপ্ত নম্বর (Marks Obtained)</span></label>
            <input 
              type="number" 
              step="0.25"
              placeholder="নেগেটিভ কেটে নেট মার্কস" 
              className="input input-bordered input-sm w-full font-bold text-primary"
              value={obtained}
              onChange={(e) => setObtained(e.target.value)}
              required 
            />
          </div>

          <div className="form-control mt-auto">
            <button type="submit" className="btn btn-primary btn-sm w-full">
              ➕ রেজাল্ট সেভ করুন
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResultEntryForm;