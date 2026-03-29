import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false }, // null for Google auth users
  googleId: { type: String, sparse: true },
  avatar: String,
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  company: String,
  jobTitle: String,
  timezone: { type: String, default: 'UTC' },
  emailsSent: { type: Number, default: 0 },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  lastAgentSummary: { type: String, default: '' },
  agentPreferences: {
    prospecting: {
      autoSend: { type: Boolean, default: false },
      minIcpScore: { type: Number, default: 60 },
      industry: { type: String, default: 'B2B SaaS' },
      companySize: { type: String, default: '100 - 500 EMP' },
      fundingStage: { type: String, default: 'Series B or Later' },
      location: { type: String, default: 'North America' }
    },
    dealIntel: {
      riskAlertThreshold: { type: Number, default: 70 }
    },
    retention: {
      churnEscalateThreshold: { type: Number, default: 75 }
    },
    competitive: {
      trackedCompetitors: { type: [String], default: [] }
    }
  },
  notificationPrefs: {
    emailAlerts: { type: Boolean, default: true },
    slackAlerts: { type: Boolean, default: false },
    dailySummary: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true }
  },
  connectedIntegrations: {
    hubspot: { type: Boolean, default: false },
    salesforce: { type: Boolean, default: false },
    gmail: { type: Boolean, default: false },
    slack: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
