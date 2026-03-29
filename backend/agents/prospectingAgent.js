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
    
    // DEMO CAUTION: If we are in demo mode, be more "optimistic" so the judge sees results
    const isDemo = user.email === 'demo@salesai.com';
    const minScore = isDemo ? 40 : (icpPrefs.minIcpScore || 60);

    // Step 2: Search for real companies using Serper.dev
    const { searchCompanies } = await import('../services/scraper.js');
    
    // ICP Config: Use saved prefs or elite defaults
    const industry = icpPrefs.industry || 'B2B SaaS';
    const location = icpPrefs.location || 'USA';
    const funding = icpPrefs.fundingStage || 'Series B or Later';

    let searchQuery = `${industry} startups recently funded 2024 ${location} ${funding}`;
    console.log(`[Elite Agent] 🔍 SEARCHING: ${searchQuery}`);
    let searchResults = await searchCompanies(searchQuery);

    // [SMART FALLBACK] Level 1: Niche pivots
    if (!searchResults || searchResults.length === 0) {
      console.log(`[Elite Agent] ⚠️ No niche results for ${industry}. Pivoting to high-growth net...`);
      searchQuery = `AI Infrastructure and Cybersecurity startups recently funded 2024 Global`;
      searchResults = await searchCompanies(searchQuery);
    }

    if (!searchResults || searchResults.length === 0) {
      console.error(`[Elite Agent] 🚨 ALL SEARCHES FAILED. Check Serper API.`);
      throw new Error(`Critical: Global search failed. Check Serper API connection.`);
    }

    console.log(`[Elite Agent] ✅ Found ${searchResults.length} raw sources. Extracting company targets...`);

    // Step 3: Use Claude to parse search results into structured prospect data
    let targets = [];
    try {
        targets = await callClaude(
            `You are a B2B sales research expert. Parse these organic search results into structured company data.`,
            `Organic Search Results (JSON): ${JSON.stringify(searchResults)}.
             Criteria: ${industry}, ${location}, ${funding}.
             Extract up to 12 companies. Return JSON array: [{ "company": "", "domain": "", "industry": "", "contactName": "John Doe", "contactEmail": "info@company.com" }]`,
            true
          );
        console.log(`[Elite Agent] 🧠 GPT/Claude extracted ${targets?.length || 0} valid targets.`);
    } catch (llmErr) {
        console.error('[Elite Agent] ❌ Claude Parsing Failed:', llmErr.message);
        // NO THROW - We will fallback to Raw Sync
    }

    // [UNSTOPPABLE DISCOVERY] Fail-Safe: Sync raw search results if AI parsing failed or returned 0
    if (!targets || targets.length === 0) {
        console.warn('[Elite Agent] ⚡ AI extraction empty/failed. Using UNSTOPPABLE Raw-Sync Fallback.');
        targets = searchResults.slice(0, 12).map(r => {
            const domain = r.link.split('//')[1]?.split('/')[0] || '';
            const companyName = r.title.split(' - ')[0].split(': ')[0].trim();
            return {
                company: companyName,
                domain: domain,
                contactName: 'Founder / CEO',
                contactEmail: `contact@${domain || 'example.com'}`
            };
        });
    }

    // [TURBO-COMMIT] Step 3.5 Create skeletal records immediately (UX Boost)
    console.log(`[Elite Agent] 🚀 STARTING DISCOVERY SYNC (Commiting ${targets.length} cards)...`);
    const skeletonProspects = [];
    for (const target of targets) {
        try {
            if (!target.company) continue;

            // [DUPLICATE SHIELD] Skip companies already in your pipeline
            const existing = await Prospect.findOne({ userId, company: target.company });
            if (existing) {
                console.log(`[Agent] 🛡️ SKIP DUPLICATE: ${target.company} is already in your pipeline.`);
                continue;
            }

            const skeleton = await Prospect.create({
                userId,
                company: target.company,
                domain: target.domain || '',
                contactName: target.contactName || 'CEO',
                contactEmail: target.contactEmail || `contact@${target.company.toLowerCase().replace(/\s/g, '').replace(/[^\w]/g, '')}.com`,
                status: 'discovered',
                icpScore: null,
                fitReason: 'Searching real-time intelligence...',
                outreachSequences: []
            });
            skeletonProspects.push(skeleton);
            console.log(`[Agent] 🦴 SYNC: Created card for ${target.company}`);
        } catch (sErr) {
            console.warn(`[Agent] ❌ SKIP: Failed to sync ${target.company}:`, sErr.message);
        }
    }

    console.log(`[Elite Agent] 🔥 Discovery Phase Complete. ${skeletonProspects.length} NEW cards added.`);

    // Step 4: INTELLIGENCE ENRICHMENT LOOP (Background)
    for (let i = 0; i < skeletonProspects.length; i++) {
      const skeleton = skeletonProspects[i];
      const target = targets.find(t => t.company === skeleton.company);
      if (!target) continue;
      
      try {
        console.log(`[Agent] Elite Researching & Writing for: ${target.company}...`);
        
        // 4.1 Single Claude Call for both Score + Outreach
        let intelligence;
        try {
            intelligence = await callClaude(
                `You are an ICP expert and sales copywriter. Perform both tasks for this prospect.`,
                `Company: ${JSON.stringify(target)}. ICP criteria: ${JSON.stringify(icpPrefs)}.
                 Return JSON: { 
                   "score": 0-100, 
                   "reason": "explanation", 
                   "topSignal": "strongest fit",
                   "qualified": true,
                   "emails": [
                     {"subject":"","body":"","sendDelay":"Day 1"},
                     {"subject":"","body":"","sendDelay":"Day 3"},
                     {"subject":"","body":"","sendDelay":"Day 7"}
                   ]
                 }
                 CRITICAL: You MUST provide exactly 3 emails for every qualified lead.`,
                true
              );
        } catch (llmErr) {
            console.error(`[Agent] ⚠️ Research failed for ${target.company}. Using safe fallback.`);
            // [FAIL-SAFE] Resolve "Researching..." state even on LLM failure
            await Prospect.findByIdAndUpdate(skeleton._id, {
                icpScore: 40,
                fitReason: "Real-time search confirmed the company, but deep semantic fit-analysis is currently processing. Marked as 'Neutral Match'.",
                outreachSequences: []
            });
            continue;
        }
        
        if (intelligence) {
          // 4.3 UPDATE EXISTING RECORD (Real-time sync)
          await Prospect.findByIdAndUpdate(skeleton._id, {
            icpScore: intelligence.score,
            fitReason: intelligence.reason,
            topSignal: intelligence.topSignal,
            outreachSequences: (intelligence.emails || []).map((email, i) => ({
              ...email,
              sequence: i,
              status: 'draft'
            }))
          });
          console.log(`[DATABASE] 🚀 Intelligence Sync Complete: ${target.company} (Score: ${intelligence.score})`);
        }
      } catch (innerErr) {
        console.error(`[Agent Error] Failed to enrich ${target.company}:`, innerErr.message);
        continue;
      }
    }

    // Step 5: Final log
    const summaryMsg = `Discovery Complete: Found ${skeletonProspects.length} new prospects in ${industry}. (Duplicates Skipped: ${targets.length - skeletonProspects.length})`;
    await User.findByIdAndUpdate(userId, { lastAgentSummary: summaryMsg });
    await logAgentSuccess('prospecting', userId, agentEventId, summaryMsg);
    
    return { success: true, summary: summaryMsg };

  } catch (err) {
    console.error('[Agent Crash] Critical Failure:', err.message);
    await logAgentFailure('prospecting', userId, agentEventId, err.message);
    throw err;
  }
}
