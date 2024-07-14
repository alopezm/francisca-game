import { Game } from "phaser";
import { GameConfig } from "./GameConfig";
import { IntroScene } from "./scenes/IntroScene";
import { BerlinScene } from "./scenes/BerlinScene/BerlinScene";

export function initGame({ parent }) {
  const game = new Game({
    parent,
    type: Phaser.AUTO,
    width: GameConfig.width * 2,
    height: GameConfig.height * 2,
    scene: [IntroScene, BerlinScene],
    physics: { default: "arcade" },
  });

  return game;
}
