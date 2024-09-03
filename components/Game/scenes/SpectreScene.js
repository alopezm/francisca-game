import { BaseScene } from "./BaseScene";

const MESSAGES = [
  "Espectro: ¿Me recuerdas?  Soy aquella intrusa que un día tu pequeña mente confundió con un fantasma",
  "Espectro: Antes de seguir tu paso más allá, aún debes recorrer algunos otros de tus pasos",
  "Misión: Explora tu hogar de la infancia. Recoge tus pasos",
];
const IMAGE = "/assets/spectre_scene.png";
const SCENE_NAME = "spectre-scene";

export class SpectreScene extends BaseScene {
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

    this.setupKeyNextTextKeyEvents(() => {
      ++line;

      if (line === MESSAGES.length) {
        this.scene.switch("berlin-scene");
      } else {
        text.setText(MESSAGES[line]);
      }
    });
  }
}
