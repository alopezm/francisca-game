import { Scene } from "phaser";
import { uniq } from "@/utils/uniq";
import { GameConfig } from "@/components/Game/GameConfig";
import { BUILDINGS } from "@/components/Game/configs/buildings";
import { COLLECTABLES } from "@/components/Game/configs/collectables";

export class BerlinScene extends Scene {
  buildings;
  cursors;
  player;
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
      frameWidth: 64,
      frameHeight: 77,
    });

    const uniqKeys = [
      ...uniq(BUILDINGS.map(({ key }) => key)),
      ...uniq(COLLECTABLES.map(({ key }) => key)),
    ];
    uniqKeys.forEach((key) => this.load.image(key, key));
  }

  create() {
    this.add
      .image(0, 0, "floor-1")
      .setOrigin(0, 0)
      .setDisplaySize(GameConfig.width, GameConfig.height);
    this.add
      .image(GameConfig.width, 0, "floor-2")
      .setOrigin(0, 0)
      .setDisplaySize(GameConfig.width, GameConfig.height);
    this.add
      .image(0, GameConfig.height, "floor-3")
      .setOrigin(0, 0)
      .setDisplaySize(GameConfig.width, GameConfig.height);
    this.add
      .image(GameConfig.width, GameConfig.height, "floor-4")
      .setOrigin(0, 0)
      .setDisplaySize(GameConfig.width, GameConfig.height);

    this.buildings = this.physics.add.staticGroup();
    this.buildings.createMultiple(
      BUILDINGS.flatMap(({ key, items }) =>
        items.map((item) => ({ key, setOrigin: { x: 0, y: 0 }, ...item }))
      )
    );

    this.player = this.physics.add.sprite(420, 380, "character");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.createPlayerAnimation();

    this.physics.add.collider(this.player, this.buildings);

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

    this.cameras.main.setSize(GameConfig.width, GameConfig.height).setZoom(1);
    this.cameras.main.startFollow(this.player);
  }

  update() {
    if (GameConfig.isMovementPaused) {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      this.player.anims.play("turn", true);
      return;
    }

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
      key: "turn",
      frames: [{ key: "character", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("character", {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
