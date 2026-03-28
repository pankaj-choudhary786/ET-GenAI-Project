import express from 'express';
import User from '../models/User.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import AgentEvent from '../models/AgentEvent.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
  next();
};

router.use(authMiddleware, adminCheck);

// GET /api/admin/stats
router.get('/stats', asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const totalUsers = await User.countDocuments();
  
  // For 'activeUsersLast30Days', assuming any agent config or update touches user
  // We approximate using users created or events. We will count users who have > 0 agent events last 30d
  const activeIds = await AgentEvent.distinct('userId', { createdAt: { $gte: thirtyDaysAgo } });
  const activeUsersLast30Days = activeIds.length;

  const totalEmailsSent = await BehaviorEvent.countDocuments({ eventType: 'email_sent' });
  const totalAgentActions = await AgentEvent.countDocuments();
  
  // Hardcoded for demo
  const dataSourceBreakdown = { hubspot: 24, salesforce: 15, gmail: 42 };

  res.json({
    success: true,
    stats: {
      totalUsers,
      activeUsersLast30Days,
      totalEmailsSent,
      totalAgentActions,
      dataSourceBreakdown
    }
  });
}));

// GET /api/admin/users
router.get('/users', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  if (req.query.plan) query.plan = req.query.plan;
  if (req.query.status) {
    const isAct = req.query.status === 'active';
    query.isActive = isAct;
  }

  const users = await User.find(query).skip(skip).limit(limit).select('-password');
  const totalCount = await User.countDocuments(query);
  
  res.json({
    success: true,
    users,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalCount
  });
}));

// GET /api/admin/agent-log 
router.get('/agent-log', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.agentType) query.agentType = req.query.agentType;
  if (req.query.status) query.status = req.query.status;

  const logs = await AgentEvent.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email company')
    .lean();
    
  const totalCount = await AgentEvent.countDocuments(query);

  res.json({
    success: true,
    logs,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalCount
  });
}));

export default router;
