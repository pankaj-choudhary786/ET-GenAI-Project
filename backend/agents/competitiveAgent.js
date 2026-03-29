import Battlecard from '../models/Battlecard.js';
import Deal from '../models/Deal.js';
import { callClaude } from '../services/llm.js';
import { logAgentStart, logAgentSuccess, logAgentFailure } from '../utils/agentLogger.js';

// Stub for slack alert functionality
async function sendSlackAlert(userId, message) {
  console.log(`[SLACK ALERT USER ${userId}]: ${message}`);
}

export async function runCompetitiveAgent(competitorName, userId) {
  const agentEventId = await logAgentStart('competitive', userId);
  try {
    // Step 1: Scrape competitor's public pages using Firecrawl
    const { scrapePageContent, scrapeCompetitorSignals } = await import('../services/scraper.js');
    const signals = await scrapeCompetitorSignals(competitorName);
    
    // Attempt to scrape their homepage or pricing page
    const battlecard = await Battlecard.findOne({ competitor: competitorName, userId });
    const competitorUrl = battlecard?.competitorWebsite || `https://www.google.com/search?q=${competitorName}`;
    const scrapedContent = await scrapePageContent(competitorUrl);

    // Step 2: Use Claude to analyze shifts in positioning
    const oldOverview = battlecard?.sections?.overview || "No existing data.";

    const battlecardAnalysis = await callClaude(
      `You are a competitive intelligence expert. Compare new data with existing battlecard to detect positioning shifts.`,
      `Competitor: ${competitorName}
       Old Overview: ${oldOverview}
       New Scraped Data: ${scrapedContent}
       Recent Signals: ${signals.join('\n')}
       
       Return JSON: {
         "hasPositioningShift": boolean,
         "positioningShiftReason": "one sentence explanation of what changed in their pitch",
         "overview": "updated overview",
         "theirPitch": "how they pitch themselves now",
         "theirStrengths": ["strength1", "...", "strengthN"],
         "theirWeaknesses": ["weakness1", "...", "weaknessN"],
         "ourCounterPositioning": ["strength1", "...", "strengthN"],
         "objectionHandlers": [{ "objection": "...", "response": "..." }],
         "pricing": "updated pricing",
         "recentSignals": [{ "headline": "...", "url": "..." }]
       }`,
      true
    );

    // Step 3: Update Battlecard in MongoDB
    await Battlecard.findOneAndUpdate(
      { competitor: competitorName, userId },
      { 
        sections: {
          overview: battlecardAnalysis.overview,
          theirPitch: battlecardAnalysis.theirPitch,
          theirStrengths: battlecardAnalysis.theirStrengths,
          theirWeaknesses: battlecardAnalysis.theirWeaknesses,
          ourCounterPositioning: battlecardAnalysis.ourCounterPositioning,
          objectionHandlers: battlecardAnalysis.objectionHandlers,
          pricing: battlecardAnalysis.pricing
        },
        recentSignals: battlecardAnalysis.recentSignals,
        lastScraped: new Date(),
        freshness: 'fresh'
      },
      { upsert: true }
    );

    // Step 4: PUSH TO CRM if positioning shift detected
    const user = await import('../models/User.js').then(m => m.default.findById(userId));
    const hubspotKey = user.integrations?.hubspot?.apiKey || process.env.HUBSPOT_API_KEY;

    if (battlecardAnalysis.hasPositioningShift && hubspotKey) {
        // Find deals mentioning this competitor
        const affectedDeals = await Deal.find({
            userId,
            riskSignals: { $elemMatch: { signal: { $regex: competitorName, $options: 'i' } } }
        });

        const { addHubSpotNote } = await import('../services/hubspot.js');
        for (const deal of affectedDeals) {
            if (deal.hubspotId) {
                const noteBody = `🎯 AI AGENT ALERT: Positioning shift detected for ${competitorName}!\n\n${battlecardAnalysis.positioningShiftReason}\n\nCounter-messaging updated in battlecards.`;
                await addHubSpotNote(hubspotKey, deal.hubspotId, noteBody);
            }
        }

        if (affectedDeals.length > 0) {
            await sendSlackAlert(userId, `🎯 Battlecard updated for ${competitorName}. Pushed to ${affectedDeals.length} HubSpot deals.`);
        }
    }

    const summaryMsg = `Recon Complete: Updated ${competitorName} battlecard from live signals. Detected ${battlecardAnalysis.hasPositioningShift ? 'a significant' : 'no'} positioning shift. Insights synced to ${affectedDeals.length} active deals.`;
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(userId, { lastAgentSummary: summaryMsg });
    await logAgentSuccess('competitive', userId, agentEventId, summaryMsg);
    
    return { success: true, summary: summaryMsg, dealsUpdated: affectedDeals.length };

  } catch (err) {
    await logAgentFailure('competitive', userId, agentEventId, err.message);
    throw err;
  }
}
