import { BaseScene } from "./BaseScene";

const MESSAGES = [
  "Solo hay ruinas de Sur a Norte.",
  "El bosque de Brandenburgo no es la diferencia, está abrasado completamente.",
  "W. Benjamin: - ¿A esto nos ha llevado la locura del nacionalsocialismo? …por un bigotón austriaco…",
  "W. Benjamin: La Berlín que conocía, palpitante de historia y cultura , se ha consumido por las llamas de la guerra y la sombra de la barbarie.",
  "Misión: Buscar el camino hacia el Alexanderplatz.",
];
const IMAGE = "/assets/Tank_org.png";
const SCENE_NAME = "tank-scene";

export class TankScene extends BaseScene {
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
        this.completeCollectableScene();
      } else {
        text.setText(MESSAGES[line]);
      }
    });
  }
}
