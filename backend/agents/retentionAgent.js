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
      // Step 1: Calculate churn score from baseline signals
      let churnScore = 0;
      const loginDropPct = account.loginLast30d > 0 
        ? Math.max(0, ((account.loginLast30d - account.loginLast7d * 4) / account.loginLast30d) * 100)
        : 50;
      
      churnScore += Math.min(40, loginDropPct * 0.4);
      churnScore += Math.min(30, account.supportTickets30d * 5);
      churnScore += Math.min(20, (1 - account.featureAdoptionPct / 100) * 20);

      // Step 2: Use Claude for deep sentiment analysis of support notes
      const notesToAnalyze = account.supportNotes?.slice(-3).join('\n\n') || "No recent notes.";
      const analysis = await callClaude(
        `You are a customer success expert. Analyze account health and sentiment to prevent churn.`,
        `Recent support tickets for ${account.companyName}:
         ${notesToAnalyze}
         
         Context: Login drop: ${loginDropPct.toFixed(0)}%, Feature adoption: ${account.featureAdoptionPct}%,
         Support tickets (30d): ${account.supportTickets30d}.
         
         Return JSON: {
           "churnScore": 0-100,
           "sentiment": "positive/neutral/negative/angry",
           "primaryConcern": "one sentence",
           "interventionType": "none/nudge/offer/escalate",
           "interventionMessage": "full personalized email body (or escalation brief)",
           "offerDetails": "e.g., 15% discount or training session",
           "urgency": "immediate/this-week/monitor"
         }`,
        true
      );

      // Step 3: Update churn signal record
      const statusMap = { none: 'none', nudge: 'nudge_sent', offer: 'offer_sent', escalate: 'escalated' };
      await ChurnSignal.findByIdAndUpdate(account._id, {
        churnScore: analysis.churnScore,
        sentimentScore: analysis.sentiment === 'positive' ? 0.8 : analysis.sentiment === 'negative' ? -0.5 : analysis.sentiment === 'angry' ? -0.9 : 0,
        interventionStatus: statusMap[analysis.interventionType] || 'none',
        interventionMessage: analysis.interventionMessage
      });

      // Step 4: Execute intervention
      const { sendProspectEmail } = await import('../services/mailer.js');
      const slackWebhook = process.env.SLACK_WEBHOOK_URL;
      const { default: axios } = await import('axios');

      if (analysis.interventionType === 'nudge' || analysis.interventionType === 'offer') {
          // Send real email to the account contact
          await sendProspectEmail(
              { contactEmail: account.contactEmail, contactName: account.contactName, _id: account._id, ownerId: userId },
              { subject: `Improving your NexusAI experience`, body: analysis.interventionMessage },
              0
          );
      } else if (analysis.interventionType === 'escalate' && slackWebhook) {
          // Real Slack notification
          await axios.post(slackWebhook, {
              text: `🔴 Churn Risk: ${account.companyName} (Score: ${analysis.churnScore}%)\n${analysis.primaryConcern}\nIntervention: ${analysis.interventionMessage}`
          });
      }
    }

    const summaryMsg = `Retention Check Complete: Analyzed ${accounts.length} active customer accounts.`;
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(userId, { lastAgentSummary: summaryMsg });
    await logAgentSuccess('retention', userId, agentEventId, summaryMsg);
    
    return { success: true, summary: summaryMsg, scanned: accounts.length };

  } catch (err) {
    await logAgentFailure('retention', userId, agentEventId, err.message);
    throw err;
  }
}
