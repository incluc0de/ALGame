import { GameState } from "../state/GameState.js";
import { CONFIG } from "../config.js";

const XP_COLLECTION_TIME = CONFIG.PRE_GAME_XP_TIME || 30;
const XP_VALUE = 10;
const XP_PENALTY = 20;
const XP_TO_SPAWN_BUG = 5;

export default class PreGameXPScene extends Phaser.Scene {
  constructor() {
    super("PreGameXPScene");

    this.player = null;
    this.platforms = null;
    this.xps = null;
    this.bombs = null;
    this.cursors = null;

    this.collectedXP = 0;
    this.totalCollectedItems = 0;
    this.timeLeft = XP_COLLECTION_TIME;
    this.gameFinished = false;

    this.xpText = null;
    this.timerText = null;
  }

  preload() {
    this.load.image("fundo", "assets/fundo.png");
    this.load.image("plataforma", "assets/plataforma.png");
    this.load.image("xp", "assets/xp.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 227,
      frameHeight: 730
    });
  }

  create() {
    const W = CONFIG.GAME_WIDTH;
    const H = CONFIG.GAME_HEIGHT;

    this.add.image(W / 2, H / 2, "fundo").setDisplaySize(W, H);

    this.platforms = this.physics.add.staticGroup();

    this.platforms
      .create(W / 2, H - 40, "plataforma")
      .setDisplaySize(W, 80)
      .refreshBody();

    this.platforms
      .create(W * 0.75, H * 0.66, "plataforma")
      .setDisplaySize(300, 60)
      .refreshBody();

    this.platforms
      .create(W * 0.22, H * 0.47, "plataforma")
      .setDisplaySize(300, 60)
      .refreshBody();

    this.platforms
      .create(W * 0.78, H * 0.34, "plataforma")
      .setDisplaySize(300, 60)
      .refreshBody();

    this.player = this.physics.add.sprite(120, H - 170, "player");
    this.player.setBounce(0.15);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.12);

    this.createAnimations();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.xps = this.physics.add.group({
      key: "xp",
      repeat: 11,
      setXY: {
        x: 50,
        y: 0,
        stepX: 80
      }
    });

    this.xps.children.iterate((child) => {
      child.setScale(0.035);
      child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.7));
    });

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.xps, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.overlap(
      this.player,
      this.xps,
      this.collectXP,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );

    this.xpText = this.add.text(16, 16, "XP coletado: 0", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#0f172a",
      padding: { x: 10, y: 6 }
    });

    this.timerText = this.add.text(W - 210, 16, `Tempo: ${this.timeLeft}`, {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#fde68a",
      backgroundColor: "#0f172a",
      padding: { x: 10, y: 6 }
    });

    this.add
      .text(W / 2, 70, "Colete XP antes da missão!", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      repeat: XP_COLLECTION_TIME - 1,
      callback: () => {
        this.timeLeft -= 1;
        this.timerText.setText(`Tempo: ${this.timeLeft}`);

        if (this.timeLeft <= 0) {
          this.finishPreGame();
        }
      }
    });
  }

  createAnimations() {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 3
      }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 4 }],
      frameRate: 10
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 5,
        end: 8
      }),
      frameRate: 8,
      repeat: -1
    });
  }

  update() {
    if (this.gameFinished) return;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-180);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(180);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn", true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-340);
    }
  }

  collectXP(player, xp) {
    xp.disableBody(true, true);

    this.collectedXP += XP_VALUE;
    this.totalCollectedItems += 1;

    this.xpText.setText(`XP coletado: ${this.collectedXP}`);

    if (this.totalCollectedItems % XP_TO_SPAWN_BUG === 0) {
      this.spawnBug();
    }

    if (this.xps.countActive(true) === 0) {
      this.xps.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
  }

  spawnBug() {
    const W = CONFIG.GAME_WIDTH;

    const x =
      this.player.x < W / 2
        ? Phaser.Math.Between(W / 2, W - 40)
        : Phaser.Math.Between(40, W / 2);

    const bug = this.bombs.create(x, 16, "bomb");

    bug.setScale(0.5);
    bug.setBounce(1);
    bug.setCollideWorldBounds(true);
    bug.setVelocity(Phaser.Math.Between(-180, 180), 20);
    bug.allowGravity = false;
  }

  hitBomb(player, bomb) {
    bomb.disableBody(true, true);

    this.collectedXP = Math.max(0, this.collectedXP - XP_PENALTY);
    this.xpText.setText(`XP coletado: ${this.collectedXP}`);

    player.setTint(0xff5555);

    this.time.delayedCall(300, () => {
      player.clearTint();
    });
  }

  finishPreGame() {
    if (this.gameFinished) return;

    const W = CONFIG.GAME_WIDTH;
    const H = CONFIG.GAME_HEIGHT;

    this.gameFinished = true;

    GameState.data.xp += this.collectedXP;
    GameState.data.level = Math.floor(GameState.data.xp / 300) + 1;
    GameState.save();

    this.physics.pause();

    this.add
      .rectangle(W / 2, H / 2, 520, 220, 0x0f172a, 0.92)
      .setStrokeStyle(2, 0x38bdf8);

    this.add
      .text(W / 2, H / 2 - 50, "Coleta finalizada!", {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#ffffff",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.add
      .text(W / 2, H / 2 + 5, `XP obtido: +${this.collectedXP}`, {
        fontFamily: "Arial",
        fontSize: "26px",
        color: "#86efac"
      })
      .setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start("MenuScene");
    });
  }
}