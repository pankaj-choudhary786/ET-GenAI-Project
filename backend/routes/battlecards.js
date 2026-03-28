import express from 'express';
import Battlecard from '../models/Battlecard.js';
import Deal from '../models/Deal.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { runCompetitiveAgent } from '../agents/competitiveAgent.js';

const router = express.Router();
router.use(authMiddleware);

// GET /api/battlecards
router.get('/', asyncHandler(async (req, res) => {
  let battlecards = await Battlecard.find({ userId: req.user.userId }).lean();
  
  // Determine freshness
  battlecards = battlecards.map(card => {
    let freshness = 'needs-update';
    if (card.lastScraped) {
      const hours = (Date.now() - new Date(card.lastScraped).getTime()) / (1000 * 60 * 60);
      if (hours < 24) freshness = 'fresh';
      else if (hours < 72) freshness = 'stale';
    }
    return { ...card, freshness };
  });

  res.json({ success: true, count: battlecards.length, battlecards });
}));

// GET /api/battlecards/:competitor
router.get('/:competitor', asyncHandler(async (req, res) => {
  const competitor = decodeURIComponent(req.params.competitor);
  const battlecard = await Battlecard.findOne({ competitor, userId: req.user.userId }).lean();
  
  if (!battlecard) return res.status(404).json({ success: false, message: 'Battlecard not found' });
  res.json({ success: true, battlecard });
}));

// POST /api/battlecards/refresh/:competitor
router.post('/refresh/:competitor', asyncHandler(async (req, res) => {
  const competitor = decodeURIComponent(req.params.competitor);
  
  // Synchronous for demo purposes
  await runCompetitiveAgent(competitor, req.user.userId);
  
  const updatedCard = await Battlecard.findOne({ competitor, userId: req.user.userId }).lean();
  res.json({ success: true, battlecard: updatedCard, message: `Refreshed battlecard for ${competitor}` });
}));

// POST /api/battlecards/:id/push-to-deals
router.post('/:id/push-to-deals', asyncHandler(async (req, res) => {
  const battlecard = await Battlecard.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!battlecard) return res.status(404).json({ success: false, message: 'Battlecard not found' });

  const deals = await Deal.find({
    userId: req.user.userId,
    $or: [
      { riskSignals: { $elemMatch: { signal: { $regex: battlecard.competitor, $options: 'i' } } } },
      { competitorMentions: { $regex: battlecard.competitor, $options: 'i' } }
    ]
  });

  for (const deal of deals) {
    const note = `\n[Competitive Intelligence] Pushed ${battlecard.competitor} battlecard insights.`;
    deal.notes = (deal.notes || '') + note;
    await deal.save();
  }

  res.json({ success: true, dealsUpdated: deals.length });
}));

export default router;
