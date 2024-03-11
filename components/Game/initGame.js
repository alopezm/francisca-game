import { Scene, Game } from "phaser";

class GameConfig {
  static width = 0;
  static height = 0;
  static buildingWidth = 40;
  static buildingHeight = 40;
  static buildings = [
    { quantity: 4, setXY: { x: 300, y: 140, stepY: GameConfig.buildingHeight } },
    { quantity: 3, setXY: { x: 500, y: 520, stepY: GameConfig.buildingHeight } },
    { quantity: 6, setXY: { x: 600, y: 0, stepY: GameConfig.buildingHeight } },
    { quantity: 10, setXY: { x: 0, y: 20, stepX: GameConfig.buildingWidth } },
    { quantity: 3, setXY: { x: 20, y: 150, stepX: GameConfig.buildingWidth } },
    { quantity: 15, setXY: { x: 90, y: 300, stepX: GameConfig.buildingWidth } },
    { quantity: 12, setXY: { x: 130, y: 480, stepX: GameConfig.buildingWidth } },
    { quantity: 13, setXY: { x: 500, y: 600, stepX: GameConfig.buildingWidth } },
    { quantity: 12, setXY: { x: 0, y: 780, stepX: GameConfig.buildingWidth } },
  ];
  static stars = [
    { setXY: { x: 60, y: 80 } },
    { setXY: { x: 760, y: 40 } },
    { setXY: { x: 560, y: 540 } },
  ];
}

class Scene1 extends Scene {
  buildings;
  cursors;
  player;
  buildings;

  preload() {
    this.load.image("building", "/assets/building-40x40.png");
    this.load.image("floor", "/assets/cobblestone-floor.png");
    this.load.image("star", "/assets/star-40x40.png");
    this.load.spritesheet("dude", "/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(GameConfig.width / 2, GameConfig.height / 2, "floor");

    this.buildings = this.physics.add.staticGroup();

    this.buildings.createMultiple(
      GameConfig.buildings.map((building) => ({ key: "building", ...building }))
    );

    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.createPlayerAnimation()

    this.physics.add.collider(this.player, this.buildings);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      collideWorldBounds: true,
    });

    this.stars.createMultiple(
      GameConfig.stars.map((star) => ({ ...star, key: "star" }))
    );
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn", true);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);
  }

  createPlayerAnimation() {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}

export function initGame({ parent, width, height }) {
  GameConfig.width = width;
  GameConfig.height = height;

  const game = new Game({
    type: Phaser.AUTO,
    parent,
    width,
    height,
    scene: Scene1,
    physics: { default: "arcade" },
  });
  return game;
}
