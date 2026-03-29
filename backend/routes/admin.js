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
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Core Counts (Individual queries are faster and more reliable than complex grouping for basic stats)
    const totalUsersPromise = User.countDocuments();
    const activeIdsPromise = AgentEvent.distinct('userId', { createdAt: { $gte: thirtyDaysAgo } });
    const totalEmailsSentPromise = BehaviorEvent.countDocuments({ eventType: 'email_sent' });
    const totalAgentActionsPromise = AgentEvent.countDocuments();

    const [totalUsers, activeIds, totalEmailsSent, totalAgentActions] = await Promise.all([
      totalUsersPromise, activeIdsPromise, totalEmailsSentPromise, totalAgentActionsPromise
    ]);
    const activeUsersLast30Days = activeIds.length;
    
    // Activity Trends (7-day stack) - Robust aggregation
    let activityTrends = [];
    try {
      const trendsRaw = await AgentEvent.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { 
          $group: { 
            _id: { 
              day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
              type: "$agentType" 
            }, 
            count: { $sum: 1 } 
          } 
        },
        { $sort: { "_id.day": 1 } }
      ]);

      const trendsMap = {};
      trendsRaw.forEach(t => {
        // Use JS to format labels to avoid MongoDB version-specific behavior with %a token
        const d = new Date(t._id.day);
        const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        if (!trendsMap[label]) trendsMap[label] = { day: label };
        trendsMap[label][t._id.type] = t.count;
      });
      activityTrends = Object.values(trendsMap);
    } catch (aggError) {
      console.error("Trends aggregation failed:", aggError);
      activityTrends = []; // Empty fallback
    }

    // Data Source Breakdown - Robust aggregation
    let dataSourceBreakdown = [
      { name: 'HubSpot Sync', value: 0, color: '#FF7A59' },
      { name: 'Salesforce', value: 0, color: '#00A4BD' },
      { name: 'Gmail SMTP', value: totalUsers || 1, color: '#f59e0b' }
    ];

    try {
      const sourcesRaw = await User.aggregate([
        { 
          $group: { 
            _id: null,
            hubspot: { $sum: { $cond: [{ $eq: ["$connectedIntegrations.hubspot", true] }, 1, 0] } },
            salesforce: { $sum: { $cond: [{ $eq: ["$connectedIntegrations.salesforce", true] }, 1, 0] } }
          } 
        }
      ]);
      if (sourcesRaw && sourcesRaw.length > 0) {
        dataSourceBreakdown[0].value = sourcesRaw[0].hubspot || 0;
        dataSourceBreakdown[1].value = sourcesRaw[0].salesforce || 0;
      }
    } catch (aggError) {
      console.error("Sources aggregation failed:", aggError);
    }

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsersLast30Days,
        totalEmailsSent,
        totalAgentActions,
        activityTrends,
        dataSourceBreakdown
      }
    });
  } catch (err) {
    console.error("Major Stats Calculation Error:", err);
    res.status(500).json({ success: false, message: 'Failed to compile global stats', error: err.message });
  }
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

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
  res.json({ success: true, user, message: `User status updated to ${isActive ? 'Active' : 'Suspended'}` });
}));

export default router;
