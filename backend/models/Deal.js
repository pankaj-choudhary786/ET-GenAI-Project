import mongoose from 'mongoose';

const riskSignalSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['no_engagement', 'competitor_mention', 'stakeholder_change', 'stage_stagnation', 'negative_sentiment']
  },
  signal: String, // human-readable description
  severity: { type: String, enum: ['low', 'medium', 'high'] },
  detectedAt: { type: Date, default: Date.now }
});

const recoveryPlaySchema = new mongoose.Schema({
  actionType: String, // e.g. "Send personalized email", "Offer discount", "Schedule call"
  messageDraft: String,
  talkingPoints: [String],
  competitorBattlecard: String, // competitor name if relevant
  generatedAt: Date,
  status: { type: String, enum: ['pending', 'actioned', 'dismissed'], default: 'pending' }
});

const dealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crmId: { type: String, unique: true, sparse: true }, // HubSpot deal ID
  company: { type: String, required: true },
  contactName: String,
  contactEmail: String,
  stage: {
    type: String,
    enum: ['Lead', 'Qualified', 'Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'Lead'
  },
  value: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  probability: { type: Number, min: 0, max: 100, default: 0 },
  ownerId: String,
  riskScore: { type: Number, min: 0, max: 100, default: 0 },
  riskSignals: [riskSignalSchema],
  recoveryPlay: recoveryPlaySchema,
  competitorMentions: [String],
  emailThreadSummary: String,
  lastActivityAt: Date,
  stageSince: Date, // when the deal entered the current stage
  daysInCurrentStage: { type: Number, default: 0 },
  agentLastScanned: Date,
  notes: String
}, { timestamps: true });

export default mongoose.model('Deal', dealSchema);
