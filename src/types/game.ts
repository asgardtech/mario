export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameObject extends Position, Size {
  id: string;
  velocity: Velocity;
  isActive: boolean;
}

export interface Character extends GameObject {
  name: string;
  health: number;
  maxHealth: number;
  lives: number;
  score: number;
  powerUpState: PowerUpType | null;
  direction: 'left' | 'right';
  isJumping: boolean;
  isOnGround: boolean;
}

export enum PowerUpType {
  Mushroom = 'mushroom',
  FireFlower = 'fire-flower',
  Star = 'star',
}

export interface PowerUp extends GameObject {
  type: PowerUpType;
  duration?: number;
}

export interface Enemy extends GameObject {
  type: EnemyType;
  health: number;
  damage: number;
  patrolRange?: number;
}

export enum EnemyType {
  Goomba = 'goomba',
  KoopaTroopa = 'koopa-troopa',
  BulletBill = 'bullet-bill',
}

export interface Platform extends Position, Size {
  id: string;
  type: 'solid' | 'breakable' | 'question';
  isActive: boolean;
  containsItem?: PowerUpType;
}

export interface Level {
  id: string;
  name: string;
  background: string;
  platforms: Platform[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  startPosition: Position;
  endPosition: Position;
  timeLimit: number;
}

export interface GameState {
  currentLevel: number;
  player: Character;
  enemies: Enemy[];
  powerUps: PowerUp[];
  platforms: Platform[];
  isPaused: boolean;
  isGameOver: boolean;
  elapsedTime: number;
}

export interface Controls {
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
  run: boolean;
  action: boolean;
  pause: boolean;
}
