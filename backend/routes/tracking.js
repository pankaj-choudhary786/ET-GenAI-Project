import express from 'express';
import BehaviorEvent from '../models/BehaviorEvent.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// GET /track/open/:emailId
router.get('/open/:emailId', asyncHandler(async (req, res) => {
  const { emailId } = req.params;

  // We should ideally fetch to get prospectId but emailId is unique enough to find the sent event.
  const sentEvent = await BehaviorEvent.findOne({ 'metadata.emailId': emailId, eventType: 'email_sent' });

  if (sentEvent) {
    await BehaviorEvent.create({
      prospectId: sentEvent.prospectId,
      userId: sentEvent.userId,
      eventType: 'email_opened',
      metadata: { emailId, timestamp: new Date() }
    });
  }

  // Return a 1x1 transparent GIF pixel
  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.set('Content-Type', 'image/gif');
  res.send(pixel);
}));

// GET /track/click/:emailId/:linkId
router.get('/click/:emailId/:linkId', asyncHandler(async (req, res) => {
  const { emailId, linkId } = req.params;

  const sentEvent = await BehaviorEvent.findOne({ 'metadata.emailId': emailId, eventType: 'email_sent' });
  
  if (sentEvent) {
    await BehaviorEvent.create({
      prospectId: sentEvent.prospectId,
      userId: sentEvent.userId,
      eventType: 'link_clicked',
      metadata: { emailId, linkId, timestamp: new Date() }
    });
  }

  // Retrieve destination from DB in real implementation, using fallback for demo
  const destinationUrl = req.query.url || process.env.CLIENT_URL;
  res.redirect(301, destinationUrl);
}));

export default router;
