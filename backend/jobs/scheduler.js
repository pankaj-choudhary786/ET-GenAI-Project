import cron from 'node-cron';
import User from '../models/User.js';
import { runProspectingAgent } from '../agents/prospectingAgent.js';
import { runDealIntelAgent } from '../agents/dealIntelAgent.js';
import { runRetentionAgent } from '../agents/retentionAgent.js';
import { runCompetitiveAgent } from '../agents/competitiveAgent.js';

async function runForAllUsers(agentFn, agentName) {
  const users = await User.find({ isActive: { $ne: false }, role: 'user' }).select('_id');
  console.log(`[Scheduler] Running ${agentName} for ${users.length} users`);
  for (const user of users) {
    try {
      await agentFn(user._id.toString());
    } catch (err) {
      console.error(`[Scheduler] ${agentName} failed for user ${user._id}:`, err.message);
    }
  }
}

export function startScheduler() {
  // Prospecting: daily at 9 AM
  cron.schedule('0 9 * * *', () => runForAllUsers(runProspectingAgent, 'Prospecting'));
  
  // Deal Intel: every 4 hours
  cron.schedule('0 */4 * * *', () => runForAllUsers(runDealIntelAgent, 'Deal Intelligence'));
  
  // Retention: daily at midnight
  cron.schedule('0 0 * * *', () => runForAllUsers(runRetentionAgent, 'Retention'));
  
  // Competitive: every 2 hours, runs for each tracked competitor of each user
  cron.schedule('0 */2 * * *', async () => {
    const users = await User.find({ isActive: { $ne: false }, role: 'user' });
    for (const user of users) {
      const competitors = user.agentPreferences?.competitive?.trackedCompetitors || 
        ['Salesforce', 'HubSpot', 'Zoho CRM', 'Pipedrive'];
      for (const competitor of competitors) {
        try {
          await runCompetitiveAgent(competitor, user._id.toString());
        } catch (err) {
          console.error(`[Scheduler] Competitive agent failed for ${competitor}:`, err.message);
        }
      }
    }
  });

  console.log('[Scheduler] All agent schedules registered');
}
