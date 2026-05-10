export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GRAVITY: 0.5,
  MAX_FALL_SPEED: 10,
  PLAYER_SPEED: 5,
  PLAYER_RUN_SPEED: 8,
  PLAYER_JUMP_FORCE: 12,
  FPS: 60,
} as const;

export const PLAYER_CONFIG = {
  INITIAL_LIVES: 3,
  INITIAL_HEALTH: 1,
  MAX_HEALTH: 3,
  START_X: 50,
  START_Y: 400,
  WIDTH: 32,
  HEIGHT: 32,
} as const;

export const POWER_UP_DURATIONS = {
  STAR: 10000,
  FIRE_FLOWER: Infinity,
  MUSHROOM: Infinity,
} as const;

export const COLLISION_LAYERS = {
  PLAYER: 'player',
  ENEMY: 'enemy',
  PLATFORM: 'platform',
  POWER_UP: 'powerup',
  PROJECTILE: 'projectile',
} as const;

export const KEYBOARD_CONTROLS = {
  MOVE_LEFT: ['ArrowLeft', 'KeyA'],
  MOVE_RIGHT: ['ArrowRight', 'KeyD'],
  JUMP: ['Space', 'ArrowUp', 'KeyW'],
  RUN: ['ShiftLeft', 'ShiftRight'],
  ACTION: ['KeyX', 'KeyZ'],
  PAUSE: ['Escape', 'KeyP'],
} as const;
