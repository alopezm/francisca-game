import { Scene } from "phaser";
import { uniq } from "@/utils/uniq";
import { GameConfig } from "../../GameConfig";
import { BUILDINGS } from "./BerlinScene.buildings";
import { COLLECTABLES } from "./BerlinScene.collectables";
import { ENEMIES } from "./BerlinScene.enemies";
import { SCENE_TRIGGERS } from "./BerlinScene.sceneTriggers";
import {
  PLAYER_X,
  PLAYER_Y,
  SCENE_ZOOM,
  PLAYER_VELOCITY,
} from "./BerlinScene.config";

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
  statics;
  usedScenesMap;

  doorSideA;
  doorSideB;
  isDoorOpen;
  collectablesToOpenDoorMap;

  constructor() {
    super("berlin-scene");
  }

  preload() {
    this.load.image("berlin_door", "/assets/berlin-door.jpg");
    this.load.image("berlin_floor", "/assets/berlin_floor.png");

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
      ...uniq(SCENE_TRIGGERS.map(({ key }) => key)),
    ];
    uniqKeys.forEach((key) => this.load.image(key, key));
  }

  create() {
    this.usedScenesMap = new Map();

    const floor = this.add.image(0, 0, "berlin_floor").setOrigin(0, 0);

    this.statics = this.physics.add.staticGroup();

    // create buildings
    this.statics.createMultiple(
      BUILDINGS.flatMap(({ key, items }) =>
        items.map((item) => ({ key, setOrigin: { x: 0, y: 0 }, ...item }))
      )
    );

    // create door
    this.doorSideA = this.statics.create(2480, 1510, "berlin_door");
    this.doorSideB = this.statics.create(2546, 1510, "berlin_door");
    this.doorSideB.angle = 180;
    this.isDoorOpen = false;
    const collectablesToOpenDoorMap = new Map();
    this.collectablesToOpenDoorMap = collectablesToOpenDoorMap;

    this.player = this.physics.add.sprite(PLAYER_X, PLAYER_Y, "character");
    this.player.setBounce(0.2);
    this.createPlayerAnimation();

    this.enemies = this.physics.add.group();
    ENEMIES.forEach((item) => {
      const enemy = this.enemies.create(item.x, item.y, "enemy");
      enemy.setBounce(1);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocity(item.velocityX, item.velocityY);
    });
    this.physics.add.collider(this.enemies, this.statics);

    this.createEnemyAnimation();
    this.physics.add.collider(this.player, this.enemies, () => {
      this.scene.start("game-over-scene");
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.collectables = this.physics.add.group({
      createCallback: function (item) {
        item.setName(this.getLength() - 1);

        // register collectables required to open the door
        const collectable = COLLECTABLES[item.name];
        if (collectable.requiredToOpenDoor) {
          collectablesToOpenDoorMap.set(item.name, item.name);
        }
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

    this.createSceneTriggers();

    this.physics.add.collider(this.player, this.statics);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, floor.width, floor.height);
    this.physics.world.setBounds(0, 0, floor.width, floor.height);
    this.player.setCollideWorldBounds(true);

    this.cameras.main.zoom = SCENE_ZOOM;
  }

  update() {
    if (GameConfig.isMovementPaused) {
      this.physics.pause();
    } else {
      this.physics.resume();
      this.animatePlayer();
      this.animateEnemy();
    }
  }

  animateEnemy() {
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

    this.player.anims.play(animationMovement, true);
    this.player.setVelocityY(velocityY);
    this.player.setVelocityX(velocityX);
  }

  removeCollectable(player, item) {
    item.disableBody(true, true);
    GameConfig.openModal(item.name);

    // check if has all the required collectables to open the door
    if (!this.isDoorOpen && this.collectablesToOpenDoorMap.has(item.name)) {
      this.collectablesToOpenDoorMap.delete(item.name);
      if (!this.collectablesToOpenDoorMap.size) this.openDoor();
    }
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

  createSceneTriggers() {
    this.sceneTriggers = this.physics.add.group({
      createCallback: function (item) {
        item.setName(this.getLength() - 1);
      },
    });
    this.sceneTriggers.createMultiple(
      SCENE_TRIGGERS.map((item) => ({
        key: item.key,
        setOrigin: { x: 0, y: 0 },
        setXY: { x: item.x, y: item.y },
      }))
    );

    this.physics.add.overlap(
      this.player,
      this.sceneTriggers,
      this.triggerScene,
      null,
      this
    );
  }

  triggerScene(player, item) {
    if (this.usedScenesMap.has(item.name)) return;

    this.usedScenesMap.set(item.name, item.name);
    this.physics.world.removeCollider(item);
    const scene = SCENE_TRIGGERS[item.name]?.scene;
    if (scene) this.scene.switch(scene);
  }

  openDoor() {
    if (this.isDoorOpen) return;

    this.isDoorOpen = true;
    this.doorSideA.angle = 180;
    this.doorSideB.angle = -180;
    this.doorSideA.y -= this.doorSideA.height;
    this.doorSideB.y -= this.doorSideB.height;
    this.doorSideA.x -= this.doorSideA.width;
    this.doorSideB.x += this.doorSideB.width;
  }
}
