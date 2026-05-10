import { Vector2D } from '@/types/game';

export const GAME_CONSTANTS = {
  INITIAL_LIVES: 3,
  INITIAL_TIME: 300,
  LEVEL_TIME_LIMIT: 300,
  GRAVITY: 0.5,
  MAX_FALL_SPEED: 10,
  INVINCIBILITY_DURATION: 120,
  STAR_POWER_DURATION: 180,
} as const;

export const PLAYER_CONSTANTS = {
  MOVE_SPEED: 3,
  JUMP_FORCE: -12,
  MAX_VELOCITY_X: 5,
  MAX_VELOCITY_Y: 15,
  FRICTION: 0.8,
  SMALL_SIZE: { width: 16, height: 16 },
  BIG_SIZE: { width: 16, height: 32 },
} as const;

export const SCORE_VALUES = {
  COIN: 100,
  GOOMBA: 100,
  KOOPA: 200,
  PIRANHA: 300,
  BULLET: 400,
  BLOCK_BREAK: 50,
  POWER_UP: 1000,
  LEVEL_COMPLETE: 5000,
  TIME_BONUS_MULTIPLIER: 10,
} as const;

export const SPAWN_POINT: Vector2D = { x: 50, y: 400 };

export const CANVAS_SIZE = {
  WIDTH: 800,
  HEIGHT: 600,
} as const;
