import mongoose from 'mongoose';

const agentEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agentType: {
    type: String,
    enum: ['prospecting', 'deal_intel', 'retention', 'competitive'],
    required: true
  },
  action: String, // short summary: "Found 4 new ICP matches", "Flagged Acme Corp (risk 82)"
  entityType: { type: String, enum: ['prospect', 'deal', 'account', 'battlecard'] },
  entityId: mongoose.Schema.Types.ObjectId,
  entityName: String,
  outputSummary: String, // longer detail for the admin log
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },
  errorMessage: String,
  metadata: mongoose.Schema.Types.Mixed // any extra agent-specific data
}, { timestamps: true });

// Index for fast feed queries
agentEventSchema.index({ userId: 1, createdAt: -1 });
agentEventSchema.index({ agentType: 1, createdAt: -1 });

export default mongoose.model('AgentEvent', agentEventSchema);
