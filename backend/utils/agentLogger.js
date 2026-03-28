import AgentEvent from '../models/AgentEvent.js';

export async function logAgentStart(agentType, userId) {
  const event = await AgentEvent.create({
    agentType, 
    userId,
    action: `${agentType} agent started`,
    status: 'pending'
  });
  return event._id;
}

export async function logAgentSuccess(agentType, userId, eventId, summary) {
  await AgentEvent.findByIdAndUpdate(eventId, {
    status: 'success',
    action: summary,
    outputSummary: `Execution completed successfully for ${agentType} agent.`
  });
}

export async function logAgentFailure(agentType, userId, eventId, errorMessage) {
  await AgentEvent.findByIdAndUpdate(eventId, {
    status: 'failed',
    action: `Failed: ${agentType} agent error`,
    errorMessage: errorMessage,
    outputSummary: `Error: ${errorMessage}`
  });
}
