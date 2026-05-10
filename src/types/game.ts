export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';

export type Direction = 'left' | 'right' | 'up' | 'down';

export interface Vector2D {
  x: number;
  y: number;
}

export interface PlayerState {
  position: Vector2D;
  velocity: Vector2D;
  direction: Direction;
  isJumping: boolean;
  isGrounded: boolean;
  powerUpState: PowerUpType;
  invincible: boolean;
  invincibilityTimer: number;
}

export type PowerUpType = 'small' | 'big' | 'fire' | 'star';

export interface Enemy {
  id: string;
  type: EnemyType;
  position: Vector2D;
  velocity: Vector2D;
  isAlive: boolean;
}

export type EnemyType = 'goomba' | 'koopa' | 'piranha' | 'bullet';

export interface Coin {
  id: string;
  position: Vector2D;
  collected: boolean;
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  position: Vector2D;
  collected: boolean;
}

export interface Block {
  id: string;
  type: BlockType;
  position: Vector2D;
  isBreakable: boolean;
  isBroken: boolean;
  containsItem?: PowerUpType | 'coin';
  isActivated: boolean;
}

export type BlockType = 'brick' | 'question' | 'platform' | 'pipe';

export interface Level {
  id: number;
  name: string;
  timeLimit: number;
  enemies: Enemy[];
  coins: Coin[];
  powerUps: PowerUp[];
  blocks: Block[];
  spawnPoint: Vector2D;
  exitPoint: Vector2D;
}

export interface GameState {
  status: GameStatus;
  player: PlayerState;
  currentLevel: number;
  levels: Level[];
  score: number;
  coins: number;
  lives: number;
  time: number;
  isPaused: boolean;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'LEVEL_COMPLETE' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESTART_LEVEL' }
  | { type: 'UPDATE_PLAYER_POSITION'; payload: Vector2D }
  | { type: 'UPDATE_PLAYER_VELOCITY'; payload: Vector2D }
  | { type: 'SET_PLAYER_DIRECTION'; payload: Direction }
  | { type: 'PLAYER_JUMP' }
  | { type: 'PLAYER_LAND' }
  | { type: 'COLLECT_COIN'; payload: string }
  | { type: 'COLLECT_POWER_UP'; payload: { id: string; type: PowerUpType } }
  | { type: 'PLAYER_HIT' }
  | { type: 'DEFEAT_ENEMY'; payload: string }
  | { type: 'ACTIVATE_BLOCK'; payload: string }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'LOSE_LIFE' }
  | { type: 'GAIN_LIFE' }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'RESET_GAME' };
