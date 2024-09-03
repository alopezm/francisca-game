import { BaseScene } from "./BaseScene";

const MESSAGES = [
  "El Alexanderplatz emula el mismo paisaje que has visto hasta ahora. Pero notas algo diferente…",
  "W. Benjamin: ¿Dónde está la Berolina?...",
  "El pedestal de la Berolina está en ruinas, sin embargo no se puede distinguir el cobre de la efigie entre los escombros. Parece que no hubiese sido destruida por las bombas allí.",
  "La noticia parecia ser cierta: los rumores dicen que la Berolina fue refundida.",
  "La estatua de la Berolina era realmente una conexión entre el presente y pasado. Sin ella, la ciudad perdía esa conexión, que se hacía más evidente en la destrucción que dejaba el conflicto tras de sí.",
  "Desorientado, empiezas a temblar, la falta de aire se hace evidente, las palpitaciones son doblemente veloces y se sienten como un repique de tambores. Tardas poco en desvanecer.",
];
const IMAGE = "/assets/scene_Angelus_novus.png";
const SCENE_NAME = "angelous-scene";

export class AngelousScene extends BaseScene {
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
        this.scene.start("credits-scene");
      } else {
        text.setText(MESSAGES[line]);
      }
    });
  }
}
