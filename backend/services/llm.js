import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function callClaude(systemPrompt, userPrompt, expectJson = false) {
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: expectJson 
        ? systemPrompt + '\n\nCRITICAL: Respond ONLY with valid JSON. No markdown, no explanation, no backticks. Raw JSON only.'
        : systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });
    const text = message.content[0].text.trim();
    if (expectJson) {
      const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(cleaned);
    }
    return text;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error('LLM returned invalid JSON: ' + err.message);
    }
    throw err;
  }
}
