import { GameState } from "../state/GameState.js";
import { addButton, addHeader, addPanel } from "../utils/ui.js";
export default class MenuScene extends Phaser.Scene {
  constructor() { super("MenuScene"); }
  create() {
    const state = GameState.data;
    addHeader(this, state);
    this.add.text(512, 110, "Academia dos Algoritmistas", { fontFamily: "Arial", fontSize: "38px", color: "#fff", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(512, 160, "Resolva desafios, ganhe XP e avance na jornada dos algoritmos.", { fontFamily: "Arial", fontSize: "20px", color: "#cbd5e1" }).setOrigin(0.5);
    addPanel(this, 512, 330, 720, 260);
    this.add.text(220, 240, "Perfil atual", { fontFamily: "Arial", fontSize: "22px", color: "#93c5fd", fontStyle: "bold" });
    this.add.text(220, 280, `Jogador: ${state.playerId}\nSessão: ${state.sessionId}\nTópico: ${state.profile.topico}\nPerfil cognitivo: ${state.profile.perfil_cognitivo}`, { fontFamily: "Arial", fontSize: "18px", color: "#fff", lineSpacing: 8 });
    this.add.text(585, 240, "Conquistas", { fontFamily: "Arial", fontSize: "22px", color: "#93c5fd", fontStyle: "bold" });
    this.add.text(585, 280, state.achievements.length ? state.achievements.join("\n") : "Nenhuma conquista ainda.", { fontFamily: "Arial", fontSize: "17px", color: "#fde68a", lineSpacing: 6 });
    addButton(this, 512, 510, "Iniciar Missão", () => this.scene.start("ChallengeScene"));
  }
}
