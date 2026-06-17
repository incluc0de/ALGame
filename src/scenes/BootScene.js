import { GameState } from "../state/GameState.js";
export default class BootScene extends Phaser.Scene {
  constructor() { super("BootScene"); }
  create() { GameState.load(); this.scene.start("MenuScene"); }
}
