import { GameState, InputState, Platform } from './types';
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

  private createInitialState(): GameState {
    const platforms: Platform[] = [
      { position: { x: 0, y: 550 }, velocity: { x: 0, y: 0 }, width: 800, height: 50, type: 'platform', color: '#8B4513' },
      { position: { x: 200, y: 450 }, velocity: { x: 0, y: 0 }, width: 150, height: 30, type: 'platform', color: '#228B22' },
      { position: { x: 400, y: 350 }, velocity: { x: 0, y: 0 }, width: 150, height: 30, type: 'platform', color: '#228B22' },
      { position: { x: 600, y: 450 }, velocity: { x: 0, y: 0 }, width: 150, height: 30, type: 'platform', color: '#228B22' },
      { position: { x: 800, y: 550 }, velocity: { x: 0, y: 0 }, width: 400, height: 50, type: 'platform', color: '#8B4513' },
      { position: { x: 900, y: 450 }, velocity: { x: 0, y: 0 }, width: 100, height: 30, type: 'platform', color: '#228B22' },
      { position: { x: 1100, y: 350 }, velocity: { x: 0, y: 0 }, width: 100, height: 30, type: 'platform', color: '#228B22' },
      { position: { x: 1300, y: 250 }, velocity: { x: 0, y: 0 }, width: 150, height: 30, type: 'platform', color: '#228B22' },
      { position: { x: 1500, y: 550 }, velocity: { x: 0, y: 0 }, width: 500, height: 50, type: 'platform', color: '#8B4513' },
    ];

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
