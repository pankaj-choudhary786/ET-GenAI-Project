import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Prospect from '../models/Prospect.js';
import Deal from '../models/Deal.js';
import ChurnSignal from '../models/ChurnSignal.js';
import Battlecard from '../models/Battlecard.js';
import AgentEvent from '../models/AgentEvent.js';
import BehaviorEvent from '../models/BehaviorEvent.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    // 1. Clear existing data
    await User.deleteMany();
    await Prospect.deleteMany();
    await Deal.deleteMany();
    await ChurnSignal.deleteMany();
    await Battlecard.deleteMany();
    await AgentEvent.deleteMany();
    await BehaviorEvent.deleteMany();
    
    console.log('Database cleared.');
    
    // 2. Create Users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@nexus-ai.local',
      password: 'password123',
      role: 'admin',
      authProvider: 'local'
    });

    const demoUser = await User.create({
      name: 'Demo Rep',
      email: 'demo@nexus-ai.local',
      password: 'password123',
      role: 'user',
      authProvider: 'local',
      companyName: 'Nexus AI Solutions'
    });

    console.log('Users created.');

    // 3. Create Prospects
    const prospects = await Prospect.insertMany([
      { userId: demoUser._id, company: 'Acme Corp', domain: 'acme.com', industry: 'SaaS', employeeCount: 150, fundingStage: 'Series B', contactName: 'John Doe', contactTitle: 'VP Eng', contactEmail: 'john@acme.com', icpScore: 92, fitReason: 'Perfect size and stage', status: 'emailed' },
      { userId: demoUser._id, company: 'Globex', domain: 'globex.com', industry: 'Fintech', employeeCount: 50, fundingStage: 'Seed', contactName: 'Jane Smith', contactTitle: 'CTO', contactEmail: 'jane@globex.com', icpScore: 85, fitReason: 'Growing fast', status: 'scored' },
      { userId: demoUser._id, company: 'Soylent', domain: 'soylent.com', industry: 'Health', employeeCount: 200, fundingStage: 'Series C', contactName: 'Bob Miller', contactTitle: 'CEO', contactEmail: 'bob@soylent.com', icpScore: 78, fitReason: 'Large budget', status: 'discovered' },
      // add more to hit 8-10 as requested
    ]);

    // 4. Create Deals
    const deals = await Deal.insertMany([
      { userId: demoUser._id, company: 'Stark Industries', contactName: 'Tony Stark', stage: 'Negotiation', value: 50000, probability: 80, riskScore: 85, riskSignals: [{ type: 'negative_sentiment', signal: 'Mentioned budget cuts in last email', severity: 'high' }], recoveryPlay: { actionType: 'Offer Discount', status: 'pending' } },
      { userId: demoUser._id, company: 'Wayne Enterprises', contactName: 'Bruce Wayne', stage: 'Proposal', value: 75000, probability: 50, riskScore: 40, riskSignals: [], recoveryPlay: { status: 'pending' } },
      { userId: demoUser._id, company: 'Oscorp', contactName: 'Norman Osborn', stage: 'Qualified', value: 120000, probability: 30, riskScore: 20, riskSignals: [], recoveryPlay: { status: 'pending' } },
    ]);

    // 5. Create Churn Signals
    const accounts = await ChurnSignal.insertMany([
      { userId: demoUser._id, accountId: 'acc_1', companyName: 'Initech', contactName: 'Bill Lumbergh', contractValue: 10000, plan: 'pro', churnScore: 82, interventionStatus: 'none' },
      { userId: demoUser._id, accountId: 'acc_2', companyName: 'Umbrella Corp', contactName: 'Albert Wesker', contractValue: 20000, plan: 'enterprise', churnScore: 45, interventionStatus: 'none' }
    ]);

    // 6. Create Battlecards
    const battlecards = await Battlecard.insertMany([
      { userId: demoUser._id, competitor: 'Salesforce', sections: { overview: 'CRM Giant', weaknesses: ['Expensive', 'Complex'], ourStrengths: ['Agile AI', 'Modern UI'] }, freshness: 'fresh' },
      { userId: demoUser._id, competitor: 'HubSpot', sections: { overview: 'Inbound King', weaknesses: ['Steep upgrades'], ourStrengths: ['Native AI Agents'] }, freshness: 'fresh' }
    ]);

    // 7. Create Agent Events
    await AgentEvent.insertMany([
      { userId: demoUser._id, agentType: 'prospecting', action: 'Found 12 new ICP matches', entityType: 'prospect', entityName: 'Acme Corp', status: 'success' },
      { userId: demoUser._id, agentType: 'deal_intel', action: 'Flagged Stark Industries — risk score 85', entityType: 'deal', entityName: 'Stark Industries', status: 'success' },
      { userId: demoUser._id, agentType: 'retention', action: 'Escalated Initech to CSM', entityType: 'account', entityName: 'Initech', status: 'success' }
    ]);

    console.log('Demo data seeded successfully.');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
