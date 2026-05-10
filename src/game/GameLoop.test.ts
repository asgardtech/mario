import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameLoop } from "./GameLoop";
import { InputHandler } from "./input";
import { Renderer } from "./renderer";
import { createInitialState } from "./createInitialState";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

describe("GameLoop", () => {
  let gameLoop: GameLoop;
  let mockCtx: CanvasRenderingContext2D;
  let inputHandler: InputHandler;
  let renderer: Renderer;

  beforeEach(() => {
    mockCtx = {
      fillStyle: "",
      fillRect: vi.fn(),
      fillText: vi.fn(),
      font: "",
      clearRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    inputHandler = new InputHandler();
    renderer = new Renderer(mockCtx);

    const initialState = createInitialState();
    gameLoop = new GameLoop(
      initialState,
      inputHandler,
      renderer,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
  });

  it("should initialize with correct state", () => {
    const state = gameLoop.getState();
    expect(state.isRunning).toBe(false);
    expect(state.score).toBe(0);
    expect(state.player).toBeDefined();
    expect(state.level).toBeDefined();
  });

  it("should start the game loop", () => {
    gameLoop.start();
    const state = gameLoop.getState();
    expect(state.isRunning).toBe(true);
  });

  it("should stop the game loop", () => {
    gameLoop.start();
    gameLoop.stop();
    const state = gameLoop.getState();
    expect(state.isRunning).toBe(false);
  });

  it("should not start if already running", () => {
    const requestAnimationFrameSpy = vi.spyOn(window, "requestAnimationFrame");
    gameLoop.start();
    gameLoop.start();
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
    gameLoop.stop();
  });

  it("should have player with initial position", () => {
    const state = gameLoop.getState();
    expect(state.player.position.x).toBe(100);
    expect(state.player.position.y).toBe(100);
  });

  it("should have platforms in the level", () => {
    const state = gameLoop.getState();
    expect(state.level.platforms.length).toBeGreaterThan(0);
  });
});
