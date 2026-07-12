require('dotenv').config();
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: { origin: "*" }
});

// Attach io to app for use in controllers
app.set('io', io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});