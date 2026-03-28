import express from 'express';
import Prospect from '../models/Prospect.js';
import protect from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// @route   GET /api/outbox
router.get('/', async (req, res, next) => {
  try {
    const { agentType, page = 1, limit = 20 } = req.query;
    let query = { userId: req.user._id, 'outreachSequences.status': 'draft' };

    // Hackathon mockup: If filter by agentType, let's just use the query context
    const prospects = await Prospect.find(query).select('company contactName outreachSequences');

    // Flatten all drafts
    let allDrafts = [];
    prospects.forEach(p => {
      p.outreachSequences.forEach(s => {
        if (s.status === 'draft') {
          allDrafts.push({
            id: s._id,
            prospectId: p._id,
            company: p.company,
            contactName: p.contactName,
            subject: s.subject,
            body: s.body,
            sequence: s.sequence,
            aiReason: s.aiReason,
            createdAt: s._id.getTimestamp()
          });
        }
      });
    });

    const start = (page - 1) * limit;
    const paginated = allDrafts.slice(start, start + Number(limit));

    res.json({
      success: true,
      data: paginated,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: allDrafts.length,
        pages: Math.ceil(allDrafts.length / limit)
      }
    });
  } catch (error) { next(error); }
});

// Outbox approve/reject map directly to prospect endpoints for simplicity
// See routes/prospects.js for approval logic

export default router;
