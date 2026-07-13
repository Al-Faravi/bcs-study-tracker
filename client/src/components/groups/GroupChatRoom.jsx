import React, { useEffect, useState, useRef } from 'react';
import { Send, Loader2, MessageSquare, ShieldCheck, User as UserIcon, Image as ImageIcon, Paperclip, Mic, Square, Download, FileText, X } from 'lucide-react';
import io from 'socket.io-client';
import { fetchMessagesApi } from '../../api/messageApi';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const GroupChatRoom = ({ groupId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  
  // ফাইল ও ছবি প্রিভিউ স্টেট
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState('text'); // 'image' অথবা 'file'
  
  // ভয়েস রেকর্ডিং স্টেট
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchMessagesApi(groupId);
        setMessages(data.messages || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load messages', err);
        setLoading(false);
      }
    };
    loadHistory();

    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.emit('join_group_room', groupId);

    socketRef.current.on('receive_message', (incomingMessage) => {
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ================= ফাইল ও ছবি হ্যান্ডলার =================
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // ৫ মেগাবাইটের বেশি ফাইল হলে সতর্ক করবে
    if (file.size > 5 * 1024 * 1024) {
      alert('ফাইল সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        name: file.name,
        data: reader.result // Base64 স্ট্রিং
      });
      setFileType(type);
      if (type === 'image') {
        setFilePreview(reader.result);
      } else {
        setFilePreview(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const cancelAttachment = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileType('text');
  };

  // ================= ভয়েস রেকর্ডিং হ্যান্ডলার =================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          sendMediaMessage('audio', reader.result, `Voice Note (${new Date().toLocaleTimeString('bn-BD')})`);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('মাইক্রোফোন অ্যাক্সেস পাওয়া যায়নি! ব্রাউজারের পারমিশন চেক করুন।');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // ================= মেসেজ পাঠানোর মূল ফাংশন =================
  const sendMediaMessage = (type, url, name, text = '') => {
    const messageData = {
      groupId,
      senderId: currentUser._id || currentUser.id,
      text: text,
      messageType: type,
      fileUrl: url,
      fileName: name
    };
    socketRef.current.emit('send_message', messageData);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;

    if (selectedFile) {
      sendMediaMessage(fileType, selectedFile.data, selectedFile.name, inputText);
      cancelAttachment();
    } else {
      sendMediaMessage('text', '', '', inputText);
    }
    setInputText('');
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">চ্যাট রুম লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden relative">
      
      {/* মেসেজ লিস্ট এরিয়া */}
      <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-70 my-12">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">এই চ্যাট রুমে এখনো কোনো কথা হয়নি।<br/>নোটস, ছবি বা ভয়েস মেসেজ পাঠিয়ে আলোচনা শুরু করুন!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = (msg.sender?._id || msg.sender)?.toString() === (currentUser._id || currentUser.id)?.toString();

            return (
              <div key={index} className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                
                {!isMe && (
                  <div className="w-8 h-8 rounded-xl neu-card p-0.5 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center mb-1">
                    {msg.sender?.profilePic ? (
                      <img src={msg.sender.profilePic} alt="User" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                )}

                <div className={`max-w-[80%] sm:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  
                  {!isMe && (
                    <span className="text-[10px] font-extrabold text-slate-600 mb-1 ml-1 flex items-center gap-1">
                      {msg.sender?.name || 'ইউজার'}
                      {msg.sender?.role === 'admin' && <ShieldCheck className="w-3 h-3 text-indigo-600 inline" />}
                    </span>
                  )}

                  {/* ================= মেসেজ বাবল (টাইপ অনুযায়ী রেন্ডার) ================= */}
                  <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm space-y-2 ${
                    isMe 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none' 
                      : 'neu-inset bg-white text-slate-800 border border-white/80 rounded-bl-none'
                  }`}>
                    
                    {/* ১. ছবি মেসেজ হলে */}
                    {msg.messageType === 'image' && msg.fileUrl && (
                      <div className="rounded-xl overflow-hidden border border-white/20 max-h-60">
                        <img src={msg.fileUrl} alt="Attachment" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all" onClick={() => window.open(msg.fileUrl)} />
                      </div>
                    )}

                    {/* ২. পিডিএফ বা ফাইল মেসেজ হলে */}
                    {msg.messageType === 'file' && msg.fileUrl && (
                      <a 
                        href={msg.fileUrl} 
                        download={msg.fileName || 'study-file'} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isMe ? 'bg-indigo-700/50 border-indigo-400 text-white hover:bg-indigo-700' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        <FileText className="w-6 h-6 flex-shrink-0 text-amber-400" />
                        <div className="overflow-hidden">
                          <span className="font-extrabold text-xs block truncate">{msg.fileName || 'ডাউনলোড ফাইল'}</span>
                          <span className="text-[10px] opacity-80 block">ক্লিক করে ডাউনলোড করুন</span>
                        </div>
                        <Download className="w-4 h-4 ml-auto flex-shrink-0" />
                      </a>
                    )}

                    {/* ৩. ভয়েস মেসেজ বা অডিও হলে */}
                    {msg.messageType === 'audio' && msg.fileUrl && (
                      <div className="flex flex-col gap-1 w-56 sm:w-64">
                        <span className="text-[10px] font-extrabold flex items-center gap-1 opacity-90">
                          <Mic className="w-3 h-3 text-rose-400 animate-pulse" /> ভয়েস নোট
                        </span>
                        <audio controls src={msg.fileUrl} className="w-full h-8 rounded-lg" />
                      </div>
                    )}

                    {/* ৪. সাধারণ টেক্সট বা ক্যাপশন */}
                    {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}

                  </div>

                  <span className="text-[9px] font-bold text-slate-400 mt-1 mx-1">
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ================= ফাইল প্রিভিউ বার (যদি কিছু সিলেক্ট করা থাকে) ================= */}
      {selectedFile && (
        <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
            {fileType === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            <span className="truncate max-w-xs">{selectedFile.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-200 text-indigo-800">সংযুক্ত হয়েছে</span>
          </div>
          <button onClick={cancelAttachment} className="p-1 rounded-full hover:bg-rose-100 text-rose-600 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= ভয়েস রেকর্ডিং ইন্ডিকেটর বার ================= */}
      {isRecording && (
        <div className="px-4 py-2.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs font-extrabold text-rose-600">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
            <span>ভয়েস রেকর্ড হচ্ছে... ({recordingTime} সেকেন্ড)</span>
          </div>
          <button onClick={stopRecording} className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-rose-700 shadow-sm">
            <Square className="w-3.5 h-3.5" />
            <span>সেন্ড করুন</span>
          </button>
        </div>
      )}

      {/* ================= স্মার্ট চ্যাট ইনপুট ও অ্যাটাচমেন্ট বার ================= */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200/60 bg-white flex items-center gap-1.5 sm:gap-2">
        
        {/* হিডেন ফাইল ইনপুটস */}
        <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => handleFileSelect(e, 'image')} className="hidden" />
        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" ref={fileInputRef} onChange={(e) => handleFileSelect(e, 'file')} className="hidden" />

        {/* ছবি সংযুক্তি বাটন */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="p-2 sm:p-2.5 rounded-xl neu-inset bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex-shrink-0"
          title="ছবি বা খাতার নোট পাঠাতে ক্লিক করুন"
        >
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* পিডিএফ ও ফাইল সংযুক্তি বাটন */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 sm:p-2.5 rounded-xl neu-inset bg-slate-50 text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-all flex-shrink-0"
          title="পিডিএফ বা লেকচার শিট পাঠাতে ক্লিক করুন"
        >
          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* মেসেজ লেখার বক্স */}
        <input
          type="text"
          placeholder="মেসেজ বা ক্যাপশন লিখুন..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isRecording}
          className="flex-grow px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl neu-inset bg-slate-50 border border-slate-200/60 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
        />

        {/* ভয়েস রেকর্ডিং বাটন (ইনপুট খালি থাকলে দেখাবে, কিছু লিখলে সেন্ড বাটন দেখাবে) */}
        {!inputText.trim() && !selectedFile ? (
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 sm:p-2.5 rounded-xl transition-all flex-shrink-0 ${
              isRecording 
                ? 'bg-rose-600 text-white animate-bounce shadow-lg' 
                : 'neu-inset bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title="ভয়েস মেসেজ পাঠাতে ক্লিক করুন"
          >
            {isRecording ? <Square className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        ) : (
          /* সেন্ড বাটন */
          <button
            type="submit"
            className="p-2.5 sm:p-3 rounded-xl btn-glow text-white shadow-md hover:scale-105 transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        )}

      </form>

    </div>
  );
};

export default GroupChatRoom;