import { GameState, InputState, Platform, TileMap, Tile } from './types';
import { Physics } from './physics';
import { Renderer } from './renderer';

export class GameEngine {
  private state: GameState;
  private physics: Physics;
  private renderer: Renderer;
  private input: InputState;
  private animationFrameId: number | null = null;
  private lastFrameTime = performance.now();

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.physics = new Physics();
    this.input = {
      left: false,
      right: false,
      jump: false,
      space: false,
    };

    this.state = this.createInitialState();
    this.setupInputHandlers();
  }

  private createTileMap(): TileMap {
    const tileWidth = 32;
    const tileHeight = 32;
    const cols = 100;
    const rows = 20;

    const tiles: Tile[][] = [];
    for (let row = 0; row < rows; row++) {
      tiles[row] = [];
      for (let col = 0; col < cols; col++) {
        tiles[row][col] = { type: 'empty', color: '' };
      }
    }

    // Ground floor from 0 to 25
    for (let col = 0; col < 25; col++) {
      tiles[17][col] = { type: 'ground', color: '#8B4513' };
      tiles[18][col] = { type: 'ground', color: '#654321' };
    }

    // Platform at row 14, cols 6-10
    for (let col = 6; col < 11; col++) {
      tiles[14][col] = { type: 'brick', color: '#228B22' };
    }

    // Platform at row 11, cols 12-16
    for (let col = 12; col < 17; col++) {
      tiles[11][col] = { type: 'brick', color: '#228B22' };
    }

    // Platform at row 14, cols 18-22
    for (let col = 18; col < 23; col++) {
      tiles[14][col] = { type: 'brick', color: '#228B22' };
    }

    // Ground floor from 25 to 62
    for (let col = 25; col < 63; col++) {
      tiles[17][col] = { type: 'ground', color: '#8B4513' };
      tiles[18][col] = { type: 'ground', color: '#654321' };
    }

    // Platform at row 14, cols 28-31
    for (let col = 28; col < 32; col++) {
      tiles[14][col] = { type: 'brick', color: '#228B22' };
    }

    // Platform at row 11, cols 34-37
    for (let col = 34; col < 38; col++) {
      tiles[11][col] = { type: 'brick', color: '#228B22' };
    }

    // Platform at row 8, cols 40-44
    for (let col = 40; col < 45; col++) {
      tiles[8][col] = { type: 'brick', color: '#228B22' };
    }

    // Ground floor from 63 to end
    for (let col = 63; col < cols; col++) {
      tiles[17][col] = { type: 'ground', color: '#8B4513' };
      tiles[18][col] = { type: 'ground', color: '#654321' };
    }

    return {
      tiles,
      tileWidth,
      tileHeight,
      worldWidth: cols * tileWidth,
      worldHeight: rows * tileHeight,
    };
  }

  private generatePlatformsFromTileMap(tileMap: TileMap): Platform[] {
    const platforms: Platform[] = [];

    for (let row = 0; row < tileMap.tiles.length; row++) {
      for (let col = 0; col < tileMap.tiles[row].length; col++) {
        const tile = tileMap.tiles[row][col];
        if (tile.type !== 'empty') {
          // Merge adjacent horizontal tiles
          let width = tileMap.tileWidth;
          let mergedCol = col;

          while (mergedCol + 1 < tileMap.tiles[row].length &&
                 tileMap.tiles[row][mergedCol + 1].type === tile.type &&
                 tileMap.tiles[row][mergedCol + 1].color === tile.color) {
            width += tileMap.tileWidth;
            mergedCol++;
          }

          platforms.push({
            position: {
              x: col * tileMap.tileWidth,
              y: row * tileMap.tileHeight
            },
            velocity: { x: 0, y: 0 },
            width,
            height: tileMap.tileHeight,
            type: 'platform',
            color: tile.color,
          });

          col = mergedCol;
        }
      }
    }

    return platforms;
  }

  private createInitialState(): GameState {
    const tileMap = this.createTileMap();
    const platforms = this.generatePlatformsFromTileMap(tileMap);

    return {
      player: {
        position: { x: 100, y: 400 },
        velocity: { x: 0, y: 0 },
        width: 32,
        height: 32,
        type: 'player',
        isJumping: false,
        isFacingRight: true,
      },
      platforms,
      tileMap,
      particles: [],
      camera: { x: 0, y: 0 },
      score: 0,
      isPlaying: false,
    };
  }

  private keydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') this.input.left = true;
    if (e.key === 'ArrowRight') this.input.right = true;
    if (e.key === ' ') {
      e.preventDefault();
      this.input.jump = true;
      this.input.space = true;
    }
    if (e.key === 'Enter' && !this.state.isPlaying) {
      this.state.isPlaying = true;
    }
  };

  private keyupHandler = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') this.input.left = false;
    if (e.key === 'ArrowRight') this.input.right = false;
    if (e.key === ' ') {
      this.input.jump = false;
      this.input.space = false;
    }
  };

  private setupInputHandlers() {
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

  start() {
    this.gameLoop();
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
  }

  private gameLoop = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastFrameTime) / 16.67;
    this.lastFrameTime = currentTime;

    this.physics.update(this.state, {
      left: this.input.left,
      right: this.input.right,
      jump: this.input.jump,
    }, deltaTime, this.renderer.getWidth());

    this.renderer.render(this.state);

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  resize(width: number, height: number) {
    this.renderer.resize(width, height);
  }

  getCanvasWidth(): number {
    return this.renderer.getWidth();
  }

  getState(): GameState {
    return this.state;
  }
}
