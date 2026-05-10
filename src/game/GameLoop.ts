import { GameState } from "./types";
import { InputHandler } from "./input";
import { Renderer } from "./renderer";
import { applyGravity, handleInput, updatePosition, checkCollisions } from "./physics";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

export class GameLoop {
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimeStep: number = 1000 / 60;

  constructor(
    private state: GameState,
    private inputHandler: InputHandler,
    private renderer: Renderer,
    private canvasWidth: number,
    private canvasHeight: number
  ) {}

  public start(): void {
    if (this.animationFrameId !== null) return;

    this.state.isRunning = true;
    this.lastFrameTime = performance.now();
    this.loop(this.lastFrameTime);
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.state.isRunning = false;
  }

  private loop = (currentTime: number): void => {
    if (!this.state.isRunning) return;

    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.fixedTimeStep) {
      this.update();
      this.accumulator -= this.fixedTimeStep;
    }

    this.render();

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
}
