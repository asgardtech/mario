import { GameState, GameStateType } from "./types";
import { InputHandler } from "./input";
import { Renderer } from "./renderer";
import { applyGravity, handleInput, updatePosition, checkCollisions } from "./physics";
import { FRAME_TIME, MAX_DELTA } from "./constants";

export interface GameLoopOptions {
  developerMode?: boolean;
}

export class GameLoop {
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimeStep: number = FRAME_TIME;
  private readonly developerMode: boolean;
  private visibilityChangeHandler: () => void;

  // Performance metrics
  private frameCount: number = 0;
  private lastFpsUpdate: number = 0;
  private currentFps: number = 0;

  constructor(
    private state: GameState,
    private inputHandler: InputHandler,
    private renderer: Renderer,
    private canvasWidth: number,
    private canvasHeight: number,
    options: GameLoopOptions = {}
  ) {
    this.developerMode = options.developerMode ?? false;

    // Setup Page Visibility API handler
    this.visibilityChangeHandler = () => {
      if (document.hidden && this.state.state === GameStateType.PLAYING) {
        this.pause();
      }
    };

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  public start(): void {
    if (this.animationFrameId !== null) return;

    this.state.isRunning = true;
    this.state.state = GameStateType.PLAYING;
    this.lastFrameTime = performance.now();
    this.lastFpsUpdate = this.lastFrameTime;
    this.loop(this.lastFrameTime);
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.state.isRunning = false;
    this.state.state = GameStateType.MENU;
  }

  public pause(): void {
    if (this.state.state === GameStateType.PLAYING) {
      this.state.state = GameStateType.PAUSED;
      this.state.isRunning = false;

      if (this.developerMode) {
        console.log('[GameLoop] Game paused');
      }
    }
  }

  public resume(): void {
    if (this.state.state === GameStateType.PAUSED) {
      this.state.state = GameStateType.PLAYING;
      this.state.isRunning = true;
      this.lastFrameTime = performance.now();

      if (this.developerMode) {
        console.log('[GameLoop] Game resumed');
      }

      if (this.animationFrameId === null) {
        this.loop(this.lastFrameTime);
      }
    }
  }

  public transitionToPlaying(): void {
    if (this.state.state === GameStateType.MENU) {
      this.start();
    }
  }

  public destroy(): void {
    this.stop();
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  private loop = (currentTime: number): void => {
    if (!this.state.isRunning || this.state.state !== GameStateType.PLAYING) {
      return;
    }

    // Clamp delta time to prevent spiral of death
    const rawDeltaTime = currentTime - this.lastFrameTime;
    const deltaTime = Math.min(rawDeltaTime, MAX_DELTA);
    this.lastFrameTime = currentTime;
    this.accumulator += deltaTime;

    // Update FPS metrics if in developer mode
    if (this.developerMode) {
      this.frameCount++;
      if (currentTime - this.lastFpsUpdate >= 1000) {
        this.currentFps = this.frameCount;
        this.frameCount = 0;
        this.lastFpsUpdate = currentTime;

        console.log(`[GameLoop] FPS: ${this.currentFps}, Delta: ${rawDeltaTime.toFixed(2)}ms, Accumulator: ${this.accumulator.toFixed(2)}ms`);
      }
    }

    try {
      while (this.accumulator >= this.fixedTimeStep) {
        this.update();
        this.accumulator -= this.fixedTimeStep;
      }

      this.render();
    } catch (error) {
      console.error('[GameLoop] Error in game loop:', error);

      if (this.developerMode) {
        console.error('[GameLoop] Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      }

      // Attempt to recover by resetting accumulator
      this.accumulator = 0;

      // Don't stop the loop - try to continue
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(): void {
    const input = this.inputHandler.getInputState();
    const { player, level } = this.state;

    handleInput(player, input);
    applyGravity(player);
    updatePosition(player);
    checkCollisions(player, level.platforms, this.canvasWidth, this.canvasHeight);
  }

  private render(): void {
    this.renderer.clear(this.canvasWidth, this.canvasHeight);
    this.renderer.render(this.state);
  }

  public getState(): GameState {
    return this.state;
  }

  public getCurrentFps(): number {
    return this.currentFps;
  }

  public getGameStateType(): GameStateType {
    return this.state.state;
  }
}
