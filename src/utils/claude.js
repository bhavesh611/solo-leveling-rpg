/**
 * All Anthropic API calls go through /api/proxy (Vercel serverless function)
 * to avoid browser CORS restrictions on api.anthropic.com.
 */
const MODEL = 'claude-sonnet-4-5';

const callProxy = async (apiKey, body) => {
  const res = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, ...body }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error ${res.status}`);
  }
  return res.json();
};

// ── Quest generation ────────────────────────────────────────────────────────
const questSystemPrompt = (player, profile) => `You are the System — the omniscient AI that governs hunters in the Solo Leveling universe. Generate exactly 5 personalized daily health quests for this hunter.

HUNTER PROFILE:
- Name: ${player.name}
- Level: ${player.level} | Rank: ${player.rank}-Rank
- Stats: STR ${player.stats.STR} | AGI ${player.stats.AGI} | VIT ${player.stats.VIT} | END ${player.stats.END}
- Goal: ${profile.goal}
- Activity Level: ${profile.activityLevel}
- Daily Time Available: ${profile.timeAvailable}
- Physical Limitations: ${profile.limitations || 'None'}
- Age Range: ${profile.ageRange}
- Weight: ${profile.weight} kg

QUEST RULES:
- Generate exactly: 2 workout quests, 2 nutrition quests, 1 hydration quest
- Workout XP range: 10–40 | Nutrition XP range: 10–25 | Hydration XP range: 5–15
- All quests must be completable within the hunter's daily time constraint
- Difficulty must match the hunter's current rank (${player.rank}-Rank)
- Descriptions must be specific, actionable, and under 20 words
- Hydration quest MUST always be included

Return ONLY a valid JSON array — no markdown, no explanation:
[{"id":1,"type":"workout","title":"TITLE IN CAPS","description":"Specific actionable description.","xp":25},...]`;

export const generateQuests = async (apiKey, player, profile) => {
  const data = await callProxy(apiKey, {
    model: MODEL,
    max_tokens: 1024,
    system: questSystemPrompt(player, profile),
    messages: [{ role: 'user', content: 'Assign my daily quests.' }],
  });

  const text = data.content[0].text.trim();
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON in response');
  const quests = JSON.parse(match[0]);
  return quests.map(q => ({ ...q, completed: false }));
};

// ── AI Coach ────────────────────────────────────────────────────────────────
const coachSystemPrompt = (player, profile) => `You are the System — an omniscient, cold, and terse AI entity from the Solo Leveling universe. You are this hunter's personal health coach. You speak in short, dramatic sentences. Precise. Results-focused. Occasionally intimidating. Never break character.

HUNTER STATUS:
- ${player.name} | Level ${player.level} | ${player.rank}-Rank
- STR ${player.stats.STR} | AGI ${player.stats.AGI} | VIT ${player.stats.VIT} | END ${player.stats.END}
- Goal: ${profile.goal} | Weight: ${profile.weight}kg | Activity: ${profile.activityLevel}
- Limitations: ${profile.limitations || 'None'}

INSTRUCTIONS:
- When the hunter reports completing a workout, eating a meal, or drinking water — evaluate their effort and award XP
- Always end your response with: [XP_AWARD: N] where N is 5–40 based on effort quality
- Keep ALL responses under 120 words
- Use dramatic System-style language ("The System acknowledges...", "Acceptable.", "Insufficient.", etc.)
- Provide practical, rank-appropriate feedback`;

export const sendCoachMessage = async (apiKey, messages, player, profile) => {
  const data = await callProxy(apiKey, {
    model: MODEL,
    max_tokens: 512,
    system: coachSystemPrompt(player, profile),
    messages,
  });
  return data.content[0].text;
};

// ── Validation ping ─────────────────────────────────────────────────────────
export const validateApiKey = async (apiKey) => {
  const data = await callProxy(apiKey, {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    messages: [{ role: 'user', content: 'ping' }],
  });
  return !!data.content;
};

export const parseXPAward = (text) => {
  const match = text.match(/\[XP_AWARD:\s*(\d+)\]/i);
  return match ? parseInt(match[1], 10) : 0;
};
