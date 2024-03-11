import { Scene, Game } from "phaser";

const BUILDING_W = 40;

class GameConfig {
  static width = 0;
  static height = 0;
}

let cursors, player, buildings;

class Scene1 extends Scene {
  buildings;

  preload() {
    this.load.image("building", "/assets/building-40x40.png");
    this.load.image("floor", "/assets/cobblestone-floor.png");

    this.load.spritesheet("dude", "/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(GameConfig.width / 2, GameConfig.height / 2, "floor");

    buildings = this.physics.add.staticGroup();

    for (let x = 30; x <= GameConfig.width; x += BUILDING_W) {
      buildings.create(x, 30, "building");
    }

    for (let x = 750; x <= GameConfig.width; x += BUILDING_W) {
      buildings.create(x, 200, "building");
    }

    for (let x = 600; x >= 0; x -= BUILDING_W) {
      buildings.create(x, 400, "building");
    }

    for (let x = 50; x >= 0; x -= BUILDING_W) {
      buildings.create(x, 550, "building");
    }

    player = this.physics.add.sprite(100, 450, "dude");

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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

    this.physics.add.collider(player, buildings);

    cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("turn", true);
    }
     
    if (cursors.up.isDown) {
      player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
      player.setVelocityY(160);
    } else {
      player.setVelocityY(0);
    }
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
    physics: {
      default: "arcade",
      // arcade: {
      //   gravity: { y: 200 },
      // },
    },
  });
  return game;
}
