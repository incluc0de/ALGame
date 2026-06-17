import { CONFIG } from "../config.js";
function normalizeAgentResponse(data) {
  if (!data) return data;
  if (typeof data.output === "string") {
    try { return JSON.parse(data.output); } catch { return data; }
  }
  if (typeof data.output === "object") return data.output;
  return data;
}
async function postToAgent(payload) {
  const response = await fetch(CONFIG.AGENT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
  const data = await response.json();
  return normalizeAgentResponse(data);
}
export const AgentService = {
  createChallenge({ sessionId, playerId, profile, context }) {
    return postToAgent({ eventType: "create_challenge", sessionId, playerId, profile, context });
  },
  evaluateSolution({ sessionId, playerId, challengeId, challenge, studentSolution, attemptContext }) {
    return postToAgent({ eventType: "evaluate_solution", sessionId, playerId, challengeId, challenge, studentSolution, attemptContext });
  },
  requestIntervention({ sessionId, playerId, challengeId, challenge, interventionContext }) {
    return postToAgent({ eventType: "request_intervention", sessionId, playerId, challengeId, challenge, interventionContext });
  },
  finishChallenge({ sessionId, playerId, challengeId, result }) {
    return postToAgent({ eventType: "finish_challenge", sessionId, playerId, challengeId, result });
  }
};
