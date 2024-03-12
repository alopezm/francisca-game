import { Scene, Game } from "phaser";

export class GameConfig {
  static width = 0;
  static height = 0;
  static buildingWidth = 40;
  static buildingHeight = 40;
  static buildings = [
    {
      quantity: 4,
      setXY: { x: 300, y: 140, stepY: GameConfig.buildingHeight },
    },
    {
      quantity: 3,
      setXY: { x: 480, y: 480, stepY: GameConfig.buildingHeight },
    },
    { quantity: 6, setXY: { x: 600, y: 0, stepY: GameConfig.buildingHeight } },
    { quantity: 20, setXY: { x: 0, y: 0, stepX: GameConfig.buildingWidth } },
    { quantity: 3, setXY: { x: 0, y: 150, stepX: GameConfig.buildingWidth } },
    { quantity: 15, setXY: { x: 90, y: 300, stepX: GameConfig.buildingWidth } },
    {
      quantity: 12,
      setXY: { x: 130, y: 480, stepX: GameConfig.buildingWidth },
    },
    {
      quantity: 8,
      setXY: { x: 480, y: 600, stepX: GameConfig.buildingWidth },
    },
    { quantity: 20, setXY: { x: 0, y: 760, stepX: GameConfig.buildingWidth } },
  ];
  static stars = [
    {
      setXY: { x: 60, y: 80 },
      data: {
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Panor%C3%A1mica_Oto%C3%B1o_Alc%C3%A1zar_de_Segovia.jpg/1280px-Panor%C3%A1mica_Oto%C3%B1o_Alc%C3%A1zar_de_Segovia.jpg",
        description: "Lorem Ipsum 1",
        title: "Lorem Ipsum 1",
      },
    },
    {
      setXY: { x: 760, y: 80 },
      data: {
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Windsor_Castle_at_Sunset_-_Nov_2006.jpg/1280px-Windsor_Castle_at_Sunset_-_Nov_2006.jpg",
        description: "Lorem Ipsum 2",
        title: "Lorem Ipsum 2",
      },
    },
    {
      setXY: { x: 560, y: 540 },
      data: {
        img: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Chateau_de_Montsoreau_Museum_of_contemporary_art.jpg",
        description: "Lorem Ipsum 3",
        title: "Lorem Ipsum 3",
      },
    },
  ];

  static isMovementPaused = false;
  static pauseMovement() {
    GameConfig.isMovementPaused = true;
  }
  static startMovement() {
    GameConfig.isMovementPaused = false;
  }
  static openModal = () => {};
}

class Scene1 extends Scene {
  buildings;
  cursors;
  player;
  buildings;

  preload() {
    this.load.image("building", "/assets/building-40x40.png");
    this.load.image("floor-1", "/assets/floor-1.png");
    this.load.image("floor-2", "/assets/floor-2.png");
    this.load.image("floor-3", "/assets/floor-3.png");
    this.load.image("floor-4", "/assets/floor-4.png");
    this.load.image("star", "/assets/star-40x40.png");
    this.load.spritesheet("dude", "/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
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
      GameConfig.buildings.map((building) => ({
        key: "building",
        setOrigin: { x: 0, y: 0 },
        ...building,
      }))
    );

    this.player = this.physics.add.sprite(120, 80, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.createPlayerAnimation();

    this.physics.add.collider(this.player, this.buildings);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      createCallback: function (star) {
        star.setName(this.getLength() - 1);
      },
    });
    this.stars.createMultiple(
      GameConfig.stars.map((star) => ({
        key: "star",
        setOrigin: { x: 0, y: 0 },
        ...star,
      }))
    );
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
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

  collectStar(player, star) {
    star.disableBody(true, true);
    GameConfig.openModal(star.name);
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

export function initGame({ parent }) {
  const game = new Game({
    parent,
    type: Phaser.AUTO,
    width: GameConfig.width * 2,
    height: GameConfig.height * 2,
    scene: Scene1,
    physics: { default: "arcade" },
  });

  return game;
}
