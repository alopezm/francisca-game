import { Game } from "phaser";
import { GameConfig } from "./GameConfig";
import { IntroScene } from "./scenes/IntroScene";
import { BerlinScene } from "./scenes/BerlinScene/BerlinScene";
import { GameOverScene } from "./scenes/GameOverScene";

export function initGame({ parent }) {
  const game = new Game({
    parent,
    type: Phaser.AUTO,
    width: GameConfig.width * 2,
    height: GameConfig.height * 2,
    scene: [
      IntroScene,
      BerlinScene,
      GameOverScene,
    ],
    physics: { default: "arcade" },
  });

  return game;
}
