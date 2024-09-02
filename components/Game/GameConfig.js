function getPlayMusicLs() {
  const value = localStorage.getItem("music-on");
  
  let play
  if (value === null) play = true;
  else play = value === "1";

  return play;
}

function setPlayMusicLs(value) {
  const valueLs = value ? "1" : "0";
  localStorage.setItem("music-on", valueLs);
}

let playMusic = getPlayMusicLs();

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

  static setPlayMusic(value) {
    playMusic = !!value;
    setPlayMusicLs(playMusic);
  }

  static getPlayMusic() {
    return playMusic;
  }
}
