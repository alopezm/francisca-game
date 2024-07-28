export class GameConfig {
  static WIDTH = 1600;
  static HEIGHT = 1200;

  static isMovementPaused = false;

  static pauseMovement() {
    GameConfig.isMovementPaused = true;
  }
  static startMovement() {
    GameConfig.isMovementPaused = false;
  }

  static openModal = () => {};
}
