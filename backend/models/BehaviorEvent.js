import mongoose from 'mongoose';

const behaviorEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entityType: { type: String, enum: ['prospect', 'account', 'deal'] },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  emailId: String, // unique ID for email tracking
  eventType: {
    type: String,
    enum: ['email_opened', 'link_clicked', 'email_replied', 'website_visit', 'login', 'feature_used', 'support_ticket', 'email_sent', 'prospect_qualified']
  },
  metadata: {
    subject: String,     // for email events
    url: String,         // for link clicks
    page: String,        // for website visits
    feature: String,     // for feature_used
    ticketId: String,    // for support_ticket
    ipAddress: String,
    userAgent: String
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for fast lookups by entity and event type
behaviorEventSchema.index({ entityId: 1, eventType: 1, timestamp: -1 });
behaviorEventSchema.index({ emailId: 1 });

export default mongoose.model('BehaviorEvent', behaviorEventSchema);
