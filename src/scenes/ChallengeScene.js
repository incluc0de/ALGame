import { GameState } from "../state/GameState.js";
import { AgentService } from "../services/AgentService.js";

import {
  addButton,
  addHeader,
  addPanel,
  wrapText,
  showProcessingOverlay,
  hideProcessingOverlay,
  showToast,
  setButtonEnabled
} from "../utils/ui.js";

export default class ChallengeScene extends Phaser.Scene {
  constructor() {
    super("ChallengeScene");

    this.feedbackOverlay = null;
    this.feedbackSpaceKey = null;

    this.answerElement = null;
    this.statusText = null;
    this.isSubmitting = false;

    this.sendButton = null;
    this.focusButton = null;
    this.menuButton = null;
  }

  async create() {
    this.isSubmitting = false;
    this.answerElement = null;
    this.statusText = null;
    this.sendButton = null;
    this.focusButton = null;
    this.menuButton = null;
    this.input.keyboard.enabled = true;
  
    addHeader(this, GameState.data);
  
    this.statusText = this.add.text(512, 120, "Carregando missão...", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#fff"
    }).setOrigin(0.5);
  
    try {
      if (!GameState.data.currentChallenge) {
        await this.createChallenge();
      }
  
      this.renderChallenge();
  
    } catch (e) {
      console.error(e);
  
      if (this.statusText) {
        this.statusText.setText(`Erro ao carregar desafio: ${e.message}`);
      }
    }
  }

  async createChallenge() {
  const s = GameState.data;

  const topic =
    s.learningPath?.currentTopic ||
    s.profile?.topico ||
    "variaveis";

  const level =
    s.learningPath?.currentLevel ||
    s.profile?.nivel_aprendizagem ||
    "basico";

  const profile = {
    ...s.profile,
    topico: topic,
    nivel_aprendizagem: level
  };

  s.profile = profile;
  GameState.save();

  const response = await AgentService.createChallenge({
    sessionId: s.sessionId,
    playerId: s.playerId,
    profile,
    context: {
      fase_atual: 1,
      desempenho_recente: "baixo",
      tentativas_medias: 3,
      tempo_medio_resposta_segundos: 180
    }
  });

  GameState.startChallenge(response);
}

  renderChallenge() {
    const response = GameState.data.currentChallenge;

    if (!response || !response.challenge) {
      this.statusText?.setText("Desafio inválido. Gere uma nova missão.");
      GameState.data.currentChallenge = null;
      GameState.save();
      return;
    }

    const challenge = response.challenge || response.desafio;
    const linguagem = GameState.data.profile?.linguagem || "pseudocodigo";

    const topicId = GameState.data.learningPath?.currentTopic || "variaveis";
    const levelId = GameState.data.learningPath?.currentLevel || "basico";
    const topicTitle =
      GameState.data.learningPath?.topics?.[topicId]?.title || topicId;

    this.statusText.destroy();

    this.add.text(512, 90, `Missão: ${topicTitle} - ${levelId}`, {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#86efac",
      fontStyle: "bold"
    }).setOrigin(0.5);

    addPanel(this, 512, 230, 880, 215);

    this.add.text(100, 140, challenge.titulo || "Desafio de Algoritmo", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#93c5fd",
      fontStyle: "bold"
    });

    this.add.text(100, 180, wrapText(challenge.enunciado, 85), {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#fff",
      lineSpacing: 8
    });

    this.add.text(100, 285, `Objetivo: ${challenge.objetivo || "Resolver o desafio."}`, {
      fontFamily: "Arial",
      fontSize: "17px",
      color: "#cbd5e1"
    });

    this.add.text(100, 340, `Digite sua solução em ${linguagem}:`, {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#fde68a"
    });

    const placeholders = {
      pseudocodigo:
        "Exemplo:\nLeia numero\nSE numero > 0 ENTÃO\n   Escreva 'positivo'",

      portugol:
        "Exemplo:\nleia(numero)\nse numero > 0 entao\n   escreval('positivo')\nfimse",

      javascript:
        "Exemplo:\nlet numero = 3;\nif(numero > 0){\n   console.log('positivo');\n}",

      python:
        "Exemplo:\nnumero = 3\nif numero > 0:\n    print('positivo')",

      c:
        "Exemplo:\nint numero = 3;\nif(numero > 0){\n   printf('positivo');\n}"
    };

    const placeholder = placeholders[linguagem] || placeholders.pseudocodigo;

    this.answerElement = this.add.dom(512, 440).createFromHTML(`
      <textarea 
        id="answerBox" 
        style="
          width:760px;
          height:120px;
          font-size:18px;
          font-family:Consolas,monospace;
          padding:12px;
          border-radius:8px;
          border:2px solid #60a5fa;
          background:#0f172a;
          color:white;
          resize:none;
          outline:none;
          box-sizing:border-box;
        "
        placeholder="${placeholder.replaceAll('"', '&quot;')}"></textarea>
    `);

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

    const s = GameState.data;

    this.sendButton = addButton(
      this,
      250,
      565,
      "Enviar Solução",
      () => this.submitAnswer(),
      230
    );

    this.focusButton = addButton(
      this,
      512,
      565,
      s.xp >= 100 ? "Recuperar Foco -100 XP" : "Recuperar Foco Bloqueado",
      () => this.useFocusBreak(),
      260
    );

    this.menuButton = addButton(
      this,
      775,
      565,
      "Voltar ao Menu",
      () => {
        GameState.resetSession();
        this.scene.start("MenuScene");
      },
      230
    );
  }

  setSceneButtonsEnabled(enabled) {
    setButtonEnabled(this.sendButton, enabled);
    setButtonEnabled(this.focusButton, enabled);
    setButtonEnabled(this.menuButton, enabled);
  }

  async submitAnswer() {
    if (this.isSubmitting) return;

    const answer = this.answerElement.getChildByID("answerBox").value.trim();

    if (!answer) {
      showToast(this, "Digite uma solução antes de enviar.", "#fca5a5");
      return;
    }

    this.isSubmitting = true;
    this.setSceneButtonsEnabled(false);

    showProcessingOverlay(this, "Mentor Byte está analisando sua solução...");

    try {
      const s = GameState.data;
      const cr = s.currentChallenge;

      GameState.addAttempt();

      const totalSeconds = Math.floor(
        (Date.now() - s.challengeStartTime) / 1000
      );

      const evaluation = await AgentService.evaluateSolution({
        sessionId: s.sessionId,
        playerId: s.playerId,
        challengeId: cr.challengeId,
        challenge: {
          topico: cr.challenge.topico,
          enunciado: cr.challenge.enunciado,
          criterios_avaliacao: cr.challenge.criterios_avaliacao || []
        },
        studentSolution: {
          formato: s.profile?.linguagem || "pseudocodigo",
          resposta: answer
        },
        attemptContext: {
          numero_tentativa: GameState.data.attempts,
          tempo_resposta_segundos: totalSeconds,
          intervencoes_anteriores: GameState.data.interventionsUsed
        }
      });

      GameState.data.lastEvaluation = evaluation;
      GameState.save();

      hideProcessingOverlay(this);

      this.isSubmitting = false;
      this.setSceneButtonsEnabled(true);
      this.input.keyboard.enabled = true;

      if (
        evaluation.evaluation?.isCorrect ||
        evaluation.gameAction === "finish_challenge"
      ) {
        this.scene.start("ResultScene");
        return;
      }

      if (evaluation.gameAction === "offer_intervention") {
        this.scene.start("InterventionScene");
        return;
      }

      try {
        this.showPedagogicalFeedback(
          evaluation.feedback?.message ||
          "Revise sua solução e tente novamente."
        );
      }
      catch(err){
        console.error("Erro no feedback:", err);
      }

    } catch (error) {
      console.error(error);

      hideProcessingOverlay(this);

      this.isSubmitting = false;
      this.setSceneButtonsEnabled(true);
      this.input.keyboard.enabled = true;

      showToast(this, "Não foi possível avaliar agora. Tente novamente.", "#fca5a5");
    }
  }

  useFocusBreak() {
    if (this.isSubmitting) return;

    const s = GameState.data;
    const cost = 100;

    if (s.xp < cost) {
      showToast(this, "Você precisa de pelo menos 100 XP para recuperar foco.", "#fca5a5");
      return;
    }

    if (s.focusBreaksUsed >= s.maxFocusBreaksPerChallenge) {
      showToast(this, "Limite de pausas de foco atingido neste desafio.", "#fca5a5");
      return;
    }

    s.xp -= cost;
    s.focusBreaksUsed += 1;
    s.level = Math.floor(s.xp / 300) + 1;
    s.preGameReturnScene = "ChallengeScene";

    GameState.save();

    this.scene.start("PreGameXPScene");
  }

  showPedagogicalFeedback(message) {
    this.hidePedagogicalFeedback();
  
    if (this.answerElement) {
      this.answerElement.setVisible(false);
    }
  
    const W = this.scale.width;
    const H = this.scale.height;
  
    this.feedbackOverlay = this.add.container(W / 2, H / 2);
    this.feedbackOverlay.setDepth(10000);
  
    const bg = this.add.rectangle(0, 0, 760, 320, 0x0f172a, 0.98)
      .setStrokeStyle(3, 0xfde68a);
  
    const title = this.add.text(0, -120, "Feedback do Mentor Byte", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#fde68a",
      fontStyle: "bold"
    }).setOrigin(0.5);
  
    const text = this.add.text(0, -35, message, {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 660 },
      lineSpacing: 8
    }).setOrigin(0.5);
  
    const hint = this.add.text(0, 125, "ou pressione ESPAÇO para continuar", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#cbd5e1"
    }).setOrigin(0.5);
  
    const retryButton = addButton(this, 0, 82, "Tentar novamente", () => {
      this.hidePedagogicalFeedback();
    }, 260);
  
    this.feedbackOverlay.add([bg, title, text, retryButton, hint]);
  
    this.input.keyboard.enabled = true;
  
    this.input.keyboard.once("keydown-SPACE", () => {
      this.hidePedagogicalFeedback();
    });
  }
  
  hidePedagogicalFeedback() {
    if (this.feedbackOverlay) {
      this.feedbackOverlay.destroy();
      this.feedbackOverlay = null;
    }
  
    if (this.answerElement) {
      this.answerElement.setVisible(true);
    }
  
    this.input.keyboard.enabled = true;
  }
}