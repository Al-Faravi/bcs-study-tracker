require('dotenv').config(); // <-- এই লাইনটি অবশ্যই সবার উপরে থাকতে হবে!

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const User = require('./models/User');

// ডাটাবেস কানেক্ট
connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.io সেটআপ (CORS পলিসি সহ)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // আপনার ফ্রন্টএন্ড URL
    methods: ["GET", "POST"]
  }
});

// রিয়েল-টাইম সকেট কানেকশন লজিক
io.on('connection', (socket) => {
  console.log('⚡ নতুন ইউজার সকেটে কানেক্ট হয়েছে:', socket.id);

  // ইউজার কোনো নির্দিষ্ট গ্রুপের চ্যাট রুমে জয়েন করলে
  socket.on('join_group_room', (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group room: ${groupId}`);
  });

  // 📋 ধাপ ২: নতুন মেসেজ (Text, Image, File, Audio) আসলে তা ডাটাবেসে সেভ করে রুমে ব্রডকাস্ট করা হবে
  socket.on('send_message', async (data) => {
    try {
      const { groupId, senderId, text, messageType = 'text', fileUrl = '', fileName = '' } = data;
      
      // ডাটাবেসে মেসেজ ও ফাইল সেভ
      const newMessage = await Message.create({
        group: groupId,
        sender: senderId,
        text,
        messageType,
        fileUrl,
        fileName
      });

      // সেন্ডারের তথ্য পপুলেট করা
      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'name profilePic role');

      // গ্রুপের সকল অনলাইন মেম্বারদের কাছে রিয়েল-টাইমে পাঠানো
      io.to(groupId).emit('receive_message', populatedMessage);
    } catch (err) {
      console.error('Message Send Error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ ইউজার সকেট থেকে ডিসকানেক্ট হয়েছে:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server & Socket.io running on port ${PORT}`);
});