require('dotenv').config(); // <-- এই লাইনটি অবশ্যই সবার উপরে থাকতে হবে!

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const User = require('./models/User');

// ডাটাবেস কানেক্ট (বিঃদ্রঃ app.js-এও ডাটাবেস কানেক্ট করা আছে। যেকোনো এক জায়গায় রাখলেই কাজ করবে, তবে আপাতত আপনার কোডের মতোই রাখলাম)
// connectDB(); // যদি app.js-এ কানেক্ট করা থাকে, তবে এখান থেকে রিমুভ করতে পারেন।

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// ✅ ডিপ্লয়ের জন্য ক্লায়েন্ট ইউআরএল ভেরিয়েবল
const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

// ✅ Socket.io সেটআপ (ডায়নামিক CORS পলিসি সহ)
const io = new Server(server, {
  cors: {
    origin: [clientURL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
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