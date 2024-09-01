import { Game } from "phaser";
import { GameConfig } from "./GameConfig";
import { IntroScene } from "./scenes/IntroScene";
import { BerlinScene } from "./scenes/BerlinScene/BerlinScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { SpectreScene } from "./scenes/SpectreScene";
import { DoorOpenScene } from "./scenes/DoorOpenScene";
import { SoldierScene } from "./scenes/SoldierScene";
import { TankScene } from "./scenes/TankScene";
import { BerolinaScene } from "./scenes/BerolinaScene";
import { AngelousScene } from "./scenes/AngelousScene";
import { START_WITH_INTRO_SCENE } from "./scenes/BerlinScene/BerlinScene.config";

export function initGame({ parent }) {
  const game = new Game({
    parent,
    type: Phaser.AUTO,
    scene: [
      ...(START_WITH_INTRO_SCENE ? [IntroScene] : []),
      BerlinScene,
      GameOverScene,
      SpectreScene,
      DoorOpenScene,
      SoldierScene,
      TankScene,
      BerolinaScene,
      AngelousScene,
    ],
    scale: {
      mode: Phaser.Scale.FIT,
      parent: "phaser-example",
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GameConfig.WIDTH,
      height: GameConfig.HEIGHT,
    },
    physics: { default: "arcade" },
  });

  return game;
}
