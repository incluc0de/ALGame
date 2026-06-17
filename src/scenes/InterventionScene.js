import { GameState } from "../state/GameState.js";
import { AgentService } from "../services/AgentService.js";
import { addButton, addHeader, addPanel, wrapText } from "../utils/ui.js";
export default class InterventionScene extends Phaser.Scene {
  constructor() { super("InterventionScene"); }
  async create() {
    addHeader(this, GameState.data);
    this.add.text(512, 110, "Mentor Byte", { fontFamily: "Arial", fontSize: "34px", color: "#fde68a", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(512, 150, "Uma intervenção pedagógica foi liberada para ajudar você.", { fontFamily: "Arial", fontSize: "19px", color: "#cbd5e1" }).setOrigin(0.5);
    addPanel(this, 512, 345, 820, 330);
    const intervention = await this.loadIntervention();
    this.renderIntervention(intervention);
    addButton(this, 512, 565, "Tentar Novamente", () => this.scene.start("ChallengeScene"));
  }
  async loadIntervention() {
    const s = GameState.data, cr = s.currentChallenge, ev = s.lastEvaluation, rec = ev.interventionRecommendation || {};
    const response = await AgentService.requestIntervention({ sessionId: s.sessionId, playerId: s.playerId, challengeId: cr.challengeId, challenge: { topico: cr.challenge.topico, enunciado: cr.challenge.enunciado, criterios_avaliacao: cr.challenge.criterios_avaliacao || [] }, interventionContext: { recommendedLevel: rec.recommendedLevel || 1, recommendedType: rec.recommendedType || "motivacional", mainErrorCode: ev.evaluation?.mainErrorCode || null, mainErrorDescription: ev.evaluation?.mainErrorDescription || "", numero_tentativa: s.attempts, perfil_cognitivo: s.profile.perfil_cognitivo, intervencoes_anteriores: s.interventionsUsed } });
    GameState.data.lastIntervention = response;
    GameState.addIntervention(response.intervention?.type);
    return response.intervention || {};
  }
  renderIntervention(intervention) {
    this.add.text(140, 220, intervention.title || "Dica do Mentor", { fontFamily: "Arial", fontSize: "25px", color: "#93c5fd", fontStyle: "bold" });
    this.add.text(140, 265, wrapText(intervention.message || "", 80), { fontFamily: "Arial", fontSize: "20px", color: "#fff", lineSpacing: 8 });
    let details = "";
    if (intervention.steps?.length) details += intervention.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
    if (intervention.hints?.length) details += intervention.hints.map((s, i) => `Dica ${i + 1}: ${s}`).join("\n");
    if (intervention.solution?.length) details += intervention.solution.join("\n");
    if (intervention.example) details += `Exemplo: ${intervention.example.problem || ""}\n${Array.isArray(intervention.example.solution) ? intervention.example.solution.join("\n") : ""}`;
    this.add.text(140, 345, details || "Observe o enunciado e tente novamente.", { fontFamily: "Arial", fontSize: "18px", color: "#d1fae5", lineSpacing: 7 });
  }
}
