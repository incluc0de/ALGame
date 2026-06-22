export default class IntroVideoScene extends Phaser.Scene {
    constructor() {
      super("IntroVideoScene");
  
      this.video = null;
      this.storyText = null;
      this.currentPart = 0;
      this.textTimer = null;
    }
  
    preload() {
      this.load.video(
        "introVideo",
        "/videos/algame_intro2.mp4",
        "loadeddata",
        false,
        true
      );
    }
  
    create() {
      const W = this.scale.width;
      const H = this.scale.height;
  
      this.cameras.main.setBackgroundColor("#000000");
  
      this.video = this.add.video(W / 2, H / 2, "introVideo");
      this.video.setOrigin(0.5);
  
      this.video.setScale(1.6);   
      //this.video.setDisplaySize(W, W * 9 / 16);
      this.video.y = H / 2 - 30;
  
      this.video.play(true);
  
      const storyParts = [
        "No mundo digital de ALGame, o conhecimento e a estabilidade dos sistemas são protegidos pelo poderoso Escudo AL.",
  
        "Até que uma ameaça chamada NULLBUG, criada a partir de erros, falhas lógicas e códigos corrompidos, começa a se espalhar pela rede.",
  
        "O NULLBUG consome experiência, corrompe algoritmos e mergulha o mundo digital no caos.",
  
        "Diante dessa ameaça, surge um jovem programador equipado com o Escudo AL.",
  
        "Ele embarca em uma jornada através de plataformas digitais para coletar XP, desenvolver suas habilidades e enfrentar os NULLBUGs.",
  
        "Usando lógica, raciocínio computacional e programação, ele restaura partes do sistema a cada desafio superado.",
  
        "Agora, a missão é sua: aprender, evoluir e proteger o mundo digital por meio do conhecimento e da resolução de problemas."
      ];
  
      this.add.rectangle(W / 2, H - 85, W - 80, 120, 0x000000, 0.72)
        .setStrokeStyle(2, 0x38bdf8);
  
      this.storyText = this.add.text(W / 2, H - 95, storyParts[0], {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: {
          width: W - 140
        },
        lineSpacing: 6
      }).setOrigin(0.5);
  
      /*this.add.text(W - 20, H - 20, "ENTER para pular", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#fde68a"
      }).setOrigin(1);*/

      const skipText = this.add.text(W - 20, 40, "⏭ ENTER para pular", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#fde68a",
        backgroundColor: "#0f172a",
        padding: {
          x: 10,
          y: 6
        }
      })
      .setOrigin(1, 0)
      .setDepth(1000);
  
      this.textTimer = this.time.addEvent({
        delay: 5500,
        repeat: storyParts.length - 2,
        callback: () => {
          this.currentPart += 1;
          this.storyText.setText(storyParts[this.currentPart]);
        }
      });
  
      this.time.delayedCall(storyParts.length * 5500 + 1200, () => {
        this.goToPreGame();
      });
  
      this.input.keyboard.once("keydown-ENTER", () => {
        this.goToPreGame();
      });
    }
  
    goToPreGame() {
      if (this.textTimer) {
        this.textTimer.remove(false);
        this.textTimer = null;
      }
  
      if (this.video) {
        this.video.stop();
      }
  
      this.scene.start("PreGameXPScene");
    }
  }