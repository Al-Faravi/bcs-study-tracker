import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Key, Plus, ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';

const initialGroups = [
  {
    id: 1,
    name: "৪৬তম বিসিএস প্রিলি ফাইটার্স",
    target: "BCS Preliminary",
    membersCount: 12,
    description: "প্রতিদিন রাত ৯টায় মডেল টেস্ট এবং লাইভ প্রবলেম সলভিং। শুধুমাত্র সিরিয়াস প্রার্থীরাই রিকোয়েস্ট দিন।",
    admin: "Faravi",
    isPublic: false
  },
  {
    id: 2,
    name: "Bank & BCS Combined Study",
    target: "Bank + BCS",
    membersCount: 8,
    description: "ইংরেজি ও গণিতের বেসিক থেকে অ্যাডভান্সড প্রস্তুতি। প্রতিদিন টার্গেট বেইজড স্টাডি।",
    admin: "Sajjad",
    isPublic: false
  },
  {
    id: 3,
    name: "টার্গেট এডমিন ক্যাডার - লিখিত প্রস্তুতি",
    target: "BCS Written",
    membersCount: 5,
    description: "লিখিত পরীক্ষার উত্তরপত্র মূল্যায়ন এবং প্রতিদিন বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি নিয়ে আলোচনা।",
    admin: "Nafis",
    isPublic: false
  }
];

const GroupsListPage = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [requestedGroups, setRequestedGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleAddMe = (groupId) => {
    if (!requestedGroups.includes(groupId)) {
      setRequestedGroups([...requestedGroups, groupId]);
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (inviteCode.trim() !== '') {
      navigate(`/group/${selectedGroup.id}`);
    } else {
      setErrorMsg("দয়া করে সঠিক ইনভাইট কোডটি প্রদান করুন।");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f4f8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= HEADER ================= */}
        <div className="neu-card p-6 border border-white/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl neu-inset text-indigo-600">
                <Users className="w-6 h-6" />
              </div>
              <span>স্টাডি গ্রুপসমূহ</span>
            </h1>
            <p className="text-sm text-slate-600">
              আপনার পছন্দের গ্রুপে 'Add Me' রিকোয়েস্ট পাঠান অথবা ইনভাইট কোড দিয়ে সরাসরি যুক্ত হোন।
            </p>
          </div>
          
          <button className="w-full sm:w-auto px-6 py-3 rounded-xl btn-glow text-sm font-bold flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span>নতুন গ্রুপ তৈরি করুন</span>
          </button>
        </div>

        {/* ================= GROUPS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const isRequested = requestedGroups.includes(group.id);

            return (
              <div key={group.id} className="neu-card p-6 border border-white/60 flex flex-col justify-between group">
                <div className="space-y-4">
                  
                  {/* Badge & Members Count */}
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full neu-inset text-indigo-600 font-bold text-[11px] uppercase tracking-wider">
                      {group.target}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{group.membersCount} Members</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-snug">{group.name}</h2>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">{group.description}</p>
                  </div>

                  {/* Admin Info */}
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>এডমিন: <strong className="text-slate-800">{group.admin}</strong></span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-4 mt-6 border-t border-slate-200/60">
                  {!isRequested ? (
                    <button 
                      onClick={() => handleAddMe(group.id)} 
                      className="w-full py-3 rounded-xl btn-glow text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Me (রিকোয়েস্ট পাঠান)</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-full py-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                        <span>Request Sent (কোডের অপেক্ষায়)</span>
                      </div>
                      <button 
                        onClick={() => { setSelectedGroup(group); setInviteCode(''); setErrorMsg(''); document.getElementById('code_modal').showModal(); }}
                        className="w-full py-2.5 rounded-xl neu-btn text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-center gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Enter Invite Code</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ================= MODAL: ENTER INVITE CODE ================= */}
      <dialog id="code_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 border border-white/80 max-w-md bg-[#f0f4f8]">
          <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <span>সিক্রেট ইনভাইট কোড প্রদান করুন</span>
          </h3>
          <p className="py-3 text-xs text-slate-600 leading-relaxed">
            গ্রুপ মেম্বারের কাছ থেকে প্রাপ্ত ওয়ান-টাইম কোডটি এখানে লিখুন (যেমন: <code className="neu-inset px-2 py-0.5 rounded font-bold text-indigo-600">BCS-100</code>)
          </p>

          <form onSubmit={handleCodeSubmit} className="mt-2 space-y-4">
            <input 
              type="text" 
              placeholder="e.g. BCS-7890" 
              className="w-full p-4 neu-inset rounded-2xl text-center font-mono text-lg font-bold tracking-widest uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            {errorMsg && <p className="text-rose-600 text-xs font-semibold text-center">{errorMsg}</p>}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/60">
              <button type="button" className="px-5 py-2.5 rounded-xl neu-btn text-xs font-semibold text-slate-600" onClick={() => document.getElementById('code_modal').close()}>
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center gap-1.5">
                <span>Join Group</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </dialog>

    </div>
  );
};

export default GroupsListPage;