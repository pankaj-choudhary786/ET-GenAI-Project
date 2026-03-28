import User from '../models/User.js';
import Prospect from '../models/Prospect.js';
import BehaviorEvent from '../models/BehaviorEvent.js';
import { callClaude } from '../services/llm.js';
import { logAgentStart, logAgentSuccess, logAgentFailure } from '../utils/agentLogger.js';

export async function runProspectingAgent(userId) {
  const agentEventId = await logAgentStart('prospecting', userId);
  try {
    // Step 1: Get user's ICP preferences
    const user = await User.findById(userId);
    const icpPrefs = user.agentPreferences?.prospecting || {};
    const minScore = icpPrefs.minIcpScore || 60;

    // Step 2: Generate prospect targets using Claude
    const targets = await callClaude(
      `You are a B2B sales research expert. Generate realistic prospect company data.`,
      `Generate 5 prospect companies that fit this ICP: ${JSON.stringify(icpPrefs)}. 
       Return JSON array: [{ "company": "", "domain": "", "industry": "", "employeeCount": 0, "fundingStage": "", "recentSignal": "", "contactName": "", "contactTitle": "", "contactEmail": "", "linkedinUrl": "" }]`,
      true
    );

    // Step 3: Score each prospect against ICP
    const scoredProspects = [];
    for (const target of targets) {
      const scoreResult = await callClaude(
        `You are an ICP fit scoring expert. Score prospects on a 0-100 scale.`,
        `Score this company against ICP criteria. ICP: ${JSON.stringify(icpPrefs)}. Company: ${JSON.stringify(target)}.
         Return JSON: { "score": 0-100, "reason": "2-3 sentence explanation", "topSignal": "the strongest fit reason" }`,
        true
      );
      
      if (scoreResult.score >= minScore) {
        scoredProspects.push({ ...target, icpScore: scoreResult.score, fitReason: scoreResult.reason, topSignal: scoreResult.topSignal });
      }
    }

    // Step 4: Generate 3-email outreach sequence for each qualified prospect
    for (const prospect of scoredProspects) {
      const emailSequence = await callClaude(
        `You are an expert B2B sales copywriter. Write personalized, concise outreach emails.`,
        `Write a 3-email outreach sequence for this prospect. 
         Company: ${prospect.company}, Contact: ${prospect.contactName} (${prospect.contactTitle}), 
         Key signal: ${prospect.topSignal}, Fit reason: ${prospect.fitReason}.
         Return JSON array of 3 emails: [{ "subject": "", "body": "", "sendDelay": "Day 1 / Day 4 / Day 8", "tone": "professional/casual/urgent" }]`,
        true
      );

      // Step 5: Save prospect to MongoDB (skip if already exists by email)
      const exists = await Prospect.findOne({ contactEmail: prospect.contactEmail, userId });
      if (!exists) {
        const newProspect = await Prospect.create({
          ...prospect,
          userId,
          status: 'scored',
          outreachSequences: emailSequence.map((email, i) => ({
            ...email,
            sequence: i,
            status: 'draft'
          }))
        });

        // Step 6: Log behavior event for discovery
        await BehaviorEvent.create({
          prospectId: newProspect._id,
          userId,
          eventType: 'prospect_discovered',
          metadata: { icpScore: prospect.icpScore, signal: prospect.topSignal }
        });
      }
    }

    // Step 7: Log agent completion
    await logAgentSuccess('prospecting', userId, agentEventId, 
      `Found and scored ${scoredProspects.length} new prospects above ICP threshold of ${minScore}`);

  } catch (err) {
    await logAgentFailure('prospecting', userId, agentEventId, err.message);
    throw err;
  }
}
