const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express(); // 👈 এই লাইনের নিচে সব app.use থাকবে!

// Database Connection
connectDB();

const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
  origin: [clientURL, "http://localhost:5173"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ================= Routes =================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// ✅ আমাদের নতুন টার্গেট রুট অবশ্যই এখানে (অন্য সব রুটের সাথে) থাকবে!
app.use('/api/targets', require('./routes/targetRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;