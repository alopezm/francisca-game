import { Scene } from "phaser";
import { GameConfig } from "../GameConfig";

export class BaseScene extends Scene {
  static music;
  static numColletablesScenes = 0;
  static numColletablesScenesDone = 0;

  completeCollectableScene() {
    this.scene.switch("berlin-scene");
    BaseScene.numColletablesScenesDone++;
  }

  setupKeyEvents(key = "ENTER", cb) {
    if (!key) return;

    let shouldUpdate = true;

    this.input.keyboard.on(`keyup-${key}`, () => {
      shouldUpdate = true;
    });

    this.input.keyboard.on(`keydown-${key}`, () => {
      if (!shouldUpdate) return;
      cb();
      shouldUpdate = false;
    });
  }

  setupKeyNextTextKeyEvents(cb) {
    this.setupKeyEvents("ENTER", cb);
  }

  loadMusic() {
    this.load.audio("main-music", "/music/symphony.mp3");
  }

  setupMusic() {
    if (!BaseScene.music) {
      BaseScene.music = this.sound.add("main-music", { loop: true });
      // get music ready to be played on user interaction
      BaseScene.music.play();
      const playMusic = !GameConfig.getPlayMusic();
      if (playMusic) BaseScene.music.pause();
    }

    this.setupKeyEvents("M", () => {
      const playMusic = !GameConfig.getPlayMusic();
      if (playMusic) BaseScene.music.resume();
      else BaseScene.music.pause();
      GameConfig.setPlayMusic(playMusic);
    });
  }
}
