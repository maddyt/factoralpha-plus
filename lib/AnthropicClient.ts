const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const ANTHROPIC_AGENTS_BASE_URL =
  process.env.ANTHROPIC_AGENTS_BASE_URL || 'https://api.anthropic.com/v1/agents';

export async function callAgent(payload: unknown) {
  const res = await fetch(ANTHROPIC_AGENTS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Anthropic API error: ${res.status}`);
  }

  return res.json();
}
