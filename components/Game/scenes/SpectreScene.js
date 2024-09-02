import { BaseTextScene } from "./BaseTextScene";

const MESSAGES = [
  "Linea 1",
  "Linea 2",
];
const IMAGE = "/assets/spectre-scene.png";
const SCENE_NAME = "spectre-scene";

export class SpectreScene extends BaseTextScene {
  imageKey = IMAGE + SCENE_NAME;

  constructor() {
    super(SCENE_NAME);
  }

  preload() {
    this.load.image(this.imageKey, IMAGE);
  }

  create() {
    this.add.image(0, 0, this.imageKey).setOrigin(0, 0);

    let line = 0;

    const text = this.add.text(850, 450, MESSAGES[line], {
      fontFamily: "Times New Roman",
      fontSize: 55,
    });
    text.setOrigin(0, 0);
    text.setWordWrapWidth(700, false);

    this.setupKeyEvents(() => {
      ++line;

      if (line === MESSAGES.length) {
        this.scene.switch("berlin-scene");
      } else {
        text.setText(MESSAGES[line]);
      }
    });
  }
}
