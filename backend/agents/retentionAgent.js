import ChurnSignal from '../models/ChurnSignal.js';
import { callClaude } from '../services/llm.js';
import { logAgentStart, logAgentSuccess, logAgentFailure } from '../utils/agentLogger.js';

// Stub for slack alert functionality
async function sendSlackAlert(userId, message) {
  // Can be plugged into actual webhook integration later
  console.log(`[SLACK ALERT USER ${userId}]: ${message}`);
}

// Stub for email intervention
async function sendInterventionEmail(account, message) {
  console.log(`[INTERVENTION EMAIL TO ${account.companyName}]: ${message}`);
}

export async function runRetentionAgent(userId) {
  const agentEventId = await logAgentStart('retention', userId);
  try {
    const accounts = await ChurnSignal.find({ userId });

    for (const account of accounts) {
      // Step 1: Calculate churn score from signals
      let churnScore = 0;
      const loginDropPct = account.loginLast30d > 0 
        ? Math.max(0, ((account.loginLast30d - account.loginLast7d * 4) / account.loginLast30d) * 100)
        : 50;
      
      churnScore += Math.min(40, loginDropPct * 0.4);
      churnScore += Math.min(30, account.supportTickets30d * 5);
      churnScore += Math.min(20, (1 - account.featureAdoptionPct / 100) * 20);
      churnScore += account.sentimentScore < -0.2 ? 10 : 0;
      churnScore = Math.min(100, Math.round(churnScore));

      // Step 2: Use Claude for sentiment analysis and intervention decision
      const analysis = await callClaude(
        `You are a customer success expert analyzing account health to prevent churn.`,
        `Analyze this customer account and recommend an intervention.
         Account: ${account.companyName}, Contract: $${account.contractValue},
         Login drop: ${loginDropPct.toFixed(0)}%, Feature adoption: ${account.featureAdoptionPct}%,
         Support tickets (30d): ${account.supportTickets30d}, Sentiment score: ${account.sentimentScore},
         Current churn score: ${churnScore}.
         Return JSON: {
           "churnScore": 0-100,
           "primaryConcern": "one sentence",
           "interventionType": "none/nudge/offer/escalate",
           "interventionMessage": "full message to send (email or escalation brief)",
           "offerDetails": "specific offer if applicable (e.g., 20% discount for annual upgrade)",
           "urgency": "immediate/this-week/monitor"
         }`,
        true
      );

      // Step 3: Update churn signal record
      const statusMap = { none: 'none', nudge: 'nudge_sent', offer: 'offer_sent', escalate: 'escalated' };
      await ChurnSignal.findByIdAndUpdate(account._id, {
        churnScore: analysis.churnScore,
        interventionStatus: statusMap[analysis.interventionType] || 'none'
      });

      // Step 4: Execute intervention
      if (analysis.interventionType === 'nudge' || analysis.interventionType === 'offer') {
        await sendInterventionEmail(account, analysis.interventionMessage);
      } else if (analysis.interventionType === 'escalate') {
        await sendSlackAlert(userId, 
          `🔴 Churn Risk: ${account.companyName} (Score: ${analysis.churnScore}%)\n${analysis.primaryConcern}\nBrief: ${analysis.interventionMessage}`
        );
      }
    }

    await logAgentSuccess('retention', userId, agentEventId,
      `Analyzed ${accounts.length} accounts. Interventions triggered for at-risk accounts.`);

  } catch (err) {
    await logAgentFailure('retention', userId, agentEventId, err.message);
    throw err;
  }
}
