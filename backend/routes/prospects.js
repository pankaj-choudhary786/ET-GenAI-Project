import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Prospect from '../models/Prospect.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendProspectEmail } from '../services/mailer.js';
import { callClaude } from '../services/llm.js';
import { runProspectingAgent } from '../agents/prospectingAgent.js';

const router = express.Router();

// GET /api/prospects — returns all prospects belonging to req.user.userId
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const query = { userId: req.user.userId };
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  const prospects = await Prospect.find(query).sort({ createdAt: -1 });
  res.json({ success: true, count: prospects.length, prospects });
}));

// GET /api/prospects/:id
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const prospect = await Prospect.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!prospect) {
    return res.status(404).json({ success: false, message: 'Prospect not found' });
  }
  res.json({ success: true, prospect });
}));

// POST /api/prospects/run-agent 
router.post('/run-agent', authMiddleware, asyncHandler(async (req, res) => {
  const jobId = uuidv4();
  // Fire and forget
  runProspectingAgent(req.user.userId).catch(console.error);
  
  res.json({ success: true, message: "Prospecting agent started", jobId });
}));

// PUT /api/prospects/:id/status
router.put('/:id/status', authMiddleware, asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const updated = await Prospect.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { status },
    { new: true, runValidators: true }
  );

  res.json({ success: true, prospect: updated });
}));

// POST /api/prospects/:id/approve-email
router.post('/:id/approve-email', authMiddleware, asyncHandler(async (req, res) => {
  const { sequenceIndex, editedBody } = req.body;

  const prospect = await Prospect.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!prospect) return res.status(404).json({ success: false, message: 'Prospect not found' });

  // Support both old (index) and new (sequence) field names
  const sequenceItem = prospect.outreachSequences.find(s =>
    String(s.sequence) === String(sequenceIndex) || String(s.index) === String(sequenceIndex)
  ) || prospect.outreachSequences[Number(sequenceIndex)] || prospect.outreachSequences[0];
  
  if (!sequenceItem) return res.status(404).json({ success: false, message: 'Sequence not found' });

  sequenceItem.body = editedBody || sequenceItem.body;
  sequenceItem.status = 'sent';
  sequenceItem.sentAt = Date.now();

  prospect.status = 'emailed';
  
  try {
    await sendProspectEmail(prospect, sequenceItem, sequenceIndex);
  } catch (emailErr) {
    console.error('[Email] Send failed (non-fatal):', emailErr.message);
  }
  await prospect.save();

  res.json({ success: true, prospect });
}));

// POST /api/prospects/:id/regenerate-email
router.post('/:id/regenerate-email', authMiddleware, asyncHandler(async (req, res) => {
  const { sequenceIndex, guidance } = req.body;
  
  const prospect = await Prospect.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!prospect) return res.status(404).json({ success: false, message: 'Prospect not found' });

  const sequenceItem = prospect.outreachSequences.find(s => String(s.index) === String(sequenceIndex));
  if (!sequenceItem) return res.status(404).json({ success: false, message: 'Sequence not found' });

  // Call Claude to rewrite
  const rewriteResponse = await callClaude(
    `You are an expert sales copywriter rewriting an email draft. You must ONLY output the exact plain text body of the rewritten email. Do NOT include any intro or conversational text.`,
    `Here is the original draft:
    ${sequenceItem.body}
    
    Guidance to apply: ${guidance}`
  );

  sequenceItem.body = rewriteResponse;
  await prospect.save();

  res.json({ success: true, prospect });
}));

// DELETE /api/prospects/:id 
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const prospect = await Prospect.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { status: 'dropped' },
    { new: true }
  );
  
  res.json({ success: true, message: 'Prospect removed' });
}));

export default router;
