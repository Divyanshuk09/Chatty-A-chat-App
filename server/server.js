import dotenv from 'dotenv';
dotenv.config(); // ✅ Load environment variables at the top

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io'

import { connectDB } from './DB/index.js';
import connectCloudinary from './Utils/cloudinary.js';

// Connect to MongoDB
await connectDB();
await connectCloudinary();

const app = express();
// Step 1: Create HTTP server to support Socket.IO
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Step 2: Initialize socket.io server with CORS settings
export const io = new Server(server, {
  cors: { origin: '*' }
})

// Step 3: Create a map to store online users with their socket IDs
export const userSocketMap = {}; // Format: { userId: socketId }

// Step 4: Listen for new socket connections
io.on('connection', (socket) => {
  // Step 5: Get userId from client query during handshake
  const userId = socket.handshake.query.userId;
  console.log("A user is connected", userId);

  // Step 6: If userId exists, map it to the socket ID
  if (userId) {
    userSocketMap[userId] = socket.id
  }

  // Step 7: Emit updated list of online users to all clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  // Step 8: Handle socket disconnection
  socket.on('disconnect', () => {
    console.log("User is Disconnected", userId);
    // Step 9: Remove user from the map on disconnect
    delete userSocketMap[userId]
    // Step 10: Emit updated online users list again
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())

// Test Route
app.get('/', (req, res) => {
  res.send('✅ API is working');
});

import userRouter from './Routes/user.routes.js'
import messageRouter from './Routes/message.routes.js'

// Routes
app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
