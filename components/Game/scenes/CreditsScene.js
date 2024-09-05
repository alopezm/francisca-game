import { BaseScene } from "./BaseScene";

export class CreditsScene extends BaseScene {
  constructor() {
    super("credits-scene");
  }

  create() {
    this.setupKeyNextTextKeyEvents(() => {
      window.location.href = "/";
    });

    const style = {
      fontFamily: "Times New Roman",
      fontSize: 55,
    };

    this.add.text(100, 300, "Diseño:", style);
    this.add.text(100, 370, "Francisca Jaramillo y Anderson López", style);

    this.add.text(100, 500, "Desarrollo:", style);
    this.add.text(100, 570, "Anderson López y Francisca Jaramillo", style);

    this.add.text(100, 700, "Investigación, guión e historia:", style);
    this.add.text(100, 770, "Felipe Marín y Francisca Jaramillo", style);
  }
}
