import mongoose from 'mongoose';

const objectionSchema = new mongoose.Schema({
  objection: String,
  response: String
});

const marketSignalSchema = new mongoose.Schema({
  headline: String,
  source: String,
  url: String,
  summary: String,
  publishedAt: Date,
  detectedAt: { type: Date, default: Date.now }
});

const battlecardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  competitor: { type: String, required: true },
  competitorWebsite: String,
  sections: {
    overview: String,
    theirPitch: String,
    weaknesses: [String],
    ourStrengths: [String],
    objectionHandlers: [objectionSchema],
    pricing: String,
    targetCustomer: String
  },
  marketSignals: [marketSignalSchema],
  activeDeals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }], // deals where this competitor is mentioned
  embeddingHash: String, // MD5 hash of scraped content for diff detection
  lastScraped: Date,
  freshness: { type: String, enum: ['fresh', 'stale', 'outdated'], default: 'fresh' }
}, { timestamps: true });

export default mongoose.model('Battlecard', battlecardSchema);
