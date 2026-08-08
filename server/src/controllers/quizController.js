const Quiz = require('../models/Quiz');
const Group = require('../models/Group');

// ১. নতুন কুইজ তৈরি করা
exports.createQuiz = async (req, res) => {
  try {
    const { groupId, title, subject, duration, questions } = req.body;
    
    const quiz = await Quiz.create({
      group: groupId,
      title,
      subject,
      duration,
      questions,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'কুইজ তৈরি করতে সমস্যা হয়েছে', error: error.message });
  }
};

// ২. নির্দিষ্ট গ্রুপের সব কুইজ লোড করা
exports.getGroupQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ group: req.params.groupId }).sort('-createdAt');
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'কুইজ লোড করা যায়নি', error: error.message });
  }
};

// ৩. কুইজ সাবমিট করা এবং রেজাল্ট (Score) হিসাব করা
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // ইউজারের দেওয়া উত্তরগুলোর অ্যারে
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'কুইজটি পাওয়া যায়নি' });
    }

    let score = 0;
    // ইউজারের উত্তরের সাথে ডাটাবেসের সঠিক উত্তর মেলানো হচ্ছে
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += 1;
      }
    });

    // রেজাল্ট ডাটাবেসে সেভ করা
    const participantData = {
      user: req.user._id,
      score: score,
      totalAttempted: answers.length
    };
    
    quiz.participants.push(participantData);
    await quiz.save();

    res.status(200).json({ success: true, score, total: quiz.questions.length, message: 'খাতা মূল্যায়ন সম্পন্ন হয়েছে!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'কুইজ সাবমিট করতে সমস্যা হয়েছে', error: error.message });
  }
};