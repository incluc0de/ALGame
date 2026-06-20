import { GameState } from "../state/GameState.js";
import { AgentService } from "../services/AgentService.js";
import { addButton, addHeader, addPanel, wrapText } from "../utils/ui.js";
export default class ChallengeScene extends Phaser.Scene {
  constructor() { super("ChallengeScene"); this.answerElement = null; this.statusText = null; }
  async create() {
    addHeader(this, GameState.data);
    this.statusText = this.add.text(512, 120, "Carregando missão...", { fontFamily: "Arial", fontSize: "24px", color: "#fff" }).setOrigin(0.5);
//---
 
//---
    try {
      if (!GameState.data.currentChallenge) await this.createChallenge();
      this.renderChallenge();
    } catch (e) { this.statusText.setText(`Erro ao carregar desafio: ${e.message}`); }
  }
  async createChallenge() {
    const s = GameState.data;
    const response = await AgentService.createChallenge({ sessionId: s.sessionId, playerId: s.playerId, profile: s.profile, context: { fase_atual: 1, desempenho_recente: "baixo", tentativas_medias: 3, tempo_medio_resposta_segundos: 180 } });
    GameState.startChallenge(response);
  }
  renderChallenge() {
    const response = GameState.data.currentChallenge;
    // variação de linguagens
    const linguagem = GameState.data.profile?.linguagem || "pseudocodigo";

    const challenge = response.challenge;
    this.statusText.destroy();
    this.add.text(512, 90, "Missão: Floresta das Decisões", { fontFamily: "Arial", fontSize: "26px", color: "#86efac", fontStyle: "bold" }).setOrigin(0.5);
    addPanel(this, 512, 230, 880, 215);
    this.add.text(100, 140, challenge.titulo || "Desafio de Algoritmo", { fontFamily: "Arial", fontSize: "24px", color: "#93c5fd", fontStyle: "bold" });
    this.add.text(100, 180, wrapText(challenge.enunciado, 85), { fontFamily: "Arial", fontSize: "20px", color: "#fff", lineSpacing: 8 });
    this.add.text(100, 285, `Objetivo: ${challenge.objetivo || "Resolver o desafio."}`, { fontFamily: "Arial", fontSize: "17px", color: "#cbd5e1" });
    this.add.text(100, 340, `Digite sua solução em ${linguagem}:`, { fontFamily: "Arial", fontSize: "20px", color: "#fde68a" });
    // variação de linguagem
    const placeholders = {
      pseudocodigo:
        "Exemplo:\n Leia numero\nSE numero > 0 ENTÃO\n   Escreva 'positivo'",
    
      portugol:
        "Exemplo:\n leia(numero)\nse numero > 0 entao\n   escreval('positivo')\nfimse",
    
      javascript:
        "Exemplo:\n let numero = 3;\nif(numero > 0){\n   console.log('positivo');\n}",
    
      python:
        "Exemplo:\n numero = 3\nif numero > 0:\n    print('positivo')",
    
      c:
        "Exemplo:\n int numero = 3;\nif(numero > 0){\n   printf('positivo');\n}"
    };
    
    const placeholder =
      placeholders[linguagem] || placeholders.pseudocodigo;

    this.answerElement = this.add.dom(512, 440).createFromHTML(`<textarea id="answerBox" style="width:760px;height:120px;font-size:18px;font-family:Consolas,monospace;padding:12px;border-radius:8px;border:2px solid #60a5fa;background:#0f172a;color:white;resize:none;outline:none;" placeholder="${placeholder.replaceAll('"', '&quot;')}"></textarea>`);
    // tratamento de SPACE
    const textarea = this.answerElement.getChildByID("answerBox");

      textarea.addEventListener("focus", () => {
        this.input.keyboard.enabled = false;
      });

      textarea.addEventListener("blur", () => {
        this.input.keyboard.enabled = true;
      });

      textarea.addEventListener("keydown", (event) => {
        event.stopPropagation();
      });
    
   //------------ 
   const s = GameState.data;

   addButton(this, 250, 565, "Enviar Solução", () => this.submitAnswer(), 230);
   
   addButton(
     this,
     512,
     565,
     s.xp >= 100 ? "Recuperar Foco -100 XP" : "Recuperar Foco Bloqueado",
     () => this.useFocusBreak(),
     260
   );
   
   addButton(this, 775, 565, "Voltar ao Menu", () => {
     GameState.resetSession();
     this.scene.start("MenuScene");
   }, 230);
    
   // addButton(this, 360, 565, "Enviar Solução", () => this.submitAnswer(), 260);
   // addButton(this, 660, 565, "Voltar ao Menu", () => { GameState.resetSession(); this.scene.start("MenuScene"); }, 260);
   
  }
  async submitAnswer() {
    const answer = this.answerElement.getChildByID("answerBox").value.trim();
    if (!answer) { alert("Digite uma solução antes de enviar."); return; }
    const s = GameState.data, cr = s.currentChallenge;
    GameState.addAttempt();
    const totalSeconds = Math.floor((Date.now() - s.challengeStartTime) / 1000);
    const evaluation = await AgentService.evaluateSolution({ sessionId: s.sessionId, playerId: s.playerId, challengeId: cr.challengeId, challenge: { topico: cr.challenge.topico, enunciado: cr.challenge.enunciado, criterios_avaliacao: cr.challenge.criterios_avaliacao || [] }, studentSolution: { formato: s.profile?.linguagem || "pseudocodigo", resposta: answer }, attemptContext: { numero_tentativa: GameState.data.attempts, tempo_resposta_segundos: totalSeconds, intervencoes_anteriores: GameState.data.interventionsUsed } });
    GameState.data.lastEvaluation = evaluation; GameState.save();
    if (evaluation.evaluation?.isCorrect || evaluation.gameAction === "finish_challenge") this.scene.start("ResultScene");
    else if (evaluation.gameAction === "offer_intervention") this.scene.start("InterventionScene");
    else alert(evaluation.feedback?.message || "Tente novamente.");
  }
  //---
  useFocusBreak() {

    const s = GameState.data;
  
    const cost = 100;
  
    if (s.xp < cost) {
      alert("Você precisa de pelo menos 100 XP para recuperar foco.");
      return;
    }
  
    if (s.focusBreaksUsed >= s.maxFocusBreaksPerChallenge) {
      alert("Limite de pausas de foco atingido neste desafio.");
      return;
    }
  
    s.xp -= cost;
    s.focusBreaksUsed += 1;
    s.level = Math.floor(s.xp / 300) + 1;
  
    s.preGameReturnScene = "ChallengeScene";
  
    GameState.save();
  
    this.scene.start("PreGameXPScene");
    }
}
