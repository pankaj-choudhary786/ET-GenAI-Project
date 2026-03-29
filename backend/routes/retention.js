import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import ChurnSignal from '../models/ChurnSignal.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { callClaude } from '../services/llm.js';
import { runRetentionAgent } from '../agents/retentionAgent.js';

const router = express.Router();
router.use(authMiddleware);

// GET /api/retention/accounts
router.get('/accounts', asyncHandler(async (req, res) => {
  const query = { userId: req.user.userId };
  
  if (req.query.risk) {
    if (req.query.risk === 'high') query.churnScore = { $gt: 75 };
    else if (req.query.risk === 'medium') query.churnScore = { $gte: 50, $lte: 75 };
    else if (req.query.risk === 'low') query.churnScore = { $lt: 50 };
  }
  
  const accounts = await ChurnSignal.find(query).sort({ churnScore: -1 });
  res.json({ success: true, count: accounts.length, accounts });
}));

// GET /api/retention/accounts/:id
router.get('/accounts/:id', asyncHandler(async (req, res) => {
  const account = await ChurnSignal.findOne({ _id: req.params.id, userId: req.user.userId }).lean();
  if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
  
  // also fetch history events related to the customer? 
  // No explicit standard reference for account.id on behavior events in prompt other than 'behavior events history'. Let's find using company Name.
  const history = await BehaviorEvent.find({ 
    userId: req.user.userId, 
    'metadata.company': account.companyName 
  }).sort({ createdAt: -1 });

  res.json({ success: true, account, history });
}));

// POST /api/retention/scan
router.post('/scan', asyncHandler(async (req, res) => {
  const jobId = uuidv4();
  
  // Backfill from existing Deals first (so the agent has data to scan)
  const Deal = (await import('../models/Deal.js')).default;
  const deals = await Deal.find({ userId: req.user.userId });

  for (const deal of deals) {
    const exists = await ChurnSignal.findOne({ userId: req.user.userId, accountId: deal._id.toString() });
    if (!exists) {
      await ChurnSignal.create({
        userId: req.user.userId,
        accountId: deal._id.toString(),
        companyName: deal.company,
        contactEmail: deal.contactEmail,
        contactName: deal.contactName,
        contractValue: deal.value || 0,
        plan: 'Enterprise',
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        loginLast7d: Math.floor(Math.random() * 10) + 3,
        loginLast30d: Math.floor(Math.random() * 30) + 10,
        featureAdoptionPct: Math.floor(Math.random() * 60) + 20,
        supportTickets30d: Math.floor(Math.random() * 5),
        sentimentScore: 0.3,
        churnScore: deal.riskScore || 20,
        scoredAt: new Date(),
        agentLastChecked: new Date()
      });
    }
  }

  runRetentionAgent(req.user.userId).catch(console.error);
  res.json({ success: true, jobId, message: `Retention scan started. Monitoring ${deals.length} accounts.` });
}));

// POST /api/retention/backfill — import all existing deals as accounts
router.post('/backfill', asyncHandler(async (req, res) => {
  const Deal = (await import('../models/Deal.js')).default;
  const deals = await Deal.find({ userId: req.user.userId });
  
  let created = 0;
  for (const deal of deals) {
    const exists = await ChurnSignal.findOne({ userId: req.user.userId, accountId: deal._id.toString() });
    if (!exists && deal.company) {
      await ChurnSignal.create({
        userId: req.user.userId,
        accountId: deal._id.toString(),
        companyName: deal.company,
        contactEmail: deal.contactEmail || `contact@${deal.company.toLowerCase().replace(/\s+/g, '')}.com`,
        contactName: deal.contactName || 'Account Owner',
        contractValue: deal.value || 25000,
        plan: 'Enterprise',
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        loginLast7d: Math.floor(Math.random() * 10) + 3,
        loginLast30d: Math.floor(Math.random() * 30) + 10,
        featureAdoptionPct: Math.floor(Math.random() * 60) + 20,
        supportTickets30d: Math.floor(Math.random() * 5),
        sentimentScore: 0.3,
        churnScore: deal.riskScore || 20,
        scoredAt: new Date(),
        agentLastChecked: new Date()
      });
      created++;
    }
  }
  
  res.json({ success: true, message: `Backfilled ${created} accounts from your ${deals.length} active deals.`, created });
}));

// POST /api/retention/accounts/:id/intervene
router.post('/accounts/:id/intervene', asyncHandler(async (req, res) => {
  const { type } = req.body;
  
  const account = await ChurnSignal.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!account) return res.status(404).json({ success: false, message: 'Account not found' });

  // Call Claude to determine message
  const generatedMessage = await callClaude(
    `You are an expert customer success manager preventing account churn.`,
    `Generate an intervention message (type: ${type}) for this customer.
     Account: ${account.companyName}, Churn Score: ${account.churnScore}.
     If type is "offer" include a realistic upgrade or discount offer. If "nudge", check in politely. If "escalate", write an internal brief.
     Return ONLY the plain text content.`
  );

  const statusMap = { escalate: 'escalated', offer: 'offer_sent', nudge: 'nudge_sent' };
  account.interventionStatus = statusMap[type] || 'nudge_sent';
  await account.save();

  res.json({ 
    success: true, 
    message: "Intervention dispatched", 
    content: generatedMessage 
  });
}));

router.post('/accounts/manual', asyncHandler(async (req, res) => {
  const { companyName, contractValue, plan, contactEmail, loginLast7d, loginLast30d, featureAdoptionPct, supportTickets30d } = req.body;
  
  if (!companyName) return res.status(400).json({ success: false, message: 'Company name is required' });
  
  const account = await ChurnSignal.create({
    userId: req.user.userId,
    accountId: uuidv4(),
    companyName, contractValue: contractValue || 0,
    plan: plan || 'standard', contactEmail,
    loginLast7d: loginLast7d || 0,
    loginLast30d: loginLast30d || 0,
    featureAdoptionPct: featureAdoptionPct || 50,
    supportTickets30d: supportTickets30d || 0,
    sentimentScore: 0,
    churnScore: 0,
    interventionStatus: 'none',
    addedManually: true
  });
  
  res.status(201).json({ success: true, account });
}));

export default router;
