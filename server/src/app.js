const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Database Connection
connectDB();

// Middleware (এখানে limit বাড়িয়ে 50MB করা হয়েছে যাতে বড় ছবি বা ফাইল আপলোডে এরর না আসে)
app.use(cors());
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