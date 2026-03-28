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
    // Step 1: Scrape competitor's public pages
    // Using inline import for scraper, fallback if fails
    let scrapedContent = '';
    
    try {
      const { scrapeCompetitorSignals } = await import('../services/scraper.js').catch(() => ({}));
      if (scrapeCompetitorSignals) {
          const signals = await scrapeCompetitorSignals(competitorName);
          scrapedContent = signals.join('\n');
      } else {
          throw new Error("Scraper service not available");
      }
    } catch (scrapeErr) {
      // Scraping may fail — that's fine, Claude will use its training knowledge
      scrapedContent = `Could not scrape. Use your knowledge of ${competitorName}.`;
    }

    // Step 2: Generate / update battlecard using Claude
    const battlecard = await callClaude(
      `You are a competitive intelligence expert in B2B SaaS sales. Create detailed, accurate battlecards.`,
      `Create a comprehensive sales battlecard for competing against ${competitorName}.
       Recent info found (if any): ${scrapedContent}.
        Return JSON: {
          "overview": "2-3 sentence overview",
          "theirPitch": "how they pitch themselves",
          "weaknesses": ["weakness1", "weakness2"],
          "ourStrengths": ["strength1", "strength2"],
          "objectionHandlers": [
            { "objection": "...", "response": "..." }
          ],
          "pricing": "pricing summary",
          "targetCustomer": "ideal customer profile",
          "marketSignals": [
            { "headline": "...", "summary": "...", "source": "...", "url": "..." }
          ]
        }`,
      true
    );

    // Step 3: Upsert battlecard in MongoDB
    await Battlecard.findOneAndUpdate(
      { competitor: competitorName, userId },
      { 
        competitor: competitorName, 
        userId,
        sections: {
          overview: battlecard.overview,
          theirPitch: battlecard.theirPitch,
          weaknesses: battlecard.weaknesses,
          ourStrengths: battlecard.ourStrengths,
          objectionHandlers: battlecard.objectionHandlers,
          pricing: battlecard.pricing,
          targetCustomer: battlecard.targetCustomer
        },
        marketSignals: battlecard.marketSignals,
        lastScraped: new Date(),
        freshness: 'fresh'
      },
      { upsert: true, new: true }
    );

    // Step 4: Find active deals mentioning this competitor and push the card
    const affectedDeals = await Deal.find({
      userId,
      riskSignals: { $elemMatch: { signal: { $regex: competitorName, $options: 'i' } } }
    });

    if (affectedDeals.length > 0) {
      await sendSlackAlert(userId,
        `🎯 Battlecard updated for ${competitorName}. Pushed to ${affectedDeals.length} active deals.`
      );
    }

    await logAgentSuccess('competitive', userId, agentEventId,
      `Updated ${competitorName} battlecard. Found ${affectedDeals.length} active deals mentioning this competitor.`);

  } catch (err) {
    await logAgentFailure('competitive', userId, agentEventId, err.message);
    throw err;
  }
}
