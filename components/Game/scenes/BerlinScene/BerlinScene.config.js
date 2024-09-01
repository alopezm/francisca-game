import { IS_DEVELOPMENT } from "@/utils/config";

// Development settings only for testing
const DEV_SCENE_ZOOM = 1;
// const DEV_SCENE_ZOOM = 1.25;

// player top left corner
const DEV_PLAYER_X = 350;
const DEV_PLAYER_Y = 1450;

// player bottom right corner
// const DEV_PLAYER_X = 1700;
// const DEV_PLAYER_Y = 750;

const DEV_START_WITH_INTRO_SCENE = true;

// DO NOT CHANGE
export const PLAYER_VELOCITY = 250;
export const PLAYER_X = IS_DEVELOPMENT ? DEV_PLAYER_X : 1250;
export const PLAYER_Y = IS_DEVELOPMENT ? DEV_PLAYER_Y : 2997;
export const SCENE_ZOOM = IS_DEVELOPMENT ? DEV_SCENE_ZOOM : 1;
export const START_WITH_INTRO_SCENE = IS_DEVELOPMENT
  ? DEV_START_WITH_INTRO_SCENE
  : true;