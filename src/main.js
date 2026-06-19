import Phaser from "phaser";
import { CONFIG } from "./config.js";
import BootScene from "./scenes/BootScene.js";
import MenuScene from "./scenes/MenuScene.js";
import ChallengeScene from "./scenes/ChallengeScene.js";
import InterventionScene from "./scenes/InterventionScene.js";
import ResultScene from "./scenes/ResultScene.js";

import PreGameXPScene from "./scenes/PreGameXPScene.js";

//import { CONFIG } from "./config.js";

const gameConfig = {
  type: Phaser.AUTO,
  width: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  parent: "game",
  backgroundColor: "#111827",
  dom: {
    createContainer: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [
    BootScene,
    PreGameXPScene,
    MenuScene,
    ChallengeScene,
    InterventionScene,
    ResultScene
  ]
};

new Phaser.Game(gameConfig);
/*new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  parent: "game",
  backgroundColor: "#111827",
  dom: { createContainer: true },
  scene: [BootScene, MenuScene, ChallengeScene, InterventionScene, ResultScene]
});*/
