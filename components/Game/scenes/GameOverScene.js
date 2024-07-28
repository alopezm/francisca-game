import { Scene } from "phaser";
import { GameConfig } from "../GameConfig";

export class GameOverScene extends Scene {
  constructor() {
    super("game-over-scene");
  }

  preload() {
    this.load.image("game-over", "/assets/game-over.jpg");
  }

  create() {
    this.add
      .image(0, 0, "game-over")
      .setOrigin(0, 0)
      .setDisplaySize(GameConfig.WIDTH, GameConfig.HEIGHT);

    this.add.text(450, 400, "GAME OVER", {
      fontFamily: "Times New Roman",
      fontSize: 120,
    });

    this.restartButton = this.add.text(650, 600, "Reiniciar Juego", {
      fontFamily: "Times New Roman",
      fontSize: 60,
    });

    this.restartButton
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.restartButton.setStyle({ fill: "#ff0" });
      })
      .on("pointerout", () => {
        this.restartButton.setStyle({ fill: "#fff" });
      })
      .on("pointerdown", () => {
        this.scene.start("berlin-scene");
      });
  }
}
