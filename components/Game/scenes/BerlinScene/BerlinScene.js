import { Scene } from "phaser";
import { uniq } from "@/utils/uniq";
import { GameConfig } from "../../GameConfig";
import { BUILDINGS } from "./BerlinScene.buildings";
import { COLLECTABLES } from "./BerlinScene.collectables";
import { ENEMIES } from "./BerlinScene.enemies";

export class BerlinScene extends Scene {
  enemy;
  player;
  cursors;
  buildings;

  constructor() {
    super("berlin-scene");
  }

  preload() {
    this.load.image("floor-1", "/assets/floor-1.png");
    this.load.image("floor-2", "/assets/floor-2.png");
    this.load.image("floor-3", "/assets/floor-3.png");
    this.load.image("floor-4", "/assets/floor-4.png");

    this.load.spritesheet("character", "/assets/minibenji.png", {
      frameWidth: 63,
      frameHeight: 77,
    });

    ENEMIES.forEach((enemy) => {
      this.load.spritesheet(enemy.key, enemy.key, {
        frameWidth: enemy.frameWidth,
        frameHeight: enemy.frameHeight,
      });
    });

    const uniqKeys = [
      ...uniq(BUILDINGS.map(({ key }) => key)),
      ...uniq(COLLECTABLES.map(({ key }) => key)),
    ];
    uniqKeys.forEach((key) => this.load.image(key, key));
  }

  create() {
    this.add.image(0, 0, "floor-1").setOrigin(0, 0).setDisplaySize(1024, 1024);
    this.add
      .image(1024, 0, "floor-2")
      .setOrigin(0, 0)
      .setDisplaySize(1024, 1024);
    this.add
      .image(0, 1024, "floor-3")
      .setOrigin(0, 0)
      .setDisplaySize(1024, 1024);
    this.add
      .image(1024, 1024, "floor-4")
      .setOrigin(0, 0)
      .setDisplaySize(1024, 1024);

    this.buildings = this.physics.add.staticGroup();
    this.buildings.createMultiple(
      BUILDINGS.flatMap(({ key, items }) =>
        items.map((item) => ({ key, setOrigin: { x: 0, y: 0 }, ...item }))
      )
    );

    this.player = this.physics.add.sprite(600, 440, "character");
    this.player.setBounce(0.2);
    // this.player.setCollideWorldBounds(true);
    this.createPlayerAnimation();

    // TODO: add more enemies
    this.enemy = this.physics.add.sprite(600, 600, ENEMIES[0].key);
    // grey filter for the enemy
    this.enemy.setTint(0x787878);
    this.createEnemyAnimation();
    this.physics.add.collider(this.player, this.enemy, () => {
      this.scene.start("game-over-scene");
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.collectables = this.physics.add.group({
      createCallback: function (item) {
        item.setName(this.getLength() - 1);
      },
    });
    this.collectables.createMultiple(
      COLLECTABLES.map((item) => ({ setOrigin: { x: 0, y: 0 }, ...item }))
    );

    // Add glow animation to the collectables
    this.collectables.getChildren().forEach((item) => {
      item.preFX.setPadding(0.5);
      const fx = item.preFX.addGlow();
      this.tweens.add({
        targets: fx,
        outerStrength: 0.1,
        yoyo: true,
        loop: -1,
        duration: 3000,
        ease: "Sine.easeInOut",
      });
    });

    this.physics.add.overlap(
      this.player,
      this.collectables,
      this.removeCollectable,
      null,
      this
    );

    this.physics.add.collider(this.player, this.buildings);

    this.cameras.main.startFollow(this.player);
  }

  update() {
    let animationMovement = "stand";
    let velocityX = 0;
    let velocityY = 0;

    if (!GameConfig.isMovementPaused) {
      this.enemy.anims.play("enemy", true);

      if (this.cursors.up.isDown) {
        velocityY = -160;
        animationMovement = "back";
      } else if (this.cursors.down.isDown) {
        velocityY = 160;
        animationMovement = "front";
      }

      if (this.cursors.left.isDown) {
        velocityX = -160;
        animationMovement = "left";
      } else if (this.cursors.right.isDown) {
        velocityX = 160;
        animationMovement = "right";
      }
    }

    this.player.anims.play(animationMovement, true);
    this.player.setVelocityY(velocityY);
    this.player.setVelocityX(velocityX);
  }

  removeCollectable(player, item) {
    item.disableBody(true, true);
    GameConfig.openModal(item.name);
  }

  createPlayerAnimation() {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("character", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "back",
      frames: this.anims.generateFrameNumbers("character", {
        start: 4,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "front",
      frames: this.anims.generateFrameNumbers("character", {
        start: 8,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("character", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "stand",
      frames: [{ key: "character", frame: 8 }],
      frameRate: 20,
    });
  }

  createEnemyAnimation() {
    this.anims.create({
      key: "enemy",
      frames: this.anims.generateFrameNumbers(ENEMIES[0].key, {
        start: 0,
        end: 3,
      }),
      frameRate: 3,
      repeat: -1,
    });
  }
}
