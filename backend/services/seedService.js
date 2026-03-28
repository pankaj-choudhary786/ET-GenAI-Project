import User from '../models/User.js';
import Prospect from '../models/Prospect.js';
import Deal from '../models/Deal.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import ChurnSignal from '../models/ChurnSignal.js';
import Battlecard from '../models/Battlecard.js';
import AgentEvent from '../models/AgentEvent.js';
import bcryptjs from 'bcryptjs';

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

    // ─── 1. PROSPECTS (aligned with Prospect schema) ───────────────────────
    console.log('[SeedService] Seeding prospects...');
    await Prospect.insertMany([
      {
        userId,
        company: 'FinPay Solutions',
        industry: 'Fintech',
        employeeCount: 180,
        fundingStage: 'Series B',
        contactName: 'Alice Johnson',
        contactTitle: 'VP Sales',
        contactEmail: 'alice@finpaysolutions.com',
        icpScore: 78,
        fitReason: 'Growing fintech company with recent Series B funding, actively scaling their sales team.',
        triggerSignal: 'Recent Series B funding of $22M announced',
        status: 'discovered',
        outreachSequences: []
      },
      {
        userId,
        company: 'CloudWorks',
        industry: 'B2B SaaS',
        employeeCount: 250,
        fundingStage: 'Series C',
        contactName: 'Bob Smith',
        contactTitle: 'CRO',
        contactEmail: 'bob@cloudworks.io',
        icpScore: 85,
        fitReason: 'Scaling SaaS company with strong revenue growth, actively hiring SDRs indicating sales expansion.',
        triggerSignal: 'Hiring 12 SDRs this quarter',
        status: 'discovered',
        outreachSequences: []
      },
      {
        userId,
        company: 'LogiChain',
        industry: 'Supply Chain Tech',
        employeeCount: 320,
        fundingStage: 'Series B',
        contactName: 'Diana Prince',
        contactTitle: 'Sales Manager',
        contactEmail: 'diana@logichain.net',
        icpScore: 92,
        fitReason: 'Supply chain optimization company expanding to Europe — perfect ICP with high urgency.',
        triggerSignal: 'Expanding to 5 new European markets in Q2',
        status: 'scored',
        outreachSequences: [
          {
            subject: 'Scaling your European sales pipeline — here\'s how',
            body: 'Hi Diana,\n\nSaw that LogiChain is expanding to Europe this quarter — exciting move.\n\nWe help supply chain companies like yours automate their outbound pipeline so the sales team can focus on closing rather than prospecting.\n\nWould it be worth a 15-min call this week?\n\nBest,\nSalesAI',
            sequence: 1,
            status: 'draft',
            aiReason: 'European expansion signal makes timing perfect for outreach'
          }
        ]
      },
      {
        userId,
        company: 'Stark Industries',
        industry: 'Enterprise Tech',
        employeeCount: 5000,
        fundingStage: 'Public',
        contactName: 'Tony Stark',
        contactTitle: 'CTO',
        contactEmail: 'tony@stark.com',
        icpScore: 99,
        fitReason: 'Enterprise company with massive growth trajectory and strong sales infrastructure need.',
        triggerSignal: 'Published RFP for AI sales automation tooling',
        status: 'replied',
        outreachSequences: [
          {
            subject: 'Re: AI for your sales team — NexusAI',
            body: 'Hi Tony,\n\nThank you for your reply! Great to hear you\'re evaluating AI sales tools.\n\nNexusAI\'s autonomous agents handle prospecting, deal risk, and churn prediction without manual intervention.\n\nLet\'s schedule a demo — what\'s your availability?\n\nBest,\nSalesAI Team',
            sequence: 1,
            status: 'sent',
            sentAt: new Date(Date.now() - 2 * 86400000),
            aiReason: 'High ICP score and active RFP makes this a hot lead'
          }
        ]
      }
    ]);

    // ─── 2. DEALS (aligned with Deal schema) ───────────────────────────────
    console.log('[SeedService] Seeding deals...');
    await Deal.insertMany([
      {
        userId,
        company: 'Goblin Corp',
        contactName: 'Norman Osborn',
        contactEmail: 'norman@goblincorp.com',
        stage: 'Proposal',
        value: 15000,
        riskScore: 85,
        riskSignals: [
          { type: 'no_engagement', signal: 'No email response for 14 days', severity: 'high', detectedAt: new Date() }
        ],
        recoveryPlay: {
          actionType: 'Send urgent check-in',
          messageDraft: 'Hi Norman,\n\nI wanted to check in on our proposal — wanted to make sure it addresses everything you need. Happy to jump on a quick call to discuss any questions.\n\nBest,\nSalesAI Team',
          talkingPoints: ['Timeline alignment', 'Budget flexibility', 'Pilot program option'],
          generatedAt: new Date(),
          status: 'pending'
        },
        stageSince: new Date(Date.now() - 15 * 86400000),
        daysInCurrentStage: 15
      },
      {
        userId,
        company: 'Oscorp',
        contactName: 'Otto Octavius',
        contactEmail: 'otto@oscorp.com',
        stage: 'Negotiation',
        value: 45000,
        riskScore: 72,
        riskSignals: [
          { type: 'stage_stagnation', signal: 'Stalled in Negotiation for 25+ days', severity: 'high', detectedAt: new Date() },
          { type: 'competitor_mention', signal: 'Competitor Salesforce mentioned in last email', severity: 'medium', detectedAt: new Date() }
        ],
        recoveryPlay: {
          actionType: 'Offer competitive discount + schedule exec call',
          messageDraft: 'Hi Otto,\n\nI know negotiations can take time, but I want to make sure we\'re the right fit for Oscorp. I can offer a 15% launch discount if we can finalize by end of month.\n\nWould it help to get our exec team on a call?\n\nBest,\nSalesAI',
          talkingPoints: ['Salesforce comparison — our agents vs their manual workflow', 'ROI calculator', '15% discount offer'],
          generatedAt: new Date(),
          status: 'pending'
        },
        stageSince: new Date(Date.now() - 25 * 86400000),
        daysInCurrentStage: 25
      },
      {
        userId,
        company: 'Daily Bugle Media',
        contactName: 'J. Jonah Jameson',
        contactEmail: 'jj@dailybugle.com',
        stage: 'Demo',
        value: 12000,
        riskScore: 30,
        riskSignals: [],
        stageSince: new Date(Date.now() - 5 * 86400000),
        daysInCurrentStage: 5
      },
      {
        userId,
        company: 'Rand Enterprises',
        contactName: 'Danny Rand',
        contactEmail: 'danny@rand.com',
        stage: 'Qualified',
        value: 55000,
        riskScore: 5,
        riskSignals: [],
        stageSince: new Date(Date.now() - 2 * 86400000),
        daysInCurrentStage: 2
      }
    ]);

    // ─── 3. CHURN SIGNALS (aligned with ChurnSignal schema) ─────────────────
    console.log('[SeedService] Seeding churn signals...');
    await ChurnSignal.insertMany([
      {
        userId,
        accountId: `acc_initech_${userId}`,
        companyName: 'Initech',
        contactEmail: 'bill@initech.com',
        contractValue: 12000,
        churnScore: 82,
        loginLast7d: 0,
        loginLast30d: 5,
        loginTrend: [4, 3, 2, 1, 0, 0, 0],
        featureAdoptionPct: 30,
        supportTickets30d: 8,
        sentimentScore: -0.6,
        interventionStatus: 'escalated',
        scoredAt: new Date(),
        agentLastChecked: new Date()
      },
      {
        userId,
        accountId: `acc_soylent_${userId}`,
        companyName: 'Soylent Corp',
        contactEmail: 'ceo@soylent.com',
        contractValue: 40000,
        churnScore: 78,
        loginLast7d: 1,
        loginLast30d: 10,
        loginTrend: [8, 6, 4, 3, 2, 1, 1],
        featureAdoptionPct: 45,
        supportTickets30d: 5,
        sentimentScore: -0.4,
        interventionStatus: 'offer_sent',
        scoredAt: new Date(),
        agentLastChecked: new Date()
      },
      {
        userId,
        accountId: `acc_umbrella_${userId}`,
        companyName: 'Umbrella Inc',
        contactEmail: 'wesker@umbrella.com',
        contractValue: 90000,
        churnScore: 60,
        loginLast7d: 3,
        loginLast30d: 20,
        loginTrend: [10, 8, 7, 5, 4, 3, 3],
        featureAdoptionPct: 60,
        supportTickets30d: 2,
        sentimentScore: -0.1,
        interventionStatus: 'nudge_sent',
        scoredAt: new Date(),
        agentLastChecked: new Date()
      },
      {
        userId,
        accountId: `acc_massive_${userId}`,
        companyName: 'Massive Dynamic',
        contactEmail: 'bell@massivedynamic.com',
        contractValue: 80000,
        churnScore: 18,
        loginLast7d: 10,
        loginLast30d: 42,
        loginTrend: [12, 14, 13, 15, 14, 10, 10],
        featureAdoptionPct: 85,
        supportTickets30d: 0,
        sentimentScore: 0.8,
        interventionStatus: 'none',
        scoredAt: new Date(),
        agentLastChecked: new Date()
      }
    ]);

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
          weaknesses: ['Extremely complex to implement', 'Requires expensive consultants', 'Very high cost ($150-$300/user/month)', 'Over-engineered for SMBs'],
          ourStrengths: ['AI-native from day one', 'Zero implementation needed', 'Autonomous agents do the work', '70% lower cost'],
          objectionHandlers: [
            { objection: 'We already use Salesforce', response: 'NexusAI works alongside Salesforce — our agents layer autonomous prospecting and deal intelligence on top of your existing CRM data.' }
          ],
          pricing: '$150-$300/user/month for Enterprise tiers. Requires additional consulting fees.',
          targetCustomer: 'Enterprise companies with 500+ employees and dedicated Salesforce admins.'
        },
        marketSignals: [
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
          weaknesses: ['Sales tools less deep than dedicated CRMs', 'Gets expensive at scale ($800-$3200/month)', 'Limited autonomous AI for true outbound', 'Marketing-centric, not sales-first'],
          ourStrengths: ['Sales-first AI DNA', 'Truly autonomous outbound agents', 'Real-time deal risk detection', 'Churn prediction built-in'],
          objectionHandlers: [
            { objection: 'We use HubSpot for marketing and sales', response: 'HubSpot is great for inbound. NexusAI adds autonomous outbound intelligence — we generate leads, score them, and write personalized emails without manual effort.' }
          ],
          pricing: '$800-$3200/month for Sales Hub Pro/Enterprise. Per-seat licensing adds up quickly.',
          targetCustomer: 'Mid-market B2B companies with inbound marketing focus and 50-500 employees.'
        },
        marketSignals: [
          { headline: 'HubSpot launches Breeze AI — automated marketing workflows', source: 'VentureBeat', summary: 'HubSpot enters AI race with Breeze, targeting marketing automation', publishedAt: new Date(Date.now() - 7 * 86400000) }
        ],
        lastScraped: new Date(Date.now() - 2 * 86400000),
        freshness: 'fresh'
      },
      {
        userId,
        competitor: 'Pipedrive',
        competitorWebsite: 'pipedrive.com',
        sections: {
          overview: 'Pipeline-focused CRM designed for sales teams, popular with SMBs for its simplicity.',
          theirPitch: 'The CRM that\'s easy to use, designed by salespeople for salespeople.',
          weaknesses: ['No autonomous AI agents', 'Limited automation depth', 'No AI-written outreach', 'Weak analytics and forecasting'],
          ourStrengths: ['Agents that generate and qualify leads automatically', 'AI-written personalized cold emails', 'Deal risk detection before deals go cold', 'Churn prediction built-in'],
          objectionHandlers: [
            { objection: 'Pipedrive is simple and our team loves it', response: 'NexusAI integrates with Pipedrive and adds the autonomous layer on top — your team keeps their workflow, and the agents do the prospecting and risk monitoring.' }
          ],
          pricing: '$15-$99/user/month. Simple and affordable.',
          targetCustomer: 'Small and mid-market sales teams looking for a simple pipeline management tool.'
        },
        marketSignals: [],
        lastScraped: new Date(),
        freshness: 'fresh'
      }
    ]);

    // ─── 5. AGENT EVENT LOGS ────────────────────────────────────────────────
    console.log('[SeedService] Seeding agent events...');
    const agentLogs = [
      { agentType: 'prospecting', action: 'Found 5 new high-ICP prospects above score 80. Outreach sequences generated via Claude AI.', outputSummary: 'Discovered FinPay Solutions (78), CloudWorks (85), LogiChain (92). Email sequences queued for approval.' },
      { agentType: 'deal_intel', action: 'Risk scan complete. Flagged 2 deals at critical risk — Goblin Corp (85) and Oscorp (72).', outputSummary: 'Goblin Corp has 14 days of silence. Oscorp mentioned Salesforce as a competitor. Recovery plays generated.' },
      { agentType: 'retention', action: 'Churn prediction run. Initech elevated to score 82 — escalation triggered.', outputSummary: 'Initech: 0 logins last 7 days, 8 support tickets. CSM escalation email dispatched automatically.' },
      { agentType: 'competitive', action: 'Battlecard update: Salesforce raised prices 9%. HubSpot launched Breeze AI.', outputSummary: 'Scraped salesforce.com and hubspot.com — 3 new market signals detected and added to battlecards.' },
      { agentType: 'prospecting', action: 'Outreach email approved and sent to diana@logichain.net (Step 1 of 3).', outputSummary: 'Email delivered. Open tracking enabled. Follow-up Step 2 scheduled for Day 4.' },
      { agentType: 'deal_intel', action: 'Stakeholder change detected at Oscorp — new VP of Finance identified.', outputSummary: 'LinkedIn signal: Otto Octavius changed title. Recovery play updated with new talking points.' },
      { agentType: 'retention', action: 'Soylent Corp offer playbook triggered. Discount email queued for approval.', outputSummary: 'Churn score 78. Automated retention offer drafted — 20% renewal discount.' },
      { agentType: 'competitive', action: 'Pipedrive battlecard refreshed. No new signals detected.', outputSummary: 'Last scraped: pipedrive.com pricing and feature pages. Content hash unchanged.' }
    ];

    await AgentEvent.insertMany(
      agentLogs.map((log, i) => ({
        userId,
        agentType: log.agentType,
        action: log.action,
        outputSummary: log.outputSummary,
        status: 'success',
        createdAt: new Date(Date.now() - i * 4 * 3600000) // stagger by 4 hours each
      }))
    );

    console.log('[SeedService] ✅ Seeding complete for userId:', userId);
    return { success: true, message: 'Demo environment populated successfully.' };

  } catch (error) {
    console.error('[SeedService] ❌ Seeding error:', error.message);
    console.error(error);
    throw error;
  }
}
