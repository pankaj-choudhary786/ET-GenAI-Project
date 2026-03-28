import express from 'express';
import AgentEvent from '../models/AgentEvent.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

// GET /api/feed
router.get('/', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const query = { userId: req.user.userId };
  
  if (req.query.agentType) {
    query.agentType = req.query.agentType;
  }
  
  const events = await AgentEvent.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({ success: true, count: events.length, events });
}));

export default router;
