export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const PLAYER = {
  WIDTH: 32,
  HEIGHT: 48,
  SPEED: 5,
  JUMP_FORCE: -12,
  MAX_FALL_SPEED: 15,
} as const;

export const PHYSICS = {
  GRAVITY: 0.6,
  FRICTION: 0.8,
} as const;

export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;
export const MAX_DELTA = 250; // Maximum delta time in ms to prevent spiral of death
