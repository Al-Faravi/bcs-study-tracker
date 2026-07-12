const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
// অন্যান্য রাউটগুলো পরে এখানে যুক্ত হবে

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;