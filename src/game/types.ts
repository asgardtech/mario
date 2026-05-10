export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  position: Vector2D;
  velocity: Vector2D;
  width: number;
  height: number;
}

export interface Player extends GameObject {
  isJumping: boolean;
  isGrounded: boolean;
}

export enum GameStateType {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
}

export interface GameState {
  player: Player;
  level: Level;
  isRunning: boolean;
  state: GameStateType;
  score: number;
}

export interface Level {
  width: number;
  height: number;
  platforms: Platform[];
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}
