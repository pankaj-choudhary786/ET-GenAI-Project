import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Deal from '../models/Deal.js';
import AgentEvent from '../models/AgentEvent.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { callClaude } from '../services/llm.js';
import { runDealIntelAgent } from '../agents/dealIntelAgent.js';

const router = express.Router();

router.use(authMiddleware);

// GET /api/deals
router.get('/', asyncHandler(async (req, res) => {
  const query = { userId: req.user.userId };
  if (req.query.stage) query.stage = req.query.stage;
  
  const fetchedDeals = await Deal.find(query).sort({ createdAt: -1 }).lean();
  
  if (req.query.riskMin) {
    const min = parseInt(req.query.riskMin, 10);
    if (!isNaN(min)) {
       // Filter post-fetch if filtering is easier, or convert to mongoose.
       // However MongoDB is fine for raw queries but let's do it right.
    }
  }

  const dealsQuery = Deal.find(query).sort({ createdAt: -1 });
  if (req.query.riskMin) {
    dealsQuery.where('riskScore').gte(parseInt(req.query.riskMin, 10));
  }
  
  let deals = await dealsQuery.lean();

  deals = deals.map(deal => {
    const stageEntered = deal.stageEnteredAt ? new Date(deal.stageEnteredAt).getTime() : new Date(deal.createdAt).getTime();
    const daysInStage = Math.floor((Date.now() - stageEntered) / (1000 * 60 * 60 * 24));
    return { ...deal, daysInStage };
  });

  res.json({ success: true, count: deals.length, deals });
}));

// GET /api/deals/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ _id: req.params.id, userId: req.user.userId }).lean();
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
  
  const stageEntered = deal.stageEnteredAt ? new Date(deal.stageEnteredAt).getTime() : new Date(deal.createdAt).getTime();
  deal.daysInStage = Math.floor((Date.now() - stageEntered) / (1000 * 60 * 60 * 24));
  
  res.json({ success: true, deal });
}));

// POST /api/deals/scan 
router.post('/scan', asyncHandler(async (req, res) => {
  const jobId = uuidv4();
  runDealIntelAgent(req.user.userId).catch(console.error);
  res.json({ success: true, jobId, message: 'Deal intelligence agent started' });
}));

// GET /api/deals/:id/recovery 
router.get('/:id/recovery', asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });

  if (deal.recoveryPlay && deal.recoveryPlay.messageDraft) {
    return res.json({ success: true, recoveryPlay: deal.recoveryPlay });
  }

  // Synchronous generation logic just for recovery play extraction if not mapped 
  // Realistically we trigger Claude synchronously here:
  const riskAssessment = await callClaude(
    `You are an expert sales coach analyzing deal risk and creating recovery strategies.`,
    `Provide a recovery plan to unstick this deal.
      Deal: Company: ${deal.company}, Stage: ${deal.stage}, Value: $${deal.value}.
      Return JSON: { 
        "action": "specific action to take",
        "messageDraft": "full email draft to send to prospect",
        "talkingPoints": ["point1", "point2", "point3", "point4", "point5"],
        "urgency": "immediate/this-week/monitor"
      }`,
    true
  );

  deal.recoveryPlay = {
    ...riskAssessment,
    generatedAt: new Date()
  };
  await deal.save();

  res.json({ success: true, recoveryPlay: deal.recoveryPlay });
}));

// POST /api/deals/:id/send-recovery
router.post('/:id/send-recovery', asyncHandler(async (req, res) => {
  const { emailBody } = req.body;
  const deal = await Deal.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });

  // Mock send email via nodemail... but prompt just says "Logs the send event. Updates deal's lastActivityAt to now. Returns success."
  deal.lastActivityAt = new Date();
  await deal.save();

  await AgentEvent.create({
    userId: req.user.userId,
    agentType: 'deal_intel',
    action: `Recovery email sent to ${deal.company}`,
    outputSummary: `Recovery play actioned for deal worth $${deal.value}. Email dispatched.`,
    status: 'success'
  });

  res.json({ success: true, message: 'Recovery play sent' });
}));

// PUT /api/deals/:id/resolve
router.put('/:id/resolve', asyncHandler(async (req, res) => {
  const deal = await Deal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { 
      $set: { riskScore: 0, riskSignals: [] },
      $unset: { recoveryPlay: 1 } // Clears recovery play
    },
    { new: true }
  );

  await AgentEvent.create({
    userId: req.user.userId,
    agentType: 'deal_intel',
    action: `Risk resolved for ${deal.company}`,
    outputSummary: `Deal risk cleared. riskScore reset to 0.`,
    status: 'success'
  });

  res.json({ success: true, deal });
}));

// POST /api/deals
router.post('/', asyncHandler(async (req, res) => {
  const { company, contactName, contactEmail, stage, value } = req.body;
  
  const deal = await Deal.create({
    company, contactName, contactEmail, stage, value,
    userId: req.user.userId,
    stageEnteredAt: new Date(),
    riskScore: 0,
    riskSignals: []
  });

  res.status(201).json({ success: true, deal });
}));

export default router;
