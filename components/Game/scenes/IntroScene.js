import { Scene } from "phaser";

const MESSAGES = [
  "Bienvenido, presiona cualquier tecla para comenzar",
  "Solo se llega a conocer un lugar cuando uno lo experimenta en el mayor número de dimensiones posibles.",
  "Para apropiarse de un lugar hay que haber llegado a este desde cada uno de los cuatro puntos cardinales, como también hay que haberlo abandonado en todas estas direcciones.",
  "Si no, uno se lo cruzará en el camino de manera inesperada tres, cuatro veces antes de estar preparado para dar con él.",
  "En una fase posterior, uno lo busca, lo usa para orientarse.",
  "Sucede lo mismo con las casas. Sólo se alcanza a saber lo que contiene después de haber recorrido muchas otras en busca de una concreta.",
  "Abres los ojos...",
  "El último lugar en donde estabas era Portbou, pero esta destrucción no es propia de aquel villorrio hispano",
  " - ¿Eso en el fondo, es la cuadriga de Brandenburgo?, ¿es esto Berlín, cuán catástrofe ha sucedido aquí? La destrucción de mi ciudad natal es un golpe certero al corazón de mi civilización",
  "Evita a los soldados a toda costa, recoge los coleccionables a lo largo del mapa en búsqueda del salvoconducto que estabas esperando.",
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
