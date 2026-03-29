import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Prospect from '../models/Prospect.js';
import AgentEvent from '../models/AgentEvent.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendProspectEmail } from '../services/mailer.js';
import { callClaude } from '../services/llm.js';
import { runProspectingAgent } from '../agents/prospectingAgent.js';
import Deal from '../models/Deal.js';
import ChurnSignal from '../models/ChurnSignal.js';

const router = express.Router();

// GET /api/prospects — returns all prospects belonging to req.user.userId
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const query = { userId: req.user.userId };
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  // Prevent 304 caching lag during demo
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  
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

  // Save to DB FIRST — so the Outbox clears the card regardless of email delivery
  await prospect.save();

  // Then attempt real email send
  let emailWarning = null;
  try {
    await sendProspectEmail(prospect, sequenceItem, sequenceIndex);
  } catch (emailErr) {
    console.error('[Email] SMTP Send failed (non-fatal):', emailErr.message);
    // Don't crash the whole flow — DB is already updated. Report as warning.
    emailWarning = `Note: SMTP delivery failed (${emailErr.message.slice(0, 80)}). Check your Gmail App Password.`;
  }

  // [MANUAL OVERRIDE] Activity Feed Integration
  await AgentEvent.create({
    agentType: 'manual_override',
    userId: req.user.userId,
    action: 'email_approved',
    entityType: 'prospect',
    entityId: prospect._id,
    outputSummary: `Human approved sequence step ${Number(sequenceIndex) + 1} for ${prospect.company}. Email dispatched via SMTP.`,
    status: 'success'
  });

  res.json({ success: true, prospect, warning: emailWarning });
}));

// POST /api/prospects/:id/research — force-re-crunch AI data
router.post('/:id/research', authMiddleware, asyncHandler(async (req, res) => {
  const prospect = await Prospect.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!prospect) return res.status(404).json({ success: false, message: 'Prospect not found' });

  // Use LLM directly for immediate force-update
  const result = await callClaude(
    `You are an expert sales intelligence agent. Force-researching a single prospect.`,
    `Provide elite research for this target: ${prospect.company}. 
     Return JSON with exactly these keys: { "icpScore": 0-100, "fitReason": "string description", "topSignal": "short signal string" }`,
    true
  );

  prospect.icpScore = result.icpScore || 85;
  prospect.fitReason = result.fitReason || "Target verified via manual agent override. Matches ICP specifications.";
  prospect.topSignal = result.topSignal || "Active expansion signals detected.";
  
  if (prospect.status === 'discovered') {
     prospect.status = 'scored'; // Advance to next column
  }
  
  await prospect.save();

  await AgentEvent.create({
    userId: req.user.userId,
    agentType: 'prospecting',
    action: `Manual AI Research: ${prospect.company}`,
    outputSummary: `Force-analyzed target. Score: ${prospect.icpScore}. Moved to Scored & Verified.`,
    status: 'success'
  });

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

// POST /api/prospects/manual — create prospect manually without AI scoring
router.post('/manual', authMiddleware, asyncHandler(async (req, res) => {
  const { company, domain, contactName, contactTitle, contactEmail, linkedinUrl, industry, employeeCount, notes } = req.body;
  
  if (!company || !contactEmail) {
    return res.status(400).json({ success: false, message: 'Company name and contact email are required' });
  }
  
  const existing = await Prospect.findOne({ contactEmail, userId: req.user.userId });
  if (existing) {
    return res.status(400).json({ success: false, message: 'A prospect with this email already exists' });
  }

  // Use Claude to generate a quick ICP score for manually added prospect
  let icpScore = 70; // default score for manually added
  let fitReason = 'Manually added prospect';
  let outreachSequences = [];
  
  try {
    const scoreResult = await callClaude(
      'You are a B2B sales ICP scoring expert.',
      `Score this manually added prospect (0-100) and generate a 3-email outreach sequence.
       Company: ${company}, Industry: ${industry || 'Unknown'}, Size: ${employeeCount || 'Unknown'}, 
       Contact: ${contactName} (${contactTitle || 'Unknown role'}), Notes: ${notes || 'None'}.
       Return JSON: { 
         "score": 0-100, 
         "reason": "explanation",
         "emails": [{"subject":"","body":"","sendDelay":"Day 1"},{"subject":"","body":"","sendDelay":"Day 4"},{"subject":"","body":"","sendDelay":"Day 8"}]
       }`,
      true
    );
    icpScore = scoreResult.score;
    fitReason = scoreResult.reason;
    outreachSequences = (scoreResult.emails || []).map((e, i) => ({
      ...e, index: i, approved: false, sent: false
    }));
  } catch (llmErr) {
    console.error('LLM scoring failed for manual prospect, using defaults:', llmErr.message);
  }

  const prospect = await Prospect.create({
    company, domain, contactName, contactTitle, contactEmail, linkedinUrl,
    industry, employeeCount, notes,
    userId: req.user.userId,
    status: 'scored',
    icpScore,
    fitReason,
    outreachSequences,
    addedManually: true
  });

  await AgentEvent.create({
    agentType: 'manual_override',
    userId: req.user.userId,
    action: 'manual_add',
    entityType: 'prospect',
    entityId: prospect._id,
    outputSummary: `Human Override: Manually onboarded ${company} (${contactName}) — ICP score ${icpScore}`,
    status: 'success'
  });

  res.status(201).json({ success: true, prospect });
}));

// POST /api/prospects/:id/generate-sequence — Trigger AI to write outreach for an existing prospect
router.post('/:id/generate-sequence', authMiddleware, asyncHandler(async (req, res) => {
  const prospect = await Prospect.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!prospect) return res.status(404).json({ success: false, message: 'Prospect not found' });

  // Call Claude to generate exactly 3 emails
  let enrichmentData = { emails: [] };
  try {
    enrichmentData = await callClaude(
        `You are an expert sales copywriter. Generate a 3-step outreach sequence.`,
        `Company: ${prospect.company}, Contact: ${prospect.contactName}, ICP Score: ${prospect.icpScore}.
         Return JSON: { 
           "emails": [
             {"subject":"","body":"","sendDelay":"Day 1"},
             {"subject":"","body":"","sendDelay":"Day 4"},
             {"subject":"","body":"","sendDelay":"Day 8"}
           ]
         }`,
        true
      );
  } catch (err) {
    console.error(`[AI Error] Sequence generation failed for ${prospect.company}:`, err.message);
    return res.status(500).json({ success: false, message: `AI Error: ${err.message}` });
  }

  if (!enrichmentData || !enrichmentData.emails || enrichmentData.emails.length === 0) {
      return res.status(400).json({ success: false, message: 'AI returned an empty sequence. Please try again.' });
  }

  prospect.outreachSequences = enrichmentData.emails.map((e, i) => ({
    ...e, sequence: i, status: 'draft'
  }));
  
  await prospect.save();
  res.json({ success: true, prospect });
}));

// POST /api/prospects/:id/qualify — Convert prospect to a DEAL
router.post('/:id/qualify', authMiddleware, asyncHandler(async (req, res) => {
  try {
    const prospect = await Prospect.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!prospect) return res.status(404).json({ success: false, message: 'Prospect not found' });

    // 1. Mark as qualified
    prospect.status = 'qualified';
  await prospect.save();

  // 2. Use Claude to generate initial Deal Intelligence
  let riskScore = 20;
  let recoveryPlay = null;
  
  try {
    const dealIntel = await callClaude(
      `You are a senior Deal Intelligence Agent. Analyze this newly qualified prospect and generate a deal risk assessment.`,
      `Company: ${prospect.company}, Contact: ${prospect.contactName}, ICP Score: ${prospect.icpScore}.
       Return JSON: { 
         "riskScore": 0-100, 
         "signals": [{"type":"stakeholder_engagement","signal":"initial qualification complete","severity":"low"}],
         "recoveryPlay": {
            "actionType": "Executive outreach",
            "messageDraft": "Hi ${prospect.contactName}, looking forward to our next steps...",
            "talkingPoints": ["Proven ROI","Speed to value"]
         }
       }`,
      true
    );
    riskScore = dealIntel.riskScore;
    recoveryPlay = {
      ...dealIntel.recoveryPlay,
      generatedAt: new Date(),
      status: 'pending'
    };
  } catch (err) {
    console.warn('[Qualify] AI Deal Intel failed. Reason:', err.message);
  }

  // 3. Create the Real Deal
  const deal = await Deal.create({
    userId: req.user.userId,
    company: prospect.company,
    contactName: prospect.contactName,
    contactEmail: prospect.contactEmail,
    stage: 'Lead',
    value: Math.floor(Math.random() * 50000) + 15000,
    riskScore,
    riskSignals: [],
    recoveryPlay,
    prospectId: prospect._id
  });

  // 4. Log behavior
  await BehaviorEvent.create({
    userId: req.user.userId,
    entityType: 'prospect',
    entityId: prospect._id,
    eventType: 'prospect_qualified',
    metadata: { dealId: deal._id, company: prospect.company }
  });

  await AgentEvent.create({
    agentType: 'manual_override',
    userId: req.user.userId,
    action: 'deal_created',
    entityType: 'deal',
    entityId: deal._id,
    outputSummary: `Human Override: Converted ${prospect.company} to a live Deal. Initial risk assessment: ${riskScore}.`,
    status: 'success'
  });

  // 5. AUTO-CREATE RETENTION SIGNAL (Account Monitoring)
  // This links the Pipeline to the Retention Agent immediately
  await ChurnSignal.create({
    userId: req.user.userId,
    accountId: deal._id.toString(), // Use Deal ID as account ID for tracking
    companyName: prospect.company,
    contactEmail: prospect.contactEmail,
    contactName: prospect.contactName,
    contractValue: deal.value,
    plan: 'Enterprise (Auto-assigned)',
    renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year
    loginLast7d: 5, // Simulated initial usage
    loginLast30d: 5,
    featureAdoptionPct: 15,
    supportTickets30d: 0,
    sentimentScore: 0.5,
    churnScore: 10,
    scoredAt: new Date(),
    agentLastChecked: new Date()
  });

    res.json({ success: true, prospect, deal });
  } catch (err) {
    console.error(`[Qualify Error] Global crash: ${err.message}`);
    return res.status(500).json({ success: false, message: `System Error: ${err.message}` });
  }
}));

export default router;
