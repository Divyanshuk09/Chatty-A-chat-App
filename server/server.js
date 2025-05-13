import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';

import { connectDB } from './DB/index.js';
import userRouter from './Routes/user.routes.js'
import connectCloudinary from './Utils/cloudinary.js';

// Load environment variables
dotenv.config();

// Create Express app and HTTP server (for socket support)
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json({ limit: '4mb' }));
app.use(cookieParser())
// Test Route
app.get('/', (req, res) => {
  res.send('✅ API is working');
});

//Routes
app.use('/api/user',userRouter)

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
