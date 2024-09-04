import { uniq } from "@/utils/uniq";
import { BaseScene } from "@/components/Game/scenes/BaseScene";
import { GameConfig } from "../../GameConfig";
import { BUILDINGS } from "./BerlinScene.buildings";
import { COLLECTABLES } from "./BerlinScene.collectables";
import { ENEMIES } from "./BerlinScene.enemies";
import {
  PLAYER_X,
  PLAYER_Y,
  SCENE_ZOOM,
  PLAYER_VELOCITY,
  LATERAL_SPACE_COLLETABLE_MINIATURES,
  SPACE_BETWEEN_COLLETABLE_MINIATURES,
} from "./BerlinScene.config";

const ENEMY_MOVEMENT = {
  LEFT: "enemy-left",
  UP: "enemy-up",
  DOWN: "enemy-down",
  RIGHT: "enemy-right",
  STAND: "enemy-stand",
};

export class BerlinScene extends BaseScene {
  music;
  enemy;
  player;
  cursors;
  statics;
  pickedCollectables;

  doorSideAClosed;
  doorSideBClosed;
  isDoorOpen;
  collectablesToOpenDoorMap;

  constructor() {
    super("berlin-scene");
  }

  preload() {
    this.loadMusic();

    this.load.image("berlin_door", "/assets/berlin-door.jpg");
    this.load.image("berlin_floor", "/assets/berlin_floor.png");

    this.load.spritesheet("character", "/assets/minibenji.png", {
      frameWidth: 903 / 16,
      frameHeight: 77,
    });

    this.load.spritesheet("enemy", "/assets/enemy.png", {
      frameWidth: 981 / 16,
      frameHeight: 77,
    });

    const uniqKeys = [
      ...uniq(BUILDINGS.map(({ key }) => key)),
      ...uniq(COLLECTABLES.map(({ key }) => key)),
      ...uniq(COLLECTABLES.map(({ keyMiniature }) => keyMiniature)),
    ];
    uniqKeys.forEach((key) => this.load.image(key, key));
  }

  create() {
    this.setupMusic();

    BaseScene.numColletablesScenes = COLLECTABLES.filter((i) => i.scene).length;
    BaseScene.numColletablesScenesDone = 0;

    this.cursors = this.input.keyboard.createCursorKeys();
    const floor = this.add.image(0, 0, "berlin_floor").setOrigin(0, 0);

    // create buildings
    this.statics = this.physics.add.staticGroup();
    this.statics.createMultiple(
      BUILDINGS.flatMap(({ key, items }) =>
        items.map((item) => ({ key, setOrigin: { x: 0, y: 0 }, ...item }))
      )
    );

    // create doors
    this.isDoorOpen = false;
    this.pickedCollectables = new Map();
    const collectablesToOpenDoorMap = new Map();
    this.collectablesToOpenDoorMap = collectablesToOpenDoorMap;
    this.doorSideAClosed = this.statics.create(2480, 1510, "berlin_door");
    this.doorSideBClosed = this.statics.create(2549, 1510, "berlin_door");
    this.doorSideBClosed.angle = 180;
    this.doorSideAOpened = this.statics
      .create(
        this.doorSideAClosed.x - this.doorSideAClosed.width,
        this.doorSideAClosed.y - this.doorSideAClosed.height,
        "berlin_door"
      )
      .disableBody(true, true);
    this.doorSideBOpened = this.statics.create(
      this.doorSideBClosed.x + this.doorSideBClosed.width,
      this.doorSideBClosed.y - this.doorSideBClosed.height,
      "berlin_door"
    );
    this.doorSideBOpened.angle = 180;
    this.doorSideBOpened.disableBody(true, true);

    // create enemies
    this.enemies = this.physics.add.group();
    ENEMIES.forEach((item) => {
      const enemy = this.enemies.create(item.x, item.y, "enemy");
      enemy.setBounce(1);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocity(item.velocityX, item.velocityY);
    });
    this.physics.add.collider(this.enemies, this.statics);
    this.createEnemyAnimation();

    // create collectables
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

    // create player
    this.player = this.physics.add.sprite(PLAYER_X, PLAYER_Y, "character");
    this.player.setBounce(0.2);
    this.createPlayerAnimation();
    this.player.setCollideWorldBounds(true);

    // remove collectables on collision with player
    this.physics.add.overlap(
      this.player,
      this.collectables,
      this.removeCollectable,
      null,
      this
    );

    this.physics.add.collider(this.player, this.statics);
    this.physics.add.collider(this.player, this.enemies, () => {
      this.scene.start("game-over-scene");
    });
    this.physics.world.setBounds(0, 0, floor.width, floor.height);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, floor.width, floor.height);
    this.cameras.main.zoom = SCENE_ZOOM;

    // create collectable miniatures
    this.collectablesMiniatures = this.physics.add.group({
      createCallback: function (item) {
        item.setName(this.getLength() - 1);
      },
    });

    const miniaturesWidth = Math.floor(
      (this.cameras.main.width -
        LATERAL_SPACE_COLLETABLE_MINIATURES -
        SPACE_BETWEEN_COLLETABLE_MINIATURES * COLLECTABLES.length) /
        COLLECTABLES.length
    );

    this.collectablesMiniatures.createMultiple(
      COLLECTABLES.map((item, i) => ({
        key: item.keyMiniature,
        setOrigin: { x: 0, y: 0 },
        setXY: {
          x:
            LATERAL_SPACE_COLLETABLE_MINIATURES / 2 +
            (SPACE_BETWEEN_COLLETABLE_MINIATURES + miniaturesWidth) * i,
          y: 20,
        },
        setAlpha: { value: 0.4 },
        setScrollFactor: { x: 0, y: 0 },
      }))
    );
  }

  update() {
    if (GameConfig.isMovementPaused) {
      this.physics.pause();
    } else {
      if (!this.isDoorOpen && this.collectablesToOpenDoorMap.size === 0) {
        this.openDoor();
      }

      this.physics.resume();
      this.animatePlayer();
      this.animateEnemy();

      if (
        this.pickedCollectables.size === COLLECTABLES.length &&
        BaseScene.numColletablesScenes === BaseScene.numColletablesScenesDone
      ) {
        this.scene.start("angelous-scene");
      }
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
    const itemName = item.name;

    if (this.pickedCollectables.has(itemName)) return;

    this.physics.world.removeCollider(item);
    this.pickedCollectables.set(itemName, itemName);

    const collectable = COLLECTABLES[itemName];
    const { modal, scene, keepVisibleAfterCollision } = collectable;

    // destroy all effects
    item.preFX.list.forEach((fx) => fx.destroy());

    if (!keepVisibleAfterCollision) {
      item.setAlpha(0.6);
      item.setTint(0x000000);
    }

    if (scene) {
      this.scene.switch(scene);
    }

    if (modal) GameConfig.openModal(itemName);

    // show collectable miniature
    this.collectablesMiniatures.getChildren()[itemName].setAlpha(1);

    // remove required collectables to open the door
    this.collectablesToOpenDoorMap.delete(itemName);
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

  openDoor() {
    if (this.isDoorOpen) return;

    this.isDoorOpen = true;
    this.doorSideAClosed.disableBody(true, true);
    this.doorSideBClosed.disableBody(true, true);
    this.doorSideAOpened.enableBody(false, 0, 0, true, true);
    this.doorSideBOpened.enableBody(false, 0, 0, true, true);
    this.scene.switch("door-open-scene");
  }
}
