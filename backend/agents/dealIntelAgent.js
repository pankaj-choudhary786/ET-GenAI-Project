import Deal from '../models/Deal.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import { callClaude } from '../services/llm.js';
import { logAgentStart, logAgentSuccess, logAgentFailure } from '../utils/agentLogger.js';

// Stub for slack alert functionality
async function sendSlackAlert(userId, message) {
  // Can be plugged into actual webhook integration later
  console.log(`[SLACK ALERT USER ${userId}]: ${message}`);
}

export async function runDealIntelAgent(userId) {
  const agentEventId = await logAgentStart('deal_intel', userId);
  try {
    // Step 1: Fetch all open deals for this user
    const user = await User.findById(userId);
    const hubspotKey = user.integrations?.hubspot?.apiKey || process.env.HUBSPOT_API_KEY;

    const deals = await Deal.find({ 
      userId, 
      stage: { $nin: ['Closed Won', 'Closed Lost'] } 
    });

    let flaggedCount = 0;

    for (const deal of deals) {
      // Step 2: Gather real signals from HubSpot if possible
      let crmNotes = [];
      if (deal.hubspotId && hubspotKey) {
          const { getHubSpotEngagementNotes } = await import('../services/hubspot.js');
          crmNotes = await getHubSpotEngagementNotes(hubspotKey, deal.hubspotId);
      }

      const daysSinceActivity = Math.floor((Date.now() - new Date(deal.lastActivityAt || deal.createdAt)) / (1000 * 60 * 60 * 24));
      const daysInStage = Math.floor((Date.now() - new Date(deal.stageEnteredAt || deal.createdAt)) / (1000 * 60 * 60 * 24));
      
      const signals = [];
      if (daysSinceActivity > 10) signals.push(`No activity for ${daysSinceActivity} days`);
      if (daysInStage > 21) signals.push(`Stuck in ${deal.stage} stage for ${daysInStage} days`);
      if (crmNotes.length > 0) signals.push(`Analyzing ${crmNotes.length} recent CRM notes for competitor mentions or sentiment drop.`);

      // Step 3: Use Claude to assess risk and generate recovery
      const riskAssessment = await callClaude(
        `You are an expert sales coach analyzing deal risk and creating recovery strategies.`,
        `Analyze this sales deal and provide a risk score and recovery plan.
         Deal: Company: ${deal.company}, Stage: ${deal.stage}, Value: $${deal.value}, 
         Days since last activity: ${daysSinceActivity}, Days in current stage: ${daysInStage},
         Detected signals: ${signals.join(', ')}.
         Return JSON: { 
           "riskScore": 0-100, 
           "riskLevel": "low/medium/high",
           "primaryRisk": "one sentence explaining the biggest risk",
           "signals": [{"type": "no_engagement/competitor_mention/... ", "signal": "description", "severity": "low/medium/high"}],
           "recoveryPlay": {
             "action": "specific action to take",
             "messageDraft": "full email draft to send to prospect",
             "talkingPoints": ["point1", "point2", "point3", "point4", "point5"],
             "urgency": "immediate/this-week/monitor"
           }
         }`,
        true
      );

      // Step 4: Update deal in MongoDB
      await Deal.findByIdAndUpdate(deal._id, {
        riskScore: riskAssessment.riskScore,
        riskSignals: riskAssessment.signals,
        recoveryPlay: {
          ...riskAssessment.recoveryPlay,
          generatedAt: new Date()
        }
      });

      // Step 5: If high risk, send Slack alert
      if (riskAssessment.riskScore >= 70) {
        flaggedCount++;
        await sendSlackAlert(userId, 
          `🚨 Deal Alert: ${deal.company} — Risk Score ${riskAssessment.riskScore}%\n${riskAssessment.primaryRisk}`
        );
      }
    }

    const summaryMsg = `Scan Complete: Analyzed ${deals.length} active deals. Flagged ${flaggedCount} high-risk accounts requiring immediate recovery action.`;
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(userId, { lastAgentSummary: summaryMsg });
    await logAgentSuccess('deal_intel', userId, agentEventId, summaryMsg);
    
    return { success: true, summary: summaryMsg, scanned: deals.length, flagged: flaggedCount };

  } catch (err) {
    await logAgentFailure('dealIntel', userId, agentEventId, err.message);
    throw err;
  }
}
