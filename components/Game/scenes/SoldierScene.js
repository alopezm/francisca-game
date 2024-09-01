import { Scene } from "phaser";

const MESSAGES = [
  "W. Benjamin: La construcción de la identidad sólo es posible desde la consciencia de la pertenencia al sistema. Ese sentido de pertenencia, qué aciago destino para tantos jóvenes.",
  "Soldado: ",
  "Soldado: Señor, ha encontrado mi gorra y también mi gorra y mi arma. Temía la ira de mi superior si le hubiera tenido que informar que perdí un panzerfaust en estas alturas de la guerra, además, con el uniforme incompleto.",
  "Soldado: Tome, yo ya no le tengo uso.",
  "Te entrega su cuchillo de las Juventudes Hitlerianas",
];
const IMAGE = "/assets/Soldier_whitout_cap.png";
const SCENE_NAME = "soldier-scene";

export class SoldierScene extends Scene {
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

    this.input.keyboard.on("keydown", () => {
      ++line;

      if (line === MESSAGES.length) {
        this.scene.switch("berlin-scene");
      } else {
        text.setText(MESSAGES[line]);
      }
    });
  }
}
