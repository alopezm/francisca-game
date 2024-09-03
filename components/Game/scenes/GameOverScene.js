import { GameConfig } from "../GameConfig";
import { BaseScene } from "./BaseScene";

export class GameOverScene extends BaseScene {
  constructor() {
    super("game-over-scene");
  }

  preload() {
    this.load.image("game-over", "/assets/game-over.png");
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

    this.restartButton = this.add.text(600, 600, "Reiniciar Juego", {
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
