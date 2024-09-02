import { Scene } from "phaser";
import { GameConfig } from "../GameConfig";

export class BaseScene extends Scene {
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
    this.music = this.sound.add("main-music", { loop: true });
    this.music.play();

    if (!GameConfig.getPlayMusic()) this.music.pause();

    this.setupKeyEvents("M", () => {
      const playMusic = !GameConfig.getPlayMusic();

      if (playMusic) this.music.resume();
      else this.music.pause();
      GameConfig.setPlayMusic(playMusic);
    });
  }
}
