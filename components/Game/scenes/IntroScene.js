import { Scene } from "phaser";

// Each line is a screen that will be displayed on the scene
const MESSAGES = [
  "Bienvenido, presiona cualquier tecla para comenzar",
  "Solo se llega a conocer un lugar cuando uno lo experimenta en el mayor número de dimensiones posibles.",
  "Para apropiarse de un lugar hay que haber llegado a este desde cada uno de los cuatro puntos cardinales, como también hay que haberlo abandonado en todas estas direcciones.",
  "Si no, uno se lo cruzará en el camino de manera inesperada tres, cuatro veces antes de estar preparado para dar con él.",
  "En una fase posterior, uno lo busca, lo usa para orientarse.",
  "Sucede lo mismo con las casas. Sólo se alcanza a saber lo que contiene después de haber recorrido muchas otras en busca de una concreta.",
  "Desde el arco de una casa, en letras de distintos tamaños, negras, azules, amarillas y rojas, en forma de flecha, en la imagen de unas botas o la ropa lavada recién planchada, en un escalón gastado o un relleno firme, la vida te asalta, obstinada, combativa, muda.",
  "También hay que haber recorrido las calles en tranvía para poder ver que esta lucha se extiende a lo largo de los diversos pisos para al fin alcanzar su estadio decisivo en los tejados.",
  "Hasta allí únicamente llegan las palabras más duras, más antiguas de los carteles de las tiendas y solo desde el aire se tiene ante los ojos la élite industrial de la ciudad.",
];
const NEXT_SCENE = "berlin-scene";
const IMAGE = "/assets/benjamin.png";
const SCENE_NAME = "intro-scene";

export class IntroScene extends Scene {
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
        this.scene.start(NEXT_SCENE);
      } else {
        text.setText(MESSAGES[line]);
      }
    });
  }
}
