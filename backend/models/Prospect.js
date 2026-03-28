import mongoose from 'mongoose';

const outreachEmailSchema = new mongoose.Schema({
  emailId: String,
  subject: String,
  body: String,
  sequence: Number, // 1, 2, or 3 (follow-up emails)
  status: { type: String, enum: ['draft', 'approved', 'sent', 'rejected'], default: 'draft' },
  sentAt: Date,
  openCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  replied: { type: Boolean, default: 0 },
  aiReason: String // why the AI wrote this specific email
});

const prospectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  domain: String,
  industry: String,
  employeeCount: Number,
  fundingStage: String,
  fundingAmount: String,
  location: String,
  contactName: String,
  contactTitle: String,
  contactEmail: String,
  contactLinkedin: String,
  companyLinkedin: String,
  icpScore: { type: Number, min: 0, max: 100, default: 0 },
  fitReason: String, // AI explanation of why this is a good fit
  triggerSignal: String, // what triggered discovery (e.g. "Series A announced")
  status: {
    type: String,
    enum: ['discovered', 'scored', 'emailed', 'replied', 'qualified', 'dropped'],
    default: 'discovered'
  },
  outreachSequences: [outreachEmailSchema],
  crmContactId: String, // HubSpot contact ID once pushed
  crmDealId: String,
  notes: String,
  tags: [String],
  lastActivityAt: Date,
  agentLastScanned: Date
}, { timestamps: true });

export default mongoose.model('Prospect', prospectSchema);
