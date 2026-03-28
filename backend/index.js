import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import passport from 'passport';

import connectDB from './config/db.js';
import './config/passport.js';

// Route imports
import authRoutes from './routes/auth.js';
import prospectRoutes from './routes/prospects.js';
import dealRoutes from './routes/deals.js';
import retentionRoutes from './routes/retention.js';
import battlecardRoutes from './routes/battlecards.js';
import feedRoutes from './routes/feed.js';
import outboxRoutes from './routes/outbox.js'; // The user had outbox, maybe keep it even if not explicitly demanded in 3.1
import adminRoutes from './routes/admin.js';
import webhookRoutes from './routes/webhooks.js';
import trackingRoutes from './routes/tracking.js';
import errorHandler from './middleware/errorHandler.js';

// Start scheduler
import { startScheduler } from './jobs/scheduler.js';

const app = express();

// Apply middleware in exact order per prompt 3.1
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Initialize passport
app.use(passport.initialize());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/prospects', prospectRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/retention', retentionRoutes);
app.use('/api/battlecards', battlecardRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/outbox', outboxRoutes); // Keeping existing outbox for safety
app.use('/webhooks', webhookRoutes);
app.use('/track', trackingRoutes);

// Global error handler MUST BE LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    startScheduler();
    app.listen(PORT, () => console.log('Server running on port ' + PORT));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });
