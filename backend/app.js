const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./userRole/routes/authRoute");
const userRouter = require("./userRole/routes/userRoute");
const reviewRouter = require("./userRole/routes/reviewRoute");
const messageRouter = require("./utils/messageRoute");
const agentRouter = require("./agentRole/routes/agentRoute");
const adminRouter = require("./adminRole/routes/adminRoute");

const mongoose = require("mongoose");

// MongoDB Connection with error handling
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/CMS';
mongoose.connect(mongoUri)
.then(()=>{
    console.log("✅ Database connected successfully");
})
.catch((e)=>{
    console.error("❌ Database connection error:", e.message);
    process.exit(1);
});

// Middleware
app.use(express.json());

// CORS Configuration - restrict to frontend origin
const corsOptions = {
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/review", reviewRouter);
app.use("/message", messageRouter);
app.use("/agent", agentRouter);
app.use("/admin", adminRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`🚀 Server running on port ${PORT}`);
});