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
    this.add.image(0, 0, "game-over").setOrigin(0, 0);
    const text = this.add.text(270, GameConfig.height / 4, "GAME OVER", {
      fontFamily: "Times New Roman",
      fontSize: 120,
    });
  }
}
