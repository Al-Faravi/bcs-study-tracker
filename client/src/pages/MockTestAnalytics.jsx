import React, { useState, useEffect } from 'react';
import { 
  Brain, Clock, CheckCircle2, ChevronRight, Play, Plus, 
  Activity, AlertCircle, Loader2, Trophy, XCircle, FileText 
} from 'lucide-react';
import useGroupStore from '../store/useGroupStore';
import useAuthStore from '../store/useAuthStore';
import { getGroupQuizzes, createQuiz, submitQuiz } from '../api/quizService';
import toast from 'react-hot-toast';

const MockTestAnalytics = () => {
  const { groups, loadGroups } = useGroupStore();
  const { user } = useAuthStore();

  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ নতুন কুইজ স্টেট (correctOptionIndex এবং explanation যোগ করা হয়েছে)
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizSubject, setNewQuizSubject] = useState('সাধারণ জ্ঞান');
  const [newQuizDuration, setNewQuizDuration] = useState(10);
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOptionIndex: null, explanation: '' }
  ]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  useEffect(() => {
    if (selectedGroupId) fetchQuizzes(selectedGroupId);
    else setQuizzes([]);
  }, [selectedGroupId]);

  const fetchQuizzes = async (groupId) => {
    try {
      setLoading(true);
      const data = await getGroupQuizzes(groupId);
      setQuizzes(data.data || []);
    } catch (error) {
      toast.error('কুইজ লোড করতে সমস্যা হয়েছে!');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (quiz) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setQuizResult(null);
  };

  const handleOptionSelect = (qIndex, optionText) => {
    setAnswers({ ...answers, [qIndex]: optionText });
  };

  const handleSubmitExam = async () => {
    try {
      setSubmitting(true);
      const answersArray = activeQuiz.questions.map((_, i) => answers[i] || '');
      const result = await submitQuiz(activeQuiz._id, answersArray);
      setQuizResult(result);
      toast.success('পরীক্ষা সম্পন্ন হয়েছে!');
    } catch (error) {
      toast.error('খাতা জমা দিতে সমস্যা হয়েছে!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseExam = () => {
    setActiveQuiz(null);
    setQuizResult(null);
    fetchQuizzes(selectedGroupId);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOptionIndex: null, explanation: '' }]);
  };

  const handleQuestionChange = (index, field, value, optionIndex = null) => {
    const updated = [...questions];
    if (field === 'option') {
      updated[index].options[optionIndex] = value;
    } else {
      updated[index][field] = value;
    }
    setQuestions(updated);
  };

  const handleCreateQuizSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroupId) return toast.error('গ্রুপ সিলেক্ট করুন!');

    // ✅ ভ্যালিডেশন চেক
    for (let q of questions) {
      if (!q.questionText || q.options.some(opt => !opt) || q.correctOptionIndex === null) {
        return toast.error('সবগুলো প্রশ্ন, ৪টি অপশন এবং সঠিক উত্তর মার্ক করা বাধ্যতামূলক!');
      }
    }

    try {
      setCreating(true);
      
      // ✅ ব্যাকএন্ডে পাঠানোর আগে ডেটা সাজিয়ে নেওয়া
      const formattedQuestions = questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.options[q.correctOptionIndex], // রেডিও বাটন থেকে অটোমেটিক টেক্সট বসে যাবে
        explanation: q.explanation
      }));

      await createQuiz({
        groupId: selectedGroupId,
        title: newQuizTitle,
        subject: newQuizSubject,
        duration: newQuizDuration,
        questions: formattedQuestions
      });

      toast.success('নতুন মক টেস্ট পাবলিশ হয়েছে!');
      document.getElementById('create_quiz_modal').close();
      
      setNewQuizTitle('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctOptionIndex: null, explanation: '' }]);
      fetchQuizzes(selectedGroupId);
    } catch (error) {
      toast.error('কুইজ তৈরি করা যায়নি!');
    } finally {
      setCreating(false);
    }
  };

  const currentGroup = groups.find(g => g._id === selectedGroupId);
  const isAdmin = currentGroup && (currentGroup.admin?._id || currentGroup.admin) === (user?._id || user?.id);

  // ================= ৩. রেজাল্ট ও ব্যাখ্যা ভিউ =================
  if (quizResult && activeQuiz) {
    const percentage = Math.round((quizResult.score / quizResult.total) * 100);
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="neu-card p-8 rounded-3xl border border-white/80 text-center space-y-5">
          <Trophy className={`w-16 h-16 mx-auto ${percentage >= 80 ? 'text-amber-500' : percentage >= 50 ? 'text-indigo-500' : 'text-rose-500'}`} />
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">পরীক্ষার ফলাফল</h2>
            <p className="text-sm text-slate-500 mt-1">আপনার মক টেস্টের মূল্যায়ন সম্পন্ন হয়েছে</p>
          </div>
          
          <div className="flex justify-center gap-6">
            <div className="p-5 rounded-2xl neu-inset bg-white/50 w-28">
              <span className="block text-3xl font-extrabold text-indigo-600">{quizResult.score}</span>
              <span className="text-[10px] font-bold text-slate-500">প্রাপ্ত নম্বর</span>
            </div>
            <div className="p-5 rounded-2xl neu-inset bg-white/50 w-28">
              <span className="block text-3xl font-extrabold text-slate-700">{quizResult.total}</span>
              <span className="text-[10px] font-bold text-slate-500">মোট নম্বর</span>
            </div>
          </div>
        </div>

        {/* ✅ উত্তরপত্র ও ব্যাখ্যার চমৎকার UI */}
        <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-6">
          <h3 className="font-extrabold text-lg text-slate-800 border-b border-slate-200/60 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>উত্তরপত্র ও সমাধান</span>
          </h3>
          
          <div className="space-y-4">
            {activeQuiz.questions.map((q, qIndex) => {
              const userAnswer = answers[qIndex];
              const isCorrect = userAnswer === q.correctAnswer;
              
              return (
                <div key={qIndex} className={`p-5 rounded-2xl border transition-all ${isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'}`}>
                  <h4 className="font-bold text-sm text-slate-800">{qIndex + 1}. {q.questionText}</h4>
                  
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
                    <div className="p-3 rounded-xl bg-white/60">
                      <span className="text-slate-500 block mb-1">আপনার উত্তর:</span>
                      <span className={isCorrect ? 'text-emerald-700 font-extrabold' : 'text-rose-600 font-extrabold'}>
                        {userAnswer || 'কোনো উত্তর দেননি ❌'} {isCorrect && '✅'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <span className="text-emerald-600 block mb-1">সঠিক উত্তর:</span>
                        <span className="text-emerald-700 font-extrabold">{q.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  {q.explanation && (
                    <div className="mt-3 p-3.5 rounded-xl neu-inset bg-white/60 text-xs text-slate-600 leading-relaxed border border-white/80">
                      <span className="font-extrabold text-indigo-600 mr-1.5">💡 ব্যাখ্যা:</span> 
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 text-center">
            <button onClick={handleCloseExam} className="px-8 py-3 rounded-2xl btn-glow text-white font-bold shadow-lg hover:scale-105 transition-all">
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= ২. লাইভ এক্সাম ভিউ (আগের মতোই) =================
  if (activeQuiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between p-4 neu-card rounded-2xl border border-white/80 sticky top-4 z-10 bg-white/80 backdrop-blur-md shadow-sm">
          <div>
            <h2 className="font-extrabold text-lg text-slate-800">{activeQuiz.title}</h2>
            <p className="text-xs text-indigo-600 font-bold">{activeQuiz.subject}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl neu-inset bg-amber-50 text-amber-700 font-extrabold">
            <Clock className="w-5 h-5 animate-pulse" />
            <span>{activeQuiz.duration} মিনিট</span>
          </div>
        </div>

        <div className="space-y-6">
          {activeQuiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 space-y-5">
              <h3 className="font-extrabold text-slate-800 text-base sm:text-lg flex gap-3">
                <span className="text-indigo-600">{qIndex + 1}.</span>
                <span>{q.questionText}</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 sm:pl-8">
                {q.options.map((opt, optIndex) => (
                  <label 
                    key={optIndex} 
                    className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                      answers[qIndex] === opt 
                        ? 'neu-inset bg-indigo-50/50 border-indigo-300 text-indigo-700 font-bold' 
                        : 'bg-white/40 border-white/60 text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <input 
                      type="radio" name={`question-${qIndex}`} value={opt}
                      checked={answers[qIndex] === opt} onChange={() => handleOptionSelect(qIndex, opt)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <button onClick={() => setActiveQuiz(null)} className="px-6 py-3 rounded-2xl neu-inset text-rose-600 font-bold text-sm flex items-center gap-2 hover:bg-rose-50 transition-all">
            <XCircle className="w-4 h-4" /> বাতিল করুন
          </button>
          <button 
            onClick={handleSubmitExam} 
            disabled={submitting || Object.keys(answers).length !== activeQuiz.questions.length}
            className="px-8 py-3 rounded-2xl btn-glow text-white font-bold text-sm flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            <span>খাতা জমা দিন</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= ১. মেইন ড্যাশবোর্ড ভিউ =================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/40 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-bold text-indigo-600 bg-white/50">
            <Brain className="w-4 h-4" />
            <span>মক টেস্ট ও কুইজ অ্যানালিটিক্স</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">অনলাইন এক্সাম হল</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            আপনার স্টাডি গ্রুপের সিলেবাস অনুযায়ী লাইভ পরীক্ষা দিন এবং নিজের প্রস্তুতি যাচাই করুন।
          </p>
        </div>

        {isAdmin && selectedGroupId && (
          <button 
            onClick={() => document.getElementById('create_quiz_modal').showModal()}
            className="px-6 py-3.5 rounded-2xl btn-glow font-bold text-sm text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন মক টেস্ট সেট করুন</span>
          </button>
        )}
      </div>

      <div className="max-w-md">
        <label className="text-xs font-bold text-slate-700 block ml-1 mb-2">স্টাডি গ্রুপ নির্বাচন করুন</label>
        <select
          value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
        >
          <option value="" disabled>-- গ্রুপ সিলেক্ট করুন --</option>
          {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
      </div>

      {!selectedGroupId ? (
        <div className="py-16 text-center space-y-4 neu-card rounded-3xl border border-white/80 bg-white/20">
          <Activity className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-lg text-slate-600">কোনো গ্রুপ সিলেক্ট করা হয়নি</h3>
        </div>
      ) : loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <span className="text-xs font-bold text-slate-500">লোড হচ্ছে...</span>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="py-16 text-center space-y-4 neu-inset rounded-3xl bg-white/30 border border-white/50">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-extrabold text-lg text-slate-700">এই গ্রুপে এখনো কোনো কুইজ নেই</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const hasAttended = quiz.participants?.some(p => (p.user?._id || p.user) === (user?._id || user?.id));
            const myResult = quiz.participants?.find(p => (p.user?._id || p.user) === (user?._id || user?.id));

            return (
              <div key={quiz._id} className="neu-card p-6 rounded-3xl border border-white/80 bg-white/40 flex flex-col justify-between hover:border-indigo-300 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg neu-inset text-[10px] font-extrabold text-indigo-600 bg-white/60">
                      {quiz.subject}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                      <Clock className="w-3 h-3" /> {quiz.duration} মি.
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{quiz.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">প্রশ্ন: {quiz.questions?.length || 0} টি</p>
                  </div>
                </div>
                <div className="pt-6 mt-2">
                  {hasAttended ? (
                    <div className="w-full py-3 rounded-2xl neu-inset bg-emerald-50/50 text-emerald-700 text-xs font-bold flex items-center justify-between px-5">
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> সম্পন্ন</span>
                      <span>স্কোর: {myResult?.score}/{quiz.questions.length}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartExam(quiz)}
                      className="w-full py-3 rounded-2xl neu-btn text-xs font-extrabold text-indigo-600 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" /> পরীক্ষা শুরু করুন
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= ✅ MODAL: নতুন কুইজ তৈরি (আপডেটেড UI) ================= */}
      <dialog id="create_quiz_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 sm:p-8 border border-white/80 max-w-4xl w-11/12 bg-[#f0f4f8]">
          <h3 className="font-extrabold text-xl text-slate-900 border-b border-slate-200/60 pb-4 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-indigo-600" />
            নতুন মক টেস্ট সেট করুন
          </h3>

          <form onSubmit={handleCreateQuizSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block ml-1">কুইজের নাম</label>
                <input 
                  type="text" value={newQuizTitle} onChange={e => setNewQuizTitle(e.target.value)} required
                  placeholder="যেমন: বিসিএস মডেল টেস্ট ১"
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm text-slate-800 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block ml-1">পরীক্ষার সময় (মিনিট)</label>
                <input 
                  type="number" min="1" value={newQuizDuration} onChange={e => setNewQuizDuration(e.target.value)} required
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 space-y-6">
              <h4 className="font-extrabold text-sm text-slate-800 flex items-center justify-between">
                <span>প্রশ্নপত্র সেটআপ</span>
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg">{questions.length} টি প্রশ্ন</span>
              </h4>

              {questions.map((q, index) => (
                <div key={index} className="p-5 rounded-2xl bg-white/40 border border-white/80 space-y-4 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full btn-glow text-white flex items-center justify-center font-bold text-xs shadow-md">
                    {index + 1}
                  </div>
                  
                  <input 
                    type="text" required placeholder="প্রশ্নটি লিখুন..."
                    value={q.questionText} onChange={e => handleQuestionChange(index, 'questionText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl neu-inset bg-white/60 border border-white/80 text-sm font-bold text-slate-800 focus:outline-none"
                  />

                  {/* ✅ রেডিও বাটন সহ অপশন */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 sm:pl-4">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className={`flex items-center gap-3 p-2 rounded-xl transition-all ${q.correctOptionIndex === oIndex ? 'neu-inset bg-emerald-50/50 border border-emerald-200' : 'bg-transparent'}`}>
                        <input 
                          type="radio" name={`correct-${index}`}
                          checked={q.correctOptionIndex === oIndex}
                          onChange={() => handleQuestionChange(index, 'correctOptionIndex', null, oIndex)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          title="টিক দিয়ে সঠিক উত্তর হিসেবে মার্ক করুন"
                          required
                        />
                        <input 
                          type="text" required placeholder={`অপশন ${oIndex + 1}`}
                          value={opt} onChange={e => handleQuestionChange(index, 'option', e.target.value, oIndex)}
                          className="w-full px-3 py-2 rounded-lg neu-inset bg-white/50 text-xs text-slate-700 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* ✅ ব্যাখ্যার অপশনাল ফিল্ড */}
                  <div className="pl-2 sm:pl-4 pt-2 border-t border-slate-200/50 mt-4">
                    <textarea 
                      placeholder="💡 ব্যাখ্যা (অপশনাল) - উত্তরটি কেন সঠিক হলো তা বিস্তারিত লিখতে পারেন..."
                      value={q.explanation} onChange={e => handleQuestionChange(index, 'explanation', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl neu-inset bg-indigo-50/30 border border-indigo-100/50 text-xs text-slate-600 focus:outline-none resize-none"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              ))}

              <button type="button" onClick={handleAddQuestion} className="w-full py-3 rounded-xl neu-btn text-xs font-bold text-indigo-600 flex items-center justify-center gap-2 border border-dashed border-indigo-300 hover:bg-indigo-50 transition-all">
                <Plus className="w-4 h-4" /> আরও একটি প্রশ্ন যোগ করুন
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/60">
              <button type="button" onClick={() => document.getElementById('create_quiz_modal').close()} className="px-6 py-2.5 rounded-xl neu-btn text-xs font-bold text-slate-600">
                বাতিল
              </button>
              <button type="submit" disabled={creating} className="px-8 py-2.5 rounded-xl btn-glow text-xs font-bold text-white flex items-center gap-2 shadow-md">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>কুইজ পাবলিশ করুন</span>
              </button>
            </div>
          </form>
        </div>
      </dialog>

    </div>
  );
};

export default MockTestAnalytics;