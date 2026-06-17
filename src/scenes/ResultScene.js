import { GameState } from "../state/GameState.js";
import { AgentService } from "../services/AgentService.js";
import { calculateRewards } from "../utils/rewards.js";
import { addButton, addHeader, addPanel } from "../utils/ui.js";
export default class ResultScene extends Phaser.Scene {
  constructor() { super("ResultScene"); }
  async create() {
    addHeader(this, GameState.data);
    this.add.text(512, 105, "Missão Concluída!", { fontFamily: "Arial", fontSize: "36px", color: "#86efac", fontStyle: "bold" }).setOrigin(0.5);
    addPanel(this, 512, 320, 820, 360);
    const finishResponse = await this.finishChallenge();
    const rewards = this.applyLocalRewards(finishResponse);
    this.renderResult(finishResponse, rewards);
    addButton(this, 360, 565, "Próxima Missão", () => { GameState.resetSession(); this.scene.start("ChallengeScene"); }, 260);
    addButton(this, 660, 565, "Menu", () => { GameState.resetSession(); this.scene.start("MenuScene"); }, 260);
  }
  async finishChallenge() {
    const s = GameState.data, cr = s.currentChallenge;
    const totalSeconds = Math.floor((Date.now() - s.challengeStartTime) / 1000);
    const response = await AgentService.finishChallenge({ sessionId: s.sessionId, playerId: s.playerId, challengeId: cr.challengeId, result: { completed: true, finalScore: s.lastEvaluation?.evaluation?.score || 100, attempts: s.attempts, totalTimeSeconds: totalSeconds, interventionsUsed: s.interventionsUsed } });
    GameState.data.lastSummary = response; GameState.save(); return response;
  }
  applyLocalRewards(finishResponse) {
    const summary = finishResponse.summary || {};
    const rewards = calculateRewards({ completed: summary.completed ?? true, attempts: summary.attempts || GameState.data.attempts, totalTimeSeconds: summary.totalTimeSeconds || 999, interventionsUsed: summary.successfulInterventions || GameState.data.interventionsUsed, currentAchievements: GameState.data.achievements });
    GameState.applyRewards(rewards); return rewards;
  }
  renderResult(finishResponse, rewards) {
    const s = GameState.data, summary = finishResponse.summary || {};
    this.add.text(150, 180, `Pontuação: ${summary.finalScore ?? 100}`, { fontFamily: "Arial", fontSize: "24px", color: "#fff" });
    this.add.text(150, 220, `Tentativas: ${summary.attempts ?? s.attempts}`, { fontFamily: "Arial", fontSize: "22px", color: "#cbd5e1" });
    this.add.text(150, 260, `XP recebido: +${rewards.xp}`, { fontFamily: "Arial", fontSize: "24px", color: "#fde68a" });
    this.add.text(150, 300, `Bits recebidos: +${rewards.coins}`, { fontFamily: "Arial", fontSize: "24px", color: "#fde68a" });
    const achievements = rewards.achievements.length ? rewards.achievements.map(a => `🏆 ${a.title}`).join("\n") : "Nenhuma nova conquista.";
    this.add.text(150, 355, `Conquistas:\n${achievements}`, { fontFamily: "Arial", fontSize: "20px", color: "#93c5fd", lineSpacing: 8 });
    this.add.text(590, 180, `Nível atual: ${s.level}`, { fontFamily: "Arial", fontSize: "24px", color: "#fff" });
    this.add.text(590, 220, `XP total: ${s.xp}`, { fontFamily: "Arial", fontSize: "22px", color: "#cbd5e1" });
    this.add.text(590, 260, `Bits totais: ${s.coins}`, { fontFamily: "Arial", fontSize: "22px", color: "#cbd5e1" });
    const next = finishResponse.nextAction;
    if (next) this.add.text(590, 320, `Próximo passo:\n${next.action || "create_next_challenge"}\nTópico: ${next.suggestedTopic || "condicionais"}`, { fontFamily: "Arial", fontSize: "18px", color: "#d1fae5", lineSpacing: 8 });
  }
}
