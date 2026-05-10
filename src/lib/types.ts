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

export interface Tile {
  type: 'ground' | 'brick' | 'empty';
  color: string;
}

export interface TileMap {
  tiles: Tile[][];
  tileWidth: number;
  tileHeight: number;
  worldWidth: number;
  worldHeight: number;
}

export interface Particle {
  position: Vec2;
  velocity: Vec2;
  lifetime: number;
  maxLifetime: number;
  size: number;
  color: string;
}

export interface ParallaxLayer {
  image?: HTMLImageElement;
  color: string;
  speed: number;
  yOffset: number;
  height: number;
}

export interface GameState {
  player: Player;
  platforms: Platform[];
  tileMap: TileMap;
  particles: Particle[];
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
