import { BaseScene } from "./BaseScene";

const MESSAGES = [
  "Presione M para iniciar/pausar la musica\n\nPresione ↑ ↓ ← → para moverse\n\nPresione Enter para continuar al siguiente diálogo o para volver al mapa tras recoger un objeto",
  "“Solo se llega a conocer un lugar cuando uno lo experimenta en el mayor número de dimensiones posibles.",
  "Para apropiarse de un lugar hay que haber llegado a este desde cada uno de los cuatro puntos cardinales, como también hay que haberlo abandonado en todas estas direcciones.",
  "Si no, uno se lo cruzará en el camino de manera inesperada tres, cuatro veces antes de estar preparado para dar con él.",
  "En una fase posterior, uno lo busca, lo usa para orientarse.",
  "Sucede lo mismo con las casas. Sólo se alcanza a saber lo que contiene después de haber recorrido muchas otras en busca de una concreta.”",
  "Abre los ojos...",
  "El último lugar en donde se encontraba era Portbou, pero esta destrucción no es propia de aquel villorrio hispano",
  "Walter Benjamin: - ¿Eso en el fondo, es la cuadriga de Brandenburgo?, ¿es esto Berlín, cuánta catástrofe ha sucedido aquí? La destrucción de mi ciudad natal es un golpe certero al corazón de mi civilización",
  "Misión: Evitar a los soldados a toda costa, recoger los coleccionables a lo largo del mapa en búsqueda del salvoconducto que Walter Benjamin esperando.",
];
const NEXT_SCENE = "berlin-scene";
const IMAGE = "/assets/benjamin.png";
const SCENE_NAME = "intro-scene";

export class IntroScene extends BaseScene {
  imageKey = IMAGE + SCENE_NAME;

  constructor() {
    super(SCENE_NAME);
  }

  preload() {
    this.loadMusic();
    this.load.image(this.imageKey, IMAGE);
  }

  create() {
    this.setupMusic();

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
        this.scene.start(NEXT_SCENE);
      } else {
        text.setText(MESSAGES[line]);
      }
    });
  }
}
