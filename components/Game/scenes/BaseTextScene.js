import { Scene } from "phaser";

export class BaseTextScene extends Scene {
  setupKeyEvents(cb) {
    let shouldUpdate = true;

    this.input.keyboard.on("keyup-ENTER", () => {
      shouldUpdate = true;
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      if (!shouldUpdate) return;

      cb();
      shouldUpdate = false;
    });
  }
}
