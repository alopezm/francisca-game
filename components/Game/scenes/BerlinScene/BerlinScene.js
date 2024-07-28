import { Scene } from "phaser";
import { uniq } from "@/utils/uniq";
import { GameConfig } from "../../GameConfig";
import { BUILDINGS } from "./BerlinScene.buildings";
import { COLLECTABLES } from "./BerlinScene.collectables";
import { ENEMIES } from "./BerlinScene.enemies";

const PLAYER_VELOCITY = 190;
const SCENE_WIDTH = GameConfig.WIDTH * 2;
const SCENE_HEIGHT = GameConfig.HEIGHT * 2;

const ENEMY_MOVEMENT = {
  LEFT: "enemy-left",
  UP: "enemy-up",
  DOWN: "enemy-down",
  RIGHT: "enemy-right",
  STAND: "enemy-stand",
};

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

    this.load.spritesheet("enemy", "/assets/enemy.png", {
      frameWidth: 981 / 16,
      frameHeight: 77,
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

    this.player = this.physics.add.sprite(600, 1800, "character");
    this.player.setBounce(0.2);
    this.createPlayerAnimation();

    this.enemies = this.physics.add.group();
    ENEMIES.forEach((item) => {
      const enemy = this.enemies.create(item.x, item.y, "enemy");
      enemy.setBounce(1);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocity(item.velocityX, item.velocityY);
    });

    this.createEnemyAnimation();
    this.physics.add.collider(this.player, this.enemies, () => {
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
    this.cameras.main.setBounds(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    this.physics.world.setBounds(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    this.player.setCollideWorldBounds(true);
  }

  update() {
    this.animatePlayer();
    this.animateEnemy();
  }

  animateEnemy() {
    if (GameConfig.isMovementPaused) return;

    this.enemies.getChildren().forEach((enemy) => {
      const velocityX = enemy.body.velocity.x;
      const velocityY = enemy.body.velocity.y;

      if (velocityX === 0 && velocityY === 0) {
        enemy.anims.play(ENEMY_MOVEMENT.STAND, true);
        return;
      }

      if (velocityX > 0) {
        enemy.anims.play(ENEMY_MOVEMENT.RIGHT, true);
      } else if (velocityX < 0) {
        enemy.anims.play(ENEMY_MOVEMENT.LEFT, true);
      }

      if (velocityY > 0) {
        enemy.anims.play(ENEMY_MOVEMENT.UP, true);
      } else if (velocityY < 0) {
        enemy.anims.play(ENEMY_MOVEMENT.DOWN, true);
      }
    });
  }

  animatePlayer() {
    let animationMovement = "player-stand";
    let velocityX = 0;
    let velocityY = 0;

    if (!GameConfig.isMovementPaused) {
      if (this.cursors.up.isDown) {
        velocityY = -PLAYER_VELOCITY;
        animationMovement = "player-up";
      } else if (this.cursors.down.isDown) {
        velocityY = PLAYER_VELOCITY;
        animationMovement = "player-down";
      }

      if (this.cursors.left.isDown) {
        velocityX = -PLAYER_VELOCITY;
        animationMovement = "player-left";
      } else if (this.cursors.right.isDown) {
        velocityX = PLAYER_VELOCITY;
        animationMovement = "player-right";
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
      key: "player-left",
      frames: this.anims.generateFrameNumbers("character", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "player-up",
      frames: this.anims.generateFrameNumbers("character", {
        start: 4,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "player-down",
      frames: this.anims.generateFrameNumbers("character", {
        start: 8,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "player-right",
      frames: this.anims.generateFrameNumbers("character", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "player-stand",
      frames: [{ key: "character", frame: 8 }],
      frameRate: 20,
    });
  }

  createEnemyAnimation() {
    this.anims.create({
      key: ENEMY_MOVEMENT.LEFT,
      frames: this.anims.generateFrameNumbers("enemy", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: ENEMY_MOVEMENT.UP,
      frames: this.anims.generateFrameNumbers("enemy", {
        start: 4,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: ENEMY_MOVEMENT.DOWN,
      frames: this.anims.generateFrameNumbers("enemy", {
        start: 8,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: ENEMY_MOVEMENT.RIGHT,
      frames: this.anims.generateFrameNumbers("enemy", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: ENEMY_MOVEMENT.STAND,
      frames: [{ key: "enemy", frame: 4 }],
      frameRate: 20,
    });
  }
}
