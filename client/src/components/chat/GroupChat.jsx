import React, { useState } from 'react';
import { Hash, Send, Image as ImageIcon, Mic, HelpCircle, Lock, User, Radio, CheckCheck, Paperclip } from 'lucide-react';

const channels = [
  { id: 'general', name: 'general-discussion', unread: 0 },
  { id: 'math', name: 'math-problem-solving', unread: 3 },
  { id: 'gk', name: 'general-knowledge', unread: 1 },
  { id: 'english', name: 'english-grammar', unread: 0 },
];

const initialMessages = {
  general: [
    { id: 1, sender: 'Faravi (Admin)', time: 'রাত ১০:১৫', text: 'সবাই আজকের টার্গেট শেষ করে সিলেবাস ট্র্যাকারে টিক দিয়ে দাও। রাত ১১টায় লাইভ মক টেস্ট শুরু হবে।', isDoubt: false, type: 'text' },
    { id: 2, sender: 'Sajjad', time: 'রাত ১০:১৮', text: 'আমার বাংলা সাহিত্যের ২টি টপিক বাকি আছে, ৩০ মিনিটের মধ্যে শেষ করছি।', isDoubt: false, type: 'text' },
  ],
  math: [
    { id: 3, sender: 'Nafis', time: 'রাত ৯:৩০', text: 'কোনো আসল ৩ বছরে সুদে-আসে ৪৬০ টাকা এবং ৫ বছরে সুদে-আসে ৫০০ টাকা হলে শতকরা সুদের হার কত? এই অংকটার শর্টকাট কী?', isDoubt: true, type: 'text' },
    { id: 4, sender: 'Faravi (Admin)', time: 'রাত ৯:৩৫', text: '২ বছরের সুদ = (৫০০ - ৪৬০) = ৪০ টাকা। ১ বছরের সুদ = ২০ টাকা। এভাবে আসল বের করে নাও খুব সহজে।', isDoubt: false, type: 'text' },
  ],
  gk: [
    { id: 5, sender: 'Tanvir', time: 'বিকাল ৫:১২', text: 'সম্প্রতি অনুষ্ঠিত আন্তর্জাতিক সম্মেলনের বর্তমান সভাপতি কোন দেশ? কারো জানা থাকলে রেফারেন্স দেবেন প্লিজ।', isDoubt: true, type: 'text' },
  ],
  english: [
    { id: 6, sender: 'Rakib', time: 'গতকাল', text: 'Conditional sentence-এর ৩টি রুলস নিয়ে কারো কাছে ভালো হ্যান্ডনোট আছে কি?', isDoubt: false, type: 'text' },
  ]
};

const GroupChat = () => {
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isDoubtMode, setIsDoubtMode] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      sender: 'Faravi (You)',
      time: 'এইমাত্র',
      text: inputText,
      isDoubt: isDoubtMode,
      type: 'text'
    };

    setMessages({
      ...messages,
      [activeChannel]: [...(messages[activeChannel] || []), newMessage]
    });

    setInputText('');
    setIsDoubtMode(false);
  };

  const handleSendImage = () => {
    const photoMessage = {
      id: Date.now(),
      sender: 'Faravi (You)',
      time: 'এইমাত্র',
      text: '[বইয়ের পৃষ্ঠার ছবি শেয়ার করা হয়েছে]',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=80',
      isDoubt: true,
      type: 'image'
    };

    setMessages({
      ...messages,
      [activeChannel]: [...(messages[activeChannel] || []), photoMessage]
    });
  };

  const handleSendVoice = () => {
    const voiceMessage = {
      id: Date.now(),
      sender: 'Faravi (You)',
      time: 'এইমাত্র',
      text: '[০:৪৫ সেকেন্ডের ভয়েস লেকচার নোট]',
      isDoubt: false,
      type: 'voice'
    };

    setMessages({
      ...messages,
      [activeChannel]: [...(messages[activeChannel] || []), voiceMessage]
    });
  };

  const currentMessages = messages[activeChannel] || [];

  return (
    <div className="neu-card border border-white/60 overflow-hidden min-h-[600px] flex flex-col md:flex-row bg-[#f0f4f8]">
      
      {/* 👈 বাম পাশে: চ্যানেল লিস্ট (Sidebar) */}
      <div className="w-full md:w-64 p-5 border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col justify-between bg-white/20 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">স্টাডি চ্যানেলসমূহ</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          
          <ul className="space-y-1.5">
            {channels.map((chan) => (
              <li key={chan.id}>
                <button
                  onClick={() => setActiveChannel(chan.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex justify-between items-center ${
                    activeChannel === chan.id 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Hash className={`w-4 h-4 ${activeChannel === chan.id ? 'text-indigo-200' : 'text-slate-400'}`} />
                    {chan.name}
                  </span>
                  {chan.unread > 0 && activeChannel !== chan.id && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">{chan.unread}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* অনলাইন স্ট্যাটাস বক্স */}
        <div className="neu-inset p-3.5 mt-6 border border-white/40 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>১২ জন মেম্বার অনলাইনে</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">পড়াশোনা ব্যতীত অপ্রয়োজনীয় চ্যাট থেকে বিরত থাকুন।</p>
        </div>
      </div>

      {/* 👉 ডান পাশে: চ্যাট এরিয়া */}
      <div className="flex-grow flex flex-col justify-between bg-white/30">
        
        {/* চ্যাট হেডার */}
        <div className="px-6 py-4 border-b border-slate-200/60 flex justify-between items-center bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg neu-inset text-indigo-600">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900">
                {channels.find(c => c.id === activeChannel)?.name}
              </h2>
              <p className="text-[11px] font-medium text-slate-500">বিষয়ভিত্তিক প্রবলেম সলভিং ও আলোচনা চ্যানেল</p>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset text-[11px] font-semibold text-slate-500">
            <Lock className="w-3 h-3 text-indigo-600" />
            <span>End-to-End Study Encrypted</span>
          </div>
        </div>

        {/* মেসেজ লিস্ট */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[420px] flex-grow">
          {currentMessages.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm font-medium">
              এই চ্যানেলে এখনো কোনো আলোচনা শুরু হয়নি। প্রথম মেসেজ বা প্রশ্ন পাঠান!
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMe = msg.sender.includes('(You)') || msg.sender.includes('(Admin)');
              
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 px-1">
                    <span>{msg.sender}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{msg.time}</span>
                  </div>

                  {/* মেসেজ বাবল */}
                  <div className={`max-w-md p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm transition-all ${
                    msg.isDoubt 
                      ? 'bg-amber-50 border-2 border-amber-300/80 text-amber-950 shadow-amber-500/5' 
                      : isMe 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20' 
                        : 'neu-inset bg-white/80 text-slate-800 rounded-bl-none border border-white'
                  }`}>
                    {/* Doubt Tag */}
                    {msg.isDoubt && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white mb-2">
                        <HelpCircle className="w-3 h-3" />
                        <span>Doubt / Question</span>
                      </div>
                    )}
                    
                    <p>{msg.text}</p>

                    {/* ছবি মেসেজ */}
                    {msg.type === 'image' && (
                      <div className="mt-2.5 rounded-xl overflow-hidden border border-black/10">
                        <img src={msg.imageUrl} alt="Study problem" className="w-full object-cover" />
                      </div>
                    )}

                    {/* ভয়েস নোট */}
                    {msg.type === 'voice' && (
                      <div className={`mt-2 flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold ${isMe ? 'bg-indigo-700/50 text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                        <div className="w-7 h-7 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-sm cursor-pointer">
                          <span className="ml-0.5">▶</span>
                        </div>
                        <div className="w-28 h-1.5 rounded-full bg-white/30 overflow-hidden">
                          <div className="bg-white w-2/5 h-full"></div>
                        </div>
                        <span>০:৪৫</span>
                      </div>
                    )}
                  </div>

                  {isMe && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold px-1">
                      <span>Delivered</span>
                      <CheckCheck className="w-3 h-3 text-indigo-600" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* চ্যাট ইনপুট ও মিডিয়া টুলবার */}
        <div className="p-4 border-t border-slate-200/60 bg-white/40 backdrop-blur-md">
          <div className="flex justify-between items-center mb-3 px-1">
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={handleSendImage}
                className="px-3 py-1.5 rounded-lg neu-btn text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>ছবি / প্রশ্ন</span>
              </button>
              <button 
                type="button" 
                onClick={handleSendVoice}
                className="px-3 py-1.5 rounded-lg neu-btn text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5 text-indigo-600" />
                <span>ভয়েস নোট</span>
              </button>
            </div>

            {/* Doubt Toggle */}
            <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isDoubtMode 
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                : 'neu-inset text-slate-600 border-transparent'
            }`}>
              <input 
                type="checkbox" 
                checked={isDoubtMode}
                onChange={(e) => setIsDoubtMode(e.target.checked)}
                className="hidden" 
              />
              <HelpCircle className={`w-3.5 h-3.5 ${isDoubtMode ? 'text-white' : 'text-amber-500'}`} />
              <span>Mark as Doubt</span>
            </label>
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input 
              type="text" 
              placeholder={isDoubtMode ? "আপনার প্রশ্ন বা সমস্যাটি এখানে বিস্তারিত লিখুন..." : `${channels.find(c=>c.id===activeChannel)?.name} চ্যানেলে মেসেজ লিখুন...`}
              className={`flex-grow px-4 py-3 neu-inset rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                isDoubtMode ? 'ring-2 ring-amber-500 bg-amber-50/50 text-amber-950' : 'focus:ring-indigo-500/50 text-slate-800'
              }`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="px-6 py-3 rounded-xl btn-glow text-sm font-bold flex items-center gap-2 flex-shrink-0">
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default GroupChat;