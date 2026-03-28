import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/signup
router.post('/signup', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user',
    plan: 'free',
    createdAt: Date.now(),
    avatar: null,
    company: '',
    jobTitle: '',
    timezone: 'UTC',
    agentPreferences: {
      prospecting: { autoSend: false, minIcpScore: 60 },
      dealIntel: { riskAlertThreshold: 70 },
      retention: { churnEscalateThreshold: 75 },
      competitive: { trackedCompetitors: [] }
    },
    notificationPrefs: {
      emailAlerts: true, slackAlerts: false, dailySummary: true, weeklyReport: true
    },
    connectedIntegrations: {
      hubspot: false, salesforce: false, gmail: false, slack: false
    }
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id, name: user.name, email: user.email, role: user.role,
      plan: user.plan, avatar: user.avatar, company: user.company, jobTitle: user.jobTitle
    }
  });
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(404).json({ message: 'No account found with this email' });
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  if (user.isActive === false) {
    return res.status(403).json({ message: 'Your account has been suspended.' });
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id, name: user.name, email: user.email, role: user.role,
      plan: user.plan, avatar: user.avatar, company: user.company, jobTitle: user.jobTitle
    }
  });
}));

// GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin', session: false }),
  (req, res) => {
    // passport.js config will attach user to req.user (we will handle creation in config/passport.js)
    const token = generateToken(req.user);
    const userPayload = encodeURIComponent(JSON.stringify({
      id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role,
      plan: req.user.plan, avatar: req.user.avatar, company: req.user.company, jobTitle: req.user.jobTitle
    }));
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${userPayload}`);
  }
);

// GET /api/auth/me
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json({ success: true, user });
}));

// PUT /api/auth/profile
router.put('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'company', 'jobTitle', 'timezone', 'avatar', 'agentPreferences', 'notificationPrefs', 'connectedIntegrations'];
  const updates = {};
  
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password');
  
  res.json({ success: true, user });
}));


import { performSeed } from '../services/seedService.js';

// POST /api/auth/demo-login
router.post('/demo-login', asyncHandler(async (req, res) => {
  // Ensure demo user exists
  let user = await User.findOne({ email: 'demo@salesai.com' });
  if (!user) {
    await performSeed();
    user = await User.findOne({ email: 'demo@salesai.com' });
  }

  const token = generateToken(user);
  res.json({
    success: true,
    token,
    user: {
      id: user._id, name: user.name, email: user.email, role: user.role,
      plan: user.plan, avatar: user.avatar, company: user.company, jobTitle: user.jobTitle
    }
  });
}));

// POST /api/auth/seed-demo
router.post('/seed-demo', authMiddleware, asyncHandler(async (req, res) => {
  await performSeed(req.user.userId);
  res.json({ success: true, message: 'Your demo environment has been initialized.' });
}));

export default router;
