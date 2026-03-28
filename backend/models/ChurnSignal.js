import mongoose from 'mongoose';

const interventionSchema = new mongoose.Schema({
  type: { type: String, enum: ['nudge', 'offer', 'escalation'] },
  content: String, // email body or escalation brief
  sentAt: Date,
  escalatedTo: String // CSM name/email if escalated
});

const churnSignalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: String, required: true },
  companyName: { type: String, required: true },
  contactEmail: String,
  contactName: String,
  contractValue: Number,
  plan: String,
  renewalDate: Date,
  loginLast7d: { type: Number, default: 0 },
  loginLast30d: { type: Number, default: 0 },
  loginTrend: [Number], // last 30 daily login counts for sparkline
  featureAdoptionPct: { type: Number, default: 0 },
  supportTickets30d: { type: Number, default: 0 },
  sentimentScore: { type: Number, min: -1, max: 1, default: 0 }, // NLP from emails
  churnScore: { type: Number, min: 0, max: 100, default: 0 },
  churnFactors: {
    loginDropWeight: Number,
    ticketSpikeWeight: Number,
    sentimentWeight: Number,
    adoptionWeight: Number
  },
  interventionStatus: {
    type: String,
    enum: ['none', 'nudge_sent', 'offer_sent', 'escalated'],
    default: 'none'
  },
  interventionHistory: [interventionSchema],
  scoredAt: Date,
  agentLastChecked: Date
}, { timestamps: true });

export default mongoose.model('ChurnSignal', churnSignalSchema);
