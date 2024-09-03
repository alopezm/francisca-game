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
    this.add.text(100, 370, "Francisca Jaramillo", style);

    this.add.text(100, 500, "Desarrollo:", style);
    this.add.text(100, 570, "Anderson", style);

    this.add.text(100, 700, "Guión e historia:", style);
    this.add.text(100, 770, "Francisca Jaramillo y Felipe Marín", style);
  }
}
