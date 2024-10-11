import { BaseScene } from "./BaseScene";

const MESSAGES = [
"“Al ángel le gustaría quedarse, despertar a los muertos, y reparar todo lo que se ha destruido.",
"Pero una tempestad asalta desde el Paraíso, el viento se ha enredado en las alas del ángel con tanta violencia que ya no puede cerrarlas...”", 
"...", 
"Benjamin ha encontrado la paz.",
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
