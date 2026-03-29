import User from '../models/User.js';
import Prospect from '../models/Prospect.js';
import Deal from '../models/Deal.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import ChurnSignal from '../models/ChurnSignal.js';
import Battlecard from '../models/Battlecard.js';
import AgentEvent from '../models/AgentEvent.js';
import { callClaude } from './llm.js';
import { searchCompanies } from './scraper.js';

export async function performSeed(targetUserId = null) {
  try {
    console.log('[SeedService] Starting seed for userId:', targetUserId);

    // Clear existing data scoped to this user (or full reset if no user)
    if (targetUserId) {
      await Prospect.deleteMany({ userId: targetUserId });
      await Deal.deleteMany({ userId: targetUserId });
      await ChurnSignal.deleteMany({ userId: targetUserId });
      await Battlecard.deleteMany({ userId: targetUserId });
      await AgentEvent.deleteMany({ userId: targetUserId });
      console.log('[SeedService] Cleared existing data for user');
    } else {
      // Full admin reset — create a fresh demo user
      await User.deleteMany({ email: 'demo@salesai.com' });
      await Prospect.deleteMany();
      await Deal.deleteMany();
      await BehaviorEvent.deleteMany();
      await ChurnSignal.deleteMany();
      await Battlecard.deleteMany();
      await AgentEvent.deleteMany();
    }

    // Resolve the userId to seed for
    let userId;
    if (targetUserId) {
      userId = targetUserId;
    } else {
      // Ensure admin exists
      let admin = await User.findOne({ email: 'admin@salesai.com' });
      if (!admin) {
        admin = await User.create({
          name: 'Admin User',
          email: 'admin@salesai.com',
          password: 'Admin@123',
          role: 'admin',
          isActive: true
        });
      }
      // Create fresh demo user
      const demoUser = await User.create({
        name: 'Rahul Sharma',
        email: 'demo@salesai.com',
        password: 'Demo@123',
        role: 'user',
        plan: 'pro',
        company: 'SalesAI Corp',
        isActive: true,
        agentPreferences: {
          prospecting: { autoSend: false, minIcpScore: 60 },
          dealIntel: { riskAlertThreshold: 70 },
          retention: { churnEscalateThreshold: 75 },
          competitive: { trackedCompetitors: ['Salesforce', 'HubSpot'] }
        }
      });
      userId = demoUser._id;
    }

    // ─── 1. NO MOCK PROSPECTS ──────────────────────────────────────────
    console.log('[SeedService] Skipping mock prospects — Agent will run live.');

    // ─── 2. NO MOCK DEALS ───────────────────────────────────────────────
    console.log('[SeedService] Skipping mock deals — User will qualify real leads.');

    // ─── 3. NO MOCK CHURN SIGNALS ────────────────────────────────────────
    console.log('[SeedService] Skipping mock signals.');

    // ─── 4. BATTLECARDS (aligned with Battlecard schema) ────────────────────
    console.log('[SeedService] Seeding battlecards...');
    await Battlecard.insertMany([
      {
        userId,
        competitor: 'Salesforce',
        competitorWebsite: 'salesforce.com',
        sections: {
          overview: 'The dominant enterprise CRM, known for its massive ecosystem and extensive integrations.',
          theirPitch: 'The World\'s #1 CRM Platform — comprehensive, customizable, built for enterprise scale.',
          theirWeaknesses: ['Extremely complex to implement', 'Requires expensive consultants', 'Very high cost ($150-$300/user/month)', 'Over-engineered for SMBs'],
          ourCounterPositioning: ['AI-native from day one', 'Zero implementation needed', 'Autonomous agents do the work', '70% lower cost'],
          objectionHandlers: [
            { objection: 'We already use Salesforce', response: 'NexusAI works alongside Salesforce — our agents layer autonomous prospecting and deal intelligence on top of your existing CRM data.' }
          ],
          pricing: '$150-$300/user/month for Enterprise tiers. Requires additional consulting fees.',
          targetCustomer: 'Enterprise companies with 500+ employees and dedicated Salesforce admins.'
        },
        recentSignals: [
          { headline: 'Salesforce raises prices by 9% across all plans', source: 'TechCrunch', summary: 'Salesforce increased pricing citing AI investment costs', publishedAt: new Date(Date.now() - 2 * 86400000) },
          { headline: 'Salesforce Einstein AI gets major update', source: 'Forbes', summary: 'New AI features added to Salesforce CRM suite', publishedAt: new Date(Date.now() - 5 * 86400000) }
        ],
        lastScraped: new Date(),
        freshness: 'fresh'
      },
      {
        userId,
        competitor: 'HubSpot',
        competitorWebsite: 'hubspot.com',
        sections: {
          overview: 'Inbound marketing and CRM platform, strong in mid-market with an all-in-one approach.',
          theirPitch: 'The customer platform that helps businesses grow better — marketing, sales, and service in one.',
          theirWeaknesses: ['Sales tools less deep than dedicated CRMs', 'Gets expensive at scale ($800-$3200/month)', 'Limited autonomous AI for true outbound', 'Marketing-centric, not sales-first'],
          ourCounterPositioning: ['Sales-first AI DNA', 'Truly autonomous outbound agents', 'Real-time deal risk detection', 'Churn prediction built-in'],
          objectionHandlers: [
            { objection: 'We use HubSpot for marketing and sales', response: 'HubSpot is great for inbound. NexusAI adds autonomous outbound intelligence — we generate leads, score them, and write personalized emails without manual effort.' }
          ],
          pricing: '$800-$3200/month for Sales Hub Pro/Enterprise. Per-seat licensing adds up quickly.',
          targetCustomer: 'Mid-market B2B companies with inbound marketing focus and 50-500 employees.'
        },
        recentSignals: [
          { headline: 'HubSpot launches Breeze AI — automated marketing workflows', source: 'VentureBeat', summary: 'HubSpot enters AI race with Breeze, targeting marketing automation', publishedAt: new Date(Date.now() - 7 * 86400000) }
        ],
        lastScraped: new Date(Date.now() - 2 * 86400000),
        freshness: 'fresh'
      }
    ]);

    // ─── 5. AGENT EVENT LOGS (Empty for Realism) ────────────────────────────
    console.log('[SeedService] Initializing clean agent event logs.');

    console.log('[SeedService] ✅ Seeding complete for userId:', userId);
    return { success: true, message: 'Demo environment populated successfully.' };

  } catch (error) {
    console.error('[SeedService] ❌ Seeding error:', error.message);
    console.error(error);
    throw error;
  }
}
