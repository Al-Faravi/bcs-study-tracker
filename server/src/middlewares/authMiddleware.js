const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // হেডার থেকে Bearer টোকেন চেক করা হচ্ছে
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 'Bearer ' অংশটুকু বাদ দিয়ে শুধু টোকেন নেওয়া হচ্ছে
      token = req.headers.authorization.split(' ')[1];

      // টোকেন ভেরিফাই করা হচ্ছে
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ডিকোড করা ইউজার ইনফো (id, role) req.user এ সেট করা হলো যাতে কন্ট্রোলারে পাওয়া যায়
      req.user = decoded;

      next(); // সব ঠিক থাকলে পরবর্তী কাজে যাবে
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'অনুমতি নেই! টোকেনটি সঠিক নয় বা মেয়াদ শেষ হয়েছে।' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'অনুমতি নেই! কোনো টোকেন পাওয়া যায়নি।' });
  }
};

module.exports = { protect };