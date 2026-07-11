import React, { useState } from 'react';
import { Briefcase, Building2, Calendar, Users, ExternalLink, CheckCircle2, Clock, Plus, Trash2, RotateCcw, AlertCircle, Filter } from 'lucide-react';

const initialJobs = [
  {
    id: 1,
    title: "৪৬তম বিসিএস (নন-ক্যাডার পদসহ) নন-টেকনিক্যাল",
    organization: "বাংলাদেশ সরকারী কর্ম কমিশন (BPSC)",
    category: "Government / BCS",
    deadline: "2026-08-15",
    circularLink: "https://bpsc.gov.bd",
    posts: "৩,১৪০ জন",
    status: "new"
  },
  {
    id: 2,
    title: "অফিসার (জেনারেল) - সম্মিলিত ৯ ব্যাংক ও আর্থিক প্রতিষ্ঠান",
    organization: "ব্যাংকার্স সিলেকশন কমিটি সচিবালয় (BSCS)",
    category: "Bank / Financial",
    deadline: "2026-07-25",
    circularLink: "https://erecruitment.bb.org.bd",
    posts: "১,০২৬ জন",
    status: "new"
  },
  {
    id: 3,
    title: "সহকারী পরিচালক (AD) - সাধারণ শাখা",
    organization: "দুদক (Anti-Corruption Commission)",
    category: "Government",
    deadline: "2026-07-14",
    circularLink: "#",
    posts: "২৮ জন",
    status: "new"
  },
  {
    id: 4,
    title: "প্রভাষক (তথ্য ও যোগাযোগ প্রযুক্তি / কম্পিউটার বিজ্ঞান)",
    organization: "বেসরকারি শিক্ষক নিবন্ধন ও প্রত্যয়ন কর্তৃপক্ষ (NTRCA)",
    category: "Education / Teaching",
    deadline: "2026-06-30",
    circularLink: "#",
    posts: "৪৫০ জন",
    status: "new"
  }
];

const JobBoardPage = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [activeTab, setActiveTab] = useState('all');

  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newCategory, setNewCategory] = useState('Government');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPosts, setNewPosts] = useState('');
  const [newLink, setNewLink] = useState('');

  const calculateDaysLeft = (deadlineStr) => {
    const today = new Date();
    const deadlineDate = new Date(deadlineStr);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Expired (সময় শেষ)", status: "expired" };
    if (diffDays === 0) return { text: "আজই শেষ দিন!", status: "urgent" };
    if (diffDays <= 3) return { text: `আর মাত্র ${diffDays} দিন বাকি`, status: "urgent" };
    return { text: `আর ${diffDays} দিন বাকি`, status: "normal" };
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedJobs = jobs.map((job) => 
      job.id === id ? { ...job, status: newStatus } : job
    );
    setJobs(updatedJobs);
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    const newJobObj = {
      id: Date.now(),
      title: newTitle,
      organization: newOrg,
      category: newCategory,
      deadline: newDeadline,
      circularLink: newLink || "#",
      posts: newPosts ? `${newPosts} জন` : "নির্ধারিত নয়",
      status: "new"
    };

    setJobs([newJobObj, ...jobs]);
    setNewTitle('');
    setNewOrg('');
    setNewDeadline('');
    setNewPosts('');
    setNewLink('');
    document.getElementById('add_job_modal').close();
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'applied') return job.status === 'applied';
    if (activeTab === 'ignored') return job.status === 'ignored';
    return job.status !== 'ignored';
  });

  const appliedCount = jobs.filter(j => j.status === 'applied').length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f4f8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= HEADER & STATUS TABS ================= */}
        <div className="neu-card p-6 border border-white/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl neu-inset text-indigo-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <span>চাকরির খবর ও আবেদন ট্র্যাকার</span>
            </h1>
            <p className="text-sm text-slate-600">
              গ্রুপ মেম্বারদের শেয়ার করা সকল নতুন সার্কুলার দেখুন এবং ডেডলাইনের পূর্বে আবেদন সম্পন্ন করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('all')} 
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'neu-btn text-slate-600 hover:text-indigo-600'
              }`}
            >
              সকল সার্কুলার ({jobs.filter(j=>j.status !== 'ignored').length})
            </button>
            <button 
              onClick={() => setActiveTab('applied')} 
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'applied' ? 'bg-emerald-600 text-white shadow-md' : 'neu-btn text-slate-600 hover:text-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>আমার আবেদন ({appliedCount})</span>
            </button>
            <button 
              onClick={() => setActiveTab('ignored')} 
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'ignored' ? 'bg-slate-800 text-white shadow-md' : 'neu-btn text-slate-600 hover:text-slate-900'
              }`}
            >
              আগ্রহী নই ({jobs.filter(j=>j.status === 'ignored').length})
            </button>
            <button 
              onClick={() => document.getElementById('add_job_modal').showModal()}
              className="w-full sm:w-auto px-5 py-2 rounded-xl btn-glow text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 ml-auto md:ml-2"
            >
              <Plus className="w-4 h-4" />
              <span>সার্কুলার যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* ================= JOBS GRID ================= */}
        {filteredJobs.length === 0 ? (
          <div className="neu-card p-16 text-center text-slate-400 border border-white/50 space-y-2">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-base">এই তালিকায় কোনো চাকরির সার্কুলার নেই।</p>
            <p className="text-xs">উপরের বাটন থেকে নতুন সার্কুলার যোগ করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const countdown = calculateDaysLeft(job.deadline);
              const isExpired = countdown.status === 'expired';
              const isApplied = job.status === 'applied';

              return (
                <div 
                  key={job.id} 
                  className={`neu-card p-6 border transition-all duration-300 flex flex-col justify-between ${
                    isApplied ? 'border-emerald-500/40 bg-gradient-to-br from-[#f0f4f8] to-emerald-50/30' : isExpired ? 'border-rose-300/40 opacity-70 bg-slate-200/40' : 'border-white/60 hover:-translate-y-1'
                  }`}
                >
                  <div className="space-y-4">
                    
                    {/* Top Badges */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-3 py-1 rounded-full neu-inset text-indigo-600 font-bold text-[10px] uppercase tracking-wider">
                        {job.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isExpired ? 'bg-rose-100 text-rose-700' : countdown.status === 'urgent' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'neu-inset text-slate-600'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {countdown.text}
                      </span>
                    </div>

                    {/* Title & Organization */}
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">{job.title}</h2>
                      <p className="text-xs font-semibold text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{job.organization}</span>
                      </p>
                    </div>

                    {/* Meta Info Box */}
                    <div className="grid grid-cols-2 gap-3 text-xs neu-inset p-3.5 border border-white/40">
                      <div>
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          শূন্যপদ:
                        </span>
                        <p className="font-bold text-slate-800 mt-0.5">{job.posts}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          শেষ তারিখ:
                        </span>
                        <p className={`font-bold mt-0.5 ${isExpired ? 'text-rose-600' : 'text-slate-800'}`}>{job.deadline}</p>
                      </div>
                    </div>

                    {/* Applied Status Banner */}
                    {isApplied && (
                      <div className="bg-emerald-100/80 text-emerald-800 p-2.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>আবেদন সম্পন্ন করা হয়েছে</span>
                      </div>
                    )}

                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-200/60">
                    <a 
                      href={job.circularLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>সার্কুলার দেখুন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex gap-2">
                      {!isApplied && !isExpired && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(job.id, 'ignored')} 
                            className="px-3 py-1.5 rounded-lg neu-btn text-xs font-semibold text-slate-600 hover:text-slate-900"
                            title="তালিকা থেকে সরান"
                          >
                            Not Now
                          </button>
                          <button 
                            onClick={() => handleStatusChange(job.id, 'applied')} 
                            className="px-3.5 py-1.5 rounded-lg btn-glow text-xs font-bold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Applied</span>
                          </button>
                        </>
                      )}

                      {isApplied && (
                        <button 
                          onClick={() => handleStatusChange(job.id, 'new')} 
                          className="px-3 py-1.5 rounded-lg neu-btn text-xs font-semibold text-slate-600 hover:text-amber-600 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Undo</span>
                        </button>
                      )}
                      
                      {job.status === 'ignored' && (
                        <button 
                          onClick={() => handleStatusChange(job.id, 'new')} 
                          className="px-3 py-1.5 rounded-lg neu-btn text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>তালিকায় ফেরান</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ================= MODAL: ADD JOB CIRCULAR ================= */}
      <dialog id="add_job_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 border border-white/80 max-w-lg bg-[#f0f4f8]">
          <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>নতুন চাকরির সার্কুলার যোগ করুন</span>
          </h3>
          
          <form onSubmit={handleAddJob} className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">পদের নাম (Job Title)</label>
              <input type="text" placeholder="যেমন: ৪৬তম বিসিএস বা সহকারী জেনারেল ম্যানেজার" className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} required />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">প্রতিষ্ঠানের নাম</label>
              <input type="text" placeholder="যেমন: বাংলাদেশ ব্যাংক বা সরকারি কর্ম কমিশন" className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newOrg} onChange={(e)=>setNewOrg(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">ক্যাটাগরি</label>
                <select className="w-full px-3 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newCategory} onChange={(e)=>setNewCategory(e.target.value)}>
                  <option value="Government / BCS">Government / BCS</option>
                  <option value="Bank / Financial">Bank / Financial</option>
                  <option value="Education / Teaching">Education / Teaching</option>
                  <option value="Private / Corporate">Private / Corporate</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">আবেদনের শেষ তারিখ (Deadline)</label>
                <input type="date" className="w-full px-3 py-2 neu-inset rounded-xl text-sm font-semibold text-indigo-600 focus:outline-none" value={newDeadline} onChange={(e)=>setNewDeadline(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">পদসংখ্যা (Posts)</label>
                <input type="number" placeholder="যেমন: ১০২৬" className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newPosts} onChange={(e)=>setNewPosts(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">সার্কুলার লিংক</label>
                <input type="url" placeholder="https://..." className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newLink} onChange={(e)=>setNewLink(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/60">
              <button type="button" className="px-5 py-2 rounded-xl neu-btn text-xs font-semibold text-slate-600" onClick={()=>document.getElementById('add_job_modal').close()}>Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl btn-glow text-xs font-semibold">Save Circular</button>
            </div>
          </form>
        </div>
      </dialog>

    </div>
  );
};

export default JobBoardPage;