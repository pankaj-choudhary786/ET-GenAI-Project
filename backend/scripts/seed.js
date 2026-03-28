import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Prospect from '../models/Prospect.js';
import Deal from '../models/Deal.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import ChurnSignal from '../models/ChurnSignal.js';
import Battlecard from '../models/Battlecard.js';
import AgentEvent from '../models/AgentEvent.js';

mongoose.connect(process.env.MONGODB_URI);

async function seed() {
  try {
    console.log('Clearing collections...');
    await User.deleteMany();
    await Prospect.deleteMany();
    await Deal.deleteMany();
    await BehaviorEvent.deleteMany();
    await ChurnSignal.deleteMany();
    await Battlecard.deleteMany();
    await AgentEvent.deleteMany();

    console.log('Generating users...');
    const adminUser = await User.create({
      name: "Admin User", 
      email: "admin@salesai.com", 
      password: "Admin@123", 
      role: "admin",
      isActive: true
    });

    const demoUser = await User.create({
      name: "Rahul Sharma", 
      email: "demo@salesai.com", 
      password: "Demo@123", 
      role: "user", 
      plan: "pro", 
      company: "SalesAI Corp",
      isActive: true,
      agentPreferences: {
        prospecting: { autoSend: false, minIcpScore: 60 },
        dealIntel: { riskAlertThreshold: 70 },
        retention: { churnEscalateThreshold: 75 },
        competitive: { trackedCompetitors: ['Salesforce', 'HubSpot'] }
      }
    });

    const demoUserId = demoUser._id;

    console.log('Generating prospects...');
    const prospectsData = [
      { 
        company: 'FinPay Solutions', contactName: 'Alice Johnson', contactEmail: 'alice@finpaysolutions.com', contactTitle: 'VP Sales', status: 'discovered', icpScore: 78, fitReason: 'Growing fintech', triggerSignal: 'Recent Series B funding',
        outreachSequences: []
      },
      { 
        company: 'CloudWorks', contactName: 'Bob Smith', contactEmail: 'bob@cloudworks.io', contactTitle: 'CRO', status: 'discovered', icpScore: 85, fitReason: 'Scaling SaaS', triggerSignal: 'Hiring SDRs',
        outreachSequences: []
      },
      { 
        company: 'LogiChain', contactName: 'Diana Prince', contactEmail: 'diana@logichain.net', contactTitle: 'Sales Manager', status: 'scored', icpScore: 92, fitReason: 'Supply chain optimization', triggerSignal: 'Expanding to Europe',
        outreachSequences: [
          { sequence: 1, subject: 'Scaling your sales', body: 'Hi Diana, let\'s talk...', status: 'draft', aiReason: 'Targeting expansion' }
        ]
      },
      { 
        company: 'Stark Industries', contactName: 'Tony Stark', contactEmail: 'tony@stark.com', contactTitle: 'Owner', status: 'replied', icpScore: 99, fitReason: 'Enterprise', triggerSignal: 'Massive growth',
        outreachSequences: [
          { sequence: 1, subject: 'Armor your sales', body: 'Hi Tony...', status: 'sent', sentAt: new Date(Date.now() - 259200000), aiReason: 'High enterprise fit' }
        ]
      }
    ];

    const insertedProspects = await Prospect.insertMany(prospectsData.map(p => ({ ...p, userId: demoUserId })));

    console.log('Generating deals...');
    const dealsData = [
      { 
        company: 'Goblin Corp', stage: 'Demo', value: 15000, riskScore: 85, riskSignals: [{ type: 'no_engagement', signal: 'No activity for 14 days', severity: 'high' }], 
        recoveryPlay: { actionType: 'Send urgent check-in', messageDraft: 'Hi there...', talkingPoints: ['Timeline'], status: 'pending' }, 
        stageSince: new Date(Date.now() - 15 * 86400000), daysInCurrentStage: 15
      },
      { 
        company: 'Oscorp', stage: 'Proposal', value: 45000, riskScore: 72, riskSignals: [{ type: 'stage_stagnation', signal: 'Stalled in stage', severity: 'high' }], 
        recoveryPlay: { actionType: 'Offer discount', messageDraft: '10% off...', talkingPoints: ['Value'], status: 'pending' }, 
        stageSince: new Date(Date.now() - 25 * 86400000), daysInCurrentStage: 25
      },
      { 
        company: 'Daily Bugle', stage: 'Negotiation', value: 12000, riskScore: 50, riskSignals: [{ type: 'competitor_mention', signal: 'Competitor Salesforce mentioned', severity: 'medium' }], 
        stageSince: new Date(Date.now() - 10 * 86400000), daysInCurrentStage: 10
      }
    ];
    
    await Deal.insertMany(dealsData.map(d => ({ ...d, userId: demoUserId })));

    console.log('Generating churn signals...');
    const churnData = [
      { companyName: 'Initech', accountId: 'acc_initech', contractValue: 12000, churnScore: 82, loginLast30d: 5, loginLast7d: 0, supportTickets30d: 8, featureAdoptionPct: 30, sentimentScore: -0.6, interventionStatus: 'escalated' },
      { companyName: 'Soylent', accountId: 'acc_soylent', contractValue: 40000, churnScore: 78, loginLast30d: 10, loginLast7d: 1, supportTickets30d: 5, featureAdoptionPct: 45, sentimentScore: -0.4, interventionStatus: 'offer_sent' }
    ];

    await ChurnSignal.insertMany(churnData.map(c => ({ ...c, userId: demoUserId })));

    console.log('Generating battlecards...');
    await Battlecard.insertMany([
      { 
        competitor: "Salesforce", sections: { overview: "Leading CRM.", theirPitch: "No. 1 CRM", weaknesses: ["Complex"], ourStrengths: ["AI-native"], objectionHandlers: [], pricing: "High.", targetCustomer: "Enterprise" }, userId: demoUserId, lastScraped: new Date() 
      },
      { 
        competitor: "HubSpot", sections: { overview: "Marketing giant.", theirPitch: "All-in-one", weaknesses: ["Expensive at scale"], ourStrengths: ["Better sales agents"], objectionHandlers: [], pricing: "Tiered.", targetCustomer: "Mid-market" }, userId: demoUserId, lastScraped: new Date(Date.now() - 48*60*60*1000) 
      }
    ]);

    console.log('Generating behavior events...');
    const behaviorTypes = ['email_opened', 'link_clicked', 'email_sent', 'email_replied'];
    const bEvents = [];
    for(let i=0; i<15; i++) {
        bEvents.push({
            userId: demoUserId,
            eventType: behaviorTypes[i % behaviorTypes.length],
            entityId: insertedProspects[i % insertedProspects.length]._id,
            entityType: 'prospect',
            timestamp: new Date(Date.now() - Math.random() * 7 * 86400000)
        });
    }
    await BehaviorEvent.insertMany(bEvents);

    console.log('Generating agent events...');
    const agentTypes = ['prospecting', 'deal_intel', 'retention', 'competitive'];
    const aEvents = [];
    for(let i=0; i<20; i++) {
        aEvents.push({
            userId: demoUserId,
            agentType: agentTypes[i % agentTypes.length],
            action: 'Scan completed',
            status: 'success',
            outputSummary: `Automated scan completed with findings.`,
            createdAt: new Date(Date.now() - Math.random() * 7 * 86400000)
        });
    }
    await AgentEvent.insertMany(aEvents);

    console.log('Seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
