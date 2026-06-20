export default class IntroVideoScene extends Phaser.Scene {

    constructor() {
      super("IntroVideoScene");
    }
  
    preload() {
  
      this.load.video(
        "introVideo",
        "/videos/algame_intro.mp4",
        "loadeddata",
        false,
        true
      );
  
    }
  
    create() {
  
      const W = this.scale.width;
      const H = this.scale.height;
  
      this.cameras.main.setBackgroundColor("#000000");
  
      const video = this.add.video(
        W / 2,
        H / 2,
        "introVideo"
      );
  
      video.setOrigin(0.5);
  
      const scaleX = W / video.width;
      const scaleY = H / video.height;
  
      video.setScale(
        //Math.max(scaleX, scaleY)
        Math.min(scaleX, scaleY)
      );
  
      video.play(false);
  
      this.add.text(
        W - 20,
        H - 20,
        "ENTER para pular",
        {
          fontSize: "20px",
          color: "#ffffff"
        }
      )
      .setOrigin(1);
  
      this.input.keyboard.once(
        "keydown-ENTER",
        () => {
          video.stop();
          this.scene.start("PreGameXPScene");
        }
      );
  
      video.once(
        "complete",
        () => {
          this.scene.start("PreGameXPScene");
        }
      );
    }
  }