export interface Vec2 {
  x: number;
  y: number;
}

export interface Entity {
  position: Vec2;
  velocity: Vec2;
  width: number;
  height: number;
  type: 'player' | 'platform' | 'enemy' | 'collectible';
}

export interface Player extends Entity {
  type: 'player';
  isJumping: boolean;
  isFacingRight: boolean;
}

export interface Platform extends Entity {
  type: 'platform';
  color: string;
}

export interface GameState {
  player: Player;
  platforms: Platform[];
  camera: Vec2;
  score: number;
  isPlaying: boolean;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  space: boolean;
}
