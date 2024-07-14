export class GameConfig {
  static width = 0;
  static height = 0;

  static isMovementPaused = false;
  static pauseMovement() {
    GameConfig.isMovementPaused = true;
  }
  static startMovement() {
    GameConfig.isMovementPaused = false;
  }
  static openModal = () => {};
}
