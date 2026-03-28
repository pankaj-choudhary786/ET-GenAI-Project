import express from 'express';
import Deal from '../models/Deal.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import Prospect from '../models/Prospect.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// POST /webhooks/hubspot
router.post('/hubspot', asyncHandler(async (req, res) => {
  // Normally validate signature with process.env.HUBSPOT_WEBHOOK_SECRET
  // Assuming array of events
  const events = req.body;
  if (Array.isArray(events)) {
    for (const evt of events) {
      if (evt.subscriptionType === 'deal.propertyChange') {
        const crmId = String(evt.objectId);
        await Deal.findOneAndUpdate(
          { crmId },
          { 
             stage: evt.propertyValue, // mapped roughly
             lastActivityAt: new Date()
          }
        );
      }
    }
  }

  res.status(200).json({ success: true, message: 'Webhook received' });
}));

// POST /webhooks/gmail
router.post('/gmail', asyncHandler(async (req, res) => {
  // In reality, Google Pub/Sub pushes base64 encoded messages
  // This logic is abstracted simplified logic for the assignment
  const { messageId, from, subject } = req.body; 

  const prospect = await Prospect.findOne({ contactEmail: from });
  if (prospect) {
    prospect.status = 'replied';
    await prospect.save();
    
    await BehaviorEvent.create({
      prospectId: prospect._id,
      userId: prospect.ownerId,
      eventType: 'email_replied',
      metadata: { messageId, subject }
    });
  }

  res.status(200).json({ success: true, message: 'Webhook received' });
}));

export default router;
