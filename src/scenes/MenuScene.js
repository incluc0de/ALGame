import { GameState } from "../state/GameState.js";

import {
  DIDACTIC_PATH,
  LEVELS
} from "../services/LearningPathService.js";

import {
  addButton,
  addHeader,
  addPanel,
  showToast
} from "../utils/ui.js";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");

    this.pathPanel = null;
    this.closePathButton = null;
  }

  create() {
    const state = GameState.data;

    addHeader(this, state);

    this.add.text(512, 95, "Academia dos Algoritmistas", {
      fontFamily: "Arial",
      fontSize: "38px",
      color: "#fff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(512, 140, "Resolva desafios, evolua na trilha e proteja o mundo digital.", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#cbd5e1"
    }).setOrigin(0.5);

    addPanel(this, 512, 330, 760, 300);

    const currentTopicId = state.learningPath?.currentTopic || state.profile.topico;
    const currentLevel = state.learningPath?.currentLevel || state.profile.nivel_aprendizagem;
    const currentTopicTitle =
      state.learningPath?.topics?.[currentTopicId]?.title || currentTopicId;

    this.add.text(170, 220, "Perfil atual", {
      fontFamily: "Arial",
      fontSize: "22px",
      color: "#93c5fd",
      fontStyle: "bold"
    });

    this.add.text(
      170,
      260,
      `Jogador: ${state.playerId}
Sessão: ${state.sessionId}
Tópico atual: ${currentTopicTitle}
Nível didático: ${currentLevel}
Linguagem: ${state.profile?.linguagem || "pseudocodigo"}
Perfil cognitivo: ${state.profile?.perfil_cognitivo || "não informado"}`,
      {
        fontFamily: "Arial",
        fontSize: "17px",
        color: "#fff",
        lineSpacing: 7
      }
    );

    this.add.text(585, 220, "Conquistas", {
      fontFamily: "Arial",
      fontSize: "22px",
      color: "#93c5fd",
      fontStyle: "bold"
    });

    this.add.text(
      585,
      260,
      state.achievements.length
        ? state.achievements.join("\n")
        : "Nenhuma conquista ainda.",
      {
        fontFamily: "Arial",
        fontSize: "17px",
        color: "#fde68a",
        lineSpacing: 6
      }
    );

    addButton(this, 340, 530, "Iniciar Missão", () => {
      GameState.resetSession();
      this.scene.start("ChallengeScene");
    }, 240);

    addButton(this, 680, 530, "Trilha Pedagógica", () => {
      this.showLearningPath();
    }, 280);
  }

  closeLearningPath() {
    if (this.pathPanel) {
      this.pathPanel.destroy();
      this.pathPanel = null;
    }

    if (this.closePathButton) {
      this.closePathButton.destroy();
      this.closePathButton = null;
    }
  }

  showLearningPath() {
    this.closeLearningPath();

    const path = GameState.data.learningPath;

    this.pathPanel = this.add.container(512, 320);
    this.pathPanel.setDepth(9999);

    const bg = this.add.rectangle(0, 0, 900, 520, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0x38bdf8);

    const title = this.add.text(0, -230, "Trilha Pedagógica", {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const subtitle = this.add.text(
      0,
      -195,
      "Conclua os níveis para liberar novos tópicos. A excelência libera prestígio e ranking futuro.",
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#cbd5e1"
      }
    ).setOrigin(0.5);

    this.pathPanel.add([bg, title, subtitle]);

    let y = -155;

    DIDACTIC_PATH.forEach((topic) => {
      const topicState = path.topics[topic.id];

      const topicColor = topicState.unlocked ? "#86efac" : "#94a3b8";
      const topicStatus = topicState.unlocked ? "Liberado" : "Bloqueado";

      const topicText = this.add.text(
        -410,
        y,
        `${topic.title} — ${topicStatus}`,
        {
          fontFamily: "Arial",
          fontSize: "17px",
          color: topicColor
        }
      );

      this.pathPanel.add(topicText);

      let x = 95;

      LEVELS.forEach((levelId) => {
        const levelState = topicState.levels[levelId];

        let symbol = "🔒";
        let color = "#94a3b8";

        if (levelState.excellence) {
          symbol = "🏆";
          color = "#fde68a";
        } else if (levelState.completed) {
          symbol = "✅";
          color = "#86efac";
        } else if (levelState.unlocked) {
          symbol = "🟡";
          color = "#ffffff";
        }

        const levelText = this.add.text(
          x,
          y,
          `${symbol} ${levelId}`,
          {
            fontFamily: "Arial",
            fontSize: "15px",
            color
          }
        );

        if (levelState.unlocked) {
          levelText.setInteractive({ useHandCursor: true });

          levelText.on("pointerdown", () => {
            GameState.setCurrentLearningStep(topic.id, levelId);

            showToast(
              this,
              `Trilha selecionada: ${topic.title} - ${levelId}`,
              "#86efac"
            );

            this.closeLearningPath();
            this.scene.restart();
          });
        }

        this.pathPanel.add(levelText);

        x += 125;
      });

      y += 40;
    });

    const legend = this.add.text(
      -410,
      190,
      "Legenda: 🔒 bloqueado | 🟡 liberado | ✅ concluído | 🏆 excelência",
      {
        fontFamily: "Arial",
        fontSize: "15px",
        color: "#cbd5e1"
      }
    );

    this.pathPanel.add(legend);

    this.closePathButton = addButton(this, 512, 570, "Fechar", () => {
      this.closeLearningPath();
    }, 200);

    this.closePathButton.setDepth(10000);
  }
}