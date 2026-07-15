const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Database Connection
connectDB();

// ✅ ডিপ্লয়ের জন্য নতুন CORS কনফিগারেশন
const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware (এখানে limit বাড়িয়ে 50MB করা হয়েছে যাতে বড় ছবি বা ফাইল আপলোডে এরর না আসে)
app.use(cors({
  origin: [clientURL, "http://localhost:5173"], // লোকাল এবং লাইভ দুটোই কাজ করবে
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;