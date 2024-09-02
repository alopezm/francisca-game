import { BaseScene } from "./BaseScene";

const MESSAGES = [
  
  "Soldado: Señor, ha encontrado mi gorra y también mi arma. Temía la ira de mi superior si le hubiera tenido que informar que perdí un panzerfaust en estas alturas de la guerra, además, le iba a informar con el uniforme incompleto.",
  "Soldado: Tome, yo ya no le tengo uso.",
  "Te entrega su cuchillo de las Juventudes Hitlerianas",
];
const IMAGE = "/assets/soldier_scene.png";
const SCENE_NAME = "soldier-scene";

export class SoldierScene extends BaseScene {
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
