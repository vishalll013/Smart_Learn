const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Offline/Mock Mode';
  res.json({
    status: 'UP',
    database: dbStatus,
    timestamp: new Date()
  });
});

// Import route files
const authRouter = require('./routes/auth');
const coursesRouter = require('./routes/courses');
const quizzesRouter = require('./routes/quizzes');
const resourcesRouter = require('./routes/resources');
const announcementsRouter = require('./routes/announcements');
const dashboardRouter = require('./routes/dashboard');

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/dashboard', dashboardRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
